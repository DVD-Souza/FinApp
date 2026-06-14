import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { useFinance } from '../context/FinanceContext';
import MonthYearPicker from '../components/MonthYearPicker';
import { getMonthYear } from '../utils/helpers';
import { colors } from '../utils/colors';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
  const { transactions } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getMonthYear(new Date()));

  const filtered = transactions.filter(t => getMonthYear(t.date) === selectedMonth);
  const expenses = filtered.filter(t => t.amount < 0);

  const pieData = useMemo(() => {
    const map = new Map();
    expenses.forEach(t => {
      if (!t.category) return;
      const cat = t.category;
      map.set(cat, (map.get(cat) || 0) + Math.abs(t.amount));
    });

    const data = Array.from(map.entries()).map(([name, value], idx) => ({
      name: name.length > 12 ? name.slice(0, 10) + '…' : name,
      amount: value,
      color: `hsl(${idx * 45}, 70%, 60%)`,
      legendFontColor: colors?.text || '#333',
    }));

    return data.filter(item => item && item.color && item.amount > 0);
  }, [expenses]);

  const monthlySeries = useMemo(() => {
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = getMonthYear(d);
      labels.push(key.slice(5));
      const monthTxs = transactions.filter(t => getMonthYear(t.date) === key);
      incomeData.push(monthTxs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0));
      expenseData.push(monthTxs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0));
    }
    return { labels, incomeData, expenseData };
  }, [transactions]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Relatórios</Text>
        <MonthYearPicker value={selectedMonth} onChange={setSelectedMonth} />

        <Text style={styles.section}>
          Despesas por categoria ({selectedMonth.slice(5)}/{selectedMonth.slice(0, 4)})
        </Text>
        {pieData.length === 0 ? (
          <Text style={styles.empty}>Nenhuma despesa neste período</Text>
        ) : (
          <PieChart
            data={pieData}
            width={screenWidth - 32}
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

        <Text style={styles.section}>Evolução (últimos 6 meses)</Text>
        <LineChart
          data={{
            labels: monthlySeries.labels,
            datasets: [
              { data: monthlySeries.incomeData, color: () => colors.success, strokeWidth: 2 },
              { data: monthlySeries.expenseData, color: () => colors.danger, strokeWidth: 2 },
            ],
            legend: ['Receitas', 'Despesas'],
          }}
          width={screenWidth - 32}
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
        <View style={{ height: 20 }} />
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
});