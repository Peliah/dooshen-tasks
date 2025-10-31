import { ThemeProvider as CustomThemeProvider, useTheme } from '@/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <ThemeProviderWrapper />
    </CustomThemeProvider>
  );
}

function ThemeProviderWrapper() {
  const { isDark } = useTheme();
  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ConvexProvider>
    </ThemeProvider>
  );
}
