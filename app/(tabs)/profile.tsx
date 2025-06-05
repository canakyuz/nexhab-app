import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <IconSymbol size={100} name="person.circle" color="#808080" />
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText>This is the Profile screen.</ThemedText>
    </ThemedView>
  );
}