package com.codequality.benchmarker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_submissions")
public class CodeSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String language;

    @Column(columnDefinition = "TEXT")
    private String code;

    private Integer score = 0;

    private Integer maintainabilityIndex = 0;

    private Integer cyclomaticComplexity = 0;

    private Integer linesOfCode = 0;

    private Integer issuesCount = 0;

    private String status = "Passed";

    private String author = "Alex Rivera";

    private LocalDateTime createdAt = LocalDateTime.now();

    public CodeSubmission() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getMaintainabilityIndex() { return maintainabilityIndex; }
    public void setMaintainabilityIndex(Integer maintainabilityIndex) { this.maintainabilityIndex = maintainabilityIndex; }

    public Integer getCyclomaticComplexity() { return cyclomaticComplexity; }
    public void setCyclomaticComplexity(Integer cyclomaticComplexity) { this.cyclomaticComplexity = cyclomaticComplexity; }

    public Integer getLinesOfCode() { return linesOfCode; }
    public void setLinesOfCode(Integer linesOfCode) { this.linesOfCode = linesOfCode; }

    public Integer getIssuesCount() { return issuesCount; }
    public void setIssuesCount(Integer issuesCount) { this.issuesCount = issuesCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
