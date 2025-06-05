// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
    'house.fill': 'home',
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
    'chevron.left': 'chevron-left',
    'gearshape.fill': 'settings',
    'bell.fill': 'notifications',
    'plus.circle.fill': 'add-circle',
    'trash.fill': 'delete',
    'pencil.circle.fill': 'edit',
    'checkmark.circle.fill': 'check-circle',
    'xmark.circle.fill': 'close',
    'heart.fill': 'favorite',
    'heart': 'favorite-border',
    'magnifyingglass': 'search',
    'person.fill': 'person',
    'person.crop.circle.fill': 'account-circle',
    'star.fill': 'star',
    'star': 'star-border',
    'ellipsis': 'more-vert',
    'ellipsis.circle': 'more-horiz',
    'ellipsis.circle.fill': 'more-horiz',
    'link': 'link',
    'link.circle': 'link',
    'link.circle.fill': 'link',
    'photo': 'photo',
    'photo.fill': 'photo',
    'camera': 'camera-alt',
    'camera.fill': 'camera-alt',
    // add habit tracker icons
    'checkmark.square.fill': 'check-box',
    // add focus timer icons
    'clock': 'access-time',
    'clock.badge': 'timer',
    'clock.badge.fill': 'timer',

} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
