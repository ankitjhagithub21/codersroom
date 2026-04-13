import { Server } from "socket.io";
import { config } from "../config/env.js";
let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, { cors: { origin: config.origin } });
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
   
     socket.on("code-update", (data) => {
      console.log("Code update received", data);
      io.emit("code-update", data);
    });
    
    socket.on("language-update", (data) => {
      console.log("Language update received", data);
      io.emit("language-update", data);
    });

    socket.on("theme-update", (data) => {
      console.log("Theme update received", data);
      io.emit("theme-update", data);
    });
  });
};

const getIO = () => io; // call this from any service to emit events

export { initSocket, getIO };