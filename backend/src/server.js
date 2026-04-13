import app from "./app.js";
import http from "http";
import { config } from "./config/env.js";
import { initSocket } from "./socket/index.js";

const server = http.createServer(app); // wrap Express in a raw HTTP server
initSocket(server);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

