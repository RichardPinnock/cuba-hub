import { useLocalSearchParams } from 'expo-router';

import { TaskFormScreen } from '@/modules/tareas/screens/TaskFormScreen';

export default function EditarTarea() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TaskFormScreen id={Number(id)} />;
}
