package com.example.project_tracking.Service;

import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getProjectsByManager(Long managerId) {
        return projectRepository.findByManagerId(managerId);
    }

    public List<Project> getAll(){
        return projectRepository.findAll();
    }
    public Project createProject(Project project) {
        if(project.getModellingHours()==null){
            project.setModellingHours(BigDecimal.ZERO);
        }

        if(project.getCheckingHours()==null){
            project.setCheckingHours(BigDecimal.ZERO);
        }

        if(project.getDetailingHours()==null){
            project.setDetailingHours(BigDecimal.ZERO);
        }

        project.setModellingTime(BigDecimal.ZERO);
        project.setCheckingTime(BigDecimal.ZERO);
        project.setDetailingTime(BigDecimal.ZERO);
        project.setWorkingHours(BigDecimal.ZERO);
        return projectRepository.save(project);
    }
}

