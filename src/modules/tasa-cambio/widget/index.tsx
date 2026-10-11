import { WIDGET_COLORS } from '@/core/widgets/colors';

import type { ModuleWidget } from '../../types';
import { getRates } from '../services/rates-service';
import { TasaWidget } from './TasaWidget';

export const tasaWidget: ModuleWidget = {
  name: 'TasaWidget',
  render: async () => {
    const rates = await getRates();
    return {
      light: <TasaWidget rates={rates} colors={WIDGET_COLORS.light} />,
      dark: <TasaWidget rates={rates} colors={WIDGET_COLORS.dark} />,
    };
  },
};
