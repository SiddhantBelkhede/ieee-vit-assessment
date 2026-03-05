import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiService";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!password) return;

    const success = await api.adminLogin(password);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      alert("Login failed. Please check your passcode and try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="view-container animate-fade-in">
      {/* Header Section */}
      <div className="header-section">
        <span className="label-mono" style={{ color: "var(--neon-cyan)" }}>
          [ SECURE ACCESS ]
        </span>
        <h2 className="page-title">Admin Login</h2>
        <p className="page-subtitle">
          Enter your passcode to access the management dashboard.
        </p>
      </div>

      {/* Input Field */}
      <div className="form-group">
        <label className="label-mono">Access Key</label>
        <div style={{ display: "flex" }}>
          <span
            className="option-prefix-input"
            style={{ background: "var(--neon-cyan)", color: "black" }}
          >
            #
          </span>
          <input
            type="password"
            className="input-sharp"
            style={{ borderLeft: "none" }}
            placeholder="Enter code..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-row" style={{ marginTop: "20px" }}>
        <button
          className="btn-industrial-secondary"
          onClick={() => navigate("/")}
          style={{ borderRadius: "var(--radius-std)" }}
        >
          Cancel
        </button>
        <button
          className="btn-industrial"
          onClick={login}
          style={{ borderRadius: "var(--radius-std)" }}
        >
          Sign In
        </button>
      </div>

      {/* Required Footer Branding */}
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
