import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiService";

export default function Home({ user, setUser }) {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  // Hidden Admin Access: Shift + A
  useEffect(() => {
    const handleAdminSecret = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.shiftKey && e.key === "A") navigate("/admin/login");
    };
    window.addEventListener("keydown", handleAdminSecret);
    return () => window.removeEventListener("keydown", handleAdminSecret);
  }, [navigate]);

  const startQuiz = async () => {
    // Basic Validation
    if (!user.name.trim() || !user.instaId.trim()) {
      alert("Please fill in both your name and Instagram handle to continue.");
      return;
    }

    // Real-time Database Check
    setIsVerifying(true);
    try {
      const alreadyExists = await api.checkCandidate(user.instaId.trim());

      if (alreadyExists) {
        alert("Our records show this Instagram ID has already participated.");
        setIsVerifying(false);
        return;
      }

      // Start the test
      navigate("/quiz");
    } catch (err) {
      alert(
        "We're having trouble connecting to the server. Please try again in a moment.",
      );
      setIsVerifying(false);
    }
  };

  return (
    <div className="view-container animate-fade-in">
      {/* Header Section */}
      <div className="header-section">
        <span className="label-mono">IEEE VIT Pune Presents</span>
        <h2 className="page-title">Technical Assessment</h2>
        <p className="page-subtitle">
          Please enter your details below to begin the quiz.
        </p>
      </div>

      {/* Registration Fields */}
      <div className="form-group">
        <label className="label-mono">01. Full Name</label>
        <input
          type="text"
          className="input-sharp"
          placeholder="e.g. John Doe"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          autoComplete="off"
        />
      </div>

      <div className="form-group">
        <label className="label-mono">02. Instagram Handle</label>
        <div style={{ display: "flex" }}>
          <span className="option-prefix-input">@</span>
          <input
            type="text"
            className="input-sharp"
            style={{ borderLeft: "none" }}
            placeholder="username"
            value={user.instaId}
            onChange={(e) => setUser({ ...user, instaId: e.target.value })}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="action-section" style={{ marginTop: "10px" }}>
        <button
          className="btn-industrial"
          onClick={startQuiz}
          disabled={isVerifying}
          style={{ borderRadius: "var(--radius-std)" }}
        >
          {isVerifying ? "Verifying..." : "Start Assessment"}
        </button>
      </div>

      {/* Required Footer */}
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
