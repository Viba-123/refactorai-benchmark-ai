package com.codequality.benchmarker.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.datasource.url:jdbc:postgresql}")
    private String dbUrl;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "CodeQualityBenchmarker");
        status.put("version", "2.4.0");
        status.put("engine", "AST Static Engine (McCabe / Halstead)");
        status.put("database", dbUrl.contains("h2") ? "H2 (PostgreSQL Emulated)" : "PostgreSQL");
        status.put("aiAvailable", System.getenv("GEMINI_API_KEY") != null || System.getenv("OPENAI_API_KEY") != null);
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }
}
