import Link from "next/link";

export default function CourseCard({
  course,
  enrolled = false,
  onEnroll,
  enrolling = false,
}) {
  return (
    <article className="course-card">
      <span className="course-tag">Course</span>
      <h3>{course.title}</h3>
      <p>
        {course.description ||
          "A focused course designed to help you build practical skills."}
      </p>
      <div className="course-meta">
        <span>By {course.instructor?.username || "Lumen instructor"}</span>
        {enrolled ? (
          <span className="card-link">Enrolled</span>
        ) : onEnroll ? (
          <button
            className="button button-green button-small"
            onClick={() => onEnroll(course._id)}
            disabled={enrolling}
          >
            {enrolling ? "Joining..." : "Enroll"}
          </button>
        ) : (
          <Link className="card-link" href={`/courses/${course._id}`}>
            View course
          </Link>
        )}
      </div>
    </article>
  );
}
