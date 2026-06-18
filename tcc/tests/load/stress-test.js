/**
 * Stress Test — 100 VUs / 5 min
 * Exercita todos os endpoints críticos ao mesmo tempo com 3 perfis em paralelo.
 * Objetivo: identificar o ponto de degradação antes da quebra.
 *
 * Thresholds mais rigorosos para detectar problemas sob carga extrema.
 */
import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";
import {
  BASE_URL,
  CREDENTIALS,
  DEFAULT_THRESHOLDS,
  authHeaders,
  jsonHeader,
  buildHtml,
} from "./helpers/config.js";

const errors = new Rate("stress_errors");
const loginRate = new Rate("stress_login_ok");

// 3 cenários em paralelo = ~33 VUs cada → ~100 VUs total
export const options = {
  scenarios: {
    admin_scenario: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 33 },
        { duration: "3m", target: 33 },
        { duration: "1m", target: 0 },
      ],
      exec: "adminFlow",
    },
    recep_scenario: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 34 },
        { duration: "3m", target: 34 },
        { duration: "1m", target: 0 },
      ],
      exec: "recepFlow",
    },
    paciente_scenario: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 33 },
        { duration: "3m", target: 33 },
        { duration: "1m", target: 0 },
      ],
      exec: "pacienteFlow",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<2000"], // threshold mais tolerante para stress
    http_req_failed: ["rate<0.05"], // até 5% de erro aceitável em stress
    stress_login_ok: ["rate>0.95"],
    stress_errors: ["rate<0.05"],
  },
};

// Utilitário: faz login e retorna token ou null
function doLogin(creds) {
  const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(creds), {
    headers: jsonHeader(),
  });
  const ok = check(res, { "stress login 200": (r) => r.status === 200 });
  loginRate.add(ok);
  return ok ? res.json("token") : null;
}

// Fluxo do Admin
export function adminFlow() {
  const token = doLogin(CREDENTIALS.admin);
  if (!token) {
    errors.add(true);
    return;
  }
  const hdrs = { headers: authHeaders(token) };

  const reqs = http.batch([
    ["GET", `${BASE_URL}/api/usuarios`, null, hdrs],
    ["GET", `${BASE_URL}/api/especialidades`, null, hdrs],
    ["GET", `${BASE_URL}/api/profissionais`, null, hdrs],
    ["GET", `${BASE_URL}/api/agendas`, null, hdrs],
    ["GET", `${BASE_URL}/api/unidades`, null, hdrs],
    ["GET", `${BASE_URL}/api/agendamentos`, null, hdrs],
  ]);

  reqs.forEach((res) =>
    check(res, { "admin req ok": (r) => r.status === 200 }),
  );
  errors.add(false);
  sleep(1.5);
}

// Fluxo da Recepcionista
export function recepFlow() {
  const token = doLogin(CREDENTIALS.recepcionista);
  if (!token) {
    errors.add(true);
    return;
  }
  const hdrs = { headers: authHeaders(token) };

  const reqs = http.batch([
    ["GET", `${BASE_URL}/api/pacientes`, null, hdrs],
    ["GET", `${BASE_URL}/api/agendamentos`, null, hdrs],
    ["GET", `${BASE_URL}/api/unidades`, null, hdrs],
    ["GET", `${BASE_URL}/api/agendas`, null, hdrs],
    ["GET", `${BASE_URL}/api/especialidades`, null, hdrs],
    ["GET", `${BASE_URL}/api/profissionais`, null, hdrs],
  ]);

  reqs.forEach((res) =>
    check(res, { "recep req ok": (r) => r.status === 200 }),
  );
  errors.add(false);
  sleep(1.5);
}

// Fluxo do Paciente
export function pacienteFlow() {
  const token = doLogin(CREDENTIALS.paciente);
  if (!token) {
    errors.add(true);
    return;
  }
  const hdrs = { headers: authHeaders(token) };

  const reqs = http.batch([
    ["GET", `${BASE_URL}/api/agendamentos`, null, hdrs],
    ["GET", `${BASE_URL}/api/especialidades`, null, hdrs],
    ["GET", `${BASE_URL}/api/profissionais`, null, hdrs],
    ["GET", `${BASE_URL}/api/datas`, null, hdrs],
  ]);

  reqs.forEach((res) =>
    check(res, { "paciente req ok": (r) => r.status === 200 }),
  );
  errors.add(false);
  sleep(1.5);
}

// K6 exige que exista uma função default quando há cenários com exec customizado
export default function () {}

export function handleSummary(data) {
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const json = `tests/reports/stress-${ts}.json`;
  const html = `tests/reports/stress-${ts}.html`;
  const p95 = (data.metrics.http_req_duration?.values?.["p(95)"] ?? 0).toFixed(
    2,
  );
  const err = ((data.metrics.http_req_failed?.values?.rate ?? 0) * 100).toFixed(
    2,
  );
  const reqs = data.metrics.http_reqs?.values?.count ?? 0;
  return {
    [json]: JSON.stringify(data, null, 2),
    [html]: buildHtml(data, "Stress Test (100 VUs / 10 min)"),
    stdout: `\n=== Stress Test ===\nTaxa de Erro : ${err}%\np95 Duracao  : ${p95}ms\nRequisicoes  : ${reqs}\nHTML -> ${html}\n`,
  };
}
