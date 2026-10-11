import { contadoraModule } from './contadora';
import { tareasModule } from './tareas';
import { tasaCambioModule } from './tasa-cambio';
import type { ModuleDefinition } from './types';

/** ÚNICO registro de módulos: para añadir uno, crea su carpeta y agrégalo aquí. */
export const MODULES: ModuleDefinition[] = [tareasModule, tasaCambioModule, contadoraModule];
