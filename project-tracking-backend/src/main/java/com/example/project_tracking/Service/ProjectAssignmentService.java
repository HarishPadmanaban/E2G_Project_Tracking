package com.example.project_tracking.Service;

import com.example.project_tracking.DTO.ProjectAssignmentRequestDTO;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Model.ProjectAssignment;
import com.example.project_tracking.Repository.EmployeeRepository;
import com.example.project_tracking.Repository.ProjectAssignmentRepository;
import com.example.project_tracking.Repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectAssignmentService {

    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    public ProjectAssignmentService(ProjectAssignmentRepository projectAssignmentRepository,ProjectRepository projectRepository,EmployeeRepository employeeRepository) {
        this.projectAssignmentRepository = projectAssignmentRepository;
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<ProjectAssignment> assignProjectToEmployees(ProjectAssignmentRequestDTO dto) {
        Project project = projectRepository.findById(dto.getProject_id()).orElseThrow(() -> new RuntimeException("No project Found"));
        List<Long> employeeIds = dto.getEmployeeIds();


        List<ProjectAssignment> assignments = new ArrayList<>();

        for (Long empId : employeeIds) {
            Employee employee = employeeRepository.findById(empId)
                    .orElseThrow(() -> new RuntimeException("Employee not found: " + empId));

            ProjectAssignment assignment = new ProjectAssignment();
            assignment.setEmployee(employee);
            assignment.setProject(project);

            // Manager already in Project, so no need to set manually
            assignments.add(assignment);
        }

        return projectAssignmentRepository.saveAll(assignments);
    }

    public List<Employee> getEmployeesByProject(Long projectId) {
        List<ProjectAssignment> assignments = projectAssignmentRepository.findByProject_Id(projectId);
        return assignments.stream()
                .map(ProjectAssignment::getEmployee)
                .collect(Collectors.toList());
    }

    public List<Project> getProjectsByEmployee(Long employeeId) {
        List<ProjectAssignment> assignments = projectAssignmentRepository.findByEmployee_EmpId(employeeId);
        return assignments.stream()
                .map(ProjectAssignment::getProject)
                .collect(Collectors.toList());
    }


}
