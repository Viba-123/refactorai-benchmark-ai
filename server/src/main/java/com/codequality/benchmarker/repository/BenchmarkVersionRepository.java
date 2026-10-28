package com.codequality.benchmarker.repository;

import com.codequality.benchmarker.model.BenchmarkVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BenchmarkVersionRepository extends JpaRepository<BenchmarkVersion, Long> {
    List<BenchmarkVersion> findByProjectIdOrderByIdAsc(Long projectId);
    List<BenchmarkVersion> findAllByOrderByIdAsc();
}
