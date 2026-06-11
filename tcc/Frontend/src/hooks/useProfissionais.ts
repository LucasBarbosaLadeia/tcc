import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProfissional, deleteProfissional, getProfissionais, type CreateProfissionalInput } from '@/services/profissionalService';

export function useProfissionais() {
  return useQuery({
    queryKey: ['profissionais'],
    queryFn: getProfissionais,
  });
}

export function useCreateProfissional() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProfissionalInput) => createProfissional(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profissionais'] }),
  });
}

export function useDeleteProfissional() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProfissional(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profissionais'] }),
  });
}
