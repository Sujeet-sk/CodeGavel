package com.codegavel.dto;

public class RunExampleResult {

    private final int example;
    private final String status;
    private final String actualOutput;
    private final String expectedOutput;

    public RunExampleResult(
            int example,
            String status,
            String actualOutput,
            String expectedOutput) {

        this.example = example;
        this.status = status;
        this.actualOutput = actualOutput;
        this.expectedOutput = expectedOutput;
    }

    public int getExample() {
        return example;
    }

    public String getStatus() {
        return status;
    }

    public String getActualOutput() {
        return actualOutput;
    }

    public String getExpectedOutput() {
        return expectedOutput;
    }
}
