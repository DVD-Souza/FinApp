import axios from 'axios';

const API_URL = 'https://api.fxratesapi.com/latest';
const BASE_CURRENCY = 'BRL';
let cache = null;
let lastFetch = 0;

const FALLBACK_RATES = Object.freeze({
  usd: { bid: 0, variation: 0 },
  eur: { bid: 0, variation: 0 },
});

const parseRate = (value) => {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

export const fetchExchangeRates = async () => {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_DURATION_MS) {
    return cache;
  }

  try {
    const { data } = await axios.get(API_URL, {
      params: {
        base: BASE_CURRENCY,
        symbols: 'USD,EUR',
      },
    });

    cache = {
      usd: {
        bid: parseFloat(data.rates.USD),
        variation: 0,
      },
      eur: {
        bid: parseFloat(data.rates.EUR),
        variation: 0,
      },
      timestamp: data.date,
    };

    lastFetch = now;

    return cache;
  } catch (error) {
    console.warn('Erro ao buscar cotações', error);
    return cache || FALLBACK_RATES;
  }
};
``