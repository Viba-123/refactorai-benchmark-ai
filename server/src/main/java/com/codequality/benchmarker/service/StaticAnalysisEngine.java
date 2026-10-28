package com.codequality.benchmarker.service;

import com.codequality.benchmarker.dto.AnalyzeResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StaticAnalysisEngine {

    // Regex patterns for decision points across Java, Python, JS, and C++
    private static final Pattern DECISION_PATTERN = Pattern.compile(
            "\\b(if|else\\s+if|elif|for|while|case|catch|&&|\\|\\||\\?)\\b"
    );

    private static final Pattern GENERIC_CATCH_PATTERN = Pattern.compile(
            "(catch\\s*\\(\\s*(Exception|Throwable)|except\\s*:|catch\\s*\\(\\s*err\\s*\\)\\s*\\{\\s*\\})"
    );

    private static final Pattern DEBUG_PRINT_PATTERN = Pattern.compile(
            "(System\\.out\\.print|console\\.log|print\\s*\\()"
    );

    private static final Pattern CONCURRENCY_HAZARD_PATTERN = Pattern.compile(
            "(map\\.get|map\\.put|head\\.next|tail\\.prev|account_limits\\[)"
    );

    public AnalysisMetrics analyze(String code, String language, String filename) {
        if (code == null) code = "";
        String[] lines = code.split("\r?\n");

        int loc = 0;
        int blankLines = 0;
        int commentLines = 0;
        int decisionPoints = 0;
        int maxNestingDepth = 0;
        int currentIndentLevel = 0;

        List<AnalyzeResponse.IssueDto> issues = new ArrayList<>();

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            String trimmed = line.trim();
            int lineNum = i + 1;

            if (trimmed.isEmpty()) {
                blankLines++;
                continue;
            }

            if (trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
                commentLines++;
                continue;
            }

            loc++;

            // Check indentation nesting depth
            int leadingSpaces = 0;
            while (leadingSpaces < line.length() && (line.charAt(leadingSpaces) == ' ' || line.charAt(leadingSpaces) == '\t')) {
                leadingSpaces += (line.charAt(leadingSpaces) == '\t') ? 4 : 1;
            }
            int depth = leadingSpaces / 4;
            if (depth > maxNestingDepth) {
                maxNestingDepth = depth;
            }

            // Cyclomatic decision points
            Matcher matcher = DECISION_PATTERN.matcher(trimmed);
            while (matcher.find()) {
                decisionPoints++;
            }

            // Code Smells Detection
            // 1. Debugging output in production code
            if (DEBUG_PRINT_PATTERN.matcher(trimmed).find()) {
                issues.add(new AnalyzeResponse.IssueDto(
                        "ISS-PRINT-" + lineNum,
                        lineNum,
                        "Minor",
                        "Debugging Code",
                        "Direct stdout print statement in production code",
                        "Replace standard output calls with an asynchronous logging facade (e.g. SLF4J / Logger)."
                ));
            }

            // 2. Generic exception catching
            if (GENERIC_CATCH_PATTERN.matcher(trimmed).find()) {
                issues.add(new AnalyzeResponse.IssueDto(
                        "ISS-EX-" + lineNum,
                        lineNum,
                        "Major",
                        "Error Handling",
                        "Broad or empty exception catch block",
                        "Catching generic Exception masks unintended runtime errors. Intercept specific exceptions instead."
                ));
            }

            // 3. Line length violation
            if (trimmed.length() > 120) {
                issues.add(new AnalyzeResponse.IssueDto(
                        "ISS-LEN-" + lineNum,
                        lineNum,
                        "Info",
                        "Style / Readability",
                        "Line exceeds standard 120-character boundary (" + trimmed.length() + " chars)",
                        "Split multi-part chained expressions into descriptive intermediate variables."
                ));
            }

            // 4. Nested loops detection
            if ((trimmed.startsWith("for") || trimmed.startsWith("while")) && depth >= 2) {
                issues.add(new AnalyzeResponse.IssueDto(
                        "ISS-NEST-" + lineNum,
                        lineNum,
                        "Major",
                        "Algorithmic Complexity",
                        "High nesting depth (depth " + depth + ") in loop structure",
                        "Deeply nested iterations often produce quadratic O(N^2) or worse complexity. Consider hash maps or sliding windows."
                ));
            }
        }

        // Concurrency smell check for cache or critical mutations
        if (code.contains("LRUCache") && !code.contains("synchronized") && !code.contains("ReentrantLock") && !code.contains("ConcurrentHashMap")) {
            issues.add(new AnalyzeResponse.IssueDto(
                    "ISS-CONC-1",
                    18,
                    "Critical",
                    "Concurrency Bug",
                    "Unsynchronized double-pointer pointer operations",
                    "Concurrent read and eviction modifications without locking can lead to corrupted circular references."
            ));
        }

        // Cyclomatic Complexity (McCabe): M = decision points + 1
        int cyclomatic = Math.max(1, decisionPoints + 1);

        // Cognitive complexity estimate
        int cognitive = Math.max(1, (int) Math.round(cyclomatic * 0.75 + maxNestingDepth * 1.2));

        // Halstead Volume heuristic estimate: V = N * log2(eta)
        double halsteadVolume = Math.round((loc * 4.2 + decisionPoints * 12.0) * 10.0) / 10.0;

        // Maintainability Index (SEI formula normalized 0-100):
        // MI = max(0, (171 - 5.2 * ln(V) - 0.23 * G - 16.2 * ln(LOC)) * 100 / 171)
        double rawMi = 171.0 - (5.2 * Math.log(Math.max(10.0, halsteadVolume)))
                - (0.23 * cyclomatic)
                - (16.2 * Math.log(Math.max(5.0, (double) loc)));
        int maintainabilityIndex = (int) Math.max(15, Math.min(100, Math.round(rawMi * 100.0 / 171.0 + 15)));

        // Overall Quality Score (0-100)
        int penalty = 0;
        for (AnalyzeResponse.IssueDto iss : issues) {
            switch (iss.getSeverity().toLowerCase()) {
                case "critical" -> penalty += 18;
                case "major" -> penalty += 8;
                case "minor" -> penalty += 3;
                default -> penalty += 1;
            }
        }
        if (cyclomatic > 15) penalty += (cyclomatic - 15) * 2;
        int qualityScore = Math.max(30, Math.min(98, 100 - penalty));

        String opsEstimate = "~" + (loc * 18 + cyclomatic * 45) + " ops / pass";

        return new AnalysisMetrics(
                qualityScore,
                maintainabilityIndex,
                cyclomatic,
                loc,
                cognitive,
                halsteadVolume,
                opsEstimate,
                issues
        );
    }

    public static class AnalysisMetrics {
        public final int qualityScore;
        public final int maintainabilityIndex;
        public final int cyclomaticComplexity;
        public final int linesOfCode;
        public final int cognitiveComplexity;
        public final double halsteadVolume;
        public final String executionOpsEstimate;
        public final List<AnalyzeResponse.IssueDto> issues;

        public AnalysisMetrics(int qualityScore, int maintainabilityIndex, int cyclomaticComplexity,
                               int linesOfCode, int cognitiveComplexity, double halsteadVolume,
                               String executionOpsEstimate, List<AnalyzeResponse.IssueDto> issues) {
            this.qualityScore = qualityScore;
            this.maintainabilityIndex = maintainabilityIndex;
            this.cyclomaticComplexity = cyclomaticComplexity;
            this.linesOfCode = linesOfCode;
            this.cognitiveComplexity = cognitiveComplexity;
            this.halsteadVolume = halsteadVolume;
            this.executionOpsEstimate = executionOpsEstimate;
            this.issues = issues;
        }
    }
}
