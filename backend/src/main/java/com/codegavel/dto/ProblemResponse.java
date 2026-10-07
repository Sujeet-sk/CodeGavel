package com.codegavel.dto;

import com.codegavel.entity.Problem;
import com.codegavel.entity.ProblemExample;

import java.time.LocalDateTime;
import java.util.List;

public class ProblemResponse {

    private Long id;
    private String title;
    private String slug;
    private String description;
    private String difficulty;
    private String topic;
    private String pattern;
    private String constraints;
    private String inputFormat;
    private String outputFormat;
    private String hints;
    private Long timeLimitMs;
    private Long memoryLimitMb;
    private LocalDateTime createdAt;
    private List<ExampleResponse> examples;

    public ProblemResponse(Problem problem) {
        this.id = problem.getId();
        this.title = problem.getTitle();
        this.slug = problem.getSlug();
        this.description = problem.getDescription();
        this.difficulty = problem.getDifficulty();
        this.topic = problem.getTopic();
        this.pattern = problem.getPattern();
        this.constraints = problem.getConstraints();
        this.inputFormat = problem.getInputFormat();
        this.outputFormat = problem.getOutputFormat();
        this.hints = problem.getHints();
        this.timeLimitMs = problem.getTimeLimitMs();
        this.memoryLimitMb = problem.getMemoryLimitMb();
        this.createdAt = problem.getCreatedAt();

        this.examples = problem.getExamples()
                .stream()
                .map(ExampleResponse::new)
                .toList();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSlug() { return slug; }
    public String getDescription() { return description; }
    public String getDifficulty() { return difficulty; }
    public String getTopic() { return topic; }
    public String getPattern() { return pattern; }
    public String getConstraints() { return constraints; }
    public String getInputFormat() { return inputFormat; }
    public String getOutputFormat() { return outputFormat; }
    public String getHints() { return hints; }
    public Long getTimeLimitMs() { return timeLimitMs; }
    public Long getMemoryLimitMb() { return memoryLimitMb; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<ExampleResponse> getExamples() { return examples; }

    public static class ExampleResponse {

        private Long id;
        private String input;
        private String output;
        private String explanation;
        private Integer exampleOrder;

        public ExampleResponse(ProblemExample example) {
            this.id = example.getId();
            this.input = example.getInputData();
            this.output = example.getOutputData();
            this.explanation = example.getExplanation();
            this.exampleOrder = example.getExampleOrder();
        }

        public Long getId() { return id; }
        public String getInput() { return input; }
        public String getOutput() { return output; }
        public String getExplanation() { return explanation; }
        public Integer getExampleOrder() { return exampleOrder; }
    }
}
