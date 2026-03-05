import React from "react";
import { useNavigate } from "react-router-dom";

export default function Result({ scoreData }) {
  const navigate = useNavigate();

  return (
    <div className="view-container animate-fade-in">
      {/* Header */}
      <div className="header-section" style={{ textAlign: "center" }}>
        <span className="label-mono" style={{ color: "var(--neon-cyan)" }}>
          [ Assessment Finished ]
        </span>
        <h2 className="page-title">Great Job!</h2>
        <p className="page-subtitle">
          Your results have been successfully saved in our database.
        </p>
      </div>

      {/* Scorecard Display */}
      <div
        className="score-readout"
        style={{
          border: "1px solid var(--border-white)",
          padding: "30px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "var(--radius-std)",
        }}
      >
        <div
          className="score-block"
          style={{ borderRight: "1px dashed var(--border-white)" }}
        >
          <span className="label-mono">Your Score</span>
          <div
            className="score-number"
            style={{
              color: "var(--neon-cyan)",
              textShadow: "0 0 15px rgba(0, 255, 255, 0.4)",
            }}
          >
            {scoreData.score}
          </div>
          <span className="label-mono" style={{ fontSize: "0.6rem" }}>
            Total Points Earned
          </span>
        </div>

        <div className="time-block">
          <span className="label-mono">Time Taken</span>
          <div
            className="time-number"
            style={{
              color: "var(--neon-purple)",
              textShadow: "0 0 15px rgba(168, 85, 247, 0.4)",
            }}
          >
            {scoreData.timeTaken}
            <span style={{ fontSize: "1.2rem", marginLeft: "4px" }}>s</span>
          </div>
          <span className="label-mono" style={{ fontSize: "0.6rem" }}>
            Total Duration
          </span>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="action-row" style={{ marginTop: "30px" }}>
        <button
          className="btn-industrial"
          onClick={() => navigate("/")}
          style={{ width: "100%", borderRadius: "var(--radius-std)" }}
        >
          Return to Home
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
