import { useState } from "react";
import { ArrowLeft, ArrowRight, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";

const API_URL = "http://localhost:8080/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      navigate("/login");
    } catch {
      setError(
        "Unable to create the account. The username or email may already exist."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cg-auth-page">
      <div className="cg-auth-glow cg-auth-glow-one" />
      <div className="cg-auth-glow cg-auth-glow-two" />

      <button
        className="cg-auth-back"
        onClick={() => navigate("/login")}
      >
        <ArrowLeft size={16} />
        Back to login
      </button>

      <div className="cg-auth-brand">
        <BrandMark />
      </div>

      <main className="cg-auth-layout cg-register-layout">
        <section className="cg-auth-intro">
          <div className="cg-eyebrow">Start your journey</div>

          <h1>
            Your next
            <br />
            <span>verdict</span>
            <br />
            starts here.
          </h1>

          <p>
            Create your CodeGavel account and start solving challenges in a
            focused coding arena.
          </p>
        </section>

        <section className="cg-auth-card">
          <div className="cg-auth-card-kicker">New contender</div>

          <h2>Create your account.</h2>

          <p className="cg-auth-card-subtitle">
            Set up your profile and enter the arena.
          </p>

          <form onSubmit={handleRegister} className="cg-auth-form">
            <label>
              Username
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error && <div className="cg-auth-error">{error}</div>}

            <button
              className="cg-auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create account"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="cg-auth-switch">
            Already have an account?
            <button onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>
        </section>
      </main>

      <div className="cg-auth-footer">
        <Code2 size={13} />
        CodeGavel · Build your edge.
      </div>
    </div>
  );
}

export default Register;
