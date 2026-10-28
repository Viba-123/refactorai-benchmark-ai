package com.codequality.benchmarker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "analysis_results")
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long submissionId;

    private String filename;

    private String language;

    private Integer qualityScore;

    private Integer maintainabilityIndex;

    private Integer cyclomaticComplexity;

    private Integer linesOfCode;

    private Integer cognitiveComplexity;

    private Double halsteadVolume;

    private String executionOpsEstimate;

    private Boolean isAiRefactored = false;

    private String engineType;

    @Column(columnDefinition = "TEXT")
    private String originalCode;

    @Column(columnDefinition = "TEXT")
    private String suggestedCode;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @OneToMany(mappedBy = "analysisResult", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CodeIssue> issues = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    public AnalysisResult() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Integer getQualityScore() { return qualityScore; }
    public void setQualityScore(Integer qualityScore) { this.qualityScore = qualityScore; }

    public Integer getMaintainabilityIndex() { return maintainabilityIndex; }
    public void setMaintainabilityIndex(Integer maintainabilityIndex) { this.maintainabilityIndex = maintainabilityIndex; }

    public Integer getCyclomaticComplexity() { return cyclomaticComplexity; }
    public void setCyclomaticComplexity(Integer cyclomaticComplexity) { this.cyclomaticComplexity = cyclomaticComplexity; }

    public Integer getLinesOfCode() { return linesOfCode; }
    public void setLinesOfCode(Integer linesOfCode) { this.linesOfCode = linesOfCode; }

    public Integer getCognitiveComplexity() { return cognitiveComplexity; }
    public void setCognitiveComplexity(Integer cognitiveComplexity) { this.cognitiveComplexity = cognitiveComplexity; }

    public Double getHalsteadVolume() { return halsteadVolume; }
    public void setHalsteadVolume(Double halsteadVolume) { this.halsteadVolume = halsteadVolume; }

    public String getExecutionOpsEstimate() { return executionOpsEstimate; }
    public void setExecutionOpsEstimate(String executionOpsEstimate) { this.executionOpsEstimate = executionOpsEstimate; }

    public Boolean getIsAiRefactored() { return isAiRefactored; }
    public void setIsAiRefactored(Boolean isAiRefactored) { this.isAiRefactored = isAiRefactored; }

    public String getEngineType() { return engineType; }
    public void setEngineType(String engineType) { this.engineType = engineType; }

    public String getOriginalCode() { return originalCode; }
    public void setOriginalCode(String originalCode) { this.originalCode = originalCode; }

    public String getSuggestedCode() { return suggestedCode; }
    public void setSuggestedCode(String suggestedCode) { this.suggestedCode = suggestedCode; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<CodeIssue> getIssues() { return issues; }
    public void setIssues(List<CodeIssue> issues) { this.issues = issues; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
