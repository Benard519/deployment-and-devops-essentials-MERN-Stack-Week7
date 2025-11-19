require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { StatusCodes } = require('http-status-codes');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');
const { login, profile } = require('./controllers/authController');
const {
  getRooms,
  createRoom,
  joinRoom,
  getRoomParticipants,
  getOrCreatePrivateRoom,
} = require('./controllers/roomController');
const {
  getRoomMessages,
  markRead,
  getUnreadCount,
} = require('./controllers/messageController');
const { listUsers } = require('./controllers/userController');
const initializeSocket = require('./socket');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

const defaultOrigin = 'http://localhost:5173';
const allowedOrigins = (process.env.FRONTEND_URL || defaultOrigin)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!allowedOrigins.includes(defaultOrigin)) {
  allowedOrigins.push(defaultOrigin);
}

const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  morgan(isProduction ? 'combined' : 'dev', {
    skip: () => process.env.LOG_REQUESTS === 'false',
  })
);
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

const healthHandler = (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version,
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

app.post('/api/auth/login', login);
app.get('/api/auth/me', authMiddleware, profile);

app.get('/api/rooms', authMiddleware, getRooms);
app.post('/api/rooms', authMiddleware, createRoom);
app.post('/api/rooms/:roomId/join', authMiddleware, joinRoom);
app.post('/api/rooms/private', authMiddleware, getOrCreatePrivateRoom);
app.get('/api/rooms/:roomId/participants', authMiddleware, getRoomParticipants);
app.get('/api/rooms/:id/messages', authMiddleware, getRoomMessages);
app.post('/api/messages/:messageId/read', authMiddleware, markRead);
app.get('/api/unread', authMiddleware, getUnreadCount);
app.get('/api/users', authMiddleware, listUsers);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  initializeSocket(server);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

app.use(notFoundHandler);
app.use(errorHandler);

start();





