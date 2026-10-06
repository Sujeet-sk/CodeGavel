import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Play,
  Send,
  Terminal,
  XCircle,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { getProblem, submitCode, getSubmission } from "../services/api";

const STARTER_CODE = `public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`;

function Problem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(STARTER_CODE);
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProblem(id)
      .then(setProblem)
      .catch(console.error);
  }, [id]);

  async function handleSubmit() {
    if (!code.trim() || submitting) return;

    setSubmitting(true);
    setResult("PENDING");

    try {
      const submission = await submitCode(Number(id), code);
      setResult(submission.status);

      const interval = setInterval(async () => {
        try {
          const updated = await getSubmission(submission.id);
          setResult(updated.status);

          if (
            updated.status !== "PENDING" &&
            updated.status !== "RUNNING"
          ) {
            clearInterval(interval);
            setSubmitting(false);
          }
        } catch {
          clearInterval(interval);
          setResult("SUBMISSION_FAILED");
          setSubmitting(false);
        }
      }, 1000);
    } catch {
      setResult("SUBMISSION_FAILED");
      setSubmitting(false);
    }
  }

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    }

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  });

  if (!problem) {
    return (
      <div className="cg-loading">
        <div className="cg-loading-dot" />
        Loading challenge...
      </div>
    );
  }

  const verdictClass =
    result === "ACCEPTED"
      ? "accepted"
      : [
          "WRONG_ANSWER",
          "COMPILATION_ERROR",
          "RUNTIME_ERROR",
          "TIME_LIMIT_EXCEEDED",
          "SUBMISSION_FAILED",
        ].includes(result)
      ? "failed"
      : "waiting";

  return (
    <div className="cg-workspace">
      <header className="cg-workspace-topbar">
        <div className="cg-workspace-brand">
          <button
            className="cg-icon-button"
            onClick={() => navigate("/problems")}
            title="Back to challenges"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="cg-workspace-divider" />

          <div>
            <div className="cg-workspace-label">Challenge</div>
            <div className="cg-workspace-title">
              {problem.title}
            </div>
          </div>
        </div>

        <div className="cg-workspace-meta">
          <span
            className={`cg-difficulty ${
              problem.difficulty?.toLowerCase()
            }`}
          >
            {problem.difficulty}
          </span>

          <span className="cg-language">
            <Code2 size={14} />
            Java 21
            <ChevronDown size={13} />
          </span>
        </div>
      </header>

      <main className="cg-workspace-grid">
        <section className="cg-problem-panel">
          <div className="cg-panel-heading">
            <div>
              <div className="cg-panel-kicker">
                Problem statement
              </div>

              <h1>{problem.title}</h1>
            </div>
          </div>

          <div className="cg-problem-body">
            <p>{problem.description}</p>

            <div className="cg-info-card">
              <div className="cg-info-icon">
                <Terminal size={17} />
              </div>

              <div>
                <strong>Your mission</strong>

                <span>
                  Write a Java program that produces the expected
                  output for every hidden test case.
                </span>
              </div>
            </div>

            <div className="cg-example-block">
              <div className="cg-example-title">
                Execution environment
              </div>

              <div className="cg-example-row">
                <span>Language</span>
                <strong>Java 21</strong>
              </div>

              <div className="cg-example-row">
                <span>Runtime</span>
                <strong>Docker sandbox</strong>
              </div>

              <div className="cg-example-row">
                <span>Evaluation</span>
                <strong>Hidden test cases</strong>
              </div>
            </div>

            <div className="cg-shortcut">
              <span>Quick submit</span>
              <kbd>Ctrl</kbd>
              <span>+</span>
              <kbd>Enter</kbd>
            </div>
          </div>
        </section>

        <section className="cg-editor-panel">
          <div className="cg-editor-toolbar">
            <div className="cg-editor-tab">
              <Code2 size={15} />
              Main.java
            </div>

            <div className="cg-editor-actions">
              <button
                className="cg-run-button"
                disabled={submitting}
                onClick={handleSubmit}
              >
                <Play size={14} />
                Run
              </button>

              <button
                className="cg-submit-button"
                disabled={submitting || !code.trim()}
                onClick={handleSubmit}
              >
                <Send size={14} />
                {submitting ? "Judging..." : "Submit"}
              </button>
            </div>
          </div>

          <div className="cg-editor-shell">
            <Editor
              height="100%"
              language="java"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                automaticLayout: true,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                tabSize: 4,
                wordWrap: "on",
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "line",
                bracketPairColorization: {
                  enabled: true,
                },
              }}
            />
          </div>

          <div className="cg-verdict-panel">
            <div className="cg-verdict-heading">
              <div className="cg-verdict-title">
                <Terminal size={15} />
                Verdict
              </div>

              {result && (
                <span
                  className={`cg-verdict-badge ${verdictClass}`}
                >
                  {result === "ACCEPTED" && (
                    <CheckCircle2 size={14} />
                  )}

                  {verdictClass === "failed" && (
                    <XCircle size={14} />
                  )}

                  {(result === "PENDING" ||
                    result === "RUNNING") && (
                    <Clock3 size={14} />
                  )}

                  {result}
                </span>
              )}
            </div>

            <div className="cg-verdict-content">
              {!result && (
                <>
                  <div className="cg-verdict-empty-icon">
                    <Terminal size={20} />
                  </div>

                  <span>
                    Submit your solution to receive a verdict.
                  </span>
                </>
              )}

              {result === "PENDING" && (
                <span>
                  Your submission is waiting in the judge queue...
                </span>
              )}

              {result === "RUNNING" && (
                <span>
                  Your code is being executed in the sandbox...
                </span>
              )}

              {result === "ACCEPTED" && (
                <span>
                  All test cases passed. Your solution has been
                  accepted.
                </span>
              )}

              {result === "WRONG_ANSWER" && (
                <span>
                  Your program ran successfully, but the output did
                  not match the expected result.
                </span>
              )}

              {result === "COMPILATION_ERROR" && (
                <span>
                  Your Java source could not be compiled. Check the
                  syntax and try again.
                </span>
              )}

              {result === "RUNTIME_ERROR" && (
                <span>
                  Your program encountered an error while running.
                </span>
              )}

              {result === "TIME_LIMIT_EXCEEDED" && (
                <span>
                  Your program exceeded the allowed execution time.
                </span>
              )}

              {result === "SUBMISSION_FAILED" && (
                <span>
                  Something went wrong while submitting. Please try
                  again.
                </span>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Problem;
