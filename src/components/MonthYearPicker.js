import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/colors';

export default function MonthYearPicker({ value, onChange }) {
  const [year, month] = value.split('-');

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));

  const handleMonth = (newMonth) => onChange(`${year}-${newMonth}`);
  const handleYear = (newYear) => onChange(`${newYear}-${month}`);

  return (
    <View style={styles.container}>
      <Picker selectedValue={month} style={styles.picker} onValueChange={handleMonth}>
        {months.map(m => <Picker.Item key={m} label={m} value={m} />)}
      </Picker>
      <Picker selectedValue={year} style={styles.picker} onValueChange={handleYear}>
        {years.map(y => <Picker.Item key={y} label={y} value={y} />)}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
    overflow: 'hidden',
  },
  picker: { flex: 1, height: 50 },
});