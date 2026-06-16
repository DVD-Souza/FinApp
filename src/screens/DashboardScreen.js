import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function DashboardScreen({ navigation }) {
  const { transactions, deleteTransaction, loading: ctxLoading, error: ctxError } = useFinance();
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
        {lastTransactions.length === 0 ? (
          <Text style={styles.empty}>Nenhuma transação ainda</Text>
        ) : (
          lastTransactions.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={() => navigation.navigate('AddEdit', { transaction: tx })}
              onDelete={() => deleteTransaction(tx.id)}
            />
          ))
        )}

        <View style={styles.exchangeSection}>
          <View style={styles.exchangeHeader}>
            <Text style={styles.section}>Cotações do dia</Text>
            <Text style={styles.exchangeBase}>Base: BRL</Text>
          </View>
          {ratesLoading ? (
            <ActivityIndicator size="small" />
          ) : rates ? (
            <>
              <View style={styles.row}>
                <View style={styles.rateCard}>
                  <View style={styles.rateCurrencyContainer}>
                    <Text style={styles.rateCurrencyIcon}>🇺🇸</Text>
                    <Text style={styles.rateCurrency}>USD</Text>
                  </View>
                  <View style={styles.rateValueContainer}>
                    <Text style={styles.rateValue}>{formatCurrency(rates.usd.bid)}</Text>
                  </View>
                </View>
                <View style={styles.rateCard}>
                  <View style={styles.rateCurrencyContainer}>
                    <Text style={styles.rateCurrencyIcon}>🇪🇺</Text>
                    <Text style={styles.rateCurrency}>EUR</Text>
                  </View>
                  <View style={styles.rateValueContainer}>
                    <Text style={styles.rateValue}>{formatCurrency(rates.eur.bid)}</Text>
                  </View>
                </View>
              </View>
              {rates.timestamp && (
                <Text style={styles.rateTimestamp}>
                  Atualizado em: {new Date(rates.timestamp).toLocaleDateString('pt-BR')}
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.error}>Erro ao carregar câmbio</Text>
          )}
        </View>
        <View style={{ height: 20 }} />
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
  balance: { fontSize: 34, fontWeight: '700', color: '#FFF', marginTop: 8 },
  label: { color: '#E5E7EB', fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  card: { flex: 1, backgroundColor: colors.card, padding: 16, borderRadius: 16, ...shadow },
  smallLabel: { color: colors.textMuted, fontSize: 12 },
  income: { color: colors.success, fontSize: 18, fontWeight: '700' },
  expense: { color: colors.danger, fontSize: 18, fontWeight: '700' },
  section: { fontSize: 18, fontWeight: '700', marginVertical: 12, color: colors.text },
  exchangeSection: { marginVertical: 16 },
  exchangeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exchangeBase: { fontSize: 12, color: colors.textMuted, backgroundColor: colors.card, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  rateCard: { flex: 1, backgroundColor: colors.card, padding: 16, borderRadius: 16, alignItems: 'center', ...shadow },
  rateCurrencyContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rateCurrencyIcon: { fontSize: 24, marginRight: 6 },
  rateCurrency: { fontWeight: 'bold', fontSize: 16, color: colors.text },
  rateValueContainer: { marginTop: 10 },
  rateValue: { fontSize: 20, fontWeight: '700', color: colors.primary, textAlign: 'center' },
  rateTimestamp: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 8 },
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
