import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { logger } from './utils/logger';
import stockRoutes from './routes/stockRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stockRoutes);

// WebSocket connection
io.on('connection', (socket) => {
  logger.info('Client connected');

  socket.on('subscribe', (symbol: string) => {
    logger.info(`Client subscribed to ${symbol}`);
    socket.join(symbol);
  });

  socket.on('unsubscribe', (symbol: string) => {
    logger.info(`Client unsubscribed from ${symbol}`);
    socket.leave(symbol);
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export { app, io };
