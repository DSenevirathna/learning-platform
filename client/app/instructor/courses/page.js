"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";

export default function InstructorCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", content: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.role !== "instructor") {
      router.replace("/courses");
      return;
    }

    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }

    apiFetch("/courses/instructor/my-courses")
      .then((data) => setCourses(data.courses || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await apiFetch("/courses", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setCourses((current) => [data.course, ...current]);
      setForm({ title: "", description: "", content: "" });
      setNotice("Course published successfully.");
      setShowAddCourse(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    if (submitting) return;
    setShowAddCourse(false);
    setError("");
  }

  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.enrolledStudents?.length || 0),
    0,
  );

  return (
    <div className="page-shell">
      <p className="eyebrow">Instructor studio</p>
      <h1 className="display">Your teaching dashboard.</h1>

      <div style={{ marginTop: 28, marginBottom: 28 }}>
        <div
          className="course-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <article className="course-card" style={{ minHeight: "auto" }}>
            <span className="course-tag">Courses</span>
            <h3>{courses.length}</h3>
            <p>Total published</p>
          </article>
          <article className="course-card" style={{ minHeight: "auto" }}>
            <span className="course-tag">Students</span>
            <h3>{totalStudents}</h3>
            <p>Across all courses</p>
          </article>
        </div>
      </div>

      <div
        style={{
          marginBottom: 28,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={() => setShowAddCourse(true)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Add new course
        </button>
      </div>

      {showAddCourse && (
        <div className="modal-overlay" onClick={closeModal} role="presentation">
          <div
            className="auth-card form modal-card"
            style={{ marginTop: 0 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-course-title"
          >
            <div className="modal-header">
              <h2 id="new-course-title" style={{ margin: 0 }}>
                Create a new course
              </h2>
              <button
                type="button"
                className="btn btn-icon"
                onClick={closeModal}
                aria-label="Close"
                disabled={submitting}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={submit}>
              <label className="field">
                Title
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  disabled={submitting}
                />
              </label>
              <label className="field">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  disabled={submitting}
                />
              </label>
              <label className="field">
                Content
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  disabled={submitting}
                />
              </label>
              {notice && <div className="status-message">{notice}</div>}
              {error && <div className="error-message">{error}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting && (
                    <span className="spinner" aria-hidden="true" />
                  )}
                  {submitting ? "Publishing..." : "Publish course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ width: "100%" }}>
        <div style={{ marginTop: 24 }}>
          <p className="eyebrow">Published courses</p>
          {loading ? (
            <div className="loading">Loading dashboard...</div>
          ) : courses.length ? (
            courses.map((course) => {
              const students = course.enrolledStudents || [];

              return (
                <article
                  className="course-card"
                  key={course._id}
                  style={{ marginBottom: 18, minHeight: "auto" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "center",
                      marginBottom: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <span className="course-tag">Course</span>
                      <h3 style={{ marginTop: 8 }}>{course.title}</h3>
                    </div>
                    <div
                      style={{
                        background: "#e6f4f0",
                        color: "#0f5132",
                        padding: "8px 12px",
                        borderRadius: 999,
                        fontWeight: 700,
                      }}
                    >
                      {students.length} student
                      {students.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div>
                      <strong>Description</strong>
                      <p style={{ marginTop: 6 }}>
                        {course.description ||
                          "A focused course designed to help learners build practical skills."}
                      </p>
                    </div>

                    <div>
                      <strong>Course content</strong>
                      <p style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                        {course.content || "No course content added yet."}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 12,
                      marginTop: 18,
                    }}
                  >
                    <div>
                      <strong>Created</strong>
                      <p>
                        {course.createdAt
                          ? new Date(course.createdAt).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                    <div>
                      <strong>Last updated</strong>
                      <p>
                        {course.updatedAt
                          ? new Date(course.updatedAt).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                    <div>
                      <strong>Enrolled</strong>
                      <p>{students.length}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <h4 style={{ marginBottom: 10 }}>Enrolled learners</h4>
                    {students.length ? (
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {students.map((student) => (
                          <li key={student._id || student.id}>
                            {student.username || student.name || "Student"}
                            {student.role ? ` (${student.role})` : ""}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-state" style={{ margin: 0 }}>
                        No students enrolled yet.
                      </p>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">
              Your published courses will appear here.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
          animation: overlay-in 0.15s ease-out;
        }

        .modal-card {
          width: 100%;
          max-width: 640px;
          position: relative;
          animation: card-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 4px;
        }

        @keyframes overlay-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes card-in {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

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
          padding: 11px 20px;
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
          opacity: 0.6;
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

        .btn-ghost {
          background: #fff;
          color: #344054;
          border-color: #d0d5dd;
        }

        .btn-ghost:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #98a2b3;
        }

        .btn-ghost:active:not(:disabled) {
          background: #f2f4f7;
        }

        .btn-icon {
          padding: 7px;
          border-radius: 8px;
          background: transparent;
          color: #667085;
          border-color: transparent;
        }

        .btn-icon:hover:not(:disabled) {
          background: #f2f4f7;
          color: #344054;
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
          .modal-overlay,
          .modal-card,
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
