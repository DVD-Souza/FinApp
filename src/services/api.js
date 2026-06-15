import axios from 'axios';

const API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL';
const CACHE_DURATION_MS = 60000;
const REQUEST_TIMEOUT_MS = 8000;

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
      timeout: REQUEST_TIMEOUT_MS,
    });

    cache = {
      usd: {
        bid: parseRate(data?.USDBRL?.bid),
        variation: parseRate(data?.USDBRL?.pctChange),
      },
      eur: {
        bid: parseRate(data?.EURBRL?.bid),
        variation: parseRate(data?.EURBRL?.pctChange),
      },
    };

    lastFetch = now;

    return cache;
  } catch (error) {
    console.warn('Erro ao buscar cotações', error);
    return cache || FALLBACK_RATES;
  }
};
``