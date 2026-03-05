import express from "express";
const router = express.Router();

import {
  submitAssessment,
  getLeaderboard,
  checkExistingCandidate,
} from "../controllers/candidateController.js";

import { getActiveQuestions } from "../controllers/questionController.js";

router.get("/questions", getActiveQuestions);
router.get("/check/:instaId", checkExistingCandidate);
router.post("/submit", submitAssessment);
router.get("/leaderboard", getLeaderboard);

export default router;
