import Candidate from "../models/Candidate.js";
import Question from "../models/Question.js";

// POST /api/candidate/submit
export const submitAssessment = async (req, res) => {
  const { name, instaId, answers, timeTaken } = req.body;

  try {
    // 1. Prevent duplicate submissions
    const existingCandidate = await Candidate.findOne({ instaId });
    if (existingCandidate) {
      return res
        .status(400)
        .json({
          error:
            "A candidate with this Instagram ID has already completed the assessment.",
        });
    }

    // 2. Fetch active questions to calculate the score securely on the backend
    const questions = await Question.find({ isActive: true });
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

    // 3. Save the candidate's results
    const candidate = new Candidate({ name, instaId, score, timeTaken });
    await candidate.save();

    res.status(201).json({ score, timeTaken });
  } catch (err) {
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
