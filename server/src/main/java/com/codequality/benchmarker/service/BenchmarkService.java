package com.codequality.benchmarker.service;

import com.codequality.benchmarker.model.BenchmarkVersion;
import com.codequality.benchmarker.repository.BenchmarkVersionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BenchmarkService {

    private final BenchmarkVersionRepository benchmarkRepository;

    public BenchmarkService(BenchmarkVersionRepository benchmarkRepository) {
        this.benchmarkRepository = benchmarkRepository;
    }

    public List<BenchmarkVersion> getBenchmarksForProject(Long projectId) {
        List<BenchmarkVersion> versions = benchmarkRepository.findByProjectIdOrderByIdAsc(projectId);
        if (versions.isEmpty()) {
            return benchmarkRepository.findAllByOrderByIdAsc();
        }
        return versions;
    }

    public BenchmarkVersion saveVersion(BenchmarkVersion version) {
        if (Boolean.TRUE.equals(version.getIsCurrent())) {
            // Unset current on other versions for the same project
            List<BenchmarkVersion> existing = benchmarkRepository.findByProjectIdOrderByIdAsc(version.getProjectId());
            for (BenchmarkVersion b : existing) {
                b.setIsCurrent(false);
            }
            benchmarkRepository.saveAll(existing);
        }
        return benchmarkRepository.save(version);
    }
}
