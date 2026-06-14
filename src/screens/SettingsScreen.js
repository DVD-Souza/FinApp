import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { categories, addCategory, removeCategory } = useFinance();
  const [newCat, setNewCat] = useState('');

  const handleAdd = () => {
    if (!newCat.trim()) return;
    addCategory(newCat.trim());
    setNewCat('');
  };

  const handleRemove = (cat) => {
    Alert.alert('Excluir categoria', `Remover "${cat}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', onPress: () => removeCategory(cat), style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Categorias</Text>

        <View style={styles.row}>
          <TextInput
            value={newCat}
            onChangeText={setNewCat}
            placeholder="Nova categoria"
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.categoryName}>{item}</Text>
              <TouchableOpacity onPress={() => handleRemove(item)}>
                <Ionicons name="trash-outline" size={22} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <Text style={styles.note}>* Categorias padrão não podem ser excluídas</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
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
});

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
};