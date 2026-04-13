import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import  judgeRoutes from "./routes/judge.routes.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: config.origin,
}));

// app.use("/api/judge", judgeRoutes);

app.use("/api/judge", judgeRoutes);


export default app;