import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProfissional, getProfissionais, type CreateProfissionalInput } from '@/services/profissionalService';

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
