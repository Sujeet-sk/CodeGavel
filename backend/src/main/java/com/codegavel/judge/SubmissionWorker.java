package com.codegavel.judge;

import com.codegavel.entity.Submission;
import com.codegavel.repository.SubmissionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class SubmissionWorker {

    private final SubmissionQueue submissionQueue;
    private final SubmissionRepository submissionRepository;
    private final JudgeService judgeService;

    public SubmissionWorker(
            SubmissionQueue submissionQueue,
            SubmissionRepository submissionRepository,
            JudgeService judgeService) {
        this.submissionQueue = submissionQueue;
        this.submissionRepository = submissionRepository;
        this.judgeService = judgeService;
    }

    @Scheduled(fixedDelay = 500)
    @Transactional
    public void processQueue() {

        String submissionId = submissionQueue.dequeue();

        if (submissionId == null) {
            return;
        }

        Submission submission;

        try {
            submission = submissionRepository
                    .findById(Long.parseLong(submissionId))
                    .orElse(null);
        } catch (NumberFormatException e) {
            return;
        }

        if (submission == null) {
            return;
        }

        try {
            submission.setStatus("RUNNING");
            submissionRepository.save(submission);

            JudgeResult result =
                    judgeService.judgeSubmission(submission);

            submission.setStatus(result.getStatus());
            submission.setExecutionTimeMs(
                    result.getExecutionTimeMs()
            );
            submission.setCompletedAt(
                    LocalDateTime.now()
            );

            submissionRepository.save(submission);

        } catch (Exception e) {

            submission.setStatus("SYSTEM_ERROR");
            submission.setCompletedAt(
                    LocalDateTime.now()
            );

            submissionRepository.save(submission);
        }
    }
}
