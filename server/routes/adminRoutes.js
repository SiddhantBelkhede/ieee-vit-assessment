import express from "express";
const router = express.Router();

import { adminLogin } from "../controllers/authController.js";

import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "../controllers/questionController.js";

router.post("/login", adminLogin);
router.get("/questions", getAllQuestions);
router.post("/questions", createQuestion);
router.put("/questions/reorder", reorderQuestions);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
