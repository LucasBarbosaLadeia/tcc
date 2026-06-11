import { z } from 'zod';

export const pacienteSchema = z.object({
  telefone: z.string().min(10, 'Telefone inválido (mín. 10 dígitos)'),
  cep: z
    .string()
    .regex(/^\d{8}$/, 'CEP deve conter 8 dígitos numéricos'),
  logradouro: z.string().min(3, 'Logradouro muito curto'),
  numero: z.string().min(1, 'Número obrigatório'),
  bairro: z.string().min(2, 'Bairro muito curto'),
  cidade: z.string().min(2, 'Cidade muito curta'),
  estado: z
    .string()
    .length(2, 'Use a sigla do estado (ex: SP)')
    .transform((v) => v.toUpperCase()),
});

export type PacienteSchema = z.infer<typeof pacienteSchema>;
