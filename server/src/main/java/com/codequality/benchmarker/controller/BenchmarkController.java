package com.codequality.benchmarker.controller;

import com.codequality.benchmarker.model.BenchmarkVersion;
import com.codequality.benchmarker.service.BenchmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/benchmark")
public class BenchmarkController {

    private final BenchmarkService benchmarkService;

    public BenchmarkController(BenchmarkService benchmarkService) {
        this.benchmarkService = benchmarkService;
    }

    @GetMapping
    public ResponseEntity<List<BenchmarkVersion>> getBenchmarks(@RequestParam(defaultValue = "1") Long projectId) {
        return ResponseEntity.ok(benchmarkService.getBenchmarksForProject(projectId));
    }

    @PostMapping("/version")
    public ResponseEntity<BenchmarkVersion> addVersion(@RequestBody BenchmarkVersion version) {
        return ResponseEntity.ok(benchmarkService.saveVersion(version));
    }
}
