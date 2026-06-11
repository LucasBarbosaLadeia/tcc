import { api } from './api';
import type { Horario } from '@/types/horario';

export async function getHorarios(): Promise<Horario[]> {
  const { data } = await api.get<Horario[]>('/datas');
  return data;
}
