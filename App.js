import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, ActivityIndicator, SafeAreaView, Platform, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import applyAllPatches from './src/utils/globalPatches';

// Apply comprehensive patches to fix string-to-number conversion issues
applyAllPatches();

// Ignore specific warnings
LogBox.ignoreLogs([
  'Require cycle:',
  'Remote debugger',
  'Unsupported top level event type "topInsetsChange" dispatched'
]);

export default function App() {
  // Make sure any dynamically loaded components are also patched
  useEffect(() => {
    try {
      // Reapply patches after the app is mounted
      // This handles components that might be loaded asynchronously
      applyAllPatches();

      console.log('[INFO] All patches applied successfully');
    } catch (error) {
      console.error('[ERROR] Failed to apply patches:', error);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // Remove the fixed padding and rely on SafeAreaView's natural behavior
  },
});
