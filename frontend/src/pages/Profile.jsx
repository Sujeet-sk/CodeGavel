import { ArrowLeft, Code2, Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";

function Profile() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Coder";
  const userId = localStorage.getItem("userId") || "—";

  return (
    <div className="cg-shell">
      <aside className="cg-sidebar">
        <BrandMark />

        <div className="cg-nav-label">Workspace</div>

        <nav className="cg-nav">
          <div className="cg-nav-item" onClick={() => navigate("/dashboard")}>
            <Code2 size={17} className="cg-nav-icon" />
            <span>Dashboard</span>
          </div>

          <div className="cg-nav-item" onClick={() => navigate("/problems")}>
            <Code2 size={17} className="cg-nav-icon" />
            <span>Challenges</span>
          </div>

          <div className="cg-nav-item" onClick={() => navigate("/submissions")}>
            <Code2 size={17} className="cg-nav-icon" />
            <span>Submissions</span>
          </div>
        </nav>

        <div className="cg-nav-label" style={{ marginTop: 30 }}>
          Account
        </div>

        <nav className="cg-nav">
          <div className="cg-nav-item active">
            <UserRound size={17} className="cg-nav-icon" />
            <span>Profile</span>
          </div>

          <div className="cg-nav-item" onClick={() => navigate("/settings")}>
            <Code2 size={17} className="cg-nav-icon" />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      <main className="cg-main">
        <header className="cg-topbar">
          <button
            className="cg-icon-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
          </button>
        </header>

        <section className="cg-content">
          <div className="cg-eyebrow">Account</div>

          <h1 className="cg-title">Your profile.</h1>

          <p className="cg-subtitle">
            Your CodeGavel identity and coding arena presence.
          </p>

          <div className="cg-profile-card">
            <div className="cg-profile-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <div className="cg-profile-info">
              <h2>{username}</h2>
              <span>CodeGavel member</span>
            </div>
          </div>

          <div className="cg-stats">
            <div className="cg-stat">
              <div className="cg-stat-label">Username</div>
              <div className="cg-stat-value cg-profile-value">
                {username}
              </div>
              <div className="cg-stat-detail">Your arena identity</div>
            </div>

            <div className="cg-stat">
              <div className="cg-stat-label">User ID</div>
              <div className="cg-stat-value cg-profile-value">
                #{userId}
              </div>
              <div className="cg-stat-detail">Account identifier</div>
            </div>

            <div className="cg-stat">
              <div className="cg-stat-label">Role</div>
              <div className="cg-stat-value cg-profile-value">
                Coder
              </div>
              <div className="cg-stat-detail">CodeGavel member</div>
            </div>
          </div>

          <div className="cg-info-card">
            <div className="cg-info-icon">
              <Mail size={17} />
            </div>

            <div>
              <strong>Profile expansion</strong>
              <span>
                More profile features can be added here later, including
                solved challenges, streaks, rankings, and achievements.
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
