import { ThemeProvider as CustomThemeProvider, useTheme } from '@/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn('EXPO_PUBLIC_CONVEX_URL is not set. Convex features will not work.');
}

const convex = convexUrl 
  ? new ConvexReactClient(convexUrl, {
      unsavedChangesWarning: false,
    })
  : null;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Josefin Sans': require('@/assets/fonts/josefin-sans.regular.ttf'),
    'Josefin Sans SemiBold': require('@/assets/fonts/josefin-sans.semibold.ttf'),
    'Josefin Sans Bold': require('@/assets/fonts/josefin-sans.bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <CustomThemeProvider>
      <ThemeProviderWrapper />
    </CustomThemeProvider>
  );
}

function ThemeProviderWrapper() {
  const { isDark } = useTheme();
  
  if (!convex) {
    return (
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

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
