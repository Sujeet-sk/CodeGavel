package com.codegavel.service;

import com.codegavel.dto.RunExampleResult;
import com.codegavel.dto.RunResponse;
import com.codegavel.entity.Problem;
import com.codegavel.entity.ProblemExample;
import com.codegavel.judge.JavaJudge;
import com.codegavel.judge.JudgeResult;
import com.codegavel.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RunService {

    private final ProblemRepository problemRepository;
    private final JavaJudge javaJudge;

    public RunService(
            ProblemRepository problemRepository,
            JavaJudge javaJudge) {

        this.problemRepository = problemRepository;
        this.javaJudge = javaJudge;
    }

    public RunResponse run(
            Long problemId,
            String sourceCode) {

        Problem problem =
                problemRepository.findById(problemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Problem not found"
                                ));

        List<ProblemExample> examples =
                problem.getExamples()
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        ProblemExample::getExampleOrder
                                )
                        )
                        .limit(3)
                        .toList();

        if (examples.isEmpty()) {
            return new RunResponse(
                    "SYSTEM_ERROR",
                    0,
                    0,
                    null,
                    List.of()
            );
        }

        List<RunExampleResult> results =
                new ArrayList<>();

        int passed = 0;
        long totalTime = 0;

        for (int i = 0; i < examples.size(); i++) {

            ProblemExample example =
                    examples.get(i);

            JudgeResult result =
                    javaJudge.runExample(
                            sourceCode,
                            example.getInputData(),
                            example.getOutputData(),
                            problem.getSlug()
                    );

            if (result.getExecutionTimeMs() != null) {
                totalTime += result.getExecutionTimeMs();
            }

            if ("ACCEPTED".equals(result.getStatus())) {
                passed++;
            }

            results.add(
                    new RunExampleResult(
                            i + 1,
                            result.getStatus(),
                            result.getOutput(),
                            example.getOutputData()
                    )
            );
        }

        String status =
                passed == examples.size()
                        ? "COMPLETED"
                        : "COMPLETED_WITH_FAILURES";

        return new RunResponse(
                status,
                passed,
                examples.size(),
                totalTime,
                results
        );
    }
}
