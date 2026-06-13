import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadData, saveData } from '../services/storage';

const FinanceContext = createContext();

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

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const data = await loadData();

      setTransactions(
        Array.isArray(data?.transactions) ? data.transactions : []
      );

      setCategories(
        Array.isArray(data?.categories) && data.categories.length > 0
          ? data.categories
          : DEFAULT_CATEGORIES
      );

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveData({ transactions, categories });
    }
  }, [transactions, categories, loading]);

  const addTransaction = (tx) =>
    setTransactions((prev) => [
      { ...tx, id: Date.now().toString() },
      ...prev,
    ]);

  const updateTransaction = (id, updated) =>
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updated, id } : t))
    );

  const deleteTransaction = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const addCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev : [...prev, cat]
    );
  };

  const removeCategory = (cat) => {
    if (DEFAULT_CATEGORIES.includes(cat)) return;
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};