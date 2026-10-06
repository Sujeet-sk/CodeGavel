import { useState } from "react";
import { ArrowRight, Code2, ShieldCheck, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import BrandMark from "../components/BrandMark";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cg-auth-page">
      <div className="cg-auth-glow cg-auth-glow-one" />
      <div className="cg-auth-glow cg-auth-glow-two" />

      <div className="cg-auth-brand">
        <BrandMark />
      </div>

      <main className="cg-auth-layout">
        <section className="cg-auth-intro">
          <div className="cg-eyebrow">The coding arena</div>

          <h1>
            Think.
            <br />
            <span>Code.</span>
            <br />
            Get your verdict.
          </h1>

          <p>
            A focused environment for solving programming challenges and
            putting your solutions to the test.
          </p>

          <div className="cg-auth-features">
            <div>
              <Code2 size={17} />
              <span>Java 21 execution</span>
            </div>

            <div>
              <ShieldCheck size={17} />
              <span>Sandboxed judging</span>
            </div>

            <div>
              <Terminal size={17} />
              <span>Instant verdicts</span>
            </div>
          </div>
        </section>

        <section className="cg-auth-card">
          <div className="cg-auth-card-kicker">Welcome back</div>

          <h2>Enter the arena.</h2>

          <p className="cg-auth-card-subtitle">
            Sign in to continue solving challenges.
          </p>

          <form onSubmit={handleLogin} className="cg-auth-form">
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
                placeholder="Your password"
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
              {loading ? "Entering..." : "Enter CodeGavel"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="cg-auth-switch">
            Don't have an account?
            <button onClick={() => navigate("/register")}>
              Create one
            </button>
          </div>
        </section>
      </main>

      <div className="cg-auth-footer">
        CodeGavel · Build your edge.
      </div>
    </div>
  );
}

export default Login;
