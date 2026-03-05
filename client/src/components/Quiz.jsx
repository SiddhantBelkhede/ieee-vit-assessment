import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiService";

export default function Quiz({ user, setScoreData }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getQuestions()
      .then((res) => {
        setQuestions(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Connection Error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || questions.length === 0) return;

    if (timeLeft <= 0) {
      submitTest();
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, questions.length]);

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [questions[currentIndex]._id]: val });
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const timeTaken = 300 - timeLeft;
      const result = await api.submitQuiz({
        name: user.name,
        instaId: user.instaId,
        answers,
        timeTaken,
      });
      setScoreData(result);
      navigate("/result");
    } catch (err) {
      alert(
        "Something went wrong while submitting. Your session might have timed out.",
      );
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="view-container">
        <h2 className="page-title">Just a second...</h2>
        <p className="page-subtitle">We're getting everything ready for you.</p>
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="view-container">
        <h2 className="page-title">No Questions Found</h2>
        <p className="page-subtitle">
          It looks like there aren't any questions available right now.
        </p>
        <button className="btn-industrial" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );

  const q = questions[currentIndex];

  if (!q) return null;

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${("0" + (seconds % 60)).slice(-2)}`;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="view-container animate-fade-in">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span className="label-mono">Time Remaining</span>
          <span className="status-value time-critical">
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="status-item align-right">
          <span className="label-mono">Question</span>
          <span className="status-value">
            {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Question Area */}
      <div className="question-display">
        <h3 className="question-text">{q.text}</h3>

        {q.type === "output" && q.codeSnippet && (
          <pre className="code-block-industrial">
            <code>{q.codeSnippet}</code>
          </pre>
        )}

        <div className="response-section">
          {q.type === "mcq" ? (
            <div
              className="options-grid"
              style={{ display: "grid", gap: "12px" }}
            >
              {q.options.map((opt, i) => {
                const isSelected = answers[q._id] === opt;

                return (
                  <button
                    key={i}
                    type="button"
                    className="btn-industrial-secondary"
                    onClick={() => handleAnswer(opt)}
                    style={{
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "var(--radius-std)",
                      padding: "12px 20px",
                      background: isSelected
                        ? "var(--btn-blue)"
                        : "transparent",
                      color: "white",
                      border: isSelected
                        ? "none"
                        : "1px solid var(--border-white)",
                      boxShadow: isSelected
                        ? "0 0 15px rgba(29, 78, 216, 0.5)"
                        : "none",
                    }}
                  >
                    <span
                      className="label-mono"
                      style={{
                        color: isSelected ? "white" : "var(--neon-cyan)",
                        marginRight: "12px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="form-group">
              <label className="label-mono">Your Answer:</label>
              <div style={{ display: "flex" }}>
                <span
                  className="option-prefix-input"
                  style={{ background: "var(--neon-cyan)", color: "black" }}
                >
                  {">"}
                </span>
                <input
                  type="text"
                  className="input-sharp"
                  style={{ borderLeft: "none" }}
                  placeholder="Type your answer here..."
                  autoComplete="off"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="action-row" style={{ marginTop: "20px" }}>
        <button
          className="btn-industrial-secondary"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((c) => c - 1)}
          style={{ borderRadius: "var(--radius-std)" }}
        >
          Previous
        </button>
        <button
          className="btn-industrial"
          onClick={
            currentIndex < questions.length - 1
              ? () => setCurrentIndex((c) => c + 1)
              : submitTest
          }
          style={{ borderRadius: "var(--radius-std)" }}
        >
          {currentIndex < questions.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </button>
      </div>

      {/* Required Branding Footer */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <span
          className="label-mono"
          style={{ fontSize: "0.7rem", opacity: 0.6 }}
        >
          IEEE STUDENT BRANCH, VIT PUNE
        </span>
      </div>
    </div>
  );
}
