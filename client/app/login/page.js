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
            />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button className="button button-green" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="form-note">
            New to Lumen? <Link href="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
