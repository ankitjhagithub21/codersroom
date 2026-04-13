import { io } from 'socket.io-client';

// Use an environment variable for the server URL (standard for Vite)
const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export const socket = io(URL);
