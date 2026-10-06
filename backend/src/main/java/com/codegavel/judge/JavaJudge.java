package com.codegavel.judge;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.concurrent.*;

@Service
public class JavaJudge {

    public JudgeResult judge(String sourceCode, String input, String expectedOutput) {

        Path tempDir = null;

        try {
            tempDir = Files.createTempDirectory("codegavel-");

            Path sourceFile = tempDir.resolve("Main.java");
            Path inputFile = tempDir.resolve("input.txt");

            Files.writeString(sourceFile, sourceCode, StandardCharsets.UTF_8);
            Files.writeString(inputFile, input == null ? "" : input, StandardCharsets.UTF_8);

            String volume = tempDir.toAbsolutePath() + ":/sandbox";

            Process compileProcess = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "--network", "none",
                    "--memory", "128m",
                    "--cpus", "1",
                    "--pids-limit", "64",
                    "--cap-drop", "ALL",
                    "--security-opt", "no-new-privileges",
                    "-v", volume,
                    "codegavel-java:21",
                    "javac", "/sandbox/Main.java"
            ).redirectErrorStream(true).start();

            String compileOutput = new String(
                    compileProcess.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            int compileExitCode = compileProcess.waitFor();

            if (compileExitCode != 0) {
                return new JudgeResult("COMPILATION_ERROR", null, compileOutput);
            }

            Process runProcess = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "--network", "none",
                    "--memory", "128m",
                    "--cpus", "1",
                    "--pids-limit", "64",
                    "--cap-drop", "ALL",
                    "--security-opt", "no-new-privileges",
                    "--tmpfs", "/tmp",
                    "-v", volume + ":rw",
                    "codegavel-java:21",
                    "sh", "-c",
                    "java -cp /sandbox Main < /sandbox/input.txt"
            ).redirectErrorStream(true).start();

            ExecutorService executor = Executors.newSingleThreadExecutor();

            Future<String> outputFuture = executor.submit(() ->
                    new String(
                            runProcess.getInputStream().readAllBytes(),
                            StandardCharsets.UTF_8
                    )
            );

            long startTime = System.currentTimeMillis();
            String output;

            try {
                output = outputFuture.get(2, TimeUnit.SECONDS);
            } catch (TimeoutException e) {
                runProcess.destroyForcibly();
                executor.shutdownNow();
                return new JudgeResult(
                        "TIME_LIMIT_EXCEEDED",
                        2000L,
                        "Time limit exceeded"
                );
            }

            long executionTime = System.currentTimeMillis() - startTime;
            int exitCode = runProcess.waitFor();

            executor.shutdown();

            if (exitCode != 0) {
                return new JudgeResult("RUNTIME_ERROR", executionTime, output);
            }

            String actual = output.trim();
            String expected = expectedOutput == null ? "" : expectedOutput.trim();

            if (actual.equals(expected)) {
                return new JudgeResult("ACCEPTED", executionTime, actual);
            }

            return new JudgeResult("WRONG_ANSWER", executionTime, actual);

        } catch (Exception e) {
            return new JudgeResult("SYSTEM_ERROR", null, e.getMessage());

        } finally {
            if (tempDir != null) {
                try {
                    Files.walk(tempDir)
                            .sorted((a, b) -> b.compareTo(a))
                            .forEach(path -> {
                                try {
                                    Files.deleteIfExists(path);
                                } catch (IOException ignored) {}
                            });
                } catch (IOException ignored) {}
            }
        }
    }
}
