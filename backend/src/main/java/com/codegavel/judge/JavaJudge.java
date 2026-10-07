package com.codegavel.judge;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.concurrent.*;

@Service
public class JavaJudge {

    private static final long COMPILE_TIMEOUT_SECONDS = 5;
    private static final long RUN_TIMEOUT_SECONDS = 2;

    private static final int COMPILE_OUTPUT_LIMIT = 16 * 1024;
    private static final int RUN_OUTPUT_LIMIT = 64 * 1024;

    public JudgeResult judge(
            String sourceCode,
            String input,
            String expectedOutput) {

        Path tempDir = null;

        try {
            tempDir = Files.createTempDirectory("codegavel-");

            Path sourceFile = tempDir.resolve("Main.java");
            Path inputFile = tempDir.resolve("input.txt");

            Files.writeString(
                    sourceFile,
                    sourceCode,
                    StandardCharsets.UTF_8
            );

            Files.writeString(
                    inputFile,
                    input == null ? "" : input,
                    StandardCharsets.UTF_8
            );

            String volume = tempDir.toAbsolutePath() + ":/sandbox";

            // -------------------------
            // COMPILE
            // -------------------------

            Process compileProcess = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "--network", "none",
                    "--memory", "128m",
                    "--cpus", "1",
                    "--pids-limit", "64",
                    "--cap-drop", "ALL",
                    "--security-opt", "no-new-privileges",
                    "--tmpfs", "/tmp",
                    "-v", volume,
                    "codegavel-java:21",
                    "javac", "/sandbox/Main.java"
            )
                    .redirectErrorStream(true)
                    .start();

            ExecutorService compileExecutor =
                    Executors.newSingleThreadExecutor();

            Future<String> compileFuture =
                    compileExecutor.submit(() ->
                            readLimited(
                                    compileProcess,
                                    COMPILE_OUTPUT_LIMIT
                            )
                    );

            String compileOutput;

            try {
                compileOutput = compileFuture.get(
                        COMPILE_TIMEOUT_SECONDS,
                        TimeUnit.SECONDS
                );
            } catch (TimeoutException e) {

                compileProcess.destroyForcibly();
                compileExecutor.shutdownNow();

                return new JudgeResult(
                        "COMPILATION_ERROR",
                        COMPILE_TIMEOUT_SECONDS * 1000,
                        "Compilation timed out"
                );
            }

            int compileExitCode = compileProcess.waitFor();

            compileExecutor.shutdown();

            if (compileExitCode != 0) {
                return new JudgeResult(
                        "COMPILATION_ERROR",
                        null,
                        compileOutput
                );
            }

            // -------------------------
            // RUN
            // -------------------------

            Process runProcess = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "--network", "none",
                    "--memory", "128m",
                    "--cpus", "1",
                    "--pids-limit", "64",
                    "--cap-drop", "ALL",
                    "--security-opt", "no-new-privileges",
                    "--read-only",
                    "--tmpfs", "/tmp",
                    "-v", volume + ":ro",
                    "codegavel-java:21",
                    "sh", "-c",
                    "java -cp /sandbox Main < /sandbox/input.txt"
            )
                    .redirectErrorStream(true)
                    .start();

            ExecutorService runExecutor =
                    Executors.newSingleThreadExecutor();

            Future<String> outputFuture =
                    runExecutor.submit(() ->
                            readLimited(
                                    runProcess,
                                    RUN_OUTPUT_LIMIT
                            )
                    );

            long startTime = System.currentTimeMillis();

            String output;

            try {
                output = outputFuture.get(
                        RUN_TIMEOUT_SECONDS,
                        TimeUnit.SECONDS
                );
            } catch (TimeoutException e) {

                runProcess.destroyForcibly();
                runExecutor.shutdownNow();

                return new JudgeResult(
                        "TIME_LIMIT_EXCEEDED",
                        RUN_TIMEOUT_SECONDS * 1000,
                        "Time limit exceeded"
                );
            } catch (ExecutionException e) {

                runProcess.destroyForcibly();
                runExecutor.shutdownNow();

                return new JudgeResult(
                        "SYSTEM_ERROR",
                        null,
                        "Judge execution failed"
                );
            }

            long executionTime =
                    System.currentTimeMillis() - startTime;

            int exitCode = runProcess.waitFor();

            runExecutor.shutdown();

            if (output.length() >= RUN_OUTPUT_LIMIT) {
                return new JudgeResult(
                        "RUNTIME_ERROR",
                        executionTime,
                        "Output limit exceeded"
                );
            }

            if (exitCode != 0) {
                return new JudgeResult(
                        "RUNTIME_ERROR",
                        executionTime,
                        output
                );
            }

            String actual = output.trim();

            String expected =
                    expectedOutput == null
                            ? ""
                            : expectedOutput.trim();

            if (actual.equals(expected)) {
                return new JudgeResult(
                        "ACCEPTED",
                        executionTime,
                        actual
                );
            }

            return new JudgeResult(
                    "WRONG_ANSWER",
                    executionTime,
                    actual
            );

        } catch (Exception e) {

            return new JudgeResult(
                    "SYSTEM_ERROR",
                    null,
                    "Judge system error"
            );

        } finally {

            if (tempDir != null) {

                try {
                    Files.walk(tempDir)
                            .sorted((a, b) -> b.compareTo(a))
                            .forEach(path -> {
                                try {
                                    Files.deleteIfExists(path);
                                } catch (IOException ignored) {
                                }
                            });

                } catch (IOException ignored) {
                }
            }
        }
    }

    private String readLimited(
            Process process,
            int maxCharacters) throws IOException {

        byte[] buffer = new byte[4096];
        StringBuilder output = new StringBuilder();

        try (var stream = process.getInputStream()) {

            int bytesRead;

            while ((bytesRead = stream.read(buffer)) != -1) {

                int remaining = maxCharacters - output.length();

                if (bytesRead > remaining) {
                    output.append(
                            new String(
                                    buffer,
                                    0,
                                    Math.max(remaining, 0),
                                    StandardCharsets.UTF_8
                            )
                    );

                    process.destroyForcibly();

                    return output.toString();
                }

                output.append(
                        new String(
                                buffer,
                                0,
                                bytesRead,
                                StandardCharsets.UTF_8
                        )
                );
            }
        }

        return output.toString();
    }
}
