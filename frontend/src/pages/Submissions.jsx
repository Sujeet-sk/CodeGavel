import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Code2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserSubmissions } from "../services/api";
import BrandMark from "../components/BrandMark";
import LogoutButton from "../components/LogoutButton";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Coder";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    getUserSubmissions(userId)
      .then(setSubmissions)
      .catch(console.error);
  }, [userId]);

  function verdictIcon(status) {
    if (status === "ACCEPTED") {
      return <CheckCircle2 size={15} />;
    }

    if (
      status === "WRONG_ANSWER" ||
      status === "COMPILATION_ERROR" ||
      status === "RUNTIME_ERROR" ||
      status === "TIME_LIMIT_EXCEEDED"
    ) {
      return <XCircle size={15} />;
    }

    return <Clock3 size={15} />;
  }

  function verdictClass(status) {
    if (status === "ACCEPTED") return "accepted";

    if (
      status === "WRONG_ANSWER" ||
      status === "COMPILATION_ERROR" ||
      status === "RUNTIME_ERROR" ||
      status === "TIME_LIMIT_EXCEEDED"
    ) {
      return "failed";
    }

    return "waiting";
  }

  return (
    <div className="cg-shell">
      <aside className="cg-sidebar">
        <BrandMark />

        <div className="cg-nav-label">Workspace</div>

        <nav className="cg-nav">
          <div
            className="cg-nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <Code2 size={17} className="cg-nav-icon" />
            <span>Dashboard</span>
          </div>

          <div
            className="cg-nav-item"
            onClick={() => navigate("/problems")}
          >
            <Code2 size={17} className="cg-nav-icon" />
            <span>Challenges</span>
          </div>

          <div className="cg-nav-item active">
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
            <div className="cg-workspace-label">Activity</div>
            <div className="cg-simple-title">Submission history</div>
          </div>

          <button
            className="cg-icon-button"
            onClick={() => navigate("/problems")}
            title="Back to challenges"
          >
            <ArrowLeft size={18} />
          </button>
        </header>

        <section className="cg-content">
          <div className="cg-eyebrow">Your record</div>

          <h1 className="cg-title">Every verdict counts.</h1>

          <p className="cg-subtitle">
            Track your attempts, execution times, and results in one place.
          </p>

          {submissions.length === 0 ? (
            <div className="cg-empty-state">
              <div className="cg-empty-icon">
                <Clock3 size={22} />
              </div>

              <h2>No submissions yet.</h2>

              <p>
                Solve your first challenge and your submissions will appear
                here.
              </p>

              <button
                className="cg-submit-button"
                onClick={() => navigate("/problems")}
              >
                Browse challenges
              </button>
            </div>
          ) : (
            <div className="cg-submission-list">
              {submissions.map((submission) => (
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
                    className={`cg-verdict-badge ${verdictClass(
                      submission.status
                    )}`}
                  >
                    {verdictIcon(submission.status)}
                    {submission.status}
                  </span>

                  <div className="cg-execution-time">
                    {submission.executionTimeMs != null
                      ? `${submission.executionTimeMs} ms`
                      : "—"}
                  </div>

                  <ChevronRight size={16} className="cg-arrow" />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Submissions;
