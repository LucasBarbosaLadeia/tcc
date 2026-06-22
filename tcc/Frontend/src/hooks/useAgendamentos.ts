import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelAgendamento,
  confirmarPresenca,
  createAgendamento,
  getAgendamentos,
  registrarFalta,
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

export function useConfirmarPresenca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => confirmarPresenca(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agendamentos'] }),
  });
}

export function useRegistrarFalta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => registrarFalta(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agendamentos'] }),
  });
}
