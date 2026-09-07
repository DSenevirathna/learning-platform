"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";

export default function AiAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function ask(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const data = await apiFetch("/gpt/recommendations", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      setAnswer(data.recommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="page-shell">
      <p className="eyebrow">Lumen guide</p>
      <h1 className="display">Tell us where you want to go.</h1>
      <p className="lead">
        Describe your goals and get a thoughtful starting point from the courses
        in our catalog.
      </p>
      <form className="form" style={{ maxWidth: 680 }} onSubmit={ask}>
        <label className="field">
          What are you working toward?
          <textarea
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="I want to become a software engineer..."
          />
        </label>
        <button className="button button-green button-small" disabled={loading}>
          {loading ? "Thinking..." : "Find my courses"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {answer && (
        <div
          className="status-message"
          style={{ maxWidth: 680, whiteSpace: "pre-wrap" }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}
