import { useTheme } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface ThemeToggleButtonProps {
    size?: number;
    style?: ViewStyle;
    onPress?: () => void;
}

export function ThemeToggleButton({
    size = 24,
    style,
    onPress
}: ThemeToggleButtonProps) {
    const { isDark, toggleTheme } = useTheme();
    const iconColor = useThemeColor({}, 'icon');

    const handlePress = () => {
        toggleTheme();
        onPress?.();
    };

    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={handlePress}
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            accessibilityRole="button"
        >
            <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={size}
                color={iconColor}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
