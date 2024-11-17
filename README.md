# MarketLens
An open-source platform for real-time stock market analysis and technical trading strategy development. MarketLens combines modern web technologies with financial analysis tools to provide an accessible interface for stock market data visualization and strategy backtesting.


# StockVision - Real-Time Stock Analysis Platform

A full-stack application for real-time stock market data visualization and basic trading strategy backtesting. Built with React, Node.js, and WebSocket integration.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## Features

- Real-time stock price monitoring and visualization using Finnhub's WebSocket API
- Technical indicator calculations (Moving Averages, RSI, MACD)
- Interactive candlestick charts with Trading View integration
- Basic trading strategy backtesting framework
- User authentication and portfolio tracking
- Responsive design for desktop and mobile viewing

## Tech Stack

### Frontend
- React.js with TypeScript
- Redux for state management
- TradingView Lightweight Charts
- Tailwind CSS for styling
- Socket.io-client for real-time updates

### Backend
- Node.js with Express
- MongoDB for user data and strategy storage
- Socket.io for WebSocket connections
- JWT for authentication

### APIs & External Services
- Finnhub.io for real-time market data
- Alpha Vantage for historical data

## Getting Started

### Prerequisites
```bash
node >= 14.0.0
npm >= 6.14.0
MongoDB >= 4.4
```

### Environment Variables
Create a `.env` file in the server directory:
```
FINNHUB_API_KEY=your_finnhub_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/stockvision.git
cd stockvision
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Start the development servers
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## Project Structure
```
stockvision/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── tests/            # Backend tests
└── docker/               # Docker configuration files
```

## Key Features Implementation

### Real-Time Stock Data Processing
```typescript
// client/src/hooks/useStockWebSocket.ts
export const useStockWebSocket = (symbol: string) => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(WEBSOCKET_URL);
    
    socket.emit('subscribe', symbol);
    
    socket.on('price-update', (data) => {
      setPrice(data.price);
      setLoading(false);
    });

    return () => {
      socket.emit('unsubscribe', symbol);
      socket.disconnect();
    };
  }, [symbol]);

  return { price, loading };
};
```

### Technical Analysis Implementation
```typescript
// server/src/services/technicalAnalysis.ts
export const calculateMovingAverage = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  
  const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
  return sum / period;
};

export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 0;
  
  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);
  
  const avgGain = gains.slice(-period).reduce((acc, gain) => acc + gain, 0) / period;
  const avgLoss = losses.slice(-period).reduce((acc, loss) => acc + loss, 0) / period;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};
```

## Trading Strategy Example
```typescript
// server/src/services/tradingStrategy.ts
interface TradeSignal {
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  timestamp: Date;
}

export class MovingAverageCrossStrategy {
  private shortPeriod: number;
  private longPeriod: number;

  constructor(shortPeriod: number = 10, longPeriod: number = 20) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
  }

  analyze(prices: number[]): TradeSignal {
    const shortMA = calculateMovingAverage(prices, this.shortPeriod);
    const longMA = calculateMovingAverage(prices, this.longPeriod);
    
    return {
      action: shortMA > longMA ? 'BUY' : shortMA < longMA ? 'SELL' : 'HOLD',
      price: prices[prices.length - 1],
      timestamp: new Date()
    };
  }
}
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
