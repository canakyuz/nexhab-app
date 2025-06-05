import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HabitsScreen() {
    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <IconSymbol size={100} name="checkmark.square" color="#808080" />
            <ThemedText type="title">Habits</ThemedText>
            <ThemedText>This is the Habits screen.</ThemedText>
        </ThemedView>
    );
}