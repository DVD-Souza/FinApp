import axios from 'axios';

const API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL';
let cache = null;
let lastFetch = 0;

export const fetchExchangeRates = async () => {
  const now = Date.now();
  if (cache && now - lastFetch < 60000) return cache;

  try {
    const { data } = await axios.get(API_URL);
    cache = {
      usd: {
        bid: parseFloat(data.USDBRL.bid),
        variation: parseFloat(data.USDBRL.pctChange),
      },
      eur: {
        bid: parseFloat(data.EURBRL.bid),
        variation: parseFloat(data.EURBRL.pctChange),
      },
    };
    lastFetch = now;
    return cache;
  } catch (error) {
    console.error('Erro na API de câmbio:', error);
    return cache || { usd: { bid: 0, variation: 0 }, eur: { bid: 0, variation: 0 } };
  }
};