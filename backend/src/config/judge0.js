import {config} from "./env.js";

export const createJudge0Config = (formData) => ({
  method: "POST",
  url: config.rapidApiUrl,
  params: { 
    base64_encoded: "true", 
    fields: "*" 
  },
  headers: {
    "content-type": "application/json",
    "Content-Type": "application/json",
    "X-RapidAPI-Host": config.rapidApiHost,
    "X-RapidAPI-Key": config.rapidApiKey,
  },
  data: formData,
});

