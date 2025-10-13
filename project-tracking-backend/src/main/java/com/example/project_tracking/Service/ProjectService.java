package com.example.project_tracking.Service;

import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

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

    public void createProject(Project project) {
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
        projectRepository.save(project);
    }
    public List<Project> getActiveProjectsByManager(Long managerId) {
        return projectRepository.findByManagerIdAndProjectStatusTrue(managerId);
    }

    public Project updateProjectHours(Long tlId,Long projectId, BigDecimal addModellingHours, BigDecimal addCheckingHours, BigDecimal addDetailingHours) {
        Optional<Project> optionalProject = projectRepository.findById(projectId);

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();

            // Safely add (handling nulls)
            project.setModellingHours(
                    project.getModellingHours() == null ? addModellingHours :
                            project.getModellingHours().add(addModellingHours)
            );

            project.setCheckingHours(
                    project.getCheckingHours() == null ? addCheckingHours :
                            project.getCheckingHours().add(addCheckingHours)
            );

            project.setDetailingHours(
                    project.getDetailingHours() == null ? addDetailingHours :
                            project.getDetailingHours().add(addDetailingHours)
            );

            project.setTlId(tlId);

            // Save back to repo
            return projectRepository.save(project);
        } else {
            throw new RuntimeException("Project not found with ID: " + projectId);
        }
    }


}

