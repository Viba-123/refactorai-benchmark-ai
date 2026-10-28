package com.codequality.benchmarker.dto;

import java.util.ArrayList;
import java.util.List;

public class AnalyzeResponse {

    private Long id;
    private String filename;
    private String language;
    private Integer qualityScore;
    private Integer maintainabilityIndex;
    private Integer cyclomaticComplexity;
    private Integer linesOfCode;
    private Integer cognitiveComplexity;
    private Double halsteadVolume;
    private String executionOpsEstimate;
    private Boolean isAiRefactored;
    private String engineType;
    private String originalCode;
    private String suggestedCode;
    private String explanation;
    private List<IssueDto> issues = new ArrayList<>();
    private Boolean isDemo = false;

    public static class IssueDto {
        private String id;
        private Integer line;
        private String severity;
        private String type;
        private String title;
        private String description;

        public IssueDto() {}

        public IssueDto(String id, Integer line, String severity, String type, String title, String description) {
            this.id = id;
            this.line = line;
            this.severity = severity;
            this.type = type;
            this.title = title;
            this.description = description;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

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
    }

    public AnalyzeResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public List<IssueDto> getIssues() { return issues; }
    public void setIssues(List<IssueDto> issues) { this.issues = issues; }

    public Boolean getIsDemo() { return isDemo; }
    public void setIsDemo(Boolean isDemo) { this.isDemo = isDemo; }
}
