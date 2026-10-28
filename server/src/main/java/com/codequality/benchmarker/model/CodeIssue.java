package com.codequality.benchmarker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "code_issues")
public class CodeIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer line;

    private String severity; // Critical, Major, Minor, Info

    private String type;     // Concurrency, Complexity, Code Smell, Style

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_result_id")
    @JsonIgnore
    private AnalysisResult analysisResult;

    public CodeIssue() {}

    public CodeIssue(Integer line, String severity, String type, String title, String description) {
        this.line = line;
        this.severity = severity;
        this.type = type;
        this.title = title;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getLine() { return line; }
    public void setLine(Integer line) { this.line = line; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AnalysisResult getAnalysisResult() { return analysisResult; }
    public void setAnalysisResult(AnalysisResult analysisResult) { this.analysisResult = analysisResult; }
}
