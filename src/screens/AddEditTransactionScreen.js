import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFinance } from '../context/FinanceContext';
import CategoryPicker from '../components/CategoryPicker';
import CustomButton from '../components/CustomButton';
import { colors } from '../utils/colors';
import { formatDate, parseCurrencyInput } from '../utils/helpers';

export default function AddEditTransactionScreen({ route, navigation }) {
  const transaction = route?.params?.transaction;
  const { addTransaction, updateTransaction, categories } = useFinance();

  const initialCategory = useMemo(() => {
    return transaction?.category || categories?.[0] || 'Alimentação';
  }, [transaction?.category, categories]);

  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(
    transaction?.amount ? String(Math.abs(Number(transaction.amount))).replace('.', ',') : ''
  );
  const [type, setType] = useState(transaction?.amount > 0 ? 'income' : 'expense');
  const [category, setCategory] = useState(initialCategory);
  const [date, setDate] = useState(transaction?.date ? new Date(transaction.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = useCallback(() => {
    const trimmedDescription = description.trim();

    if (!trimmedDescription) {
      Alert.alert('Erro', 'Descrição é obrigatória.');
      return;
    }

    const numericAmount = parseCurrencyInput(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Erro', 'Informe um valor válido maior que zero.');
      return;
    }

    const transactionValue = type === 'income' ? numericAmount : -numericAmount;

    const payload = {
      description: trimmedDescription,
      amount: transactionValue,
      category,
      date: date.toISOString(),
    };

    if (transaction?.id) {
      updateTransaction(transaction.id, payload);
    } else {
      addTransaction(payload);
    }

    navigation.goBack();
  }, [
    description,
    amount,
    type,
    category,
    date,
    transaction?.id,
    addTransaction,
    updateTransaction,
    navigation,
  ]);

  const handleDatePickerOpen = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const onDateChange = useCallback((event, selectedDate) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title} accessibilityRole="header">
            {transaction ? 'Editar' : 'Nova'} Transação
          </Text>

          <TextInput
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            returnKeyType="next"
            accessibilityLabel="Descrição da transação"
            accessibilityHint="Digite o nome da despesa ou receita"
          />

          <TextInput
            placeholder="Valor (R$)"
            value={amount}
            onChangeText={setAmount}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            style={styles.input}
            accessibilityLabel="Valor"
            accessibilityHint="Digite o valor da transação. Você pode usar vírgula para centavos"
          />

          <View style={styles.row}>
            <CustomButton
              title="💰 Receita"
              onPress={() => setType('income')}
              type={type === 'income' ? 'success' : 'outline'}
              small
              style={styles.flexButton}
              accessibilityHint="Marcar transação como receita"
            />

            <CustomButton
              title="💸 Despesa"
              onPress={() => setType('expense')}
              type={type === 'expense' ? 'danger' : 'outline'}
              small
              style={styles.flexButton}
              accessibilityHint="Marcar transação como despesa"
            />
          </View>

          <CategoryPicker selected={category} onSelect={setCategory} categories={categories} />

          <TouchableOpacity
            onPress={handleDatePickerOpen}
            style={styles.dateButtonWrapper}
            activeOpacity={0.8}
            accessibilityLabel={`Data selecionada ${formatDate(date)}`}
            accessibilityHint="Toque para alterar a data da transação"
            accessibilityRole="button"
          >
            <View pointerEvents="none">
              <CustomButton
                title={`📅 ${formatDate(date)}`}
                type="outline"
                style={styles.dateButton}
              />
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          <CustomButton
            title="Salvar"
            onPress={handleSave}
            style={styles.saveButton}
            accessibilityHint="Salvar transação financeira"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  flexButton: {
    flex: 1,
  },
  dateButtonWrapper: {
    marginVertical: 8,
  },
  dateButton: {
    width: '100%',
  },
  saveButton: {
    marginTop: 20,
  },
});