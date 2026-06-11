import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelAgendamento,
  createAgendamento,
  getAgendamentos,
  type CreateAgendamentoInput,
} from '@/services/agendamentoService';

export function useAgendamentos() {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn: getAgendamentos,
  });
}

export function useCreateAgendamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAgendamentoInput) => createAgendamento(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agendamentos'] }),
  });
}

export function useCancelAgendamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      cancelAgendamento(id, motivo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agendamentos'] }),
  });
}
