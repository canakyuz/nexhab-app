import { BORDER_RADIUS, Colors, Shadows, Spacing } from '@/design-tokens';
import React from 'react';
import { Platform, Modal as RNModal, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

export type ModalVariant = 'default' | 'fullscreen' | 'bottomSheet';

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: ModalVariant;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export const Modal = ({
  visible,
  onClose,
  children,
  variant = 'default',
  style,
  accessibilityLabel,
}: ModalProps) => {
  const getModalStyle = () => {
    switch (variant) {
      case 'fullscreen':
        return [styles.modal, styles.fullscreen, style];
      case 'bottomSheet':
        return [styles.modal, styles.bottomSheet, style];
      default:
        return [styles.modal, style];
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={variant === 'bottomSheet' ? 'slide' : variant === 'fullscreen' ? 'fade' : 'slide'}
      onRequestClose={onClose}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={getModalStyle()}>{children}</View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.lg,
    margin: 24,
    padding: Spacing.modal.padding,
    zIndex: 2,
    ...(Platform.OS === 'ios' ? Shadows.modal.ios : Shadows.modal.android),
  },
  fullscreen: {
    margin: 0,
    borderRadius: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    margin: 0,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 32,
  },
}); 