/**
 * Spike Test — 0 → 200 VUs em 30 segundos
 * Simula um pico repentino de uso (ex: abertura de agenda de vacinação).
 * Objetivo: verificar se o sistema aguenta o choque e se recupera.
 *
 * Fases:
 *   0s  →  10s : 0 VUs  (linha de base)
 *   10s →  40s : 0 → 200 VUs (SPIKE)
 *   40s →  2m  : 200 VUs mantidos
 *   2m  →  2m30: 200 → 0 VUs (recuperação)
 *
 * Thresholds relaxados para o spike — o que importa é que o sistema não travar.
 */
import http  from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL, CREDENTIALS, DEFAULT_THRESHOLDS, authHeaders, jsonHeader, buildHtml } from './helpers/config.js';

const spikeErrors  = new Rate('spike_errors');
const spikeLogin   = new Rate('spike_login_ok');
const spikeLatency = new Trend('spike_latency_ms', true);

export const options = {
  stages: [
    { duration: '10s', target: 0   },   // baseline silencioso
    { duration: '30s', target: 200 },   // SPIKE: 0 → 200 VUs
    { duration: '80s', target: 200 },   // manter pico por ~1.5 min
    { duration: '30s', target: 0   },   // recuperação
  ],
  thresholds: {
    // Durante o spike aceitamos degradação — 10% de erro e p95 < 5s
    http_req_duration: ['p(95)<5000'],
    http_req_failed:   ['rate<0.10'],
    spike_errors:      ['rate<0.10'],
    spike_login_ok:    ['rate>0.90'],
  },
};

// Pool dos 3 perfis para distribuir a carga realisticamente
const USERS = [
  CREDENTIALS.paciente,
  CREDENTIALS.recepcionista,
  CREDENTIALS.admin,
];

export default function () {
  const start = Date.now();
  const creds = USERS[__VU % USERS.length];

  // Login
  let token = null;
  group('login', () => {
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify(creds),
      { headers: jsonHeader() },
    );
    const ok = check(res, {
      'spike login 200':     (r) => r.status === 200,
      'spike token presente':(r) => !!r.json('token'),
    });
    spikeLogin.add(ok);
    if (ok) token = res.json('token');
  });

  if (!token) {
    spikeErrors.add(true);
    sleep(0.5);
    return;
  }

  const hdrs = { headers: authHeaders(token) };

  // Endpoints críticos em batch — simula o carregamento inicial da dashboard
  group('dashboard-load', () => {
    const reqs = http.batch([
      ['GET', `${BASE_URL}/api/agendamentos`,  null, hdrs],
      ['GET', `${BASE_URL}/api/especialidades`,null, hdrs],
      ['GET', `${BASE_URL}/api/profissionais`, null, hdrs],
    ]);

    reqs.forEach((res) => {
      check(res, {
        'spike req status ok': (r) => r.status === 200 || r.status === 403,
      });
    });
  });

  spikeLatency.add(Date.now() - start);
  spikeErrors.add(false);
  sleep(0.5);
}

export function handleSummary(data) {
  const ts    = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const json  = `tests/reports/spike-${ts}.json`;
  const html  = `tests/reports/spike-${ts}.html`;
  const p95   = (data.metrics.http_req_duration?.values?.['p(95)'] ?? 0).toFixed(2);
  const err   = ((data.metrics.http_req_failed?.values?.rate ?? 0) * 100).toFixed(2);
  const reqs  = data.metrics.http_reqs?.values?.count ?? 0;
  const maxVu = data.metrics.vus_max?.values?.max ?? 0;

  return {
    [json]: JSON.stringify(data, null, 2),
    [html]: buildHtml(data, 'Spike Test (0 → 200 VUs em 30s)'),
    stdout: `
=== Spike Test ===
VUs no Pico    : ${maxVu}
Taxa de Erro   : ${err}%
p95 Duracao    : ${p95}ms
Requisicoes    : ${reqs}
HTML -> ${html}
`,
  };
}
