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
  Lightbulb,
  Cpu,
  Database,
  Tag,
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

            {problem.topic && (
              <div className="cg-problem-tags">
                <span className="cg-problem-tag">
                  <Tag size={13} />
                  {problem.topic}
                </span>

                {problem.pattern && (
                  <span className="cg-problem-tag">
                    <Cpu size={13} />
                    {problem.pattern}
                  </span>
                )}
              </div>
            )}

            {problem.constraints && (
              <div className="cg-detail-section">
                <div className="cg-detail-heading">
                  <span>Constraints</span>
                </div>
                <div className="cg-detail-content">
                  {problem.constraints}
                </div>
              </div>
            )}

            {problem.inputFormat && (
              <div className="cg-detail-section">
                <div className="cg-detail-heading">
                  <span>Input Format</span>
                </div>
                <div className="cg-detail-content">
                  {problem.inputFormat}
                </div>
              </div>
            )}

            {problem.outputFormat && (
              <div className="cg-detail-section">
                <div className="cg-detail-heading">
                  <span>Output Format</span>
                </div>
                <div className="cg-detail-content">
                  {problem.outputFormat}
                </div>
              </div>
            )}

            {problem.examples?.length > 0 && (
              <div className="cg-examples-section">
                <div className="cg-examples-heading">
                  Examples
                </div>

                {problem.examples.map((example, index) => (
                  <div className="cg-example-card" key={example.id || index}>
                    <div className="cg-example-card-title">
                      Example {index + 1}
                    </div>

                    <div className="cg-example-grid">
                      <div>
                        <span className="cg-example-label">Input</span>
                        <pre>{example.input}</pre>
                      </div>

                      <div>
                        <span className="cg-example-label">Output</span>
                        <pre>{example.output}</pre>
                      </div>
                    </div>

                    {example.explanation && (
                      <div className="cg-example-explanation">
                        <strong>Explanation:</strong>{" "}
                        {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

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

              {problem.timeLimitMs && (
                <div className="cg-example-row">
                  <span>
                    <Clock3 size={14} />
                    Time limit
                  </span>
                  <strong>{problem.timeLimitMs} ms</strong>
                </div>
              )}

              {problem.memoryLimitMb && (
                <div className="cg-example-row">
                  <span>
                    <Database size={14} />
                    Memory limit
                  </span>
                  <strong>{problem.memoryLimitMb} MB</strong>
                </div>
              )}
            </div>

            {problem.hints && (
              <div className="cg-hint-card">
                <div className="cg-hint-icon">
                  <Lightbulb size={17} />
                </div>

                <div>
                  <strong>Hint</strong>
                  <span>{problem.hints}</span>
                </div>
              </div>
            )}

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

                  {result}
                </span>
              )}
            </div>

            {!result && (
              <div className="cg-verdict-empty">
                Submit your solution to receive a verdict.
              </div>
            )}

            {result === "PENDING" && (
              <div className="cg-verdict-empty">
                Your submission is waiting in the judge queue...
              </div>
            )}

            {result === "RUNNING" && (
              <div className="cg-verdict-empty">
                CodeGavel is executing your solution...
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Problem;
