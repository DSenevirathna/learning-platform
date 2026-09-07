"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (id)
      apiFetch(`/courses/${id}`)
        .then((data) => setCourse(data.course))
        .catch((err) => setError(err.message));
  }, [id]);
  async function enroll() {
    if (!localStorage.getItem("token")) {
      setError("Sign in to enroll in a course.");
      return;
    }
    try {
      await apiFetch(`/courses/${id}/enroll`, { method: "POST" });
      setNotice(
        "Enrollment successful. You can find this course in My Learning.",
      );
    } catch (err) {
      setError(err.message);
    }
  }
  if (error)
    return (
      <div className="page-shell">
        <div className="error-message">{error}</div>
      </div>
    );
  if (!course)
    return (
      <div className="page-shell">
        <div className="loading">Loading course...</div>
      </div>
    );
  return (
    <div className="page-shell">
      <Link className="card-link" href="/courses">
        ← Back to catalog
      </Link>
      <div className="detail-layout" style={{ marginTop: 45 }}>
        <div>
          <p className="eyebrow">Course overview</p>
          <h1>{course.title}</h1>
          <p className="detail-copy">{course.description}</p>
          <p className="detail-copy">{course.content}</p>
        </div>
        <aside className="detail-panel">
          <p className="eyebrow">Ready when you are</p>
          <p>
            Learn at your own pace with guidance from{" "}
            {course.instructor?.username || "your instructor"}.
          </p>
          {notice && <div className="status-message">{notice}</div>}
          <button className="button button-green" onClick={enroll}>
            Enroll in this course
          </button>
        </aside>
      </div>
    </div>
  );
}
