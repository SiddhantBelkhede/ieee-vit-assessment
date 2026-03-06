import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const CANDIDATE_URL = `${BASE_URL}/candidate`;
const ADMIN_URL = `${BASE_URL}/admin`;

const api = {
  // Fetches only active, sorted questions (without answers)
  getQuestions: async () => {
    const response = await axios.get(`${CANDIDATE_URL}/questions`);
    return response.data;
  },

  // Submits the quiz results for scoring
  submitQuiz: async (data) => {
    const response = await axios.post(`${CANDIDATE_URL}/submit`, data);
    return response.data;
  },

  // Accepts an optional date string (e.g., "2026-03-06") to filter scores
  getLeaderboard: async (date = "all") => {
    let url = `${CANDIDATE_URL}/leaderboard`;

    if (date !== "all") {
      const startOfDay = new Date(`${date}T00:00:00`).toISOString();
      const endOfDay = new Date(`${date}T23:59:59.999`).toISOString();

      url += `?startDate=${startOfDay}&endDate=${endOfDay}`;
    } else {
      url += `?date=all`;
    }

    const response = await axios.get(url);
    return response.data;
  },

  // Verifies if a candidate exists to prevent duplicate entries
  checkCandidate: async (instaId) => {
    const response = await axios.get(`${CANDIDATE_URL}/check/${instaId}`);
    return response.data.exists;
  },

  // Admin
  // Verifies admin password
  adminLogin: async (password) => {
    try {
      const response = await axios.post(`${ADMIN_URL}/login`, { password });
      return response.data.success;
    } catch (err) {
      return false;
    }
  },

  // Fetches ALL questions including hidden ones and answers
  getAllQuestionsAdmin: async () => {
    const response = await axios.get(`${ADMIN_URL}/questions`);
    return response.data;
  },

  // Adds a new question to the database
  addQuestion: async (q) => {
    const response = await axios.post(`${ADMIN_URL}/questions`, q);
    return response.data;
  },

  // Updates an existing question (text, type, visibility, etc.)
  updateQuestion: async (id, data) => {
    const response = await axios.put(`${ADMIN_URL}/questions/${id}`, data);
    return response.data;
  },

  // Updates the display sequence of questions
  reorderQuestions: async (orderedIds) => {
    const response = await axios.put(`${ADMIN_URL}/questions/reorder`, {
      orderedIds,
    });
    return response.data;
  },

  // Permanently removes a question
  deleteQuestion: async (id) => {
    const response = await axios.delete(`${ADMIN_URL}/questions/${id}`);
    return response.data;
  },
};

export default api;
