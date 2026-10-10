package com.codegavel.dto;

import java.util.List;

public class RunResponse {

    private final String status;
    private final int passed;
    private final int total;
    private final Long executionTimeMs;
    private final List<RunExampleResult> results;

    public RunResponse(
            String status,
            int passed,
            int total,
            Long executionTimeMs,
            List<RunExampleResult> results) {

        this.status = status;
        this.passed = passed;
        this.total = total;
        this.executionTimeMs = executionTimeMs;
        this.results = results;
    }

    public String getStatus() {
        return status;
    }

    public int getPassed() {
        return passed;
    }

    public int getTotal() {
        return total;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public List<RunExampleResult> getResults() {
        return results;
    }
}
