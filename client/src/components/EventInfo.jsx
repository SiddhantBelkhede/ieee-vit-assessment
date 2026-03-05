import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventInfo({ scoreData }) {
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      name: "CODEZEST '26",
      image: "/assets/codezest-poster.jpeg",
      desc: "Where logic meets precision! Sharpen your DSA skills.",
    },
    {
      id: 2,
      name: "GATE SMASHERS",
      image: "/assets/gate-smashers-poster.jpeg",
      desc: "Tech Talk with Varun Singla, India's most trusted GATE mentor.",
    },
  ];

  return (
    <div
      className="view-container-large animate-fade-in"
      style={{ maxWidth: "1000px" }}
    >
      <div className="header-section" style={{ textAlign: "center" }}>
        <span className="label-mono" style={{ color: "var(--neon-cyan)" }}>
          [ Assessment Recorded ]
        </span>
        <h2 className="page-title">What's Next?</h2>
        <p className="page-subtitle">
          Join us for the upcoming Tech Summit '26 events!
        </p>
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "20px",
        }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="dashboard-panel"
            style={{ padding: "15px", textAlign: "center" }}
          >
            <h4
              className="label-mono"
              style={{ marginBottom: "10px", color: "var(--neon-cyan)" }}
            >
              {event.name}
            </h4>
            <img
              src={event.image}
              alt={event.name}
              style={{
                width: "100%",
                borderRadius: "var(--radius-std)",
                border: "1px solid var(--border-white)",
              }}
            />
            <p
              className="page-subtitle"
              style={{ fontSize: "0.75rem", marginTop: "10px", opacity: 0.8 }}
            >
              {event.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="action-row" style={{ marginTop: "30px" }}>
        <button
          className="btn-industrial"
          onClick={() => navigate("/result")}
          style={{ width: "100%", borderRadius: "var(--radius-std)" }}
        >
          View My Quiz Results
        </button>
      </div>

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
