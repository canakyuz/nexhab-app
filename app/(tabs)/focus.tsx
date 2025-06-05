import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function FocusScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <IconSymbol size={100} name="clock.badge" color="#808080" />
      <ThemedText type="title">Focus</ThemedText>
      <ThemedText>This is the Focus screen.</ThemedText>
    </ThemedView>
  );
}