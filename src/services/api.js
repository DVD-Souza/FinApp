import axios from 'axios';
import { loadExchangeRates, saveExchangeRates } from './storage'; // ✅ mesmo diretório

const API_URL = 'https://api.fxratesapi.com/latest';
const BASE_CURRENCY = 'BRL';
const TARGET_CURRENCIES = ['USD', 'EUR'];

/**
 * Calcula a variação percentual entre o valor atual e o anterior.
 */
const calculateVariation = (current, previous) => {
  if (!previous || previous <= 0 || !Number.isFinite(previous)) {
    return 0;
  }
  return ((current - previous) / previous) * 100;
};

/**
 * Converte um valor para número de forma segura.
 */
const toSafeNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

/**
 * Busca as cotações atuais da API, calcula a variação em relação ao
 * último valor salvo e atualiza o storage.
 * Em caso de erro, retorna os dados salvos anteriormente.
 */
export const fetchExchangeRates = async () => {
  try {
    // 1. Carrega os dados anteriores do storage
    const previousRates = await loadExchangeRates();

    // 2. Faz a requisição para a API
    const { data } = await axios.get(API_URL, {
      params: {
        base: BASE_CURRENCY,
        symbols: TARGET_CURRENCIES.join(','),
      },
    });

    // 3. Valida a resposta
    if (!data?.rates || typeof data.rates !== 'object') {
      throw new Error('Resposta da API inválida: "rates" não encontrado.');
    }

    const rawUsd = data.rates.USD;
    const rawEur = data.rates.EUR;

    if (rawUsd === undefined || rawEur === undefined) {
      throw new Error('Moeda USD ou EUR não encontrada na resposta da API.');
    }

    // 4. Converte para número (já está em BRL, pois a base é BRL)
    const usdBid = toSafeNumber(rawUsd);
    const eurBid = toSafeNumber(rawEur);

    // 5. Calcula a variação
    const usdVariation = calculateVariation(usdBid, previousRates?.usd?.bid ?? 0);
    const eurVariation = calculateVariation(eurBid, previousRates?.eur?.bid ?? 0);

    // 6. Monta o resultado
    const result = {
      usd: { bid: usdBid, variation: usdVariation },
      eur: { bid: eurBid, variation: eurVariation },
      timestamp: new Date().toISOString(),
    };

    // 7. Salva no storage
    await saveExchangeRates(result);

    return result;
  } catch (error) {
    console.warn('Erro ao buscar cotações:', error.message || error);

    // Fallback: retorna o que está no storage (ou dados vazios)
    const fallback = await loadExchangeRates();
    return fallback || {
      usd: { bid: 0, variation: 0 },
      eur: { bid: 0, variation: 0 },
      timestamp: null,
    };
  }
};

/**
 * Função auxiliar para forçar a atualização (ex: no refresh).
 */
export const refreshExchangeRates = async () => {
  return await fetchExchangeRates();
};

/**
 * Obtém as cotações atuais do storage sem chamar a API.
 */
export const getStoredExchangeRates = async () => {
  return await loadExchangeRates();
};