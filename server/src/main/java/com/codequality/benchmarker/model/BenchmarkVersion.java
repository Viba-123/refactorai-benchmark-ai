package com.codequality.benchmarker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "benchmark_versions")
public class BenchmarkVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;

    @Column(nullable = false)
    private String version;

    private String language;

    private String author;

    private Integer cyclomaticComplexity;

    private Integer maintainabilityIndex;

    private Integer linesOfCode;

    private Double estimatedRuntimeMs;

    private Double memoryFootprintMb;

    private Integer codeSmells;

    private Integer qualityScore;

    private Boolean isCurrent = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public BenchmarkVersion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public Integer getCyclomaticComplexity() { return cyclomaticComplexity; }
    public void setCyclomaticComplexity(Integer cyclomaticComplexity) { this.cyclomaticComplexity = cyclomaticComplexity; }

    public Integer getMaintainabilityIndex() { return maintainabilityIndex; }
    public void setMaintainabilityIndex(Integer maintainabilityIndex) { this.maintainabilityIndex = maintainabilityIndex; }

    public Integer getLinesOfCode() { return linesOfCode; }
    public void setLinesOfCode(Integer linesOfCode) { this.linesOfCode = linesOfCode; }

    public Double getEstimatedRuntimeMs() { return estimatedRuntimeMs; }
    public void setEstimatedRuntimeMs(Double estimatedRuntimeMs) { this.estimatedRuntimeMs = estimatedRuntimeMs; }

    public Double getMemoryFootprintMb() { return memoryFootprintMb; }
    public void setMemoryFootprintMb(Double memoryFootprintMb) { this.memoryFootprintMb = memoryFootprintMb; }

    public Integer getCodeSmells() { return codeSmells; }
    public void setCodeSmells(Integer codeSmells) { this.codeSmells = codeSmells; }

    public Integer getQualityScore() { return qualityScore; }
    public void setQualityScore(Integer qualityScore) { this.qualityScore = qualityScore; }

    public Boolean getIsCurrent() { return isCurrent; }
    public void setIsCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
