package com.codegavel.judge;

import com.codegavel.entity.Submission;
import com.codegavel.entity.TestCase;
import org.springframework.stereotype.Service;

@Service
public class JudgeService {

    private final JavaJudge javaJudge;

    public JudgeService(JavaJudge javaJudge) {
        this.javaJudge = javaJudge;
    }

    public JudgeResult judgeSubmission(Submission submission) {

        if (submission.getProblem().getTestCases().isEmpty()) {

            return new JudgeResult(
                    "SYSTEM_ERROR",
                    null,
                    "No test cases available"
            );
        }

        long totalExecutionTime = 0;

        String problemSlug =
                submission.getProblem().getSlug();

        for (TestCase testCase :
                submission.getProblem().getTestCases()) {

            JudgeResult result = javaJudge.judge(
                    submission.getSourceCode(),
                    testCase.getInputData(),
                    testCase.getExpectedOutput(),
                    problemSlug
            );

            if (result.getExecutionTimeMs() != null) {
                totalExecutionTime +=
                        result.getExecutionTimeMs();
            }

            if (!result.getStatus().equals("ACCEPTED")) {

                return new JudgeResult(
                        result.getStatus(),
                        totalExecutionTime,
                        result.getOutput()
                );
            }
        }

        return new JudgeResult(
                "ACCEPTED",
                totalExecutionTime,
                "All test cases passed"
        );
    }
}
