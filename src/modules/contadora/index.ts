import { Banknote } from 'lucide-react-native';

import { formatNumber } from '@/core/i18n/numbers';
import { useModuleData } from '@/core/hooks/use-async-data';

import type { ModuleDefinition } from '../types';
import { ContadoraArt } from './components/ContadoraArt';
import { CONTADORA_MODULE_ID, getCounts } from './services/cash-service';
import { totalFor } from './services/money';
import { CURRENCIES } from './types';

export const contadoraModule: ModuleDefinition = {
  id: CONTADORA_MODULE_ID,
  name: 'Contadora',
  description: 'Cuenta tus billetes por moneda',
  icon: Banknote,
  Art: ContadoraArt,
  route: '/contadora',
  migrations: [
    {
      version: 1,
      sql: `
        CREATE TABLE IF NOT EXISTS cash_counts (
          currency TEXT NOT NULL,
          denomination INTEGER NOT NULL,
          qty INTEGER NOT NULL,
          PRIMARY KEY (currency, denomination)
        );
        CREATE TABLE IF NOT EXISTS cash_prefs (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `,
    },
  ],
  useSummary: () => {
    const { data: counts } = useModuleData(CONTADORA_MODULE_ID, getCounts);
    const parts = CURRENCIES.map((c) => ({ c, total: totalFor(c, counts ?? {}) })).filter((p) => p.total > 0);
    return {
      title: 'Contadora',
      subtitle:
        parts.length === 0
          ? 'Cuenta tu efectivo cuando quieras'
          : parts.map((p) => `${formatNumber(p.total, 0)} ${p.c}`).join(' · '),
    };
  },
};
