import axios from "axios";
import {config} from "../config/env.js";
import {createJudge0Config} from "../config/judge0.js";


export const compileCode = async (language_id, source_code, stdin = "") => {
  try {
    const submissionData = {
      language_id,
      source_code,
      stdin
    };

    const judge0Config = createJudge0Config(submissionData);
    const response = await axios(judge0Config);
    
    const token = response.data.token;

    const resultConfig = {
      method: "GET",
      url: `${config.rapidApiUrl}/${token}`,
      params: { 
        base64_encoded: "true", 
        fields: "*" 
      },
      headers: {
        "X-RapidAPI-Host": config.rapidApiHost,
        "X-RapidAPI-Key": config.rapidApiKey,
      }
    };

    let result;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const resultResponse = await axios(resultConfig);
      result = resultResponse.data;
      attempts++;
    } while (result.status.id <= 2 && attempts < maxAttempts);

    if (result.status.id <= 2) {
      throw new Error("Execution timed out");
    }

    const decodedOutput = result.stdout ? atob(result.stdout) : "";
    const decodedError = result.stderr ? atob(result.stderr) : "";
    const decodedCompileInfo = result.compile_output ? atob(result.compile_output) : "";

    return {
      success: true,
      data: {
        status: result.status.description,
        status_id: result.status.id,
        output: decodedOutput,
        error: decodedError,
        compile_info: decodedCompileInfo,
        time: result.time,
        memory: result.memory
      }
    };

  } catch (error) {
    console.error("Judge0 API Error:", error);
    return {
      success: false,
      message: "Failed to execute code",
      error: error.response?.data || error.message
    };
  }
};