import { ArrowLeft, Bell, Code2, Moon, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";

function Settings() {
  const navigate = useNavigate();

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
          <div className="cg-nav-item" onClick={() => navigate("/profile")}>
            <Code2 size={17} className="cg-nav-icon" />
            <span>Profile</span>
          </div>

          <div className="cg-nav-item active">
            <SettingsIcon size={17} className="cg-nav-icon" />
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
          <div className="cg-eyebrow">Preferences</div>

          <h1 className="cg-title">Settings.</h1>

          <p className="cg-subtitle">
            Control how your CodeGavel workspace behaves.
          </p>

          <div className="cg-settings-list">
            <div className="cg-setting-row">
              <div className="cg-setting-icon">
                <Moon size={18} />
              </div>

              <div className="cg-setting-content">
                <strong>Appearance</strong>
                <span>CodeGavel currently uses its dark arena theme.</span>
              </div>

              <span className="cg-setting-value">Dark</span>
            </div>

            <div className="cg-setting-row">
              <div className="cg-setting-icon">
                <Bell size={18} />
              </div>

              <div className="cg-setting-content">
                <strong>Notifications</strong>
                <span>Submission and verdict notifications.</span>
              </div>

              <span className="cg-setting-value">Coming soon</span>
            </div>

            <div className="cg-setting-row">
              <div className="cg-setting-icon">
                <Code2 size={18} />
              </div>

              <div className="cg-setting-content">
                <strong>Default language</strong>
                <span>The language used by the coding workspace.</span>
              </div>

              <span className="cg-setting-value">Java 21</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Settings;
