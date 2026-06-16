import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../utils/colors';
import { getMonthYear } from '../utils/helpers';

function MonthYearPicker({ value, onChange }) {
  const safeValue = typeof value === 'string' && value.includes('-') ? value : getMonthYear(new Date());
  const [year, month] = safeValue.split('-');

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')),
    []
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, index) => String(currentYear - 2 + index));
  }, []);

  const handleMonth = useCallback(
    (newMonth) => {
      onChange(`${year}-${newMonth}`);
    },
    [onChange, year]
  );

  const handleYear = useCallback(
    (newYear) => {
      onChange(`${newYear}-${month}`);
    },
    [onChange, month]
  );

  return (
    <View
      style={styles.container}
      accessibilityLabel="Selecionar mês e ano"
      accessibilityHint="Escolha o mês e o ano para filtrar os dados financeiros"
    >
      <Picker
        selectedValue={month}
        style={styles.picker}
        onValueChange={handleMonth}
        accessibilityLabel="Mês"
      >
        {months.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>

      <Picker
        selectedValue={year}
        style={styles.picker}
        onValueChange={handleYear}
        accessibilityLabel="Ano"
      >
        {years.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
}

export default memo(MonthYearPicker);

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
  picker: {
    flex: 1,
    height: 50,
  },
});