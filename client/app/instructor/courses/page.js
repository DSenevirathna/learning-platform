"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", content: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (localStorage.getItem("token"))
      apiFetch("/courses/instructor/my-courses")
        .then((data) => setCourses(data.courses || []))
        .catch((err) => setError(err.message));
  }, []);
  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/courses", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setCourses((current) => [data.course, ...current]);
      setForm({ title: "", description: "", content: "" });
      setNotice("Course published successfully.");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className="page-shell">
      <p className="eyebrow">Instructor studio</p>
      <h1 className="display">Share what you know.</h1>
      <div className="detail-layout" style={{ marginTop: 48 }}>
        <form
          className="auth-card form"
          style={{ marginTop: 0, width: "100%" }}
          onSubmit={submit}
        >
          <h2>Create a course</h2>
          <label className="field">
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="field">
            Description
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label className="field">
            Content
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </label>
          {notice && <div className="status-message">{notice}</div>}
          {error && <div className="error-message">{error}</div>}
          <button className="button button-green">Publish course</button>
        </form>
        <div>
          <p className="eyebrow">Published courses</p>
          {courses.length ? (
            courses.map((course) => (
              <article
                className="course-card"
                key={course._id}
                style={{ marginBottom: 15, minHeight: "auto" }}
              >
                <h3>{course.title}</h3>
                <p>{course.enrolledStudents?.length || 0} enrolled students</p>
              </article>
            ))
          ) : (
            <div className="empty-state">
              Your published courses will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
