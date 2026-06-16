import AsyncStorage from '@react-native-async-storage/async-storage';

const FINANCE_KEY = '@finance_data';
const EXCHANGE_KEY = '@exchange_rates';

const DEFAULT_FINANCE_DATA = Object.freeze({
  transactions: [],
  categories: [],
});

const DEFAULT_EXCHANGE_DATA = Object.freeze({
  usd: { bid: 0, variation: 0 },
  eur: { bid: 0, variation: 0 },
  timestamp: null,
});

// --- Normalizadores ---
const normalizeTransactions = (transactions) => {
  if (!Array.isArray(transactions)) return [];
  return transactions.filter(
    (t) =>
      t &&
      typeof t.id === 'string' &&
      typeof t.description === 'string' &&
      Number.isFinite(Number(t.amount)) &&
      typeof t.category === 'string' &&
      typeof t.date === 'string'
  );
};

const normalizeCategories = (categories) => {
  if (!Array.isArray(categories)) return [];
  return categories
    .filter((c) => typeof c === 'string')
    .map((c) => c.trim())
    .filter(Boolean);
};

const normalizeRate = (rate) => ({
  bid: Number.isFinite(Number(rate?.bid)) ? Number(rate.bid) : 0,
  variation: Number.isFinite(Number(rate?.variation)) ? Number(rate.variation) : 0,
});

// --- Finanças ---
export const saveData = async (data) => {
  try {
    const normalized = {
      transactions: normalizeTransactions(data?.transactions),
      categories: normalizeCategories(data?.categories),
    };
    await AsyncStorage.setItem(FINANCE_KEY, JSON.stringify(normalized));
    return true;
  } catch (error) {
    console.warn('Erro ao salvar dados', error);
    return false;
  }
};

export const loadData = async () => {
  try {
    const json = await AsyncStorage.getItem(FINANCE_KEY);
    if (!json) return DEFAULT_FINANCE_DATA;
    const parsed = JSON.parse(json);
    return {
      transactions: normalizeTransactions(parsed?.transactions),
      categories: normalizeCategories(parsed?.categories),
    };
  } catch (error) {
    console.warn('Erro ao carregar dados', error);
    return DEFAULT_FINANCE_DATA;
  }
};

// --- Câmbio ---
export const saveExchangeRates = async (rates) => {
  try {
    const normalized = {
      usd: normalizeRate(rates?.usd),
      eur: normalizeRate(rates?.eur),
      timestamp: rates?.timestamp ?? null,
    };
    await AsyncStorage.setItem(EXCHANGE_KEY, JSON.stringify(normalized));
    return true;
  } catch (error) {
    console.warn('Erro ao salvar cotações', error);
    return false;
  }
};

export const loadExchangeRates = async () => {
  try {
    const json = await AsyncStorage.getItem(EXCHANGE_KEY);
    if (!json) return DEFAULT_EXCHANGE_DATA;
    const parsed = JSON.parse(json);
    return {
      usd: normalizeRate(parsed?.usd),
      eur: normalizeRate(parsed?.eur),
      timestamp: parsed?.timestamp ?? null,
    };
  } catch (error) {
    console.warn('Erro ao carregar cotações', error);
    return DEFAULT_EXCHANGE_DATA;
  }
};