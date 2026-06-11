export const PERFIS = ['PACIENTE', 'RECEPCIONISTA', 'ADMIN'] as const;

export type Perfil = (typeof PERFIS)[number];
