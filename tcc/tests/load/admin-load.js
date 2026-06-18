/**
 * Cenário 4 — Admin Load Test
 * Fluxo de um administrador gerenciando o sistema.
 *
 * Fluxo por iteracao:
 *   1. POST /api/auth/login
 *   2. GET  /api/usuarios         (todos os usuários)
 *   3. GET  /api/especialidades   (catálogo)
 *   4. GET  /api/profissionais    (equipe)
 *   5. GET  /api/agendas          (grade de horários)
 *   6. GET  /api/unidades         (unidades de saúde)
 *   7. GET  /api/agendamentos     (todos os agendamentos)
 *
 * Load: 50 VUs / 5 min
 */
import http  from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL, CREDENTIALS, DEFAULT_THRESHOLDS, authHeaders, jsonHeader, buildHtml } from './helpers/config.js';

const loginOk    = new Rate('admin_login_ok');
const flowErrors = new Rate('admin_flow_errors');
const endToEnd   = new Trend('admin_end_to_end_ms', true);

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0  },
  ],
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    admin_login_ok:    ['rate>0.99'],
    admin_flow_errors: ['rate<0.01'],
    admin_end_to_end_ms: ['p(95)<5000'],
  },
};

export default function () {
  const start = Date.now();
  let token   = null;

  // 1. Login como admin
  group('login', () => {
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify(CREDENTIALS.admin),
      { headers: jsonHeader() },
    );
    const ok = check(res, { 'login 200': (r) => r.status === 200, 'tem token': (r) => !!r.json('token') });
    loginOk.add(ok);
    if (ok) token = res.json('token');
  });

  if (!token) { flowErrors.add(true); return; }

  const hdrs = { headers: authHeaders(token) };

  // 2. Lista de usuários
  group('usuarios', () => {
    const res = http.get(`${BASE_URL}/api/usuarios`, hdrs);
    check(res, { 'usuarios 200': (r) => r.status === 200, 'é array': (r) => Array.isArray(r.json()) });
  });

  sleep(0.3);

  // 3. Especialidades
  group('especialidades', () => {
    const res = http.get(`${BASE_URL}/api/especialidades`, hdrs);
    check(res, { 'especialidades 200': (r) => r.status === 200, 'é array': (r) => Array.isArray(r.json()) });
  });

  sleep(0.3);

  // 4. Profissionais
  group('profissionais', () => {
    const res = http.get(`${BASE_URL}/api/profissionais`, hdrs);
    check(res, { 'profissionais 200': (r) => r.status === 200, 'é array': (r) => Array.isArray(r.json()) });
  });

  sleep(0.3);

  // 5. Agendas (grade completa)
  group('agendas', () => {
    const res = http.get(`${BASE_URL}/api/agendas`, hdrs);
    check(res, { 'agendas 200': (r) => r.status === 200, 'é array': (r) => Array.isArray(r.json()) });
  });

  sleep(0.3);

  // 6. Unidades
  group('unidades', () => {
    const res = http.get(`${BASE_URL}/api/unidades`, hdrs);
    check(res, { 'unidades 200': (r) => r.status === 200, 'é array': (r) => Array.isArray(r.json()) });
  });

  sleep(0.3);

  // 7. Todos os agendamentos
  group('agendamentos', () => {
    const res = http.get(`${BASE_URL}/api/agendamentos`, hdrs);
    check(res, { 'agendamentos 200': (r) => r.status === 200, 'é array': (r) => Array.isArray(r.json()) });
  });

  endToEnd.add(Date.now() - start);
  flowErrors.add(false);
  sleep(1);
}

export function handleSummary(data) {
  const ts   = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const json = `tests/reports/admin-load-${ts}.json`;
  const html = `tests/reports/admin-load-${ts}.html`;
  const p95  = (data.metrics.http_req_duration?.values?.['p(95)'] ?? 0).toFixed(2);
  const err  = ((data.metrics.http_req_failed?.values?.rate ?? 0) * 100).toFixed(2);
  return {
    [json]: JSON.stringify(data, null, 2),
    [html]: buildHtml(data, 'Admin Load Test'),
    stdout: `\n=== Admin Load Test ===\nTaxa de Erro: ${err}%\np95 Duracao : ${p95}ms\nHTML -> ${html}\n`,
  };
}
