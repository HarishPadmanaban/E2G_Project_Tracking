package com.example.project_tracking.Service;

import com.example.project_tracking.DTO.ProjectRequest;
import com.example.project_tracking.DTO.ProjectResponse;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Repository.EmployeeRepository;
import com.example.project_tracking.Repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    public ProjectService(ProjectRepository projectRepository,EmployeeRepository employeeRepository) {
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Project> getProjectsByManager(Long managerId) {

        List<Project> projects = projectRepository.findByManagerId(managerId);

        // Filter based on modellingHour being not null
        return projects.stream()
                .filter(p -> p.getModellingHours() != null)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getAll(){

        List<Project> projectList = projectRepository.findAll();
        return projectList.stream().map(this::convertToResponse).toList();
    }

    public ProjectResponse convertToResponse(Project project){
        Employee e = employeeRepository.findById(project.getManagerId()).orElse(null);
        //System.out.println(project+" "+e.toString());
        ProjectResponse response = new ProjectResponse(
                project.getId(),
                project.getProjectName(),
                project.getClientName(),
                project.getManagerId(),
                e.getName(), // fetch manager name from DB
                project.getAssignedHours(),
                project.getWorkingHours(),
                project.getAssignedDate(),
                project.getProjectStatus(),
                project.getSoftDelete(),
                project.getModellingHours(),
                project.getCheckingHours(),
                project.getDetailingHours(),
                project.getModellingTime(),
                project.getCheckingTime(),
                project.getDetailingTime(),
                project.getStartDate(),
                project.getCompletedDate(),
                project.getStudyHours(),
                project.getStudyHoursTracking(),
                project.getExtraHours(),
                project.getExtraHoursTracking()
        );
        return response;
    }

    public void createProject(String projectName,String clientName,Long pmId,BigDecimal totalHours) {
        Project project=new Project();

        project.setProjectName(projectName);
        project.setClientName(clientName);
        project.setManagerId(pmId);
        project.setAssignedHours(totalHours);
        project.setAssignedDate(LocalDate.now());

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
            if(project.getTlId()!=null && !(Objects.equals(project.getWorkingHours(), BigDecimal.ZERO))) {
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
            }
            else{
                return project;
            }
        } else {
            throw new RuntimeException("Project not found with ID: " + projectId);
        }
    }

    public List<Project> getProjectsByManagerNotAssigned(Long managerId) {

        List<Project> projects = projectRepository.findByManagerId(managerId);

        // Filter based on modellingHour being not null
        return projects.stream()
                .filter(p -> p.getModellingHours() == null)
                .collect(Collectors.toList());
    }

    public Project editProject(ProjectRequest projectRequest)
    {
        Project old = projectRepository.findById(projectRequest.getId()).orElse(null);
        old.setAssignedHours(projectRequest.getAssignedHours());
        old.setModellingHours(projectRequest.getModellingHours());
        old.setCheckingHours(projectRequest.getCheckingHours());
        old.setDetailingHours(projectRequest.getDetailingHours());
        old.setManagerId(projectRequest.getManagerId());
        old.setProjectName(projectRequest.getProjectName());
        old.setClientName(projectRequest.getClientName());
        old.setProjectStatus(projectRequest.isProjectStatus());
        projectRepository.save(old);
        return old;
    }

    public ProjectResponse toggleStatus(Long id) {
        Project project = projectRepository.findById(id).orElseThrow(()-> new RuntimeException("No project found with id "+id));
        project.setProjectStatus(false);
        return convertToResponse(projectRepository.save(project));
    }

    public ProjectResponse setExtra(Long id,BigDecimal extraHours) {
        Project project = projectRepository.findById(id).orElseThrow(()-> new RuntimeException("No project found with id "+id));
        project.setExtraHours(extraHours);
        return convertToResponse(projectRepository.save(project));
    }
}

