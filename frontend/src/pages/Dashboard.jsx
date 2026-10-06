import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Flame,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import BrandMark from "../components/BrandMark";
import { getProblems, getUserSubmissions } from "../services/api";

function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Coder";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getProblems().then(setProblems).catch(console.error);

    if (userId) {
      getUserSubmissions(userId)
        .then(setSubmissions)
        .catch(console.error);
    }
  }, [userId]);

  const accepted = submissions.filter(
    (submission) => submission.status === "ACCEPTED"
  ).length;

  return (
    <div className="cg-shell">
      <aside className="cg-sidebar">
        <BrandMark />

        <div className="cg-nav-label">Workspace</div>

        <nav className="cg-nav">
          <div
            className="cg-nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            <Target size={17} className="cg-nav-icon" />
            <span>Dashboard</span>
          </div>

          <div
            className="cg-nav-item"
            onClick={() => navigate("/problems")}
          >
            <Code2 size={17} className="cg-nav-icon" />
            <span>Challenges</span>
          </div>

          <div
            className="cg-nav-item"
            onClick={() => navigate("/submissions")}
          >
            <CheckCircle2 size={17} className="cg-nav-icon" />
            <span>Submissions</span>
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
          <div>
            <div className="cg-workspace-label">Overview</div>
            <div className="cg-simple-title">Your workspace</div>
          </div>

          <div className="cg-streak">
            <Flame size={15} />
            <strong>0</strong>
            day streak
          </div>
        </header>

        <section className="cg-content">
          <div className="cg-eyebrow">Welcome back</div>

          <h1 className="cg-title">Keep building, {username}.</h1>

          <p className="cg-subtitle">
            Every problem you solve makes the next one easier.
          </p>

          <div className="cg-dashboard-hero">
            <div>
              <div className="cg-dashboard-kicker">
                Your next challenge
              </div>

              <h2>Ready to enter the arena?</h2>

              <p>
                Pick a challenge, write your solution, and let CodeGavel
                judge the result.
              </p>
            </div>

            <button
              className="cg-dashboard-action"
              onClick={() => navigate("/problems")}
            >
              Browse challenges
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="cg-stats">
            <div className="cg-stat">
              <div className="cg-stat-label">Challenges</div>
              <div className="cg-stat-value">{problems.length}</div>
              <div className="cg-stat-detail">Available now</div>
            </div>

            <div className="cg-stat">
              <div className="cg-stat-label">Accepted</div>
              <div className="cg-stat-value">{accepted}</div>
              <div className="cg-stat-detail">
                Successful submissions
              </div>
            </div>

            <div className="cg-stat">
              <div className="cg-stat-label">Attempts</div>
              <div className="cg-stat-value">
                {submissions.length}
              </div>
              <div className="cg-stat-detail">
                Total submissions
              </div>
            </div>
          </div>

          <div className="cg-section-header">
            <h2 className="cg-section-title">Recent activity</h2>

            <button
              className="cg-text-button"
              onClick={() => navigate("/submissions")}
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="cg-empty-state">
              <div className="cg-empty-icon">
                <Code2 size={22} />
              </div>

              <h2>Your coding journey starts here.</h2>

              <p>
                Submit your first solution to create some activity.
              </p>
            </div>
          ) : (
            <div className="cg-submission-list">
              {submissions.slice(0, 5).map((submission) => (
                <div
                  className="cg-submission-row"
                  key={submission.id}
                >
                  <div className="cg-submission-id">
                    #{submission.id}
                  </div>

                  <div className="cg-submission-problem">
                    <strong>
                      {submission.problem?.title || "Challenge"}
                    </strong>

                    <span>
                      {submission.createdAt
                        ? new Date(
                            submission.createdAt
                          ).toLocaleString()
                        : "Recently"}
                    </span>
                  </div>

                  <span
                    className={`cg-verdict-badge ${
                      submission.status === "ACCEPTED"
                        ? "accepted"
                        : "failed"
                    }`}
                  >
                    {submission.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
