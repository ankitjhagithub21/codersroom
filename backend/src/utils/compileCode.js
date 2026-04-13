import axios from "axios";
import { config } from "../config/env.js";
import { createJudge0Config } from "../config/judge0.js";

export const compileCode = async (language_id, source_code, stdin = "") => {
  try {
    const submissionData = {
      language_id,
      // ✅ Encode to base64 before sending to Judge0
      source_code: btoa(unescape(encodeURIComponent(source_code))),
      stdin: btoa(unescape(encodeURIComponent(stdin))),
    };

    const judge0Config = createJudge0Config(submissionData);
    const response = await axios(judge0Config);

    const token = response.data.token;

    const resultConfig = {
      method: "GET",
      url: `${config.rapidApiUrl}/${token}`,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "X-RapidAPI-Host": config.rapidApiHost,
        "X-RapidAPI-Key": config.rapidApiKey,
      },
    };

    let result;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resultResponse = await axios(resultConfig);
      result = resultResponse.data;
      attempts++;
    } while (result.status.id <= 2 && attempts < maxAttempts);

    if (result.status.id <= 2) {
      throw new Error("Execution timed out");
    }

    // ✅ Safe base64 decode with UTF-8 support
    const decode = (str) =>
      str ? decodeURIComponent(escape(atob(str))) : "";

    return {
      success: true,
      data: {
        status: result.status.description,
        status_id: result.status.id,
        output: decode(result.stdout),
        error: decode(result.stderr),
        compile_info: decode(result.compile_output),
        time: result.time,
        memory: result.memory,
      },
    };
  } catch (error) {
    console.error("Judge0 API Error:", error);
    return {
      success: false,
      message: "Failed to execute code",
      error: error.response?.data || error.message,
    };
  }
};