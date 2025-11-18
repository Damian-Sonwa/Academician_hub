import dotenv from 'dotenv';
// Load environment variables FIRST
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import subjectsRoutes from './routes/subjects';
import coursesRoutes from './routes/courses';
import progressRoutes from './routes/progress';
import achievementsRoutes from './routes/achievements';
import notificationsRoutes from './routes/notifications';
import subscriptionsRoutes from './routes/subscriptions';
import projectsRoutes from './routes/projects';
import messagesRoutes from './routes/messages';
import lessonGeneratorRoutes from './routes/lessonGenerator';
import alphabetsRoutes from './routes/alphabets';
import greetingsRoutes from './routes/greetings';
import assignmentsRoutes from './routes/assignments';
import weeklyRoutes from './routes/weekly';
import dictionaryRoutes from './routes/dictionary';

// Get configuration from environment variables
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGODB_URI;

// Debug print to verify URI is loaded
console.log('Mongo URI:', MONGO_URI ? MONGO_URI.replace(/:[^:@]+@/, ':****@') : 'NOT FOUND');

// Validate MONGODB_URI
if (!MONGO_URI) {
  console.error('❌ MONGODB_URI not found in .env!');
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      // Allow any localhost origin in development
      if (process.env.NODE_ENV !== 'production') {
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          return callback(null, true);
        }
      }
      
      // List of allowed origins
      const allowedOrigins = [
        'http://localhost:8080',
        'http://localhost:8081',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8081',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ];
    
    // Add production origin from environment variable
    if (process.env.CORS_ORIGIN) {
      allowedOrigins.push(process.env.CORS_ORIGIN);
      // Also allow www version if main domain is provided
      if (process.env.CORS_ORIGIN.startsWith('https://')) {
        const domain = process.env.CORS_ORIGIN.replace('https://', '');
        allowedOrigins.push(`https://www.${domain}`);
      }
    }
    
    // Log CORS check for debugging (only in production)
    if (process.env.NODE_ENV === 'production') {
      console.log(`🔒 CORS check - Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`);
    }
    
    // Allow requests from any localhost origin in development
    if (process.env.NODE_ENV !== 'production') {
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        return callback(null, true);
      }
    }
    
    // In production, check against allowed origins
    if (process.env.NODE_ENV === 'production') {
      // Check if origin is in allowed list
      if (origin && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Also check direct match with CORS_ORIGIN
      if (origin && process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) {
        return callback(null, true);
      }
      // Allow if no origin (like mobile apps or Postman)
      if (!origin) {
        return callback(null, true);
      }
      console.error(`❌ CORS blocked - Origin: ${origin} not in allowed list`);
      return callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
    
    // Development: Allow all origins
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Preflight requests are already handled by the global CORS middleware above
// No need for explicit app.options() handler

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/lessons', lessonGeneratorRoutes);
app.use('/api/alphabets', alphabetsRoutes);
app.use('/api/greetings', greetingsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/weekly', weeklyRoutes);
app.use('/api/dictionary', dictionaryRoutes);

// Error handling middleware - MUST be after all routes
// This ensures CORS headers are always sent, even on errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err);
  
  // Ensure CORS headers are set even on errors
  const origin = req.headers.origin;
  if (origin) {
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ];
    
    if (process.env.CORS_ORIGIN) {
      allowedOrigins.push(process.env.CORS_ORIGIN);
    }
    
    if (allowedOrigins.includes(origin) || (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    }
  }
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Socket.io Connection Handling
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 New socket connection:', socket.id);

  // User joins
  socket.on('user:join', (userData) => {
    onlineUsers.set(socket.id, userData);
    console.log(`✅ User joined: ${userData.name}`);
    
    // Broadcast online users
    io.emit('users:online', Array.from(onlineUsers.values()));
  });

  // Room management
  socket.on('room:join', (roomId) => {
    socket.join(roomId);
    console.log(`📍 Socket ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit('user:joined-room', { socketId: socket.id });
  });

  socket.on('room:leave', (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 Socket ${socket.id} left room: ${roomId}`);
    socket.to(roomId).emit('user:left-room', { socketId: socket.id });
  });

  // Real-time messaging
  socket.on('message:send', (data) => {
    const { roomId, message } = data;
    const sender = onlineUsers.get(socket.id);
    
    const messageData = {
      ...message,
      sender: sender || { name: 'Anonymous' },
      timestamp: new Date(),
    };
    
    io.to(roomId).emit('message:received', messageData);
    console.log(`💬 Message sent to room ${roomId}`);
  });

  // Typing indicators
  socket.on('typing:start', (data) => {
    const { roomId, userId } = data;
    socket.to(roomId).emit('user:typing', { userId });
  });

  socket.on('typing:stop', (data) => {
    const { roomId, userId } = data;
    socket.to(roomId).emit('user:stopped-typing', { userId });
  });

  // Progress updates
  socket.on('progress:update', (data) => {
    const { userId, courseId, progress } = data;
    io.emit('progress:updated', { userId, courseId, progress });
  });

  // Achievement notifications
  socket.on('achievement:unlock', (data) => {
    io.emit('achievement:unlocked', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log(`👋 User disconnected: ${user.name}`);
      onlineUsers.delete(socket.id);
      io.emit('users:online', Array.from(onlineUsers.values()));
    }
  });
});

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB first, then start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Only start server AFTER successful MongoDB connection
    // Use httpServer for Socket.io compatibility
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
      console.log(`🔌 Socket.io server is ready`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // stop server if DB fails
  });

export default app;
