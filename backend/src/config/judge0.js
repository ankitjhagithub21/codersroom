import { config } from "./env.js";

export const createJudge0Config = (submissionData) => ({
  method: "POST",
  url: config.rapidApiUrl,
  params: {
    base64_encoded: "true", // ✅ tells Judge0 the payload IS base64
    fields: "*",
  },
  headers: {
    "Content-Type": "application/json",
    "X-RapidAPI-Host": config.rapidApiHost,
    "X-RapidAPI-Key": config.rapidApiKey,
  },
  data: submissionData, // ✅ no btoa() here
});