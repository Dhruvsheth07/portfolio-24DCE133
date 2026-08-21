import { Link } from "react-router-dom";
import About from "../components/About";
import Skills from "../components/Skills";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          <span>Cloud Computing Enthusiast &bull; Computer Engineering</span>
        </div>

        <h1 className="hero-title">
          Hi, I&apos;m <span className="gradient-text">Dhruv Sheth</span>
        </h1>
        <p className="hero-subtitle">
          Aspiring <strong>Cloud Computing Engineer &amp; Cloud Engineer</strong> dedicated to architecting cloud infrastructure, automating CI/CD pipelines, and building full-stack web applications to deploy scalable cloud solutions.
        </p>

        <div className="hero-actions">
          <Link to="/projects" className="btn btn-hero-primary">
            🚀 View GitHub Projects
          </Link>
          <Link to="/contact" className="btn btn-hero-secondary">
            💬 Connect &amp; Collaborate
          </Link>
        </div>

        <div className="hero-stats-row">
          <div className="stat-card">
            <span className="stat-icon">☁️</span>
            <span className="stat-title">Cloud Infrastructure</span>
            <span className="stat-desc">AWS, Azure &amp; GCP</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⚙️</span>
            <span className="stat-title">DevOps &amp; CI/CD</span>
            <span className="stat-desc">Automation &amp; Pipelines</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🌐</span>
            <span className="stat-title">Cloud Native Apps</span>
            <span className="stat-desc">Microservices &amp; Serverless</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Skills Section */}
      <Skills />
    </div>
  );
}

export default Home;