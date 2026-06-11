import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUnidade, deleteUnidade, getUnidades, type CreateUnidadeInput } from '@/services/unidadeService';

export function useUnidades() {
  return useQuery({
    queryKey: ['unidades'],
    queryFn: getUnidades,
  });
}

export function useCreateUnidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUnidadeInput) => createUnidade(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['unidades'] }),
  });
}

export function useDeleteUnidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUnidade(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['unidades'] }),
  });
}
