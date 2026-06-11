import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  type CreatePacienteInput,
  type UpdatePacienteInput,
} from '@/services/pacienteService';

export function useAllPacientes() {
  return useQuery({ queryKey: ['pacientes'], queryFn: getAllPacientes });
}

export function usePaciente(id: number | undefined) {
  return useQuery({
    queryKey: ['paciente', id],
    queryFn: () => getPaciente(id!),
    enabled: id !== undefined,
  });
}

export function useCreatePaciente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePacienteInput) => createPaciente(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pacientes'] }),
  });
}

export function useUpdatePaciente(id: number | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePacienteInput) => updatePaciente(id!, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['paciente', id] }),
  });
}
