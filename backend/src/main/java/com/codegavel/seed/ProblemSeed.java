package com.codegavel.seed;

import java.util.List;

public record ProblemSeed(
        String title,
        String slug,
        String description,
        String difficulty,
        String topic,
        String pattern,
        String constraints,
        String inputFormat,
        String outputFormat,
        String hints,
        Long timeLimitMs,
        Long memoryLimitMb,
        List<ExampleSeed> examples,
        List<TestCaseSeed> testCases
) {
    public record ExampleSeed(
            String input,
            String output,
            String explanation,
            Integer order
    ) {}

    public record TestCaseSeed(
            String input,
            String expectedOutput,
            Long timeLimitMs,
            boolean hidden
    ) {}
}
