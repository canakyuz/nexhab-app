import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <IconSymbol size={100} name="house" color="#808080" />
      <ThemedText type="title">Home</ThemedText>
      <ThemedText>This is the Home screen.</ThemedText>
    </ThemedView>
  );
}