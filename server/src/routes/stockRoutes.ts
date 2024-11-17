import express from 'express';
import { getStockData, getHistoricalData, searchStocks } from '../controllers/stockController';

const router = express.Router();

router.get('/quote/:symbol', getStockData);
router.get('/historical/:symbol', getHistoricalData);
router.get('/search', searchStocks);

export default router;
