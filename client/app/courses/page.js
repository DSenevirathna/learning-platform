"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "../../components/CourseCard";
import { apiFetch } from "../../lib/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [enrolling, setEnrolling] = useState("");
  useEffect(() => {
    Promise.all([
      apiFetch("/courses"),
      localStorage.getItem("token")
        ? apiFetch("/students/enrolled")
        : Promise.resolve({ courses: [] }),
    ])
      .then(([all, mine]) => {
        setCourses(all.courses || []);
        setEnrolled(mine.courses || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  async function enroll(id) {
    if (!localStorage.getItem("token")) {
      setError("Sign in to enroll in a course.");
      return;
    }
    setEnrolling(id);
    setNotice("");
    try {
      await apiFetch(`/courses/${id}/enroll`, { method: "POST" });
      setEnrolled((current) => [...current, { _id: id }]);
      setNotice("You are enrolled. Your new course is ready in My Learning.");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling("");
    }
  }
  const enrolledIds = new Set(enrolled.map((course) => course._id));
  return (
    <div className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A better way forward</p>
          <h1 className="display">
            Learn something that changes your next chapter.
          </h1>
          <p className="lead">
            Short, practical courses taught by people who care about the work.
            Choose a direction and start moving.
          </p>
          <div className="hero-actions">
            <a className="button button-dark button-small" href="#catalog">
              Browse courses
            </a>
            <Link
              className="button button-ghost button-small"
              href="/my-learning"
            >
              My learning
            </Link>
          </div>
        </div>
      </section>
      <div id="catalog" className="section-heading">
        <div>
          <p className="eyebrow">The catalog</p>
          <h2>Find your next focus.</h2>
        </div>
        <p>{courses.length} courses available</p>
      </div>
      {notice && <div className="status-message">{notice}</div>}
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : courses.length ? (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              enrolled={enrolledIds.has(course._id)}
              onEnroll={enroll}
              enrolling={enrolling === course._id}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">No courses have been published yet.</div>
      )}
    </div>
  );
}
