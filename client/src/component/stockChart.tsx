import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockChart = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // For demo purposes, generating mock data since we can't use external APIs
        const mockHistoricalData = generateMockHistoricalData();
        const mockQuote = generateMockQuote();
        
        setQuote(mockQuote);
        setChartData(mockHistoricalData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // Generate mock historical data
  const generateMockHistoricalData = () => {
    const data = [];
    const startPrice = 150;
    const days = 30;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const randomChange = (Math.random() - 0.5) * 5;
      const price = startPrice + randomChange * i;
      
      data.push({
        timestamp: date.toLocaleDateString(),
        price: Number(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }

    // Calculate MA20
    data.forEach((point, index) => {
      if (index >= 19) {
        const pricesForMA = data.slice(index - 19, index + 1).map(d => d.price);
        point.ma20 = Number((pricesForMA.reduce((a, b) => a + b, 0) / 20).toFixed(2));
      }
    });

    return data;
  };

  // Generate mock quote data
  const generateMockQuote = () => {
    const basePrice = 150;
    return {
      c: basePrice + Math.random() * 5,  // Current price
      pc: basePrice + Math.random() * 5,  // Previous close
      h: basePrice + 5 + Math.random() * 5,  // High
      l: basePrice - 5 - Math.random() * 5,  // Low
    };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{symbol} Stock Price</h2>
        <select 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="AAPL">Apple (AAPL)</option>
          <option value="GOOGL">Google (GOOGL)</option>
          <option value="MSFT">Microsoft (MSFT)</option>
          <option value="AMZN">Amazon (AMZN)</option>
        </select>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#2563eb" 
              dot={false} 
              name="Price"
            />
            <Line 
              type="monotone" 
              dataKey="ma20" 
              stroke="#16a34a" 
              dot={false} 
              name="20 MA"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {quote && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold">Current: </span>
            ${quote.c.toFixed(2)}
          </div>
          <div>
            <span className="font-bold">Previous Close: </span>
            ${quote.pc.toFixed(2)}
          </div>
          <div>
            <span className="font-bold">High: </span>
            ${quote.h.toFixed(2)}
          </div>
          <div>
            <span className="font-bold">Low: </span>
            ${quote.l.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;
