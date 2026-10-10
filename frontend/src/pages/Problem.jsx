import { useEffect, useRef, useState } from "react";
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
import {
  getProblem,
  runCode,
  submitCode,
  getSubmission,
} from "../services/api";

const STARTER_CODE = `class Solution {

    public int rob(int[] nums) {
        // Write your solution here
    }

}`;

function Problem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pollRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(STARTER_CODE);

  // Submit state
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(null);
  const [submitOutput, setSubmitOutput] = useState("");

  // Run state
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);

  useEffect(() => {
    getProblem(id)
      .then((data) => {
        setProblem(data);

        // Keep the current Robbery Planner starter.
        // For other problems, preserve the starter returned by the API if available.
        if (data?.slug === "robbery-planner") {
          setCode(STARTER_CODE);
        } else if (data?.starterCode) {
          setCode(data.starterCode);
        }
      })
      .catch(console.error);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [id]);

  async function handleRun() {
    if (!code.trim() || running) return;

    setRunning(true);
    setRunResult({
      status: "RUNNING",
      passed: 0,
      total: 3,
      executionTimeMs: null,
      results: [],
    });

    try {
      const data = await runCode(Number(id), code);
      setRunResult(data);
    } catch (error) {
      setRunResult({
        status: "SYSTEM_ERROR",
        passed: 0,
        total: 0,
        executionTimeMs: null,
        results: [
          {
            example: 0,
            status: "SYSTEM_ERROR",
            actualOutput: error?.message || "Run request failed.",
            expectedOutput: "",
          },
        ],
      });
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    if (!code.trim() || submitting) return;

    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    setSubmitting(true);
    setResult("PENDING");
    setExecutionTimeMs(null);
    setSubmitOutput("");

    try {
      const submission = await submitCode(Number(id), code);

      setResult(submission.status || "PENDING");
      setExecutionTimeMs(submission.executionTimeMs ?? null);

      if (submission.status !== "PENDING" && submission.status !== "RUNNING") {
        setSubmitting(false);
        return;
      }

      pollRef.current = setInterval(async () => {
        try {
          const updated = await getSubmission(submission.id);

          setResult(updated.status || "PENDING");
          setExecutionTimeMs(updated.executionTimeMs ?? null);

          if (updated.output) {
            setSubmitOutput(updated.output);
          }

          if (
            updated.status !== "PENDING" &&
            updated.status !== "RUNNING"
          ) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setSubmitting(false);
          }
        } catch (error) {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setResult(`ERROR: ${error?.message || "Unable to read submission."}`);
          setExecutionTimeMs(null);
          setSubmitting(false);
        }
      }, 1000);
    } catch (error) {
      setResult(`ERROR: ${error?.message || "Submission failed."}`);
      setExecutionTimeMs(null);
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

  const failedStatuses = [
    "WRONG_ANSWER",
    "COMPILATION_ERROR",
    "RUNTIME_ERROR",
    "TIME_LIMIT_EXCEEDED",
    "SYSTEM_ERROR",
    "SUBMISSION_FAILED",
  ];

  const verdictClass =
    result === "ACCEPTED"
      ? "accepted"
      : failedStatuses.includes(result) || result.startsWith("ERROR:")
        ? "failed"
        : "waiting";

  const isSubmitFinished =
    result &&
    result !== "PENDING" &&
    result !== "RUNNING" &&
    !result.startsWith("ERROR:");

  const runFinished = runResult && runResult.status !== "RUNNING";

  return (
    <div className="cg-workspace">
      <style>{`
        .cg-submit-result-panel {
          margin: 0 22px 22px;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 16px;
          background: linear-gradient(180deg, rgba(22,28,38,.98), rgba(12,17,24,.98));
          box-shadow: 0 18px 50px rgba(0,0,0,.28);
          overflow: hidden;
          animation: cgPanelIn .28s ease-out;
        }

        .cg-run-results-panel {
          margin-top: 14px;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 16px;
          background: linear-gradient(180deg, rgba(22,28,38,.98), rgba(12,17,24,.98));
          box-shadow: 0 18px 50px rgba(0,0,0,.28);
          overflow: hidden;
          animation: cgPanelDown .32s ease-out;
        }

        @keyframes cgPanelIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cgPanelDown {
          from { opacity: 0; transform: translateY(32px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 700px; }
        }

        .cg-live-state {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .cg-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #39d9ff;
          box-shadow: 0 0 0 5px rgba(57,217,255,.10), 0 0 18px rgba(57,217,255,.65);
          animation: cgPulse 1.2s infinite;
          flex: 0 0 auto;
        }

        @keyframes cgPulse {
          50% { opacity: .35; transform: scale(.72); }
        }

        .cg-result-body {
          padding: 16px 18px;
        }

        .cg-result-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-weight: 700;
        }

        .cg-result-subtitle {
          margin-top: 5px;
          color: rgba(255,255,255,.58);
          font-size: 13px;
        }

        .cg-result-grid {
          display: grid;
          gap: 8px;
          margin-top: 14px;
        }

        .cg-result-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,.035);
        }

        .cg-result-row-left {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .cg-result-output {
          margin-top: 12px;
          border-radius: 10px;
          background: #090d12;
          border: 1px solid rgba(255,255,255,.07);
          overflow: hidden;
        }

        .cg-result-output-label {
          padding: 8px 11px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: rgba(255,255,255,.45);
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .cg-result-output pre {
          margin: 0;
          padding: 12px;
          white-space: pre-wrap;
          word-break: break-word;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          color: rgba(255,255,255,.82);
        }

        .cg-result-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 18px;
          border-top: 1px solid rgba(255,255,255,.07);
          color: rgba(255,255,255,.52);
          font-size: 12px;
        }

        .cg-loading-panel {
          padding: 18px;
        }

        @media (max-width: 900px) {
          .cg-submit-result-panel { margin: 0 14px 14px; }
          .cg-result-footer { flex-direction: column; }
        }
      `}</style>

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
            <div className="cg-workspace-title">{problem.title}</div>
          </div>
        </div>

        <div className="cg-workspace-meta">
          <span
            className={`cg-difficulty ${problem.difficulty?.toLowerCase()}`}
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
              <div className="cg-panel-kicker">Problem statement</div>
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
                <div className="cg-examples-heading">Examples</div>

                {problem.examples.map((example, index) => (
                  <div
                    className="cg-example-card"
                    key={example.id || index}
                  >
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
                  Write a Java solution that produces the expected output
                  for every hidden test case.
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

          {/* SUBMIT RESULT: appears on the LEFT/problem side */}
          {result && (
            <div className="cg-submit-result-panel">
              <div className="cg-live-state">
                {submitting ? (
                  <>
                    <span className="cg-live-dot" />
                    <div>
                      <div className="cg-result-title">
                        {result === "PENDING"
                          ? "Submission queued"
                          : "Judging your solution"}
                      </div>
                      <div className="cg-result-subtitle">
                        {result === "PENDING"
                          ? "CodeGavel is preparing your submission for execution."
                          : "Your code is running through the hidden test suite."}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {result === "ACCEPTED" ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                    <div>
                      <div className="cg-result-title">
                        {result}
                      </div>
                      <div className="cg-result-subtitle">
                        {isSubmitFinished
                          ? "The judge has finished evaluating your submission."
                          : "The submission request could not be completed."}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="cg-result-body">
                {submitting && (
                  <div className="cg-loading-panel">
                    <div className="cg-result-title">
                      <Clock3 size={16} />
                      <span>Judging in progress</span>
                    </div>
                    <div className="cg-result-subtitle">
                      Please wait while CodeGavel evaluates the hidden tests.
                    </div>
                  </div>
                )}

                {!submitting && result === "ACCEPTED" && (
                  <div className="cg-result-grid">
                    <div className="cg-result-row">
                      <div className="cg-result-row-left">
                        <CheckCircle2 size={16} />
                        <span>All hidden tests passed</span>
                      </div>
                      <strong>Accepted</strong>
                    </div>
                  </div>
                )}

                {!submitting && verdictClass === "failed" && (
                  <div className="cg-result-grid">
                    <div className="cg-result-row">
                      <div className="cg-result-row-left">
                        <XCircle size={16} />
                        <span>Judge result</span>
                      </div>
                      <strong>{result}</strong>
                    </div>

                    {submitOutput && (
                      <div className="cg-result-output">
                        <div className="cg-result-output-label">
                          Judge output
                        </div>
                        <pre>{submitOutput}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="cg-result-footer">
                <span>
                  {executionTimeMs != null
                    ? `Runtime: ${executionTimeMs} ms`
                    : "Runtime: —"}
                </span>
                <span>
                  {submitting ? "Hidden tests" : "Evaluation complete"}
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="cg-editor-panel">
          <div className="cg-editor-toolbar">
            <div className="cg-editor-tab">
              <Code2 size={15} />
              Solution.java
            </div>

            <div className="cg-editor-actions">
              <button
                className="cg-run-button"
                disabled={running}
                onClick={handleRun}
              >
                <Play size={14} />
                {running ? "Running..." : "Run"}
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

          {/* RUN RESULT: opens directly below the editor */}
          {runResult && (
            <div className="cg-run-results-panel">
              <div className="cg-live-state">
                {running ? (
                  <>
                    <span className="cg-live-dot" />
                    <div>
                      <div className="cg-result-title">
                        Running visible examples
                      </div>
                      <div className="cg-result-subtitle">
                        CodeGavel is compiling and executing your solution.
                      </div>
                    </div>
                  </>
                ) : runResult.status === "COMPLETED" ? (
                  <>
                    <CheckCircle2 size={20} />
                    <div>
                      <div className="cg-result-title">
                        Run completed
                      </div>
                      <div className="cg-result-subtitle">
                        {runResult.passed}/{runResult.total} visible examples passed.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={20} />
                    <div>
                      <div className="cg-result-title">
                        Run finished with an error
                      </div>
                      <div className="cg-result-subtitle">
                        Check the example result below.
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!running && (
                <>
                  <div className="cg-result-body">
                    <div className="cg-result-grid">
                      {runResult.results?.map((example) => (
                        <div
                          className="cg-result-row"
                          key={example.example}
                        >
                          <div className="cg-result-row-left">
                            {example.status === "ACCEPTED" ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <XCircle size={16} />
                            )}

                            <span>
                              Example {example.example}
                            </span>
                          </div>

                          <span
                            className={`cg-verdict-badge ${
                              example.status === "ACCEPTED"
                                ? "accepted"
                                : "failed"
                            }`}
                          >
                            {example.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {runResult.results?.some(
                      (example) => example.status !== "ACCEPTED"
                    ) && (
                      <div className="cg-result-output">
                        <div className="cg-result-output-label">
                          Output
                        </div>

                        <pre>
                          {
                            runResult.results.find(
                              (example) =>
                                example.status !== "ACCEPTED"
                            )?.actualOutput
                          }
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="cg-result-footer">
                    <span>
                      {runResult.passed === runResult.total
                        ? "All visible examples passed."
                        : "One or more visible examples failed."}
                    </span>

                    <span>
                      {runResult.executionTimeMs != null
                        ? `Runtime: ${runResult.executionTimeMs} ms`
                        : "Runtime: —"}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Keep the original verdict area below the editor as a fallback/status summary. */}
          {!runResult && !result && (
            <div className="cg-verdict-panel">
              <div className="cg-verdict-heading">
                <div className="cg-verdict-title">
                  <Terminal size={15} />
                  Verdict
                </div>
              </div>

              <div className="cg-verdict-empty">
                Submit your solution to receive a verdict.
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Problem;
