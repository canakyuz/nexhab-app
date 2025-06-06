import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Input } from '@/components/ui';
import { BORDER_RADIUS, Colors, Spacing } from '@/design-tokens';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

const HABIT_COLORS = [
  Colors.progressGreen,
  Colors.progressBlue,
  Colors.progressYellow,
  Colors.primary,
  Colors.warning,
  Colors.error,
];

export type HabitModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (habit: any) => void;
  initialHabit?: any;
};

export const HabitModal = ({ visible, onClose, onSave, initialHabit }: HabitModalProps) => {
  const [habit, setHabit] = useState({
    name: '',
    category: '',
    color: HABIT_COLORS[0],
    description: '',
  });

  useEffect(() => {
    if (initialHabit) {
      setHabit({
        name: initialHabit.name || '',
        category: initialHabit.category || '',
        color: initialHabit.color || HABIT_COLORS[0],
        description: initialHabit.description || '',
      });
    } else {
      setHabit({ name: '', category: '', color: HABIT_COLORS[0], description: '' });
    }
  }, [initialHabit, visible]);

  const handleSave = () => {
    if (!habit.name.trim()) return;
    onSave(habit);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.modalContent}>
          <ThemedText type="subtitle" style={{ marginBottom: Spacing.md, fontWeight: '700', fontSize: 20, color: Colors.text }}>
            {initialHabit ? 'Edit Habit' : 'Add New Habit'}
          </ThemedText>
          <Input
            placeholder="Habit Name"
            value={habit.name}
            onChangeText={text => setHabit(h => ({ ...h, name: text }))}
            style={styles.input}
            autoFocus
          />
          <Input
            placeholder="Category"
            value={habit.category}
            onChangeText={text => setHabit(h => ({ ...h, category: text }))}
            style={styles.input}
          />
          <Input
            placeholder="Description"
            value={habit.description}
            onChangeText={text => setHabit(h => ({ ...h, description: text }))}
            style={styles.input}
          />
          <ThemedText type="caption" style={{ marginBottom: Spacing.xs, marginTop: Spacing.sm }}>Color</ThemedText>
          <ThemedView style={{ flexDirection: 'row', gap: 8, marginBottom: Spacing.lg }}>
            {HABIT_COLORS.map(color => (
              <Pressable
                key={color}
                onPress={() => setHabit(h => ({ ...h, color }))}
                style={({ pressed }) => [
                  styles.colorButton,
                  { backgroundColor: color, borderWidth: habit.color === color ? 3 : 1, borderColor: habit.color === color ? Colors.primary : Colors.divider, opacity: pressed ? 0.7 : 1 },
                ]}
              />
            ))}
          </ThemedView>
          <ThemedView style={{ flexDirection: 'row', gap: 12, marginTop: Spacing.md }}>
            <Button
              title="Save"
              variant="solid"
              onPress={handleSave}
              style={{ flex: 1, borderRadius: BORDER_RADIUS.lg, backgroundColor: Colors.primary, minHeight: 44 }}
              textStyle={{ fontWeight: '700', fontSize: 16, color: Colors.white }}
              disabled={!habit.name.trim()}
            />
            <Button
              title="Cancel"
              variant="ghost"
              onPress={onClose}
              style={{ flex: 1, borderRadius: BORDER_RADIUS.lg, minHeight: 44, backgroundColor: 'transparent' }}
              textStyle={{ color: Colors.primary, fontWeight: '600', fontSize: 16 }}
            />
          </ThemedView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.xl,
    width: '92%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: Spacing.sm,
    fontSize: 15,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
}); 