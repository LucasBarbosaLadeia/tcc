import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getEspecialidades,
  createEspecialidade,
  updateEspecialidade,
  deleteEspecialidade,
} from '@/services/especialidadeService';

export function useEspecialidades() {
  return useQuery({ queryKey: ['especialidades'], queryFn: getEspecialidades });
}

export function useCreateEspecialidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (nome: string) => createEspecialidade(nome),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['especialidades'] }),
  });
}

export function useUpdateEspecialidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nome }: { id: number; nome: string }) => updateEspecialidade(id, nome),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['especialidades'] }),
  });
}

export function useDeleteEspecialidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEspecialidade(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['especialidades'] }),
  });
}
