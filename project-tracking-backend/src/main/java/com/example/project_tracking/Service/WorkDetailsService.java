package com.example.project_tracking.Service;
import com.example.project_tracking.DTO.WorkDetailsRequest;
import com.example.project_tracking.DTO.WorkDetailsResponse;
import com.example.project_tracking.Model.Activity;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Model.WorkDetails;
import com.example.project_tracking.Repository.ActivityRepository;
import com.example.project_tracking.Repository.EmployeeRepository;
import com.example.project_tracking.Repository.ProjectRepository;
import com.example.project_tracking.Repository.WorkDetailsRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkDetailsService {

    private final WorkDetailsRepository workDetailsRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final ActivityRepository activityRepository;

    public WorkDetailsService(WorkDetailsRepository workDetailsRepository,
                              EmployeeRepository employeeRepository,
                              ProjectRepository projectRepository,
                              ActivityRepository activityRepository) {
        this.workDetailsRepository = workDetailsRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.activityRepository = activityRepository;
    }

    public List<WorkDetailsResponse> getAll() {
        return workDetailsRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public WorkDetails saveWorkDetails(WorkDetailsRequest request) {
        WorkDetails workDetails = new WorkDetails();

        // Set managed entities
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        workDetails.setEmployee(employee);

        Employee manager = employeeRepository.findById(request.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        workDetails.setManager(manager);

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        workDetails.setProject(project);

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        workDetails.setActivity(activity);
        workDetails.setDate(request.getDate());
        workDetails.setWorkHours(request.getWorkHours());
        workDetails.setStartTime(request.getStartTime());
        workDetails.setEndTime(request.getEndTime());
        workDetails.setProjectActivity(request.getProjectActivity());
        workDetails.setAssignedWork(request.getAssignedWork());
        workDetails.setStatus(request.getStatus());
        workDetails.setRemarks(request.getRemarks());

        updateProjectWorkingHours(project, activity, request.getWorkHours());
        
        return workDetailsRepository.save(workDetails);
    }

    private void updateProjectWorkingHours(Project project, Activity activity, Double workHours) {

        String mainType = activity.getMainType();

        // Convert workHours to BigDecimal
        BigDecimal newWorkHours = BigDecimal.valueOf(workHours);

        // Update total working hours
        BigDecimal currentWorkingHours = project.getWorkingHours() != null ? project.getWorkingHours() : BigDecimal.ZERO;
        project.setWorkingHours(currentWorkingHours.add(newWorkHours));

        // Update specific type hours based on main_type
        switch (mainType.toLowerCase()) {
            case "modelling":
                BigDecimal currentModelling = project.getModellingTime() != null ? project.getModellingTime() : BigDecimal.ZERO;
                project.setModellingTime(currentModelling.add(newWorkHours));
                break;

            case "checking":
                BigDecimal currentChecking = project.getCheckingTime() != null ? project.getCheckingTime() : BigDecimal.ZERO;
                project.setCheckingTime(currentChecking.add(newWorkHours));
                break;

            case "detailing":
                BigDecimal currentDetailing = project.getDetailingTime() != null ? project.getDetailingTime() : BigDecimal.ZERO;
                project.setDetailingTime(currentDetailing.add(newWorkHours));
                break;

            default:
                System.out.println("Unknown main_type: " + mainType);
        }

        projectRepository.save(project);
    }

    public List<WorkDetailsResponse> getByEmployee(Long employeeId) {
        return workDetailsRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ 4. Get all logs by manager ID
    public List<WorkDetailsResponse> getByManager(Long managerId) {
        return workDetailsRepository.findByManagerId(managerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ 5. Get all logs by project ID
    public List<WorkDetailsResponse> getByProject(Long projectId) {
        return workDetailsRepository.findByProjectId(projectId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ 6. Get all logs by activity ID
    public List<WorkDetailsResponse> getByActivity(Long activityId) {
        return workDetailsRepository.findByActivityId(activityId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ 7. Get logs by employee & project
    public List<WorkDetailsResponse> getByEmployeeAndProject(Long empId, Long projId) {
        return workDetailsRepository.findByEmployeeAndProject(empId, projId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ 8. Get logs by manager & project
    public List<WorkDetailsResponse> getByManagerAndProject(Long mgrId, Long projId) {
        return workDetailsRepository.findByManagerAndProject(mgrId, projId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ 9. Get logs by project & activity
    public List<WorkDetailsResponse> getByProjectAndActivity(Long projId, Long actId) {
        return workDetailsRepository.findByProjectAndActivity(projId, actId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ Helper method to map entity → DTO
    private WorkDetailsResponse convertToResponse(WorkDetails work) {
        return new WorkDetailsResponse(
                work.getId(),
                work.getEmployee() != null ? work.getEmployee().getName() : null,
                work.getManager() != null ? work.getManager().getName() : null,
                work.getProject() != null ? work.getProject().getProjectName() : null,
                work.getActivity() != null ? work.getActivity().getActivityName() : null,
                work.getDate(),
                work.getWorkHours(),
                work.getStartTime(),
                work.getEndTime(),
                work.getProjectActivity(),
                work.getAssignedWork(),
                work.getStatus(),
                work.getRemarks()
        );
    }
}

