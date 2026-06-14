import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFinance } from '../context/FinanceContext';
import CategoryPicker from '../components/CategoryPicker';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';
import { formatDate } from '../utils/helpers';

export default function AddEditTransactionScreen({ route, navigation }) {
  const { transaction } = route.params || {};
  const { addTransaction, updateTransaction, categories } = useFinance();

  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount ? String(Math.abs(transaction.amount)) : '');
  const [type, setType] = useState(transaction?.amount > 0 ? 'income' : 'expense');
  const [category, setCategory] = useState(transaction?.category || (categories && categories[0]) || 'Alimentação');
  const [date, setDate] = useState(transaction?.date ? new Date(transaction.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!description.trim()) {
      Alert.alert('Erro', 'Descrição é obrigatória');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Erro', 'Valor inválido');
      return;
    }
    const value = type === 'income' ? numericAmount : -numericAmount;
    const data = {
      description: description.trim(),
      amount: value,
      category,
      date: date.toISOString(),
    };
    if (transaction) {
      updateTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{transaction ? 'Editar' : 'Nova'} Transação</Text>

        <TextInput
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Valor (R$)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.row}>
          <CustomButton
            title="💰 Receita"
            onPress={() => setType('income')}
            type={type === 'income' ? 'success' : 'outline'}
            small
            style={styles.flexButton}
          />
          <CustomButton
            title="💸 Despesa"
            onPress={() => setType('expense')}
            type={type === 'expense' ? 'danger' : 'outline'}
            small
            style={styles.flexButton}
          />
        </View>

        <CategoryPicker selected={category} onSelect={setCategory} categories={categories} />

        <CustomButton
          title={`📅 ${formatDate(date)}`}
          onPress={() => setShowDatePicker(true)}
          type="outline"
          style={styles.dateButton}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <CustomButton title="Salvar" onPress={handleSave} style={styles.saveButton} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: colors.text },
  input: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  flexButton: { flex: 1 },
  dateButton: { marginVertical: 8 },
  saveButton: { marginTop: 20 },
});