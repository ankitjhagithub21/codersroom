import { compileCode } from "../utils/compileCode.js";

export const compileAndRun = async (req, res) => {
  const { language_id, source_code, stdin } = req.body;

  if (!language_id || !source_code) {
    return res.status(400).json({
      success: false,
      message: "language_id and source_code are required"
    });
  }

  const result = await compileCode(language_id, source_code, stdin);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};
