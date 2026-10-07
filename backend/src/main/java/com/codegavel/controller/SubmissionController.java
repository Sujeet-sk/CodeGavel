package com.codegavel.controller;

import com.codegavel.dto.SubmissionRequest;
import com.codegavel.dto.SubmissionResponse;
import com.codegavel.entity.Submission;
import com.codegavel.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse createSubmission(
            @Valid @RequestBody SubmissionRequest request) {
        return SubmissionResponse.from(submissionService.createSubmission(request));
    }

    @GetMapping("/{id}")
    public SubmissionResponse getSubmission(@PathVariable Long id) {
        return SubmissionResponse.from(submissionService.getSubmission(id));
    }

    @GetMapping("/user/{userId}")
    public List<SubmissionResponse> getUserSubmissions(
            @PathVariable Long userId) {
        return submissionService.getUserSubmissions(userId)
                .stream()
                .map(SubmissionResponse::from)
                .toList();
    }
}
