import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
}

interface RealTimeChatProps {
  roomId: string;
  roomName?: string;
}

export const RealTimeChat: React.FC<RealTimeChatProps> = ({ roomId, roomName }) => {
  const { socket, isConnected, onlineUsers, sendMessage, startTyping, stopTyping } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the room
    socket.emit('room:join', roomId);

    // Listen for messages
    socket.on('message:received', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing indicators
    socket.on('typing:update', (data: { roomId: string; typingUsers: string[] }) => {
      if (data.roomId === roomId) {
        setTypingUsers(data.typingUsers.filter(id => id !== user?._id));
      }
    });

    // Listen for user join/leave
    socket.on('user:joined-room', (data: { userId: string; name: string }) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: { id: 'system', name: 'System' },
        content: `${data.name} joined the chat`,
        timestamp: new Date()
      }]);
    });

    socket.on('user:left-room', (data: { userId: string }) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: { id: 'system', name: 'System' },
        content: 'A user left the chat',
        timestamp: new Date()
      }]);
    });

    return () => {
      socket.emit('room:leave', roomId);
      socket.off('message:received');
      socket.off('typing:update');
      socket.off('user:joined-room');
      socket.off('user:left-room');
    };
  }, [socket, isConnected, roomId, user]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // Handle typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    } else {
      startTyping(roomId);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(roomId);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    const message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar
      },
      timestamp: new Date()
    };

    sendMessage(roomId, message);
    setInputValue('');
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      stopTyping(roomId);
      typingTimeoutRef.current = null;
    }
  };

  const roomOnlineUsers = onlineUsers.filter(u => u.userId !== user?._id);

  return (
    <Card className="flex flex-col h-[600px] bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/20 border-2 border-purple-200/50 dark:border-purple-800/50 shadow-lg shadow-purple-500/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30">
        <div>
          <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {roomName || 'Chat Room'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{roomOnlineUsers.length + 1} online</span>
          </div>
        </div>
        
        {!isConnected && (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Connecting...
          </Badge>
        )}
        
        {isConnected && (
          <Badge variant="outline" className="border-green-500 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.user.id === user?._id;
            const isSystem = message.user.id === 'system';

            if (isSystem) {
              return (
                <div key={message.id} className="text-center text-sm text-muted-foreground py-2">
                  {message.content}
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-slide-up",
                  isOwn && "flex-row-reverse"
                )}
              >
                <Avatar className="w-8 h-8 ring-2 ring-purple-200 dark:ring-purple-800">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                    {message.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className={cn("flex flex-col max-w-[70%]", isOwn && "items-end")}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-xs font-medium", isOwn && "order-2")}>
                      {isOwn ? 'You' : message.user.name}
                    </span>
                    <span className={cn("text-xs text-muted-foreground", isOwn && "order-1")}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl shadow-md",
                      isOwn
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                        : "bg-white dark:bg-gray-800 border border-purple-200/50 dark:border-purple-800/50"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {typingUsers.length > 0 && (
            <div className="flex gap-3 animate-pulse">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={!isConnected}
            className="flex-1 border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || !isConnected}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};


