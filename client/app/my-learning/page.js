"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "../../components/CourseCard";
import { apiFetch } from "../../lib/api";

export default function MyLearningPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setSignedIn(Boolean(token));
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch("/students/enrolled")
      .then((data) => setCourses(data.courses || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="page-shell">
      <p className="eyebrow">Your learning</p>
      <h1 className="display">Keep the momentum.</h1>
      <p className="lead">
        Everything you have chosen to learn, gathered in one place.
      </p>
      {!signedIn && !loading ? (
        <div className="empty-state" style={{ marginTop: 42 }}>
          Sign in to see your enrolled courses.{" "}
          <Link className="card-link" href="/login">
            Sign in
          </Link>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : loading ? (
        <div className="loading">Loading your courses...</div>
      ) : courses.length ? (
        <div className="course-grid" style={{ marginTop: 48 }}>
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} enrolled />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: 42 }}>
          You have not enrolled in a course yet.{" "}
          <Link className="card-link" href="/courses">
            Explore the catalog
          </Link>
        </div>
      )}
    </div>
  );
}
