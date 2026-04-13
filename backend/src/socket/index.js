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

    socket.on("ping", () => {
      console.log("ping received");
      socket.emit("pong");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const getIO = () => io;

export { initSocket, getIO };