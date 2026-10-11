type Listener = (moduleId: string) => void;

const listeners = new Set<Listener>();

/** Bus mínimo: los servicios avisan de que cambiaron datos; hooks y widgets se refrescan. */
export function emitDataChanged(moduleId: string): void {
  listeners.forEach((l) => l(moduleId));
}

export function onDataChanged(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
