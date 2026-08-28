import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const GITHUB_USERNAME = "Dhruvsheth07";

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`
      );

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setRepos(data);
    } catch (err) {
      setError(err.message || "Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const filteredRepos = repos.filter((repo) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = repo.name?.toLowerCase().includes(term);
    const descMatch = repo.description?.toLowerCase().includes(term);
    return nameMatch || descMatch;
  });

  return (
    <div className="projects-page-container">
      <section className="projects-section">
        <div className="section-header">
          <span className="section-tag">REST API Integration &bull; Practical 3</span>
          <h2>Featured GitHub Projects</h2>
          <p className="section-desc">
            Dynamically fetched from the GitHub REST API for{" "}
            <strong>@{GITHUB_USERNAME}</strong>.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="projects-toolbar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Filter repositories by name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="projects-search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                title="Clear filter"
              >
                ✕
              </button>
            )}
          </div>
          <span className="repo-count-badge">
            {filteredRepos.length} {filteredRepos.length === 1 ? "Repository" : "Repositories"}
          </span>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State with Retry Button */}
        {error && !loading && (
          <div className="error-message">
            <p>
              <strong>API Error:</strong> {error}
            </p>
            <p className="error-hint">
              Check your internet connection or GitHub rate limit.
            </p>
            <button onClick={fetchRepositories} className="btn-retry">
              🔄 Retry Fetch
            </button>
          </div>
        )}

        {/* Success / Repositories Grid */}
        {!loading && !error && (
          <>
            {filteredRepos.length === 0 ? (
              <div className="empty-state">
                <p>No repositories match &ldquo;{searchTerm}&rdquo;.</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn-secondary"
                  style={{ marginTop: "12px" }}
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="repos-grid">
                {filteredRepos.map((repo) => (
                  <article key={repo.id} className="repo-card">
                    <div className="repo-card-header">
                      <span className="repo-folder-icon">📁</span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="repo-title-link"
                      >
                        {repo.name} ↗
                      </a>
                    </div>

                    <p className="repo-desc">
                      {repo.description || "No description provided for this repository."}
                    </p>

                    <div className="repo-footer">
                      <div className="repo-badges">
                        {repo.language && (
                          <span className="repo-lang-badge">
                            <span className="lang-dot"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="repo-stat-badge" title="Stars">
                          ⭐ {repo.stargazers_count || 0}
                        </span>
                        <span className="repo-stat-badge" title="Forks">
                          🍴 {repo.forks_count || 0}
                        </span>
                      </div>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-view-repo"
                      >
                        Code &rarr;
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Projects;