import 'expo-router/entry';

import { registerWidgetTaskHandler } from 'react-native-android-widget';

import { widgetTaskHandler } from './src/core/widgets/task-handler';

registerWidgetTaskHandler(widgetTaskHandler);
