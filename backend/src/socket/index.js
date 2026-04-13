import { Server } from "socket.io";
import { config } from "../config/env.js";

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.origin,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.username = username;
    
    // Get all users in room
    const room = io.sockets.adapter.rooms.get(roomId);
    const users = [];
    if (room) {
      for (const socketId of room) {
        const clientSocket = io.sockets.sockets.get(socketId);
        if (clientSocket && clientSocket.data.username) {
          users.push({
            id: socketId,
            name: clientSocket.data.username
          });
        }
      }
    }
    
    // Notify room about new user
    io.to(roomId).emit('room-users', { users });
    socket.to(roomId).emit('user-joined', { username });
  });
  
  socket.on('leave-room', ({ roomId, username }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', { username });
    
    // Update users list
    const room = io.sockets.adapter.rooms.get(roomId);
    const users = [];
    if (room) {
      for (const socketId of room) {
        const clientSocket = io.sockets.sockets.get(socketId);
        if (clientSocket && clientSocket.data.username) {
          users.push({
            id: socketId,
            name: clientSocket.data.username
          });
        }
      }
    }
    io.to(roomId).emit('room-users', { users });
  });


    // ✅ socket.broadcast.emit — sends to everyone EXCEPT the sender
    socket.on("code-update", (data) => {
      socket.broadcast.emit("code-update", data);
    });

    socket.on("language-update", (data) => {
      socket.broadcast.emit("language-update", data);
    });

    socket.on("theme-update", (data) => {
      socket.broadcast.emit("theme-update", data);
    });

    socket.on("compile-start", (data) => {
      socket.broadcast.emit("compile-start", data);
    });

    socket.on("compile-result", (data) => {
      socket.broadcast.emit("compile-result", data);
    });

    socket.on("ping", () => {
      console.log("ping received");
      socket.emit("pong");
    });

    socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    const username = socket.data.username;
    
    if (roomId) {
      socket.to(roomId).emit('user-left', { username });
      
      // Update users list
      const room = io.sockets.adapter.rooms.get(roomId);
      const users = [];
      if (room) {
        for (const socketId of room) {
          const clientSocket = io.sockets.sockets.get(socketId);
          if (clientSocket && clientSocket.data.username) {
            users.push({
              id: socketId,
              name: clientSocket.data.username
            });
          }
        }
      }
      io.to(roomId).emit('room-users', { users });
    }
  });
  });
};

const getIO = () => io;

export { initSocket, getIO };