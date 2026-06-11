import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  type CreateUsuarioInput,
  type UpdateUsuarioInput,
  type UsuarioAPI,
} from '@/services/usuarioService';

export type { UsuarioAPI };

export function useUsuarios() {
  return useQuery({ queryKey: ['usuarios'], queryFn: getUsuarios });
}

export function useCreateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUsuarioInput) => createUsuario(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useUpdateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateUsuarioInput }) =>
      updateUsuario(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useDeleteUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUsuario(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}
