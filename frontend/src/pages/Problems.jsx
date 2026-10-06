import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  History,
  UserRound,
  Settings,
  Search,
  Flame,
  ChevronRight,
  CircleCheck,
} from "lucide-react";
import { getProblems } from "../services/api";
import LogoutButton from "../components/LogoutButton";
import BrandMark from "../components/BrandMark";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .catch(console.error);
  }, []);

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(search.toLowerCase())
  );

  const username = localStorage.getItem("username") || "Coder";

  return (
    <div className="cg-shell">
      <aside className="cg-sidebar">
        <BrandMark />

        <div className="cg-nav-label">Workspace</div>

        <nav className="cg-nav">
          <div className="cg-nav-item active">
            <Code2 size={17} className="cg-nav-icon" />
            <span>Challenges</span>
          </div>

          <div
            className="cg-nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={17} className="cg-nav-icon" />
            <span>Dashboard</span>
          </div>

          <div
            className="cg-nav-item"
            onClick={() => navigate("/submissions")}
          >
            <History size={17} className="cg-nav-icon" />
            <span>Submissions</span>
          </div>
        </nav>

        <div className="cg-nav-label" style={{ marginTop: 30 }}>
          Account
        </div>

        <nav className="cg-nav">
          <div className="cg-nav-item">
            <UserRound size={17} className="cg-nav-icon" />
            <span>Profile</span>
          </div>

          <div className="cg-nav-item">
            <Settings size={17} className="cg-nav-icon" />
            <span>Settings</span>
          </div>
        </nav>

        <div className="cg-sidebar-bottom">
          <LogoutButton />

          <div className="cg-user-mini">
            <div className="cg-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <div className="cg-user-info">
              <div className="cg-user-name">{username}</div>
              <div className="cg-user-status">CodeGavel member</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="cg-main">
        <header className="cg-topbar">
          <div className="cg-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search challenges..."
            />
          </div>

          <div className="cg-top-actions">
            <div className="cg-streak">
              <Flame size={15} />
              <strong>0</strong>
              day streak
            </div>
          </div>
        </header>

        <section className="cg-content">
          <div className="cg-eyebrow">The Arena</div>

          <h1 className="cg-title">Sharpen your edge.</h1>

          <p className="cg-subtitle">
            Solve challenges, test your thinking, and earn your verdict.
          </p>

          <div className="cg-stats">
            <div className="cg-stat">
              <div className="cg-stat-label">Available challenges</div>
              <div className="cg-stat-value">{problems.length}</div>
              <div className="cg-stat-detail">Ready to solve</div>
            </div>

            <div className="cg-stat">
              <div className="cg-stat-label">Solved</div>
              <div className="cg-stat-value">0</div>
              <div className="cg-stat-detail">
                Keep building momentum
              </div>
            </div>

            <div className="cg-stat">
              <div className="cg-stat-label">Current streak</div>
              <div className="cg-stat-value">0</div>
              <div className="cg-stat-detail">
                Start your first challenge
              </div>
            </div>
          </div>

          <div className="cg-section-header">
            <h2 className="cg-section-title">Challenges</h2>

            <span className="cg-section-count">
              {filteredProblems.length} available
            </span>
          </div>

          <div className="cg-problem-list">
            {filteredProblems.map((problem, index) => (
              <div
                key={problem.id}
                className="cg-problem-card"
                onClick={() => navigate(`/problems/${problem.id}`)}
              >
                <div className="cg-problem-number">
                  #{String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <div className="cg-problem-title">
                    {problem.title}
                  </div>

                  <div className="cg-problem-description">
                    {problem.description}
                  </div>
                </div>

                <div className="cg-problem-right">
                  <span
                    className={`cg-difficulty ${
                      problem.difficulty?.toLowerCase()
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                  <CircleCheck size={16} color="#566171" />

                  <ChevronRight
                    className="cg-arrow"
                    size={18}
                  />
                </div>
              </div>
            ))}

            {filteredProblems.length === 0 && (
              <div className="cg-stat">
                <div className="cg-stat-label">
                  No challenges found
                </div>

                <div className="cg-stat-detail">
                  Try a different search term.
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Problems;
