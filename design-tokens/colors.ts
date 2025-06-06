/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  // Temel renkler (her temada aynı)
  primary: '#0a7ea4',
  secondary: '#FFB300',
  gray: '#6B7280',
  lightGray: '#ECEDEE',
  darkGray: '#151718',
  white: '#FFFFFF',
  black: '#000000',
  input: '#F2F2F2',
  error: '#FF5252',
  success: '#22C55E',
  warning: '#F59E0B',
  progressGreen: '#22C55E',
  progressBlue: '#0EA5E9',
  progressYellow: '#F59E0B',
  divider: '#E5E7EB',
  text: '#11181C',

  // Tema bazlı renkler
  light: {
    text: '#11181C',
    background: '#F2F2F2',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
