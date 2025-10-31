import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    themeMode: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const systemColorScheme = useRNColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

    // Load saved theme preference on app start
    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
                    setThemeModeState(savedTheme as ThemeMode);
                }
            } catch (error) {
                console.log('Error loading theme preference:', error);
            }
        };
        loadThemePreference();
    }, []);

    // Update isDark based on theme mode and system preference
    useEffect(() => {
        if (themeMode === 'system') {
            setIsDark(systemColorScheme === 'dark');
        } else {
            setIsDark(themeMode === 'dark');
        }
    }, [themeMode, systemColorScheme]);

    const toggleTheme = () => {
        const newMode: ThemeMode = isDark ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
            setThemeModeState(mode);
        } catch (error) {
            console.log('Error saving theme preference:', error);
        }
    };

    const value: ThemeContextType = {
        themeMode,
        isDark,
        toggleTheme,
        setThemeMode,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
