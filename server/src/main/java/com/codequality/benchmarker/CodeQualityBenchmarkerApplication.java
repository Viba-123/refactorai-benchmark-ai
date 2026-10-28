package com.codequality.benchmarker;

import com.codequality.benchmarker.model.BenchmarkVersion;
import com.codequality.benchmarker.model.CodeSubmission;
import com.codequality.benchmarker.model.Project;
import com.codequality.benchmarker.model.TeamComment;
import com.codequality.benchmarker.repository.BenchmarkVersionRepository;
import com.codequality.benchmarker.repository.CodeSubmissionRepository;
import com.codequality.benchmarker.repository.ProjectRepository;
import com.codequality.benchmarker.repository.TeamCommentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class CodeQualityBenchmarkerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeQualityBenchmarkerApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(ProjectRepository projectRepo,
                                  BenchmarkVersionRepository benchmarkRepo,
                                  CodeSubmissionRepository submissionRepo,
                                  TeamCommentRepository commentRepo) {
        return args -> {
            if (projectRepo.count() == 0) {
                // Seed Projects
                Project p1 = new Project("Algorithmic-Core", "High-performance data structures and graph algorithms library in Java and Python.", "Java", "https://github.com/org/algo-core");
                p1.setStars(124);
                p1.setSubmissionsCount(42);
                p1.setAvgScore(84.5);
                projectRepo.save(p1);

                Project p2 = new Project("FinTech-Payment-Gateway", "Distributed transaction processing pipeline with idempotency and retry mechanics.", "Python", "https://github.com/org/payment-gateway");
                p2.setStars(89);
                p2.setSubmissionsCount(28);
                p2.setAvgScore(78.2);
                projectRepo.save(p2);

                Project p3 = new Project("Realtime-Stream-Analytics", "In-memory event aggregation and windowing service for time-series telemetry.", "JavaScript", "https://github.com/org/stream-analytics");
                p3.setStars(64);
                p3.setSubmissionsCount(19);
                p3.setAvgScore(91.0);
                projectRepo.save(p3);

                // Seed Benchmark Versions for Project 1
                BenchmarkVersion b1 = new BenchmarkVersion();
                b1.setProjectId(p1.getId());
                b1.setVersion("v1.0 (Baseline)");
                b1.setLanguage("Java");
                b1.setAuthor("Alex Rivera");
                b1.setCyclomaticComplexity(19);
                b1.setMaintainabilityIndex(58);
                b1.setLinesOfCode(184);
                b1.setEstimatedRuntimeMs(38.4);
                b1.setMemoryFootprintMb(42.1);
                b1.setCodeSmells(8);
                b1.setQualityScore(61);
                b1.setIsCurrent(false);
                benchmarkRepo.save(b1);

                BenchmarkVersion b2 = new BenchmarkVersion();
                b2.setProjectId(p1.getId());
                b2.setVersion("v1.1 (Static Refactor)");
                b2.setLanguage("Java");
                b2.setAuthor("Automated AST Engine");
                b2.setCyclomaticComplexity(11);
                b2.setMaintainabilityIndex(74);
                b2.setLinesOfCode(142);
                b2.setEstimatedRuntimeMs(24.2);
                b2.setMemoryFootprintMb(31.8);
                b2.setCodeSmells(3);
                b2.setQualityScore(78);
                b2.setIsCurrent(false);
                benchmarkRepo.save(b2);

                BenchmarkVersion b3 = new BenchmarkVersion();
                b3.setProjectId(p1.getId());
                b3.setVersion("v2.0 (Optimized)");
                b3.setLanguage("Java");
                b3.setAuthor("AI Advisor + Alex Rivera");
                b3.setCyclomaticComplexity(6);
                b3.setMaintainabilityIndex(89);
                b3.setLinesOfCode(108);
                b3.setEstimatedRuntimeMs(14.8);
                b3.setMemoryFootprintMb(22.4);
                b3.setCodeSmells(0);
                b3.setQualityScore(92);
                b3.setIsCurrent(true);
                benchmarkRepo.save(b3);

                // Seed Initial Submissions
                CodeSubmission s1 = new CodeSubmission();
                s1.setProjectId(p1.getId());
                s1.setTitle("LRUCache.java");
                s1.setLanguage("java");
                s1.setScore(88);
                s1.setMaintainabilityIndex(82);
                s1.setCyclomaticComplexity(7);
                s1.setLinesOfCode(114);
                s1.setIssuesCount(3);
                s1.setStatus("Passed");
                s1.setAuthor("Alex Rivera");
                s1.setCreatedAt(LocalDateTime.now().minusHours(2));
                submissionRepo.save(s1);

                CodeSubmission s2 = new CodeSubmission();
                s2.setProjectId(p2.getId());
                s2.setTitle("transaction_processor.py");
                s2.setLanguage("python");
                s2.setScore(64);
                s2.setMaintainabilityIndex(59);
                s2.setCyclomaticComplexity(19);
                s2.setLinesOfCode(240);
                s2.setIssuesCount(9);
                s2.setStatus("Needs Work");
                s2.setAuthor("Sara Chen");
                s2.setCreatedAt(LocalDateTime.now().minusHours(5));
                submissionRepo.save(s2);

                // Seed Team Review Comments
                TeamComment c1 = new TeamComment();
                c1.setProjectId(p1.getId());
                c1.setAuthor("Sara Chen");
                c1.setRole("Backend Architect");
                c1.setAvatar("SC");
                c1.setTargetFile("LRUCache.java");
                c1.setLine(38);
                c1.setComment("The lock acquisition looks solid now. We should consider StampedLock if read concurrency exceeds 90% in production.");
                c1.setStatus("Reviewed");
                c1.setCreatedAt(LocalDateTime.now().minusHours(3));
                commentRepo.save(c1);

                TeamComment c2 = new TeamComment();
                c2.setProjectId(p1.getId());
                c2.setAuthor("Liam Vance");
                c2.setRole("Algorithm Specialist");
                c2.setAvatar("LV");
                c2.setTargetFile("LRUCache.java");
                c2.setLine(52);
                c2.setComment("Verified that amortized complexity is strictly O(1) for both operations. Memory overhead dropped by ~30%.");
                c2.setStatus("Approved");
                c2.setCreatedAt(LocalDateTime.now().minusHours(4));
                commentRepo.save(c2);

                System.out.println(">> CodeQualityBenchmarker database seeded with initial benchmark suites & projects.");
            }
        };
    }
}
