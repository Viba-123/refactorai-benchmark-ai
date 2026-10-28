package com.codequality.benchmarker.controller;

import com.codequality.benchmarker.model.TeamComment;
import com.codequality.benchmarker.repository.TeamCommentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/collaboration")
public class CollaborationController {

    private final TeamCommentRepository commentRepository;

    public CollaborationController(TeamCommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @GetMapping("/comments")
    public ResponseEntity<List<TeamComment>> getComments(@RequestParam(defaultValue = "1") Long projectId) {
        List<TeamComment> comments = commentRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        if (comments.isEmpty()) {
            comments = commentRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/comments")
    public ResponseEntity<TeamComment> addComment(@RequestBody TeamComment comment) {
        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(LocalDateTime.now());
        }
        if (comment.getAvatar() == null || comment.getAvatar().isBlank()) {
            comment.setAvatar("AR");
        }
        if (comment.getRole() == null || comment.getRole().isBlank()) {
            comment.setRole("Engineer");
        }
        return ResponseEntity.ok(commentRepository.save(comment));
    }
}
