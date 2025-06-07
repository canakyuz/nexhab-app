import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet, Dimensions } from 'react-native';
import { X, PlusCircle, MinusCircle, Smile } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

interface AddActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddNewHabit: () => void;
  onQuitBadHabit: () => void;
  onAddMood: () => void;
}

const { height, width } = Dimensions.get('window');

export function AddActionSheet({
  visible,
  onClose,
  onAddNewHabit,
  onQuitBadHabit,
  onAddMood
}: AddActionSheetProps) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          entering={FadeIn.duration(150)}
          style={StyleSheet.absoluteFill}
        />
      </Pressable>

      <Animated.View
        entering={SlideInDown.springify().damping(20)}
        style={styles.sheet}
      >
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
            onPress={onQuitBadHabit}
          >
            <MinusCircle size={24} color="#ef4444" />
            <Text style={styles.actionButtonText}>Kötü Alışkanlığı Bırak</Text>
            <Text style={styles.actionButtonSubtext}>Asla çok geç değil...</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}
            onPress={onAddNewHabit}
          >
            <PlusCircle size={24} color="#10b981" />
            <Text style={styles.actionButtonText}>Yeni İyi Alışkanlık</Text>
            <Text style={styles.actionButtonSubtext}>Daha iyi bir hayat için</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.moodButton}
          onPress={onAddMood}
        >
          <View style={styles.moodButtonContent}>
            <Text style={styles.moodButtonText}>Ruh Hali Ekle</Text>
            <Text style={styles.moodButtonSubtext}>Nasıl hissediyorsun?</Text>
          </View>

          <View style={styles.emojiRow}>
            <View style={[styles.emojiCircle, styles.selectedEmoji]}>
              <Text style={styles.emoji}>😍</Text>
            </View>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>😐</Text>
            </View>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>😢</Text>
            </View>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>😡</Text>
            </View>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>🥱</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
    color: 'hsl(222, 47%, 11%)',
  },
  actionButtonSubtext: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
    marginTop: 4,
  },
  moodButton: {
    padding: 16,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodButtonContent: {
    flex: 1,
  },
  moodButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: 'hsl(222, 47%, 11%)',
  },
  moodButtonSubtext: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
    marginTop: 4,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedEmoji: {
    borderWidth: 2,
    borderColor: 'hsl(221, 83%, 53%)',
  },
  emoji: {
    fontSize: 20,
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'hsl(221, 83%, 53%)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
}); 