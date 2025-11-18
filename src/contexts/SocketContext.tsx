import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: any[];
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (roomId: string, message: any) => void;
  startTyping: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Send user info to server
      newSocket.emit('user:join', {
        userId: user._id,
        name: user.name,
        avatar: user.avatar
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('users:online', (users: any[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('achievement:unlocked', (data) => {
      if (data.userId === user._id) {
        toast.success(`🏆 Achievement Unlocked: ${data.achievement.name}`, {
          description: data.achievement.description,
          duration: 5000,
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('room:join', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('room:leave', roomId);
    }
  };

  const sendMessage = (roomId: string, message: any) => {
    if (socket && isConnected) {
      socket.emit('message:send', { roomId, message });
    }
  };

  const startTyping = (roomId: string) => {
    if (socket && isConnected && user) {
      socket.emit('typing:start', { roomId, userId: user._id });
    }
  };

  const stopTyping = (roomId: string) => {
    if (socket && isConnected && user) {
      socket.emit('typing:stop', { roomId, userId: user._id });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};


