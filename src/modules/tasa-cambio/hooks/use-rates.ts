import { useModuleData } from '@/core/hooks/use-async-data';

import { getRates, TASA_MODULE_ID } from '../services/rates-service';

export function useRates() {
  const { data, loading, error } = useModuleData(TASA_MODULE_ID, getRates);
  return { rates: data ?? [], loading, error };
}
