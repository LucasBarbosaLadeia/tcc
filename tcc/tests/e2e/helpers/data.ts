export const testUsers = {
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@saude.com',
    password: process.env.E2E_ADMIN_PASSWORD ?? '',
  },
  recepcionista: {
    email: process.env.E2E_RECEP_EMAIL ?? 'recep@teste.com',
    password: process.env.E2E_RECEP_PASSWORD ?? '',
  },
  paciente: {
    email: process.env.E2E_PACIENTE_EMAIL ?? 'joao@teste.com',
    password: process.env.E2E_PACIENTE_PASSWORD ?? '',
  },
};

/** Gera um CPF matematicamente válido para uso nos testes. */
export function generateValidCPF(): string {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  let d1 = n.reduce((acc, v, i) => acc + v * (10 - i), 0);
  d1 = (d1 * 10) % 11;
  if (d1 >= 10) d1 = 0;

  let d2 = n.reduce((acc, v, i) => acc + v * (11 - i), 0) + d1 * 2;
  d2 = (d2 * 10) % 11;
  if (d2 >= 10) d2 = 0;

  const digits = [...n, d1, d2].join('');
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/** Gera email único por execução para evitar conflitos no banco. */
export function generateTestEmail(): string {
  return `e2e_${Date.now()}@teste.com`;
}
