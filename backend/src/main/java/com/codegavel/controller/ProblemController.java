package com.codegavel.controller;

import com.codegavel.dto.ProblemResponse;
import com.codegavel.entity.Problem;
import com.codegavel.service.ProblemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public List<ProblemResponse> getAllProblems() {
        return problemService.getAllProblems()
                .stream()
                .map(ProblemResponse::new)
                .toList();
    }

    @GetMapping("/{id}")
    public ProblemResponse getProblem(@PathVariable Long id) {
        return new ProblemResponse(problemService.getProblem(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProblemResponse createProblem(@RequestBody Problem problem) {
        return new ProblemResponse(problemService.createProblem(problem));
    }
}
