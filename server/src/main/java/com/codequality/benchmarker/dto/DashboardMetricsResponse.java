package com.codequality.benchmarker.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardMetricsResponse {

    private Double overallQualityScore = 82.4;
    private Integer totalSubmissions = 0;
    private Integer issuesDetected = 0;
    private Double avgMaintainability = 78.5;
    private Double cyclomaticAvg = 7.2;
    private List<SubmissionSummaryDto> recentSubmissions = new ArrayList<>();
    private Boolean isDemo = false;

    public static class SubmissionSummaryDto {
        private Long id;
        private Long projectId;
        private String projectName;
        private String title;
        private String language;
        private Integer score;
        private Integer maintainabilityIndex;
        private Integer cyclomaticComplexity;
        private Integer linesOfCode;
        private Integer issuesCount;
        private String status;
        private String timestamp;
        private String author;

        public SubmissionSummaryDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProjectId() { return projectId; }
        public void setProjectId(Long projectId) { this.projectId = projectId; }

        public String getProjectName() { return projectName; }
        public void setProjectName(String projectName) { this.projectName = projectName; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }

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

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

        public String getAuthor() { return author; }
        public void setAuthor(String author) { this.author = author; }
    }

    public DashboardMetricsResponse() {}

    public Double getOverallQualityScore() { return overallQualityScore; }
    public void setOverallQualityScore(Double overallQualityScore) { this.overallQualityScore = overallQualityScore; }

    public Integer getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(Integer totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public Integer getIssuesDetected() { return issuesDetected; }
    public void setIssuesDetected(Integer issuesDetected) { this.issuesDetected = issuesDetected; }

    public Double getAvgMaintainability() { return avgMaintainability; }
    public void setAvgMaintainability(Double avgMaintainability) { this.avgMaintainability = avgMaintainability; }

    public Double getCyclomaticAvg() { return cyclomaticAvg; }
    public void setCyclomaticAvg(Double cyclomaticAvg) { this.cyclomaticAvg = cyclomaticAvg; }

    public List<SubmissionSummaryDto> getRecentSubmissions() { return recentSubmissions; }
    public void setRecentSubmissions(List<SubmissionSummaryDto> recentSubmissions) { this.recentSubmissions = recentSubmissions; }

    public Boolean getIsDemo() { return isDemo; }
    public void setIsDemo(Boolean isDemo) { this.isDemo = isDemo; }
}
