import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { fetchStockQuote, fetchHistoricalData, searchSymbols } from '../services/stockService';

export const getStockData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const data = await fetchStockQuote(symbol);
    res.json(data);
  } catch (error) {
    logger.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
};

export const getHistoricalData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { interval = 'D' } = req.query;
    const data = await fetchHistoricalData(symbol, interval as string);
    res.json(data);
  } catch (error) {
    logger.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
};

export const searchStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    const results = await searchSymbols(query as string);
    res.json(results);
  } catch (error) {
    logger.error('Error searching stocks:', error);
    res.status(500).json({ error: 'Failed to search stocks' });
  }
};
