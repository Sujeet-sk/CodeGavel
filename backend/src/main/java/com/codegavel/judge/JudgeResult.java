package com.codegavel.judge;

public class JudgeResult {

    private final String status;
    private final Long executionTimeMs;
    private final String output;

    public JudgeResult(String status, Long executionTimeMs, String output) {
        this.status = status;
        this.executionTimeMs = executionTimeMs;
        this.output = output;
    }

    public String getStatus() {
        return status;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public String getOutput() {
        return output;
    }
}
