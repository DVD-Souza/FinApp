import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, SafeAreaView, Platform } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import TransactionItem from '../components/TransactionItem';
import { formatCurrency, getMonthYear } from '../utils/helpers';
import { fetchExchangeRates } from '../services/api';
import { colors } from '../utils/colors';

export default function DashboardScreen({ navigation }) {
  const { transactions, loading: ctxLoading, error: ctxError } = useFinance();
  const [rates, setRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentMonth = getMonthYear(new Date());
  const monthlyTransactions = transactions.filter(t => getMonthYear(t.date) === currentMonth);
  const income = monthlyTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = monthlyTransactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = income - expense;
  const lastTransactions = transactions.slice(0, 5);

  const loadRates = useCallback(async () => {
    setRatesLoading(true);
    try {
      const data = await fetchExchangeRates();
      setRates(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRates();
    setRefreshing(false);
  };

  // Mostra erro de contexto se houver
  if (ctxError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Erro ao carregar dados</Text>
          <Text style={styles.errorSub}>{ctxError.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardMain}>
          <Text style={styles.label}>Saldo atual</Text>
          <Text style={styles.balance}>{formatCurrency(balance)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.smallLabel}>Receitas</Text>
            <Text style={styles.income}>{formatCurrency(income)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.smallLabel}>Despesas</Text>
            <Text style={styles.expense}>{formatCurrency(expense)}</Text>
          </View>
        </View>

        <Text style={styles.section}>Últimas transações</Text>
        {lastTransactions.length === 0 ? (
          <Text style={styles.empty}>Nenhuma transação ainda</Text>
        ) : (
          lastTransactions.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={() => navigation.navigate('AddEdit', { transaction: tx })}
              onDelete={() => {}}
            />
          ))
        )}

        <Text style={styles.section}>Cotações do dia</Text>
        {ratesLoading ? (
          <ActivityIndicator size="small" />
        ) : rates ? (
          <View style={styles.row}>
            <View style={styles.rateCard}>
              <Text style={styles.rateCurrency}>USD</Text>
              <Text>{formatCurrency(rates.usd.bid)}</Text>
              <Text style={[styles.variation, rates.usd.variation >= 0 ? styles.posVar : styles.negVar]}>
                {rates.usd.variation}%
              </Text>
            </View>
            <View style={styles.rateCard}>
              <Text style={styles.rateCurrency}>EUR</Text>
              <Text>{formatCurrency(rates.eur.bid)}</Text>
              <Text style={[styles.variation, rates.eur.variation >= 0 ? styles.posVar : styles.negVar]}>
                {rates.eur.variation}%
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.error}>Erro ao carregar câmbio</Text>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 16, paddingBottom: 20 },
  cardMain: { backgroundColor: colors.primary, padding: 24, borderRadius: 24, marginBottom: 16 },
  balance: { fontSize: 34, fontWeight: '700', color: '#FFF', marginTop: 8 },
  label: { color: '#E5E7EB', fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  card: { flex: 1, backgroundColor: colors.card, padding: 16, borderRadius: 16, ...shadow },
  smallLabel: { color: colors.textMuted, fontSize: 12 },
  income: { color: colors.success, fontSize: 18, fontWeight: '700' },
  expense: { color: colors.danger, fontSize: 18, fontWeight: '700' },
  section: { fontSize: 18, fontWeight: '700', marginVertical: 12, color: colors.text },
  rateCard: { flex: 1, backgroundColor: colors.card, padding: 14, borderRadius: 16, alignItems: 'center', ...shadow },
  rateCurrency: { fontWeight: 'bold', fontSize: 16 },
  variation: { fontSize: 12, marginTop: 4 },
  posVar: { color: colors.success },
  negVar: { color: colors.danger },
  empty: { textAlign: 'center', color: colors.textMuted, marginVertical: 20 },
  error: { color: colors.danger, textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: colors.danger, marginBottom: 8 },
  errorSub: { fontSize: 14, color: colors.textMuted },
});

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
};