import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Platform,
  Keyboard,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { useTabBarVisibility } from '../hooks/useTabBarVisibility';

const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Moradia',
  'Salário',
  'Investimentos',
  'Outros',
];

export default function SettingsScreen({ setHideTabBar }) {
  const { categories, addCategory, removeCategory } = useFinance();
  const [newCat, setNewCat] = useState('');

  // ✅ controle da TabBar
  const handleScroll = useTabBarVisibility(
    () => setHideTabBar(true),
    () => setHideTabBar(false)
  );

  const handleAdd = useCallback(() => {
    const trimmed = newCat.trim();
    if (!trimmed) return;

    addCategory(trimmed);
    setNewCat('');
    Keyboard.dismiss();
  }, [newCat, addCategory]);

  const handleRemove = useCallback((cat) => {
    if (DEFAULT_CATEGORIES.includes(cat)) {
      Alert.alert('Aviso', 'Categorias padrão não podem ser excluídas.');
      return;
    }

    Alert.alert(
      'Excluir categoria',
      `Remover "${cat}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => removeCategory(cat),
        },
      ]
    );
  }, [removeCategory]);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.item}>
      <Text style={styles.categoryName}>{item}</Text>

      <TouchableOpacity
        onPress={() => handleRemove(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel={`Excluir categoria ${item}`}
        accessibilityRole="button"
      >
        <Ionicons name="trash-outline" size={22} color={colors.danger} />
      </TouchableOpacity>
    </View>
  ), [handleRemove]);

  const keyExtractor = useCallback((item, index) => `${item}-${index}`, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <Text style={styles.title} accessibilityRole="header">
          Categorias
        </Text>

        <View style={styles.row}>
          <TextInput
            value={newCat}
            onChangeText={setNewCat}
            placeholder="Nova categoria"
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            accessibilityLabel="Nome da nova categoria"
            accessibilityHint="Digite o nome da categoria e pressione adicionar"
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAdd}
            accessibilityLabel="Adicionar categoria"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListFooterComponent={
            <Text style={styles.note}>
              * Categorias padrão não podem ser excluídas
            </Text>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

      </View>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: colors.text,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    ...shadow,
  },

  categoryName: {
    fontSize: 16,
    color: colors.text,
  },

  note: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },

  listContent: {
    paddingBottom: 120, // ✅ ESSENCIAL para evitar sobreposição
  },
});