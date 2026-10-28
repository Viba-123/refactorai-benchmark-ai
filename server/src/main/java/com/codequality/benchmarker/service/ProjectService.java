package com.codequality.benchmarker.service;

import com.codequality.benchmarker.model.Project;
import com.codequality.benchmarker.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByUpdatedAtDesc();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project createProject(Project project) {
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        if (project.getStars() == null) project.setStars(1);
        if (project.getSubmissionsCount() == null) project.setSubmissionsCount(0);
        if (project.getAvgScore() == null) project.setAvgScore(80.0);
        return projectRepository.save(project);
    }

    public void updateProjectMetrics(Long projectId, int score) {
        projectRepository.findById(projectId).ifPresent(p -> {
            int currentCount = p.getSubmissionsCount() != null ? p.getSubmissionsCount() : 0;
            double currentAvg = p.getAvgScore() != null ? p.getAvgScore() : 0.0;
            double newAvg = (currentAvg * currentCount + score) / (currentCount + 1);
            p.setSubmissionsCount(currentCount + 1);
            p.setAvgScore(Math.round(newAvg * 10.0) / 10.0);
            p.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(p);
        });
    }
}
