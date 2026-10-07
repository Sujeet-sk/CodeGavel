package com.codegavel.repository;

import com.codegavel.entity.ProblemExample;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemExampleRepository extends JpaRepository<ProblemExample, Long> {
    void deleteByProblemId(Long problemId);
}
