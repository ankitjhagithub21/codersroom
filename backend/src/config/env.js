
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  origin: process.env.ORIGIN || "http://localhost:5173",
  rapidApiHost: process.env.RAPID_API_HOST,
  rapidApiKey: process.env.RAPID_API_KEY,
  rapidApiUrl: process.env.RAPID_API_URL,
};
