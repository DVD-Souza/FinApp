const LOCALE = 'pt-BR';
const CURRENCY = 'BRL';

export const formatCurrency = (value = 0) => {
  const numericValue = Number(value);

  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

export const parseCurrencyInput = (value = '') => {
  if (typeof value !== 'string') return 0;

  const normalizedValue = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  const parsedValue = Number.parseFloat(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

export const isValidDate = (date) => {
  const parsedDate = new Date(date);
  return !Number.isNaN(parsedDate.getTime());
};

export const formatDate = (date) => {
  if (!isValidDate(date)) return '--/--/----';

  return new Date(date).toLocaleDateString(LOCALE);
};

export const getMonthYear = (date) => {
  const parsedDate = isValidDate(date) ? new Date(date) : new Date();

  return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
};