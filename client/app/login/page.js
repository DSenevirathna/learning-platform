"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, saveSession } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      saveSession(data);
      router.push(
        data.user.role === "instructor" ? "/instructor/courses" : "/courses",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Continue learning.</h1>
        <p>Sign in to pick up where you left off.</p>
        <form className="form" onSubmit={submit}>
          <label className="field">
            Username
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
              disabled={loading}
            />
          </label>
          <label className="field">
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              disabled={loading}
            />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading && <span className="spinner" aria-hidden="true" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="form-note">
            New to Lumen? <Link href="/register">Create an account</Link>
          </p>
        </form>
      </section>

      <style jsx>{`
        .btn {
          --btn-primary: #16a34a;
          --btn-primary-hover: #15803d;
          --btn-primary-active: #166534;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14.5px;
          font-weight: 600;
          line-height: 1;
          padding: 12px 20px;
          border-radius: 10px;
          border: 1px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition:
            background-color 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            transform 0.06s ease,
            opacity 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .btn-block {
          width: 100%;
        }

        .btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .btn:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 2px #fff,
            0 0 0 4px rgba(22, 163, 74, 0.55);
        }

        .btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .btn-primary {
          background: var(--btn-primary);
          color: #fff;
          box-shadow: 0 1px 2px rgba(16, 24, 40, 0.08);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--btn-primary-hover);
          box-shadow: 0 4px 10px rgba(22, 163, 74, 0.25);
        }

        .btn-primary:active:not(:disabled) {
          background: var(--btn-primary-active);
          box-shadow: none;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .btn,
          .spinner {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
