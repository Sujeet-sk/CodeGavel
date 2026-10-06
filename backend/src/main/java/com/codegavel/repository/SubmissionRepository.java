package com.codegavel.repository;

import com.codegavel.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByUserIdOrderByCreatedAtDesc(Long userId);
}
