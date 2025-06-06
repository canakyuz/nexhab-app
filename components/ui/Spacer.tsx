import { Spacing } from '@/design-tokens';
import React from 'react';
import { View } from 'react-native';

type SpacerProps = {
  size?: number;
  horizontal?: boolean;
};

export const Spacer = ({ size = Spacing.md, horizontal = false }: SpacerProps) => (
  <View style={horizontal ? { width: size } : { height: size }} />
); 