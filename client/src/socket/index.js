import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/api.js';

const SOCKET_URL = API_BASE_URL.replace(/\/$/, '');

export const createSocketConnection = (token) =>
  io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket'],
    reconnectionAttempts: 8,
    reconnectionDelay: 1000,
    auth: {
      token,
    },
  });





