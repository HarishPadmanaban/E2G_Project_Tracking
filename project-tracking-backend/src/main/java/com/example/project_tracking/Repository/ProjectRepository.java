package com.example.project_tracking.Repository;

import com.example.project_tracking.Model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Long> {
    List<Project> findByManagerId(Long managerId);
}
