import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUnidade, getUnidades, type CreateUnidadeInput } from '@/services/unidadeService';

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
