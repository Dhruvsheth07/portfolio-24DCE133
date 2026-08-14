function Skills({ skillCategories }) {
  const defaultCategories = [
    {
      category: "Cloud Platforms & Infrastructure",
      icon: "☁️",
      skills: [
        { name: "AWS", level: "Advanced" },
        { name: "Microsoft Azure", level: "Intermediate" },
        { name: "Google Cloud Platform", level: "Intermediate" },
        { name: "Terraform", level: "Advanced" },
        { name: "CloudFormation", level: "Intermediate" },
      ],
    },
    {
      category: "DevOps & CI/CD",
      icon: "⚙️",
      skills: [
        { name: "GitHub Actions", level: "Advanced" },
        { name: "Jenkins", level: "Intermediate" },
        { name: "Docker", level: "Advanced" },
        { name: "Kubernetes", level: "Intermediate" },
        { name: "Linux Administration", level: "Advanced" },
      ],
    },
    {
      category: "Cloud Deployment & Full-Stack",
      icon: "⚡",
      skills: [
        { name: "Serverless (AWS Lambda)", level: "Advanced" },
        { name: "Node.js & Express API", level: "Advanced" },
        { name: "React.js UI", level: "Advanced" },
        { name: "MongoDB / NoSQL", level: "Advanced" },
        { name: "Cloud Services & Integration", level: "Intermediate" },
      ],
    },
    {
      category: "Tools & Environments",
      icon: "🛠️",
      skills: [
        { name: "Git & GitHub", level: "Advanced" },
        { name: "Bash & Shell Scripting", level: "Advanced" },
        { name: "Monitoring & Logging", level: "Intermediate" },
        { name: "VS Code & Thunder Client", level: "Advanced" },
      ],
    },
  ];

  const categoriesToRender = skillCategories || defaultCategories;

  return (
    <div className="skills-section">
      <div className="section-header">
        <span className="section-tag">Core Capabilities</span>
        <h2>Cloud Computing &amp; Technical Skills</h2>
        <p className="section-desc">Specialized in developing scalable cloud architectures, data-driven pipelines, and integrating them into full-stack web applications.</p>
      </div>

      <div className="skills-grid">
        {categoriesToRender.map((cat, idx) => (
          <div key={idx} className="skill-category-card">
            <div className="skill-category-header">
              <span className="skill-category-icon">{cat.icon}</span>
              <h3>{cat.category}</h3>
            </div>
            <div className="skill-chips">
              {cat.skills.map((skill, sIdx) => (
                <div key={sIdx} className="skill-pill">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;