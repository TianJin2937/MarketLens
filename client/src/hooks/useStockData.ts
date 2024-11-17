import { useState, useEffect } from 'react';
import { stockApi } from '../services/api';
import { StockQuote, HistoricalData } from '../types/stock';

export const useStockData = (symbol: string) => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quoteData, historicalData] = await Promise.all([
          stockApi.getQuote(symbol),
          stockApi.getHistoricalData(symbol)
        ]);
        setQuote(quoteData);
        setHistoricalData(historicalData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  return { quote, historicalData, loading, error };
};
