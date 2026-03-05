import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("QUESTIONS");
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: "mcq",
    text: "",
    options: ["", "", "", ""],
    answer: "",
    codeSnippet: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    try {
      const qData = await api.getAllQuestionsAdmin();
      const lData = await api.getLeaderboard();
      setQuestions(qData || []);
      setLeaderboard(lData || []);
    } catch (err) {
      console.error("SYSTEM_SYNC_ERROR", err);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData({
      type: "mcq",
      text: "",
      options: ["", "", "", ""],
      answer: "",
      codeSnippet: "",
      isActive: true,
    });
  };

  const saveQuestion = async () => {
    if (!formData.text || !formData.answer)
      return alert("VALIDATION ERROR: Statement and Answer required.");
    const payload = { ...formData };
    if (payload.type === "mcq") {
      payload.options = payload.options.filter((opt) => opt.trim() !== "");
      if (payload.options.length < 2)
        return alert("VALIDATION ERROR: Minimum 2 options required.");
    } else {
      payload.options = [];
    }
    editingId
      ? await api.updateQuestion(editingId, payload)
      : await api.addQuestion(payload);
    clearForm();
    loadData();
  };

  const editQuestion = (q) => {
    setEditingId(q._id);
    let loadedOptions = [...q.options];
    while (loadedOptions.length < 4) loadedOptions.push("");
    setFormData({ ...q, options: loadedOptions });
  };

  const deleteQ = async (id) => {
    if (window.confirm("CRITICAL WARNING: Permanently delete this record?")) {
      await api.deleteQuestion(id);
      if (editingId === id) clearForm();
      loadData();
    }
  };

  const toggleVisibility = async (q) => {
    await api.updateQuestion(q._id, { isActive: !q.isActive });
    loadData();
  };

  const moveQuestion = async (index, direction) => {
    const newArr = [...questions];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newArr.length) return;
    [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    setQuestions(newArr);
    await api.reorderQuestions(newArr.map((q) => q._id));
  };

  return (
    <div
      className="view-container-large animate-fade-in"
      style={{ maxWidth: "1100px" }}
    >
      {/* Updated Branding Header */}
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <span className="label-mono" style={{ color: "var(--neon-cyan)" }}>
            [ SESSION_ADMIN_PORTAL ]
          </span>
          <h2 className="page-title">IEEE STUDENT BRANCH, VIT PUNE</h2>
          <p
            className="page-subtitle"
            style={{ fontSize: "0.7rem", marginTop: "4px" }}
          >
            Tech Summit '26: Administrative Command & Control
          </p>
        </div>
        <button
          className="btn-industrial-secondary"
          onClick={() => navigate("/")}
          style={{
            borderRadius: "var(--radius-std)",
            padding: "6px 14px",
            fontSize: "0.65rem",
            width: "auto",
            flex: "none",
          }}
        >
          EXIT_SESSION
        </button>
      </div>

      {/* Modern Tabs */}
      <div
        className="admin-tabs"
        style={{ display: "flex", gap: "8px", marginBottom: "24px" }}
      >
        <button
          className={`tab-industrial ${tab === "QUESTIONS" ? "active" : ""}`}
          onClick={() => setTab("QUESTIONS")}
          style={{
            flex: 1,
            borderRadius: "var(--radius-std)",
            padding: "16px",
          }}
        >
          01. DATABASE_OPERATIONS
        </button>
        <button
          className={`tab-industrial ${tab === "LEADERBOARD" ? "active" : ""}`}
          onClick={() => setTab("LEADERBOARD")}
          style={{
            flex: 1,
            borderRadius: "var(--radius-std)",
            padding: "16px",
          }}
        >
          02. LIVE_CANDIDATE_METRICS
        </button>
      </div>

      {tab === "QUESTIONS" ? (
        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "400px 1fr",
            gap: "24px",
          }}
        >
          {/* Left Side: Form Entry */}
          <div
            className="dashboard-panel"
            style={{
              border: "1px solid var(--border-white)",
              padding: "24px",
              borderRadius: "var(--radius-std)",
            }}
          >
            <h4
              className="label-mono"
              style={{ marginBottom: "20px", color: "var(--neon-cyan)" }}
            >
              {editingId ? "COMMAND: UPDATE_RECORD" : "COMMAND: NEW_ENTRY"}
            </h4>

            <div className="form-group">
              <label className="label-mono">SPECIFICATION_TYPE</label>
              <select
                className="input-sharp"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                style={{ background: "#000" }}
              >
                <option value="mcq">MCQ [VARIABLE]</option>
                <option value="fill">FILL [STRING]</option>
                <option value="output">OUTPUT [CODE]</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="label-mono">PROBLEM_STATEMENT</label>
              <textarea
                className="input-sharp"
                style={{ minHeight: "80px", background: "#000" }}
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
              />
            </div>

            {formData.type === "output" && (
              <div
                className="form-group animate-fade-in"
                style={{ marginTop: "16px" }}
              >
                <label className="label-mono">SOURCE_CODE</label>
                <textarea
                  className="code-block-industrial"
                  style={{ minHeight: "100px", width: "100%" }}
                  value={formData.codeSnippet}
                  onChange={(e) =>
                    setFormData({ ...formData, codeSnippet: e.target.value })
                  }
                />
              </div>
            )}

            {formData.type === "mcq" && (
              <div
                className="form-group animate-fade-in"
                style={{ marginTop: "16px" }}
              >
                <label className="label-mono">VARIABLE_OPTIONS</label>
                {formData.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", marginBottom: "8px" }}>
                    <span
                      className="option-prefix-input"
                      style={{
                        padding: "12px",
                        background: "var(--neon-purple)",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      className="input-sharp"
                      style={{ borderLeft: "none" }}
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              className="form-group"
              style={{ marginTop: "auto", paddingTop: "20px" }}
            >
              <label className="label-mono">EXPECTED_RESULT</label>
              <input
                className="input-sharp"
                style={{ borderColor: "var(--neon-cyan)" }}
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
              />
            </div>

            <div className="action-row" style={{ marginTop: "24px" }}>
              {editingId && (
                <button
                  className="btn-industrial-secondary"
                  onClick={clearForm}
                >
                  CANCEL
                </button>
              )}
              <button className="btn-industrial" onClick={saveQuestion}>
                {editingId ? "UPDATE" : "COMMIT"}
              </button>
            </div>
          </div>

          {/* Right Side: Data Inventory with Dynamic Renumbering */}
          <div
            className="dashboard-panel"
            style={{
              overflowY: "auto",
              maxHeight: "720px",
              border: "1px solid var(--border-white)",
              padding: "24px",
              borderRadius: "var(--radius-std)",
            }}
          >
            <h4 className="label-mono" style={{ marginBottom: "20px" }}>
              SYSTEM_INVENTORY
            </h4>
            <table className="table-industrial">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>SEQ</th>
                  <th>DATA_PROFILE</th>
                  <th style={{ textAlign: "right" }}>OPERATIONS</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let activeCount = 0;
                  return questions.map((q, index) => {
                    const isHidden = !q.isActive;
                    if (!isHidden) activeCount++;

                    return (
                      <tr key={q._id} className={isHidden ? "row-hidden" : ""}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <button
                              className="btn-small"
                              style={{ fontSize: "8px", padding: "4px" }}
                              disabled={index === 0}
                              onClick={() => moveQuestion(index, "up")}
                            >
                              ▲
                            </button>
                            <span
                              className="label-mono"
                              style={{
                                fontSize: "12px",
                                margin: "4px 0",
                                color: isHidden
                                  ? "var(--neon-purple)"
                                  : "var(--neon-cyan)",
                              }}
                            >
                              {isHidden
                                ? "[--]"
                                : String(activeCount).padStart(2, "0")}
                            </span>
                            <button
                              className="btn-small"
                              style={{ fontSize: "8px", padding: "4px" }}
                              disabled={index === questions.length - 1}
                              onClick={() => moveQuestion(index, "down")}
                            >
                              ▼
                            </button>
                          </div>
                        </td>
                        <td>
                          <div
                            className="badge-industrial"
                            style={{
                              background: q.isActive
                                ? "var(--neon-cyan)"
                                : "var(--neon-purple)",
                              color: "#000",
                              marginBottom: "6px",
                              display: "inline-block",
                            }}
                          >
                            {q.type.toUpperCase()}
                          </div>
                          <div
                            className={isHidden ? "text-strike" : ""}
                            style={{ fontSize: "0.9rem", fontWeight: 600 }}
                          >
                            {q.text.substring(0, 50)}...
                          </div>
                        </td>
                        <td>
                          <div
                            className="operations-cell"
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              className="btn-small"
                              onClick={() => toggleVisibility(q)}
                            >
                              {q.isActive ? "HIDE" : "SHOW"}
                            </button>
                            <button
                              className="btn-small"
                              onClick={() => editQuestion(q)}
                            >
                              EDIT
                            </button>
                            <button
                              className="btn-small"
                              style={{ borderColor: "red", color: "red" }}
                              onClick={() => deleteQ(q._id)}
                            >
                              ×
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Leaderboard View Section */
        <div
          className="dashboard-panel animate-fade-in"
          style={{
            border: "1px solid var(--border-white)",
            padding: "24px",
            borderRadius: "var(--radius-std)",
          }}
        >
          <table className="table-industrial">
            <thead style={{ borderBottom: "2px solid var(--neon-cyan)" }}>
              <tr>
                <th>RANK</th>
                <th>CANDIDATE_PROFILE</th>
                <th>SCORE</th>
                <th>TIME</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((u, i) => (
                <tr key={u._id}>
                  <td
                    className="label-mono"
                    style={{ color: "var(--neon-cyan)", fontSize: "1.1rem" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td>
                    <div style={{ fontWeight: 800 }}>{u.name}</div>
                    <div
                      className="label-mono"
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--neon-purple)",
                      }}
                    >
                      @{u.instaId}
                    </div>
                  </td>
                  <td className="status-value" style={{ fontSize: "1.4rem" }}>
                    {u.score}
                  </td>
                  <td className="label-mono">{u.timeTaken}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
