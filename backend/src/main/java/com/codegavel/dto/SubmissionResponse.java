package com.codegavel.dto;

import com.codegavel.entity.Submission;

import java.time.LocalDateTime;

public record SubmissionResponse(
        Long id,
        Long problemId,
        String status,
        Long executionTimeMs,
        LocalDateTime createdAt,
        LocalDateTime completedAt
) {
    public static SubmissionResponse from(Submission submission) {
        return new SubmissionResponse(
                submission.getId(),
                submission.getProblem().getId(),
                submission.getStatus(),
                submission.getExecutionTimeMs(),
                submission.getCreatedAt(),
                submission.getCompletedAt()
        );
    }
}
