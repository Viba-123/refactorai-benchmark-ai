package com.codequality.benchmarker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_comments")
public class TeamComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;

    @Column(nullable = false)
    private String author;

    private String role;

    private String avatar;

    private String targetFile;

    private Integer line;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    private String status = "Reviewed"; // Reviewed, Approved, Needs Work

    private LocalDateTime createdAt = LocalDateTime.now();

    public TeamComment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getTargetFile() { return targetFile; }
    public void setTargetFile(String targetFile) { this.targetFile = targetFile; }

    public Integer getLine() { return line; }
    public void setLine(Integer line) { this.line = line; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
