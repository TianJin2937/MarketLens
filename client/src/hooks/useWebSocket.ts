import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useWebSocket = (symbol: string, onPriceUpdate: (price: number) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
      if (symbol) {
        socketRef.current?.emit('subscribe', symbol);
      }
    });

    socketRef.current.on('price-update', (data) => {
      onPriceUpdate(data.price);
    });

    return () => {
      if (symbol) {
        socketRef.current?.emit('unsubscribe', symbol);
      }
      socketRef.current?.disconnect();
    };
  }, [symbol, onPriceUpdate]);

  return socketRef.current;
};
