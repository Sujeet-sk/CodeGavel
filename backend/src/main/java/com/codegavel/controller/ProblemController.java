package com.codegavel.controller;

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
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public Problem getProblem(@PathVariable Long id) {
        return problemService.getProblem(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Problem createProblem(@RequestBody Problem problem) {
        return problemService.createProblem(problem);
    }
}
