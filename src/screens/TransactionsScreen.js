import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import TransactionItem from '../components/TransactionItem';
import MonthYearPicker from '../components/MonthYearPicker';
import { getMonthYear, formatCurrency } from '../utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

export default function TransactionsScreen({ navigation }) {
  const { transactions, deleteTransaction } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getMonthYear(new Date()));

  const filtered = transactions.filter(t => getMonthYear(t.date) === selectedMonth);
  const total = filtered.reduce((s, t) => s + t.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MonthYearPicker value={selectedMonth} onChange={setSelectedMonth} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total no mês:</Text>
          <Text style={[styles.totalValue, total >= 0 ? styles.positive : styles.negative]}>
            {formatCurrency(total)}
          </Text>
        </View>
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onEdit={() => navigation.navigate('AddEdit', { transaction: item })}
              onDelete={() => deleteTransaction(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação neste mês</Text>}
          contentContainerStyle={styles.listContent}
        />
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEdit')}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positive: { color: colors.success },
  negative: { color: colors.danger },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textMuted,
  },
  listContent: {
    paddingBottom: 80, // espaço para o FAB + TabBar
  },
  fab: {
    position: 'absolute',
    bottom: 80, // sobe acima da TabBar (60 altura + 20 de margem)
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});