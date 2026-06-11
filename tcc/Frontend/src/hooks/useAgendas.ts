import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAgenda, deleteAgenda, getAgendas, updateAgenda, type CreateAgendaInput } from '@/services/agendaService';

export function useAgendas() {
  return useQuery({
    queryKey: ['agendas'],
    queryFn: getAgendas,
  });
}

export function useCreateAgenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAgendaInput) => createAgenda(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agendas'] }),
  });
}

export function useUpdateAgenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<CreateAgendaInput> & { ativo?: boolean } }) =>
      updateAgenda(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agendas'] }),
  });
}

export function useDeleteAgenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAgenda(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agendas'] }),
  });
}
