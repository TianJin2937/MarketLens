import axios from 'axios';
import { logger } from '../utils/logger';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export const fetchStockQuote = async (symbol: string) => {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol,
        token: FINNHUB_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

export const fetchHistoricalData = async (symbol: string, interval: string) => {
  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 30 * 24 * 60 * 60; // 30 days ago

    const response = await axios.get(`${FINNHUB_BASE_URL}/stock/candle`, {
      params: {
        symbol,
        resolution: interval,
        from,
        to,
        token: FINNHUB_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};

export const searchSymbols = async (query: string) => {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/search`, {
      params: {
        q: query,
        token: FINNHUB_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    logger.error(`Error searching for ${query}:`, error);
    throw error;
  }
};
