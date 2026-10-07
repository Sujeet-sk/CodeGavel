package com.codegavel.seed;

import com.codegavel.entity.Problem;
import com.codegavel.entity.ProblemExample;
import com.codegavel.entity.TestCase;
import com.codegavel.repository.ProblemExampleRepository;
import com.codegavel.repository.ProblemRepository;
import com.codegavel.repository.TestCaseRepository;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;

@Component
public class ProblemSeedImporter implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final ProblemExampleRepository exampleRepository;
    private final ObjectMapper objectMapper;

    @Value("${codegavel.seed.enabled:false}")
    private boolean seedEnabled;

    public ProblemSeedImporter(
            ProblemRepository problemRepository,
            TestCaseRepository testCaseRepository,
            ProblemExampleRepository exampleRepository,
            ObjectMapper objectMapper) {
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.exampleRepository = exampleRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (!seedEnabled) {
            return;
        }

        Resource[] resources =
                new PathMatchingResourcePatternResolver()
                        .getResources("classpath:/problems/**/*.json");

        int imported = 0;

        for (Resource resource : resources) {
            try (InputStream input = resource.getInputStream()) {
                ProblemSeed seed = objectMapper.readValue(input, ProblemSeed.class);
                importProblem(seed);
                imported++;
                System.out.println("CodeGavel seed imported: " + seed.slug());
            }
        }

        System.out.println("CodeGavel seed complete. Problems processed: " + imported);
    }

    @Transactional
    protected void importProblem(ProblemSeed seed) {

        Problem problem = problemRepository
                .findBySlug(seed.slug())
                .orElseGet(Problem::new);

        problem.setTitle(seed.title());
        problem.setSlug(seed.slug());
        problem.setDescription(seed.description());
        problem.setDifficulty(seed.difficulty());
        problem.setTopic(seed.topic());
        problem.setPattern(seed.pattern());
        problem.setConstraints(seed.constraints());
        problem.setInputFormat(seed.inputFormat());
        problem.setOutputFormat(seed.outputFormat());
        problem.setHints(seed.hints());
        problem.setTimeLimitMs(seed.timeLimitMs());
        problem.setMemoryLimitMb(seed.memoryLimitMb());

        problem = problemRepository.save(problem);

        testCaseRepository.deleteByProblemId(problem.getId());
        exampleRepository.deleteByProblemId(problem.getId());

        if (seed.examples() != null) {
            for (ProblemSeed.ExampleSeed data : seed.examples()) {
                ProblemExample example = new ProblemExample();
                example.setProblem(problem);
                example.setInputData(data.input());
                example.setOutputData(data.output());
                example.setExplanation(data.explanation());
                example.setExampleOrder(data.order());
                exampleRepository.save(example);
            }
        }

        if (seed.testCases() != null) {
            for (ProblemSeed.TestCaseSeed data : seed.testCases()) {
                TestCase testCase = new TestCase();
                testCase.setProblem(problem);
                testCase.setInputData(data.input());
                testCase.setExpectedOutput(data.expectedOutput());
                testCase.setTimeLimitMs(
                        data.timeLimitMs() == null ? seed.timeLimitMs() : data.timeLimitMs()
                );
                testCase.setHidden(data.hidden());
                testCaseRepository.save(testCase);
            }
        }
    }
}
