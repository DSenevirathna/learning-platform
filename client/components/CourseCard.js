import Link from "next/link";

export default function CourseCard({
  course,
  enrolled = false,
  onEnroll,
  enrolling = false,
  progress,
  onProgress,
  updatingProgress = false,
}) {
  return (
    <article className="course-card">
      <span className="course-tag">Course</span>
      <h3>{course.title}</h3>
      <p>
        {course.description ||
          "A focused course designed to help you build practical skills."}
      </p>
      {onProgress && (
        <div className="progress-block">
          <div className="progress-label">
            <span>{progress?.completed ? "Completed" : "In progress"}</span>
            <span>{progress?.completed ? "100%" : "0%"}</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span
              className="progress-fill"
              style={{ width: progress?.completed ? "100%" : "0%" }}
            />
          </div>
          <button
            className="button button-ghost button-small progress-button"
            onClick={onProgress}
            disabled={updatingProgress}
          >
            {updatingProgress
              ? "Updating..."
              : progress?.completed
                ? "Mark in progress"
                : "Mark complete"}
          </button>
        </div>
      )}
      <div className="course-meta">
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
