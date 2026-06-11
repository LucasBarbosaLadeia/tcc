import { useQuery } from '@tanstack/react-query';
import { getHorarios } from '@/services/horarioService';

export function useHorarios() {
  return useQuery({
    queryKey: ['horarios'],
    queryFn: getHorarios,
  });
}
