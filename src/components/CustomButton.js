import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export default function CustomButton({ 
  title, 
  onPress, 
  type = 'primary',  // 'primary', 'success', 'danger', 'outline'
  small = false, 
  disabled = false,
  style = {}
}) {
  const getButtonStyle = () => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'danger':
        return styles.danger;
      case 'outline':
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    if (type === 'outline') return styles.outlineText;
    return styles.text;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        small && styles.small,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[getTextStyle(), small && styles.smallText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outlineText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
});