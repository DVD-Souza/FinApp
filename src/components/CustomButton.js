import React, { memo, useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

function CustomButton({
  title,
  onPress,
  type = 'primary',
  small = false,
  disabled = false,
  style,
  accessibilityHint,
}) {
  const buttonStyle = useMemo(() => {
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
  }, [type]);

  const textStyle = useMemo(() => {
    return type === 'outline' ? styles.outlineText : styles.text;
  }, [type]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        small && styles.small,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[textStyle, small && styles.smallText]} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default memo(CustomButton);

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
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
    minHeight: 40,
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