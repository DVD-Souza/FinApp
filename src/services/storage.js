import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@finance_data';

const DEFAULT_DATA = Object.freeze({
  transactions: [],
  categories: [],
});

const normalizeTransactions = (transactions) => {
  if (!Array.isArray(transactions)) return [];

  return transactions.filter((transaction) => {
    return (
      transaction &&
      typeof transaction.id === 'string' &&
      typeof transaction.description === 'string' &&
      Number.isFinite(Number(transaction.amount)) &&
      typeof transaction.category === 'string' &&
      typeof transaction.date === 'string'
    );
  });
};

const normalizeCategories = (categories) => {
  if (!Array.isArray(categories)) return [];

  return categories
    .filter((category) => typeof category === 'string')
    .map((category) => category.trim())
    .filter(Boolean);
};

export const saveData = async (data) => {
  try {
    const normalizedData = {
      transactions: normalizeTransactions(data?.transactions),
      categories: normalizeCategories(data?.categories),
    };

    await AsyncStorage.setItem(KEY, JSON.stringify(normalizedData));
    return true;
  } catch (err) {
    console.warn('Erro ao salvar dados', err);
    return false;
  }
};

export const loadData = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY);

    if (!json) return DEFAULT_DATA;

    const parsedData = JSON.parse(json);

    return {
      transactions: normalizeTransactions(parsedData?.transactions),
      categories: normalizeCategories(parsedData?.categories),
    };
  } catch (err) {
    console.warn('Erro ao carregar dados', err);
    return DEFAULT_DATA;
  }
};