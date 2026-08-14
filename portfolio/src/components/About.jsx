function About({ description }) {
  return (
    <div className="about-section">
      <div className="section-header">
        <span className="section-tag">About Me</span>
        <h2>Cloud Computing Focus</h2>
      </div>

      <div className="about-card">
        <div className="about-content">
          <p className="about-text">
            {description ||
              "I am a Computer Engineering student specializing in Cloud Computing. My primary passion lies in building scalable cloud infrastructures, architecting distributed systems, extracting insights from data, and bridging the gap between cloud services and real-world web deployment through robust full-stack engineering."}
          </p>

          <div className="about-highlights">
            <div className="highlight-item">
              <span className="highlight-number">Cloud Computing</span>
              <span className="highlight-label">Primary Specialization</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">AWS &amp; DevOps</span>
              <span className="highlight-label">Infrastructure &amp; Pipelines</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">MERN + APIs</span>
              <span className="highlight-label">Deployment &amp; Web Frameworks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;