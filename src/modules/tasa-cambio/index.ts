import { ArrowRightLeft } from 'lucide-react-native';

import { formatNumber } from '@/core/i18n/numbers';

import type { ModuleDefinition } from '../types';
import { TasaArt } from './components/TasaArt';
import { useRates } from './hooks/use-rates';
import { tasaWidget } from './widget';
import { TASA_MODULE_ID } from './services/rates-service';

export const tasaCambioModule: ModuleDefinition = {
  id: TASA_MODULE_ID,
  name: 'Tasa de cambio',
  description: 'USD y EUR a CUP, sin conexión',
  icon: ArrowRightLeft,
  Art: TasaArt,
  route: '/tasa',
  migrations: [
    {
      version: 1,
      sql: `
        CREATE TABLE IF NOT EXISTS rates (
          currency TEXT PRIMARY KEY NOT NULL,
          cup_per_unit REAL,
          updated_at TEXT
        );
        INSERT OR IGNORE INTO rates (currency, cup_per_unit, updated_at) VALUES ('USD', NULL, NULL), ('EUR', NULL, NULL);
      `,
    },
  ],
  useSummary: () => {
    const { rates } = useRates();
    const defined = rates.filter((r) => r.cupPerUnit !== null);
    if (defined.length === 0) return { title: 'Tasa de cambio', subtitle: 'Pon la tasa de hoy para convertir' };
    return {
      title: 'Tasa de cambio',
      subtitle: defined.map((r) => `1 ${r.currency} = ${formatNumber(r.cupPerUnit ?? 0)} CUP`).join(' · '),
    };
  },
  widget: tasaWidget,
};
