"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, saveSession } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/signup", {
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
        <p className="eyebrow">Start here</p>
        <h1>Make room to grow.</h1>
        <p>Build a learning rhythm around the skills you want next.</p>
        <form className="form" onSubmit={submit}>
          <label className="field">
            Username
            <input
              required
              minLength={3}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
            />
          </label>
          <label className="field">
            Password
            <input
              required
              minLength={6}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
            />
          </label>
          <label className="field">
            I am joining as
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">A student</option>
              <option value="instructor">An instructor</option>
            </select>
          </label>
          {error && <div className="error-message">{error}</div>}
          <button className="button button-green" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
          <p className="form-note">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
