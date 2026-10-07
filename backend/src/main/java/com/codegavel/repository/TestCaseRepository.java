package com.codegavel.repository;

import com.codegavel.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    void deleteByProblemId(Long problemId);
}
