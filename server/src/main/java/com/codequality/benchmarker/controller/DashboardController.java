package com.codequality.benchmarker.controller;

import com.codequality.benchmarker.dto.DashboardMetricsResponse;
import com.codequality.benchmarker.model.CodeSubmission;
import com.codequality.benchmarker.model.Project;
import com.codequality.benchmarker.repository.CodeSubmissionRepository;
import com.codequality.benchmarker.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final CodeSubmissionRepository submissionRepository;
    private final ProjectRepository projectRepository;

    public DashboardController(CodeSubmissionRepository submissionRepository, ProjectRepository projectRepository) {
        this.submissionRepository = submissionRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsResponse> getMetrics() {
        DashboardMetricsResponse resp = new DashboardMetricsResponse();

        List<CodeSubmission> submissions = submissionRepository.findAllByOrderByCreatedAtDesc();
        if (submissions.isEmpty()) {
            resp.setIsDemo(true);
            return ResponseEntity.ok(resp);
        }

        resp.setTotalSubmissions(submissions.size());

        double totalScore = 0;
        double totalMaintainability = 0;
        double totalCyclomatic = 0;
        int totalIssues = 0;

        for (CodeSubmission sub : submissions) {
            totalScore += (sub.getScore() != null ? sub.getScore() : 80);
            totalMaintainability += (sub.getMaintainabilityIndex() != null ? sub.getMaintainabilityIndex() : 75);
            totalCyclomatic += (sub.getCyclomaticComplexity() != null ? sub.getCyclomaticComplexity() : 7);
            totalIssues += (sub.getIssuesCount() != null ? sub.getIssuesCount() : 2);
        }

        int count = submissions.size();
        resp.setOverallQualityScore(Math.round((totalScore / count) * 10.0) / 10.0);
        resp.setAvgMaintainability(Math.round((totalMaintainability / count) * 10.0) / 10.0);
        resp.setCyclomaticAvg(Math.round((totalCyclomatic / count) * 10.0) / 10.0);
        resp.setIssuesDetected(totalIssues);
        resp.setIsDemo(false);

        // Add recent 10 submissions
        List<CodeSubmission> recent = submissions.stream().limit(10).toList();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, HH:mm");

        for (CodeSubmission sub : recent) {
            DashboardMetricsResponse.SubmissionSummaryDto dto = new DashboardMetricsResponse.SubmissionSummaryDto();
            dto.setId(sub.getId());
            dto.setProjectId(sub.getProjectId());
            dto.setTitle(sub.getTitle());
            dto.setLanguage(sub.getLanguage());
            dto.setScore(sub.getScore());
            dto.setMaintainabilityIndex(sub.getMaintainabilityIndex());
            dto.setCyclomaticComplexity(sub.getCyclomaticComplexity());
            dto.setLinesOfCode(sub.getLinesOfCode());
            dto.setIssuesCount(sub.getIssuesCount());
            dto.setStatus(sub.getStatus());
            dto.setAuthor(sub.getAuthor());
            dto.setTimestamp(sub.getCreatedAt() != null ? sub.getCreatedAt().format(formatter) : "Recently");

            projectRepository.findById(sub.getProjectId()).ifPresent(p -> dto.setProjectName(p.getName()));
            if (dto.getProjectName() == null) {
                dto.setProjectName("Default Suite");
            }

            resp.getRecentSubmissions().add(dto);
        }

        return ResponseEntity.ok(resp);
    }
}
