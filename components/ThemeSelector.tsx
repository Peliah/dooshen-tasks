import { ThemeMode, useTheme } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ThemeSelectorProps {
    style?: any;
}

export function ThemeSelector({ style }: ThemeSelectorProps) {
    const { themeMode, setThemeMode, isDark } = useTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const iconColor = useThemeColor({}, 'icon');
    const tintColor = useThemeColor({}, 'tint');

    const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
        { mode: 'light', label: 'Light', icon: 'sunny' },
        { mode: 'dark', label: 'Dark', icon: 'moon' },
        { mode: 'system', label: 'System', icon: 'phone-portrait' },
    ];

    const handleThemeSelect = (mode: ThemeMode) => {
        setThemeMode(mode);
        setIsModalVisible(false);
    };

    const getCurrentThemeIcon = () => {
        if (themeMode === 'system') return 'phone-portrait';
        return isDark ? 'moon' : 'sunny';
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.selectorButton, { backgroundColor }, style]}
                onPress={() => setIsModalVisible(true)}
                accessibilityLabel="Open theme selector"
                accessibilityRole="button"
            >
                <Ionicons
                    name={getCurrentThemeIcon()}
                    size={20}
                    color={iconColor}
                />
                <Text style={[styles.selectorText, { color: textColor }]}>
                    Theme
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={16}
                    color={iconColor}
                />
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsModalVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor }]}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>
                            Choose Theme
                        </Text>

                        {themeOptions.map((option) => (
                            <TouchableOpacity
                                key={option.mode}
                                style={[
                                    styles.optionButton,
                                    themeMode === option.mode && { backgroundColor: tintColor + '20' }
                                ]}
                                onPress={() => handleThemeSelect(option.mode)}
                            >
                                <Ionicons
                                    name={option.icon}
                                    size={20}
                                    color={themeMode === option.mode ? tintColor : iconColor}
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        { color: themeMode === option.mode ? tintColor : textColor }
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                {themeMode === option.mode && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color={tintColor}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    selectorText: {
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        margin: 20,
        borderRadius: 12,
        padding: 20,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
        gap: 12,
    },
    optionText: {
        fontSize: 16,
        flex: 1,
    },
});
