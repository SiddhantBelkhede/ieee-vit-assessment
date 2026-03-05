import Question from "../models/Question.js";

// GET /api/candidate/questions
export const getActiveQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true })
      .sort({ order: 1 })
      .select("-answer");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/questions
export const createQuestion = async (req, res) => {
  try {
    const count = await Question.countDocuments();
    // Automatically place new questions at the bottom of the list
    const newQ = new Question({ ...req.body, order: count });
    await newQ.save();
    res.status(201).json(newQ);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/questions/:id
export const updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    if (!updated) return res.status(404).json({ error: "Record not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/questions/:id
export const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record not found" });
    res.json({ success: true, message: "Record permanently deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/questions/reorder
export const reorderQuestions = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    // Iterate through the array of IDs sent from the frontend and update their order integer
    const promises = orderedIds.map((id, index) => {
      return Question.findByIdAndUpdate(id, { order: index });
    });

    await Promise.all(promises);
    res.json({ success: true, message: "System sequence updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
