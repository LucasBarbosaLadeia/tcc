import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAgendamentos } from '@/hooks/useAgendamentos';
import type { Agendamento } from '@/types/agendamento';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const STATUS_COLOR: Record<string, string> = {
  Agendado:   '#3b82f6',
  Realizada:  '#14b8a6',
  Cancelado:  '#ef4444',
  Falta:      '#f97316',
  'Concluído':'#22c55e',
};

function buildMonthlyData(agendamentos: Agendamento[]) {
  const now = new Date();
  const months: { mes: string; total: number; realizadas: number; canceladas: number; faltas: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${MESES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    months.push({ mes: label, total: 0, realizadas: 0, canceladas: 0, faltas: 0 });
  }

  agendamentos.forEach((a) => {
    const raw = a.horario?.data_hora_inicio ?? a.created_at;
    if (!raw) return;
    const d = new Date(raw);
    const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (diff < 0 || diff > 5) return;
    const idx = 5 - diff;
    months[idx].total++;
    if (a.status === 'Realizada' || a.status === 'Concluído') months[idx].realizadas++;
    if (a.status === 'Cancelado') months[idx].canceladas++;
    if (a.status === 'Falta') months[idx].faltas++;
  });

  return months;
}

function buildStatusData(agendamentos: Agendamento[]) {
  const counts: Record<string, number> = {};
  agendamentos.forEach((a) => { counts[a.status] = (counts[a.status] ?? 0) + 1; });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function buildProfData(agendamentos: Agendamento[]) {
  const counts: Record<string, number> = {};
  agendamentos.forEach((a) => {
    const nome = a.horario?.profissional?.nome_completo ?? 'Sem profissional';
    counts[nome] = (counts[nome] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([nome, total]) => ({ nome: nome.length > 18 ? nome.slice(0, 16) + '…' : nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);
}

function buildHourData(agendamentos: Agendamento[]) {
  const periods = [
    { periodo: 'Manhã\n06–09h', min: 6,  max: 9  },
    { periodo: 'Manhã\n09–12h', min: 9,  max: 12 },
    { periodo: 'Tarde\n12–15h', min: 12, max: 15 },
    { periodo: 'Tarde\n15–18h', min: 15, max: 18 },
    { periodo: 'Noite\n18–21h', min: 18, max: 21 },
  ];
  const result = periods.map((p) => ({ ...p, total: 0 }));
  agendamentos.forEach((a) => {
    if (!a.horario?.data_hora_inicio) return;
    const h = new Date(a.horario.data_hora_inicio).getHours();
    const idx = result.findIndex((p) => h >= p.min && h < p.max);
    if (idx >= 0) result[idx].total++;
  });
  return result;
}

function KpiCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

const tooltipStyle = { borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px #0000000d' };

export function ConsultasChart() {
  const { data: agendamentos = [], isLoading } = useAgendamentos();

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center text-sm text-gray-400">Carregando gráficos…</div>;
  }

  const total      = agendamentos.length;
  const realizadas = agendamentos.filter((a) => a.status === 'Realizada' || a.status === 'Concluído').length;
  const canceladas = agendamentos.filter((a) => a.status === 'Cancelado').length;
  const faltas     = agendamentos.filter((a) => a.status === 'Falta').length;
  const agendados  = agendamentos.filter((a) => a.status === 'Agendado').length;
  const taxa       = total > 0 ? Math.round((realizadas / total) * 100) : 0;

  const monthly  = buildMonthlyData(agendamentos);
  const byStatus = buildStatusData(agendamentos);
  const byProf   = buildProfData(agendamentos);
  const byHour   = buildHourData(agendamentos);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Consultas — Visão Geral</h3>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <KpiCard label="Total"          value={total}        color="text-gray-800"   sub="todos os registros" />
          <KpiCard label="Agendados"      value={agendados}    color="text-blue-600"   sub="aguardando atendimento" />
          <KpiCard label="Realizadas"     value={realizadas}   color="text-teal-600"   sub="consultas concluídas" />
          <KpiCard label="Canceladas"     value={canceladas}   color="text-red-500"    sub="desistências" />
          <KpiCard label="Taxa presença"  value={`${taxa}%`}  color="text-emerald-600" sub={`${faltas} falta${faltas !== 1 ? 's' : ''} registrada${faltas !== 1 ? 's' : ''}`} />
        </div>
      </div>

      {total === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-sm text-gray-400">
          Nenhum agendamento registrado ainda. Os gráficos aparecerão quando houver dados.
        </div>
      ) : (
        <>
          {/* Evolução mensal + pizza por status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Evolução dos últimos 6 meses</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6b7280" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCanc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="total"      name="Total"      stroke="#6b7280" fill="url(#gTotal)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="realizadas" name="Realizadas" stroke="#14b8a6" fill="url(#gReal)"  strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="canceladas" name="Canceladas" stroke="#ef4444" fill="url(#gCanc)"  strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Distribuição por status</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={byStatus}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                    labelLine={false}
                  >
                    {byStatus.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLOR[entry.name] ?? '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} consulta${Number(v) !== 1 ? 's' : ''}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-1">
                {byStatus.map((s) => (
                  <span key={s.name} className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: STATUS_COLOR[s.name] ?? '#94a3b8' }} />
                    {s.name} ({s.value})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Por profissional + por horário */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Consultas por profissional</p>
              {byProf.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Sem dados</p>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(160, byProf.length * 44)}>
                  <BarChart data={byProf} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="nome" width={110} tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} consulta${Number(v) !== 1 ? 's' : ''}`, 'Total']} />
                    <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={22}>
                      {byProf.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? '#14b8a6' : i === 1 ? '#0ea5e9' : '#6b7280'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Distribuição por período do dia</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={byHour} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="periodo"
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} consulta${Number(v) !== 1 ? 's' : ''}`, 'Total']} />
                  <Bar dataKey="total" name="Consultas" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {byHour.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.min < 12 ? '#0ea5e9' : entry.min < 18 ? '#14b8a6' : '#8b5cf6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-2">
                {[['#0ea5e9','Manhã'], ['#14b8a6','Tarde'], ['#8b5cf6','Noite']].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
