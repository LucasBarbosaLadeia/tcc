/**
 * Cenário 2 — Paciente Load Test
 * Fluxo realista de um paciente logado consultando seus dados.
 *
 * Fluxo por iteracao:
 *   1. POST /api/auth/login
 *   2. GET  /api/agendamentos          (seus proprios)
 *   3. GET  /api/pacientes/:id_paciente (seu proprio perfil)
 *   4. GET  /api/especialidades         (para novo agendamento)
 *   5. GET  /api/profissionais          (para novo agendamento)
 *   6. GET  /api/datas                  (horarios disponíveis)
 *
 * Load: 50 VUs / 5 min
 */
import http  from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { BASE_URL, CREDENTIALS, DEFAULT_THRESHOLDS, authHeaders, jsonHeader, buildHtml } from './helpers/config.js';

const loginOk     = new Rate('paciente_login_ok');
const flowErrors  = new Rate('paciente_flow_errors');
const endToEnd    = new Trend('paciente_end_to_end_ms', true);

const SMOKE = { stages: [{ duration: '1m', target: 5 }] };
const LOAD  = {
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
    paciente_login_ok:    ['rate>0.99'],
    paciente_flow_errors: ['rate<0.01'],
  },
};

export default function () {
  const startTime = Date.now();
  let token       = null;
  let idPaciente  = null;

  // 1. Login
  group('login', () => {
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify(CREDENTIALS.paciente),
      { headers: jsonHeader() },
    );
    const ok = check(res, {
      'login 200':    (r) => r.status === 200,
      'token existe': (r) => !!r.json('token'),
    });
    loginOk.add(ok);
    if (ok) {
      token      = res.json('token');
      idPaciente = res.json('usuario.id_paciente');
    }
  });

  if (!token) { flowErrors.add(true); return; }

  const hdrs = { headers: authHeaders(token) };

  // 2. Meus agendamentos
  group('agendamentos', () => {
    const res = http.get(`${BASE_URL}/api/agendamentos`, hdrs);
    check(res, {
      'agendamentos 200':  (r) => r.status === 200,
      'resposta é array':  (r) => Array.isArray(r.json()),
    });
  });

  sleep(0.5);

  // 3. Meu perfil de paciente (se id_paciente estiver disponível)
  if (idPaciente) {
    group('meu-perfil', () => {
      const res = http.get(`${BASE_URL}/api/pacientes/${idPaciente}`, hdrs);
      check(res, { 'perfil 200': (r) => r.status === 200 });
    });
    sleep(0.3);
  }

  // 4. Especialidades (pré-agendamento)
  group('especialidades', () => {
    const res = http.get(`${BASE_URL}/api/especialidades`, hdrs);
    check(res, {
      'especialidades 200': (r) => r.status === 200,
      'resposta é array':   (r) => Array.isArray(r.json()),
    });
  });

  sleep(0.4);

  // 5. Profissionais (pré-agendamento)
  group('profissionais', () => {
    const res = http.get(`${BASE_URL}/api/profissionais`, hdrs);
    check(res, {
      'profissionais 200': (r) => r.status === 200,
      'resposta é array':  (r) => Array.isArray(r.json()),
    });
  });

  sleep(0.3);

  // 6. Horários disponíveis
  group('horarios', () => {
    const res = http.get(`${BASE_URL}/api/datas`, hdrs);
    check(res, {
      'horarios 200':     (r) => r.status === 200,
      'resposta é array': (r) => Array.isArray(r.json()),
    });
  });

  endToEnd.add(Date.now() - startTime);
  flowErrors.add(false);
  sleep(1);
}

export function handleSummary(data) {
  const ts   = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const json = `tests/reports/paciente-load-${ts}.json`;
  const html = `tests/reports/paciente-load-${ts}.html`;
  const p95  = (data.metrics.http_req_duration?.values?.['p(95)'] ?? 0).toFixed(2);
  const err  = ((data.metrics.http_req_failed?.values?.rate ?? 0) * 100).toFixed(2);
  return {
    [json]: JSON.stringify(data, null, 2),
    [html]: buildHtml(data, 'Paciente Load Test'),
    stdout: `\n=== Paciente Load Test ===\nTaxa de Erro: ${err}%\np95 Duracao : ${p95}ms\nHTML -> ${html}\n`,
  };
}
