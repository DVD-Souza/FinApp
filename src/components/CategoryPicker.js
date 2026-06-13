import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/colors';

const DEFAULT_CATEGORIES = ['Alimentação'];

export default function CategoryPicker({ selected, onSelect, categories }) {
  const safeCategories = useMemo(() => {
    return Array.isArray(categories) && categories.length > 0
      ? categories
      : DEFAULT_CATEGORIES;
  }, [categories]);

  const safeSelected = useMemo(() => {
    return safeCategories.includes(selected)
      ? selected
      : safeCategories[0];
  }, [selected, safeCategories]);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={safeSelected}
        onValueChange={(value) => {
          if (value && value !== selected) {
            onSelect(value);
          }
        }}
      >
        {safeCategories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
    </View>
  );
}

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