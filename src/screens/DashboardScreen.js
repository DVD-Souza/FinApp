import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import TransactionItem from '../components/TransactionItem';
import { formatCurrency, getMonthYear } from '../utils/helpers';
import { fetchExchangeRates } from '../services/api';
import { colors } from '../utils/colors';
import { useTabBarVisibility } from '../hooks/useTabBarVisibility';

export default function DashboardScreen({ navigation, setHideTabBar }) {
  const { transactions, loading: ctxLoading, error: ctxError, deleteTransaction } = useFinance();

  const handleScroll = useTabBarVisibility(
    () => setHideTabBar(true),
    () => setHideTabBar(false)
  );

  const [rates, setRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentMonth = getMonthYear(new Date());

  const monthlyTransactions = useMemo(
    () => transactions.filter(t => getMonthYear(t.date) === currentMonth),
    [transactions]
  );

  const { income, expense, balance } = useMemo(() => {
    const inc = monthlyTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const exp = monthlyTransactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [monthlyTransactions]);

  const lastTransactions = transactions.slice(0, 5);

  const loadRates = useCallback(async () => {
    setRatesLoading(true);
    try {
      const data = await fetchExchangeRates();
      setRates(data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar cotações.');
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRates();
    setRefreshing(false);
  }, []);

  const handleDelete = useCallback((tx) => {
    Alert.alert(
      'Excluir transação',
      `Remover "${tx.description}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteTransaction(tx.id) }
      ]
    );
  }, [deleteTransaction]);

  if (ctxLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardMain}>
          <Text style={styles.label}>Saldo atual</Text>
          <Text style={styles.balance}>{formatCurrency(balance)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.card}>
            <Text>Receitas</Text>
            <Text style={styles.income}>{formatCurrency(income)}</Text>
          </View>

          <View style={styles.card}>
            <Text>Despesas</Text>
            <Text style={styles.expense}>{formatCurrency(expense)}</Text>
          </View>
        </View>

        <Text style={styles.section}>Últimas transações</Text>

        {lastTransactions.map(tx => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onEdit={() => navigation.navigate('AddEdit', { transaction: tx })}
            onDelete={() => handleDelete(tx)}
          />
        ))}

        <Text style={styles.section}>Cotações do dia</Text>

        {ratesLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.row}>
            <View style={styles.card}>
              <Text>USD</Text>
              <Text>{formatCurrency(rates?.usd?.bid || 0)}</Text>
            </View>

            <View style={styles.card}>
              <Text>EUR</Text>
              <Text>{formatCurrency(rates?.eur?.bid || 0)}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 120,
  },
  cardMain: { backgroundColor: colors.primary, padding: 24, borderRadius: 24, marginBottom: 16 },
  balance: { fontSize: 28, color: '#FFF' },
  label: { color: '#FFF' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: { flex: 1, padding: 16, backgroundColor: colors.card, borderRadius: 12 },
  income: { color: colors.success },
  expense: { color: colors.danger },
  section: { fontSize: 18, marginVertical: 10 },
});