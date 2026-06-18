/**
 * Cenário 3 — Recepcionista Load Test
 * Fluxo de uma recepcionista no balcão.
 *
 * Fluxo por iteracao (80% leitura / 20% escrita):
 *   1. POST /api/auth/login
 *   2. GET  /api/pacientes       (lista de pacientes)
 *   3. GET  /api/agendamentos    (agenda do dia)
 *   4. GET  /api/unidades        (unidades disponíveis)
 *   5. GET  /api/agendas         (agendas dos profissionais)
 *   6. [20%] POST /api/usuarios + POST /api/pacientes  (novo cadastro)
 *
 * Load: 50 VUs / 5 min
 */
import http  from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import {
  BASE_URL, CREDENTIALS, DEFAULT_THRESHOLDS,
  authHeaders, jsonHeader, fakeCpf, buildHtml,
} from './helpers/config.js';

const loginOk    = new Rate('recep_login_ok');
const writeOk    = new Rate('recep_write_ok');
const flowErrors = new Rate('recep_flow_errors');

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0  },
  ],
  thresholds: {
    ...DEFAULT_THRESHOLDS,
    recep_login_ok:    ['rate>0.99'],
    recep_flow_errors: ['rate<0.02'],
  },
};

export default function () {
  let token = null;

  // 1. Login como recepcionista
  group('login', () => {
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify(CREDENTIALS.recepcionista),
      { headers: jsonHeader() },
    );
    const ok = check(res, { 'login 200': (r) => r.status === 200, 'tem token': (r) => !!r.json('token') });
    loginOk.add(ok);
    if (ok) token = res.json('token');
  });

  if (!token) { flowErrors.add(true); return; }

  const hdrs = { headers: authHeaders(token) };

  // 2. Lista de pacientes
  group('lista-pacientes', () => {
    const res = http.get(`${BASE_URL}/api/pacientes`, hdrs);
    check(res, { 'pacientes 200': (r) => r.status === 200, 'é array': (r) => Array.isArray(r.json()) });
  });

  sleep(0.4);

  // 3. Agendamentos do dia
  group('agendamentos', () => {
    const res = http.get(`${BASE_URL}/api/agendamentos`, hdrs);
    check(res, { 'agendamentos 200': (r) => r.status === 200 });
  });

  sleep(0.3);

  // 4. Unidades de saúde
  group('unidades', () => {
    const res = http.get(`${BASE_URL}/api/unidades`, hdrs);
    check(res, { 'unidades 200': (r) => r.status === 200 });
  });

  sleep(0.3);

  // 5. Agendas dos profissionais
  group('agendas', () => {
    const res = http.get(`${BASE_URL}/api/agendas`, hdrs);
    check(res, { 'agendas 200': (r) => r.status === 200 });
  });

  sleep(0.5);

  // 6. Cadastro de novo paciente (20% das iterações)
  //    Gera CPF único por VU+iteração para evitar conflito de chave única
  if (__ITER % 5 === 0) {
    group('novo-cadastro', () => {
      const cpf   = fakeCpf(__VU, __ITER);
      const email = `load.${__VU}.${__ITER}@teste.internal`;

      // 6a. Criar usuário (perfil PACIENTE)
      const usuRes = http.post(
        `${BASE_URL}/api/usuarios`,
        JSON.stringify({ nome: `Paciente Carga ${__VU}-${__ITER}`, email, cpf, senha: 'Teste@12345', perfil: 'PACIENTE' }),
        { headers: authHeaders(token) },
      );
      const usuOk = check(usuRes, { 'criar usuario 201': (r) => r.status === 201 });

      if (usuOk) {
        const idUsuario = usuRes.json('id_usuario');
        sleep(0.2);

        // 6b. Criar perfil de paciente
        const pacRes = http.post(
          `${BASE_URL}/api/pacientes`,
          JSON.stringify({
            id_usuario: idUsuario,
            cpf,
            nome_completo: `Paciente Carga ${__VU}-${__ITER}`,
            data_nascimento: '1990-01-01',
            sexo: 'M',
            telefone: '11999990000',
          }),
          { headers: authHeaders(token) },
        );
        const pacOk = check(pacRes, { 'criar paciente 201': (r) => r.status === 201 });
        writeOk.add(pacOk);
      } else {
        // 400 por CPF duplicado é aceitável em testes de carga; 5xx é falha
        writeOk.add(usuRes.status < 500);
      }
    });
  }

  flowErrors.add(false);
  sleep(1);
}

export function handleSummary(data) {
  const ts   = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const json = `tests/reports/recepcionista-load-${ts}.json`;
  const html = `tests/reports/recepcionista-load-${ts}.html`;
  const p95  = (data.metrics.http_req_duration?.values?.['p(95)'] ?? 0).toFixed(2);
  const err  = ((data.metrics.http_req_failed?.values?.rate ?? 0) * 100).toFixed(2);
  return {
    [json]: JSON.stringify(data, null, 2),
    [html]: buildHtml(data, 'Recepcionista Load Test'),
    stdout: `\n=== Recepcionista Load Test ===\nTaxa de Erro: ${err}%\np95 Duracao : ${p95}ms\nHTML -> ${html}\n`,
  };
}
