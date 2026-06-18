// Configurações compartilhadas entre todos os scripts K6
// Não importar k6/http aqui — apenas constantes e funções puras

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const CREDENTIALS = {
  admin:         { email: 'admin@saude.com',  senha: 'Admin@123456' },
  recepcionista: { email: 'recep@teste.com',  senha: 'Recep@123456' },
  paciente:      { email: 'joao@teste.com',   senha: 'Paciente@123' },
};

export const DEFAULT_THRESHOLDS = {
  http_req_duration: ['p(95)<1000'],
  http_req_failed:   ['rate<0.01'],
};

export function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization:  `Bearer ${token}`,
  };
}

export function jsonHeader() {
  return { 'Content-Type': 'application/json' };
}

// Gera um CPF fictício único por VU+iteração (apenas para testes de escrita)
export function fakeCpf(vu, iter) {
  const n = String(vu * 10000 + iter).padStart(10, '0');
  return `9${n}`;
}

// Gera HTML do relatório a partir do objeto data do handleSummary
export function buildHtml(data, title) {
  const m = data.metrics;
  const fmt = (v, unit) => (v != null ? `${Number(v).toFixed(2)}${unit}` : '—');

  const summary = {
    errorRate: (m.http_req_failed?.values?.rate ?? 0) * 100,
    p95:       m.http_req_duration?.values?.['p(95)'] ?? 0,
    avg:       m.http_req_duration?.values?.avg ?? 0,
    totalReqs: m.http_reqs?.values?.count ?? 0,
  };

  const rows = Object.entries(m).map(([name, metric]) => {
    const v = metric.values;
    const mainVal =
      v.avg   != null ? fmt(v.avg,   'ms') :
      v.rate  != null ? fmt(v.rate * 100, '%') :
      v.count != null ? String(v.count) :
      v.value != null ? String(v.value) : '—';
    return `<tr>
      <td>${name}</td>
      <td>${metric.type}</td>
      <td>${mainVal}</td>
      <td>${v['p(95)'] != null ? fmt(v['p(95)'], 'ms') : '—'}</td>
      <td>${v.min != null ? fmt(v.min, 'ms') : '—'}</td>
      <td>${v.max != null ? fmt(v.max, 'ms') : '—'}</td>
    </tr>`;
  }).join('');

  const errClass  = summary.errorRate > 1  ? 'err'  : 'ok';
  const p95Class  = summary.p95 > 1000     ? 'warn' : 'ok';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f7fa;color:#1a202c}
.header{background:linear-gradient(135deg,#1a73e8,#0d5dbf);color:#fff;padding:28px 40px}
.header h1{font-size:22px;font-weight:700}
.header p{opacity:.8;margin-top:6px;font-size:13px}
.body{padding:28px 40px;max-width:1100px}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.card{background:#fff;border-radius:10px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.card .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:#718096;font-weight:600}
.card .val{font-size:26px;font-weight:700;margin-top:8px}
.ok .val{color:#0d9488}.warn .val{color:#d97706}.err .val{color:#dc2626}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)}
thead th{background:#f8fafc;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#4a5568;padding:12px 16px;text-align:left;border-bottom:2px solid #e2e8f0}
tbody td{padding:10px 16px;border-bottom:1px solid #f0f4f8;font-size:13px;font-family:monospace}
tbody tr:last-child td{border:none}
tbody tr:hover td{background:#f8fafc}
h2{font-size:16px;font-weight:600;margin-bottom:12px;color:#2d3748}
</style>
</head>
<body>
<div class="header">
  <h1>Relatorio de Carga — ${title}</h1>
  <p>Saude na Mao &middot; Gerado em ${new Date().toLocaleString('pt-BR')}</p>
</div>
<div class="body">
  <div class="cards">
    <div class="card ${errClass}">
      <div class="lbl">Taxa de Erro</div>
      <div class="val">${fmt(summary.errorRate, '%')}</div>
    </div>
    <div class="card ${p95Class}">
      <div class="lbl">p95 Duracao</div>
      <div class="val">${fmt(summary.p95, 'ms')}</div>
    </div>
    <div class="card ok">
      <div class="lbl">Media</div>
      <div class="val">${fmt(summary.avg, 'ms')}</div>
    </div>
    <div class="card ok">
      <div class="lbl">Requisicoes</div>
      <div class="val">${summary.totalReqs}</div>
    </div>
  </div>
  <h2>Metricas Detalhadas</h2>
  <table>
    <thead>
      <tr>
        <th>Metrica</th><th>Tipo</th><th>Avg / Taxa</th><th>p(95)</th><th>Min</th><th>Max</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</div>
</body>
</html>`;
}
