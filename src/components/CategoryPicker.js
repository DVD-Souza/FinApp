import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/colors';

const FALLBACK_CATEGORIES = ['Alimentação'];

function CategoryPicker({ selected, onSelect, categories }) {
  const safeCategories = useMemo(() => {
    return Array.isArray(categories) && categories.length > 0
      ? categories
      : FALLBACK_CATEGORIES;
  }, [categories]);

  const safeSelected = useMemo(() => {
    return safeCategories.includes(selected) ? selected : safeCategories[0];
  }, [selected, safeCategories]);

  return (
    <View
      style={styles.container}
      accessibilityLabel="Selecionar categoria"
      accessibilityHint="Escolha a categoria da transação"
      accessibilityRole="combobox"
    >
      <Picker selectedValue={safeSelected} onValueChange={onSelect}>
        {safeCategories.map((category) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>
    </View>
  );
}

export default memo(CategoryPicker);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    marginVertical: 8,
    overflow: 'hidden',
  },
});