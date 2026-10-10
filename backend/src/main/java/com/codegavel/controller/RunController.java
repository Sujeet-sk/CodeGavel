package com.codegavel.controller;

import com.codegavel.dto.RunRequest;
import com.codegavel.dto.RunResponse;
import com.codegavel.service.RunService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/problems")
public class RunController {

    private final RunService runService;

    public RunController(RunService runService) {
        this.runService = runService;
    }

    @PostMapping("/{id}/run")
    public RunResponse run(
            @PathVariable Long id,
            @Valid @RequestBody RunRequest request) {

        return runService.run(
                id,
                request.getSourceCode()
        );
    }
}
