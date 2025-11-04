import { ThemeProvider as CustomThemeProvider, useTheme } from '@/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error('EXPO_PUBLIC_CONVEX_URL is not set. Convex features will not work.');
  console.error('Please set EXPO_PUBLIC_CONVEX_URL in your .env file.');
}

// Always create a Convex client, even if URL is missing
// This prevents the "ConvexProvider missing" error
// The client will fail gracefully if the URL is invalid
const convex = new ConvexReactClient(convexUrl || 'https://placeholder.convex.cloud', {
  unsavedChangesWarning: false,
});

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
