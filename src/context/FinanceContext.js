import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadData, saveData } from '../services/storage';

const FinanceContext = createContext(null);

export const DEFAULT_CATEGORIES = Object.freeze([
  'Alimentação',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Moradia',
  'Salário',
  'Investimentos',
  'Outros',
]);

const createTransactionId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const normalizeCategoryName = (category) => {
  return typeof category === 'string' ? category.trim() : '';
};

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const data = await loadData();

        if (!isMounted) return;

        setTransactions(Array.isArray(data?.transactions) ? data.transactions : []);
        setCategories(
          Array.isArray(data?.categories) && data.categories.length > 0
            ? data.categories
            : DEFAULT_CATEGORIES
        );
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Erro ao carregar dados financeiros');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      saveData({ transactions, categories });
    }
  }, [transactions, categories, loading]);

  const addTransaction = useCallback((tx) => {
    setTransactions((prev) => [
      {
        ...tx,
        id: createTransactionId(),
      },
      ...prev,
    ]);
  }, []);

  const updateTransaction = useCallback((id, updated) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              ...updated,
              id,
            }
          : transaction
      )
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  }, []);

  const addCategory = useCallback((category) => {
    const normalizedCategory = normalizeCategoryName(category);

    if (!normalizedCategory) return false;

    setCategories((prev) => {
      const alreadyExists = prev.some(
        (item) => item.toLowerCase() === normalizedCategory.toLowerCase()
      );

      return alreadyExists ? prev : [...prev, normalizedCategory];
    });

    return true;
  }, []);

  const removeCategory = useCallback((category) => {
    const normalizedCategory = normalizeCategoryName(category);

    if (!normalizedCategory || DEFAULT_CATEGORIES.includes(normalizedCategory)) {
      return false;
    }

    setCategories((prev) => prev.filter((item) => item !== normalizedCategory));
    return true;
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      categories,
      loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      removeCategory,
    }),
    [
      transactions,
      categories,
      loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      removeCategory,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }

  return context;
};