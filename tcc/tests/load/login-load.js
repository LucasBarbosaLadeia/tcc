/**
 * Cenário 1 — Login Load Test
 * Exercita POST /api/auth/login com os 3 perfis do sistema.
 *
 * Smoke:  TEST_TYPE=smoke  →  5 VUs / 1 min
 * Load:   (padrão)         → 50 VUs / 5 min
 */
import http  from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL, CREDENTIALS, DEFAULT_THRESHOLDS, jsonHeader, buildHtml } from './helpers/config.js';

const loginErrors  = new Rate('login_errors');
const loginLatency = new Trend('login_latency', true);

const SMOKE = {
  stages: [{ duration: '1m', target: 5 }],
};

const LOAD = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0  },
  ],
};

export const options = {
  ...(__ENV.TEST_TYPE === 'smoke' ? SMOKE : LOAD),
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    login_errors:  ['rate<0.01'],
    login_latency: ['p(95)<800'],
  },
};

// Pool de credenciais para simular diferentes perfis
const USERS = [
  CREDENTIALS.admin,
  CREDENTIALS.recepcionista,
  CREDENTIALS.paciente,
];

export default function () {
  // Seleciona um usuário do pool de forma determinística (não aleatória = resultados reproduzíveis)
  const creds = USERS[__VU % USERS.length];

  const payload = JSON.stringify(creds);
  const res = http.post(`${BASE_URL}/api/auth/login`, payload, { headers: jsonHeader() });

  const ok = check(res, {
    'login status 200':       (r) => r.status === 200,
    'token presente':         (r) => r.json('token') !== undefined,
    'usuario presente':       (r) => r.json('usuario') !== undefined,
    'duracao < 1000ms':       (r) => r.timings.duration < 1000,
  });

  loginErrors.add(!ok);
  loginLatency.add(res.timings.duration);

  sleep(1);
}

export function handleSummary(data) {
  const ts    = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const name  = `login-${__ENV.TEST_TYPE || 'load'}`;
  const json  = `tests/reports/${name}-${ts}.json`;
  const html  = `tests/reports/${name}-${ts}.html`;

  const errRate = ((data.metrics.http_req_failed?.values?.rate ?? 0) * 100).toFixed(2);
  const p95     = (data.metrics.http_req_duration?.values?.['p(95)'] ?? 0).toFixed(2);
  const reqs    = data.metrics.http_reqs?.values?.count ?? 0;

  return {
    [json]: JSON.stringify(data, null, 2),
    [html]: buildHtml(data, 'Login Load Test'),
    stdout: `
=== Login Load Test ===
Taxa de Erro : ${errRate}%
p95 Duracao  : ${p95}ms
Requisicoes  : ${reqs}

Relatorios:
  JSON -> ${json}
  HTML -> ${html}
`,
  };
}
