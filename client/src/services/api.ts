import axios from 'axios';
import { StockQuote, HistoricalData, StockSearchResult } from '../types/stock';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const stockApi = {
  getQuote: async (symbol: string): Promise<StockQuote> => {
    const response = await api.get(`/stocks/quote/${symbol}`);
    return response.data;
  },

  getHistoricalData: async (symbol: string, interval: string = 'D'): Promise<HistoricalData> => {
    const response = await api.get(`/stocks/historical/${symbol}`, {
      params: { interval }
    });
    return response.data;
  },

  searchStocks: async (query: string): Promise<StockSearchResult[]> => {
    const response = await api.get('/stocks/search', {
      params: { query }
    });
    return response.data;
  }
};

export default api;
