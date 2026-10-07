package com.codegavel.service;

import com.codegavel.dto.SubmissionRequest;
import com.codegavel.entity.Problem;
import com.codegavel.entity.Submission;
import com.codegavel.entity.User;
import com.codegavel.judge.SubmissionQueue;
import com.codegavel.repository.ProblemRepository;
import com.codegavel.repository.SubmissionRepository;
import com.codegavel.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionQueue submissionQueue;
    private final SubmissionRateLimiter submissionRateLimiter;

    public SubmissionService(
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            ProblemRepository problemRepository,
            SubmissionQueue submissionQueue,
            SubmissionRateLimiter submissionRateLimiter) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.submissionQueue = submissionQueue;
        this.submissionRateLimiter = submissionRateLimiter;
    }

    public Submission createSubmission(SubmissionRequest request) {

        User user = getCurrentUser();

        if (!submissionRateLimiter.allow(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Submission rate limit exceeded. Try again in a minute."
            );
        }

        if (request.getSourceCode() == null || request.getSourceCode().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Source code cannot be empty"
            );
        }

        if (request.getSourceCode().length() > 50000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Source code must not exceed 50,000 characters"
            );
        }

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Problem not found"
                ));

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setSourceCode(request.getSourceCode());
        submission.setStatus("PENDING");

        submission = submissionRepository.save(submission);

        submissionQueue.enqueue(submission.getId());

        return submission;
    }

    public Submission getSubmission(Long id) {

        User currentUser = getCurrentUser();

        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Submission not found"
                ));

        if (!submission.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Access denied"
            );
        }

        return submission;
    }

    public List<Submission> getUserSubmissions(Long userId) {

        User currentUser = getCurrentUser();

        if (!currentUser.getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Access denied"
            );
        }

        return submissionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private User getCurrentUser() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found"
                ));
    }
}
