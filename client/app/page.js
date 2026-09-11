import Link from "next/link";

const highlights = [
  {
    number: "01",
    title: "Learn with purpose",
    text: "Focused lessons help you build practical skills without the noise.",
  },
  {
    number: "02",
    title: "Move at your pace",
    text: "Explore courses when you are ready and keep your learning organized.",
  },
  {
    number: "03",
    title: "Build what matters",
    text: "Turn new knowledge into confident next steps for your work and life.",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Learning, with direction</p>
          <h1 className="display">Make room for the work you want to do.</h1>
          <p className="lead">
            Lumen helps you learn practical skills through focused,
            instructor-led courses designed for real progress.
          </p>

          <div className="hero-actions">
            <Link className="button button-dark button-small" href="/courses">
              Explore courses
            </Link>
            <Link className="button button-ghost button-small" href="/register">
              Join free
            </Link>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">A clearer path forward</p>
          <h2>Learning that fits your next chapter.</h2>
        </div>
      </section>

      <section className="course-grid">
        {highlights.map((highlight) => (
          <article className="course-card" key={highlight.number}>
            <span className="course-tag">{highlight.number}</span>
            <h3>{highlight.title}</h3>
            <p>{highlight.text}</p>
          </article>
        ))}
      </section>

      <section className="hero" style={{ marginTop: "66px" }}>
        <div className="hero-copy">
          <p className="eyebrow">Start where you are</p>
          <h2 className="display">Your next skill is closer than you think.</h2>
          <div className="hero-actions">
            <Link className="button button-green button-small" href="/courses">
              View the catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
