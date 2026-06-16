import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '../context/FinanceContext';
import TransactionItem from '../components/TransactionItem';
import MonthYearPicker from '../components/MonthYearPicker';
import { getMonthYear, formatCurrency } from '../utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { useTabBarVisibility } from '../hooks/useTabBarVisibility';

export default function TransactionsScreen({ navigation, setHideTabBar }) {
  const { transactions, deleteTransaction } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getMonthYear(new Date()));

  const handleScroll = useTabBarVisibility(
    () => setHideTabBar?.(true),
    () => setHideTabBar?.(false)
  );

  const filtered = useMemo(
    () => transactions.filter(t => getMonthYear(t.date) === selectedMonth),
    [transactions, selectedMonth]
  );

  const total = useMemo(
    () => filtered.reduce((s, t) => s + t.amount, 0),
    [filtered]
  );

  const handleDelete = useCallback((id, desc) => {
    Alert.alert(
      'Excluir transação',
      `Remover "${desc}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteTransaction(id) }
      ]
    );
  }, [deleteTransaction]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <MonthYearPicker value={selectedMonth} onChange={setSelectedMonth} />

        <View style={styles.totalRow}>
          <Text>Total no mês:</Text>
          <Text>{formatCurrency(total)}</Text>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onEdit={() => navigation.navigate('AddEdit', { transaction: item })}
              onDelete={() => handleDelete(item.id, item.description)}
            />
          )}
        />

        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEdit')}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});