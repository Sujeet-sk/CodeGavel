package com.codegavel.service;

import com.codegavel.dto.SubmissionRequest;
import com.codegavel.entity.Problem;
import com.codegavel.entity.Submission;
import com.codegavel.entity.User;
import com.codegavel.judge.SubmissionQueue;
import com.codegavel.repository.ProblemRepository;
import com.codegavel.repository.SubmissionRepository;
import com.codegavel.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionQueue submissionQueue;

    public SubmissionService(
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            ProblemRepository problemRepository,
            SubmissionQueue submissionQueue) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.submissionQueue = submissionQueue;
    }

    public Submission createSubmission(SubmissionRequest request) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

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
        return submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    public List<Submission> getUserSubmissions(Long userId) {
        return submissionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
