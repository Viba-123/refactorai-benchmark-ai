package com.codequality.benchmarker.controller;

import com.codequality.benchmarker.dto.AnalyzeRequest;
import com.codequality.benchmarker.dto.AnalyzeResponse;
import com.codequality.benchmarker.model.AnalysisResult;
import com.codequality.benchmarker.model.CodeIssue;
import com.codequality.benchmarker.model.CodeSubmission;
import com.codequality.benchmarker.repository.AnalysisResultRepository;
import com.codequality.benchmarker.repository.CodeSubmissionRepository;
import com.codequality.benchmarker.service.AiRefactoringService;
import com.codequality.benchmarker.service.ProjectService;
import com.codequality.benchmarker.service.StaticAnalysisEngine;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AnalysisController {

    private final StaticAnalysisEngine analysisEngine;
    private final AiRefactoringService refactoringService;
    private final CodeSubmissionRepository submissionRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final ProjectService projectService;

    public AnalysisController(StaticAnalysisEngine analysisEngine,
                              AiRefactoringService refactoringService,
                              CodeSubmissionRepository submissionRepository,
                              AnalysisResultRepository analysisResultRepository,
                              ProjectService projectService) {
        this.analysisEngine = analysisEngine;
        this.refactoringService = refactoringService;
        this.submissionRepository = submissionRepository;
        this.analysisResultRepository = analysisResultRepository;
        this.projectService = projectService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalyzeResponse> analyzeCode(@Valid @RequestBody AnalyzeRequest req) {
        String code = req.getCode();
        String language = req.getLanguage() != null ? req.getLanguage() : "java";
        String filename = req.getFilename() != null ? req.getFilename() : "CodeSnippet";
        Long projectId = req.getProjectId() != null ? req.getProjectId() : 1L;

        // 1. Safe Static Analysis
        StaticAnalysisEngine.AnalysisMetrics metrics = analysisEngine.analyze(code, language, filename);

        // 2. Refactoring Advisory (Gemini AI if configured, otherwise labeled deterministic AST engine)
        AiRefactoringService.RefactoringResult refactor = refactoringService.generateRefactoring(
                code, language, filename, Boolean.TRUE.equals(req.getRunAiAdvisor())
        );

        // 3. Persist Code Submission
        CodeSubmission submission = new CodeSubmission();
        submission.setProjectId(projectId);
        submission.setTitle(filename);
        submission.setLanguage(language);
        submission.setCode(code);
        submission.setScore(metrics.qualityScore);
        submission.setMaintainabilityIndex(metrics.maintainabilityIndex);
        submission.setCyclomaticComplexity(metrics.cyclomaticComplexity);
        submission.setLinesOfCode(metrics.linesOfCode);
        submission.setIssuesCount(metrics.issues.size());
        submission.setStatus(metrics.qualityScore >= 80 ? "Passed" : metrics.qualityScore >= 65 ? "Needs Work" : "Smells Detected");
        submission.setAuthor("Alex Rivera");
        submission.setCreatedAt(LocalDateTime.now());
        submission = submissionRepository.save(submission);

        // 4. Persist Analysis Result
        AnalysisResult result = new AnalysisResult();
        result.setSubmissionId(submission.getId());
        result.setFilename(filename);
        result.setLanguage(language);
        result.setQualityScore(metrics.qualityScore);
        result.setMaintainabilityIndex(metrics.maintainabilityIndex);
        result.setCyclomaticComplexity(metrics.cyclomaticComplexity);
        result.setLinesOfCode(metrics.linesOfCode);
        result.setCognitiveComplexity(metrics.cognitiveComplexity);
        result.setHalsteadVolume(metrics.halsteadVolume);
        result.setExecutionOpsEstimate(metrics.executionOpsEstimate);
        result.setIsAiRefactored(refactor.isAiRefactored);
        result.setEngineType(refactor.engineType);
        result.setOriginalCode(code);
        result.setSuggestedCode(refactor.suggestedCode);
        result.setExplanation(refactor.explanation);
        result.setCreatedAt(LocalDateTime.now());

        // Attach issues
        for (AnalyzeResponse.IssueDto issDto : metrics.issues) {
            CodeIssue issue = new CodeIssue(
                    issDto.getLine(),
                    issDto.getSeverity(),
                    issDto.getType(),
                    issDto.getTitle(),
                    issDto.getDescription()
            );
            issue.setAnalysisResult(result);
            result.getIssues().add(issue);
        }

        analysisResultRepository.save(result);

        // 5. Update Project Aggregates
        projectService.updateProjectMetrics(projectId, metrics.qualityScore);

        // 6. Assemble Response
        AnalyzeResponse response = new AnalyzeResponse();
        response.setId(submission.getId());
        response.setFilename(filename);
        response.setLanguage(language);
        response.setQualityScore(metrics.qualityScore);
        response.setMaintainabilityIndex(metrics.maintainabilityIndex);
        response.setCyclomaticComplexity(metrics.cyclomaticComplexity);
        response.setLinesOfCode(metrics.linesOfCode);
        response.setCognitiveComplexity(metrics.cognitiveComplexity);
        response.setHalsteadVolume(metrics.halsteadVolume);
        response.setExecutionOpsEstimate(metrics.executionOpsEstimate);
        response.setIsAiRefactored(refactor.isAiRefactored);
        response.setEngineType(refactor.engineType);
        response.setOriginalCode(code);
        response.setSuggestedCode(refactor.suggestedCode);
        response.setExplanation(refactor.explanation);
        response.setIssues(metrics.issues);
        response.setIsDemo(false);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/analysis/history")
    public ResponseEntity<List<CodeSubmission>> getHistory() {
        return ResponseEntity.ok(submissionRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/analysis/{id}")
    public ResponseEntity<AnalysisResult> getAnalysis(@PathVariable Long id) {
        return analysisResultRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
