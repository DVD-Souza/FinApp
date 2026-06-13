import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@finance_data';

export const saveData = async (data) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    console.log('Erro ao salvar dados', err);
  }
};

export const loadData = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY);
    if (!json) return { transactions: [], categories: [] };
    return JSON.parse(json);
  } catch (err) {
    console.log('Erro ao carregar dados', err);
    return { transactions: [], categories: [] };
  }
};