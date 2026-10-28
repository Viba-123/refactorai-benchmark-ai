package com.codequality.benchmarker.repository;

import com.codequality.benchmarker.model.CodeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {
    List<CodeSubmission> findTop10ByOrderByCreatedAtDesc();
    List<CodeSubmission> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<CodeSubmission> findAllByOrderByCreatedAtDesc();
}
