import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('Informe um e-mail válido'),
  senha: z.string().min(1, 'Informe a senha').min(6, 'A senha precisa ter ao menos 6 caracteres'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
