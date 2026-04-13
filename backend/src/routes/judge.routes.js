import { Router } from "express";
import { compileAndRun } from "../controllers/judge.controller.js";

const judgeRouter = Router();

judgeRouter.post("/compile", compileAndRun);

export default judgeRouter;
