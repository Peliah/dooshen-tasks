import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

// Platform-specific font family names
// NOTE: On Android, fontWeight doesn't work with single TTF files.
// You need separate font files for each weight and load them with different names.
// For now, using regular weight on Android. When you add Bold/SemiBold fonts:
// 1. Load them in app/_layout.tsx as 'Josefin Sans Bold' and 'Josefin Sans SemiBold'
// 2. Update the android values below to use those font family names

const getFontFamily = (weight: 'regular' | 'semibold' | 'bold') => {
  if (Platform.OS === 'android') {
    // Android requires separate font files - now using specific font families
    if (weight === 'semibold') {
      return 'Josefin Sans SemiBold';
    }
    if (weight === 'bold') {
      return 'Josefin Sans Bold';
    }
    return 'Josefin Sans';
  }
  // iOS can synthesize weights from a single font file
  return 'Josefin Sans';
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Josefin Sans',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: getFontFamily('semibold'),
    // iOS can synthesize weights, Android cannot
    ...(Platform.OS === 'ios' && { fontWeight: '600' }),
  },
  title: {
    fontSize: 32,
    fontFamily: getFontFamily('bold'),
    lineHeight: 32,
    // iOS can synthesize weights, Android cannot
    ...(Platform.OS === 'ios' && { fontWeight: 'bold' }),
  },
  subtitle: {
    fontSize: 20,
    fontFamily: getFontFamily('bold'),
    // iOS can synthesize weights, Android cannot
    ...(Platform.OS === 'ios' && { fontWeight: 'bold' }),
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: 'Josefin Sans',
  },
});
