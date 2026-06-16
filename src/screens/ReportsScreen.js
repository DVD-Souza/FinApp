import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { useFinance } from '../context/FinanceContext';
import MonthYearPicker from '../components/MonthYearPicker';
import { getMonthYear } from '../utils/helpers';
import { colors } from '../utils/colors';

const CHART_COLORS = [
  '#10B981',
  '#EF4444',
  '#F59E0B',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

export default function ReportsScreen() {
  const { transactions } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getMonthYear(new Date()));
  const { width: screenWidth } = useWindowDimensions();

  const chartWidth = Math.max(screenWidth - 32, 280);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => getMonthYear(transaction.date) === selectedMonth);
  }, [transactions, selectedMonth]);

  const expenses = useMemo(() => {
    return filteredTransactions.filter((transaction) => Number(transaction.amount) < 0);
  }, [filteredTransactions]);

  const pieData = useMemo(() => {
    const categoryMap = new Map();

    expenses.forEach((transaction) => {
      if (!transaction.category) return;

      const currentAmount = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentAmount + Math.abs(Number(transaction.amount) || 0));
    });

    return Array.from(categoryMap.entries())
      .map(([name, amount], index) => ({
        name: name.length > 12 ? `${name.slice(0, 10)}…` : name,
        amount,
        color: CHART_COLORS[index % CHART_COLORS.length],
        legendFontColor: colors.text,
        legendFontSize: 12,
      }))
      .filter((item) => item.amount > 0);
  }, [expenses]);

  const monthlySeries = useMemo(() => {
    const labels = [];
    const incomeData = [];
    const expenseData = [];

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - index);

      const key = getMonthYear(date);
      const monthTransactions = transactions.filter(
        (transaction) => getMonthYear(transaction.date) === key
      );

      labels.push(key.slice(5));

      incomeData.push(
        monthTransactions
          .filter((transaction) => Number(transaction.amount) > 0)
          .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
      );

      expenseData.push(
        monthTransactions
          .filter((transaction) => Number(transaction.amount) < 0)
          .reduce((sum, transaction) => sum + Math.abs(Number(transaction.amount)), 0)
      );
    }

    return { labels, incomeData, expenseData };
  }, [transactions]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title} accessibilityRole="header">
          Relatórios
        </Text>

        <MonthYearPicker value={selectedMonth} onChange={setSelectedMonth} />

        <Text style={styles.section} accessibilityRole="header">
          Despesas por categoria ({selectedMonth.slice(5)}/{selectedMonth.slice(0, 4)})
        </Text>

        {pieData.length === 0 ? (
          <Text style={styles.empty}>Nenhuma despesa neste período</Text>
        ) : (
          <PieChart
            data={pieData}
            width={chartWidth}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        )}

        <Text style={styles.section} accessibilityRole="header">
          Evolução (últimos 6 meses)
        </Text>

        <LineChart
          data={{
            labels: monthlySeries.labels,
            datasets: [
              {
                data: monthlySeries.incomeData,
                color: () => colors.success,
                strokeWidth: 2,
              },
              {
                data: monthlySeries.expenseData,
                color: () => colors.danger,
                strokeWidth: 2,
              },
            ],
            legend: ['Receitas', 'Despesas'],
          }}
          width={chartWidth}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: () => colors.textMuted,
          }}
          bezier
          style={styles.chart}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
    color: colors.text,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginVertical: 20,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});