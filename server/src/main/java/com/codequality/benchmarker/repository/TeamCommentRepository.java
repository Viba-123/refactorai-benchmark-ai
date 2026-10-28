package com.codequality.benchmarker.repository;

import com.codequality.benchmarker.model.TeamComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamCommentRepository extends JpaRepository<TeamComment, Long> {
    List<TeamComment> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<TeamComment> findAllByOrderByCreatedAtDesc();
}
