import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';
import App from './App';
import applyAllPatches from './src/utils/globalPatches';

// Apply our consolidated patches
applyAllPatches();

console.log('[Patch] Applied global string-to-number fixes from index.js');

// Ignore specific warnings
LogBox.ignoreLogs([
  'Require cycle:',
  'Remote debugger',
  'Unsupported top level event type "topInsetsChange" dispatched'
]);

// Register the root component
registerRootComponent(App);
