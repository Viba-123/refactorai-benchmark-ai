package com.codequality.benchmarker.dto;

import jakarta.validation.constraints.NotBlank;

public class AnalyzeRequest {

    @NotBlank(message = "Source code cannot be empty")
    private String code;

    private String language = "java";

    private String filename = "CodeSnippet";

    private Long projectId = 1L;

    private Boolean runAiAdvisor = false;

    public AnalyzeRequest() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Boolean getRunAiAdvisor() { return runAiAdvisor; }
    public void setRunAiAdvisor(Boolean runAiAdvisor) { this.runAiAdvisor = runAiAdvisor; }
}
