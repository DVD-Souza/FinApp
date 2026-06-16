import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatDate } from '../utils/helpers';
import { colors } from '../utils/colors';

function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = Number(transaction?.amount) > 0;

  const amountText = useMemo(() => {
    return formatCurrency(transaction?.amount);
  }, [transaction?.amount]);

  const dateText = useMemo(() => {
    return formatDate(transaction?.date);
  }, [transaction?.date]);

  const description = transaction?.description || 'Transação sem descrição';
  const category = transaction?.category || 'Sem categoria';

  return (
    <View
      style={styles.item}
      accessibilityLabel={`${description}, ${category}, ${amountText}`}
    >
      <View style={[styles.icon, { backgroundColor: isIncome ? colors.success : colors.danger }]}>
        <Ionicons name={isIncome ? 'arrow-up' : 'arrow-down'} size={18} color="#FFF" />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {description}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {dateText} • {category}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.income : styles.expense]} numberOfLines={1}>
          {amountText}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onEdit}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={`Editar ${description}`}
            accessibilityRole="button"
          >
            <Ionicons name="pencil" size={16} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={`Excluir ${description}`}
            accessibilityRole="button"
          >
            <Ionicons name="trash" size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default memo(TransactionItem);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
    maxWidth: '42%',
  },
  amount: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 6,
  },
  income: {
    color: colors.success,
  },
  expense: {
    color: colors.danger,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});