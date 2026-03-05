import mongoose from "mongoose";
import Candidate from "../models/Candidate.js";
import Question from "../models/Question.js";

// POST /api/candidate/submit
export const submitAssessment = async (req, res) => {
  const { name, instaId, answers, timeTaken } = req.body;

  // 1. Initialize a secure database transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Prevent duplicate submissions using the session lock
    const existingCandidate = await Candidate.findOne({ instaId }).session(
      session,
    );
    if (existingCandidate) {
      await session.abortTransaction(); // Rollback any pending changes
      session.endSession();
      return res.status(400).json({
        error:
          "A candidate with this Instagram ID has already completed the assessment.",
      });
    }

    // 3. Fetch active questions to calculate the score securely
    const questions = await Question.find({ isActive: true }).session(session);
    let score = 0;

    questions.forEach((q) => {
      // Ensure the question has an answer and the user provided one
      if (answers[q._id] && q.answer) {
        if (
          answers[q._id].trim().toLowerCase() === q.answer.trim().toLowerCase()
        ) {
          score += 10; // 10 points per correct answer
        }
      }
    });

    // 4. Save the candidate's results as part of the transaction
    const candidate = new Candidate({ name, instaId, score, timeTaken });
    await candidate.save({ session });

    // 5. If everything succeeded, commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ score, timeTaken });
  } catch (err) {
    // If ANY error occurs, instantly roll back everything
    await session.abortTransaction();
    session.endSession();

    // Fallback: Catch MongoDB's strict Duplicate Key Error (E11000)
    if (err.code === 11000) {
      return res.status(400).json({
        error:
          "Duplicate submission blocked by database. Your score is already safely recorded.",
      });
    }

    console.error("[SCORE CALCULATION ERROR]:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/candidate/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    // Sort primarily by highest score, secondarily by lowest time taken
    const leaderboard = await Candidate.find()
      .sort({ score: -1, timeTaken: 1 })
      .limit(50); // Optional: limits to top 50

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/candidate/check/:instaId
export const checkExistingCandidate = async (req, res) => {
  try {
    const { instaId } = req.params;
    const candidate = await Candidate.findOne({ instaId });
    // Returns true if they exist, false if they don't
    res.json({ exists: !!candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
