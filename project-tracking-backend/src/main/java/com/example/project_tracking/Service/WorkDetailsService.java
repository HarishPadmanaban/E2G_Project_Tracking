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
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
                work.getEmployee().getId(),
                work.getManager() != null ? work.getManager().getName() : null,
                work.getManager().getId(),
                work.getProject() != null ? work.getProject().getProjectName() : null,
                work.getActivity() != null ? work.getActivity().getActivityName() : null,
                work.getDate(),
                work.getWorkHours(),
                work.getStartTime(),
                work.getEndTime(),
                work.getProjectActivity(),
                work.getAssignedWork(),
                work.getStatus(),
                work.getRemarks(),
                work.getProject().getId(),
                work.getActivity().getId()
        );
    }

    public WorkDetails stopWork(Long employeeId, String endTime, String workHoursStr) {
        WorkDetails work = workDetailsRepository.findTopByEmployeeIdAndEndTimeIsNullOrderByIdDesc(employeeId)
                .orElseThrow(() -> new RuntimeException("No active work found for employee"));

        work.setEndTime(LocalTime.parse(endTime));
        try {
            Double hours = Double.parseDouble(workHoursStr);
            work.setWorkHours(hours);
        } catch (NumberFormatException e) {
            work.setWorkHours(0.0);
        }

        return workDetailsRepository.save(work);
    }

    public WorkDetails saveFinalWork(WorkDetailsRequest request, Long activeWorkId) {
        WorkDetails work = workDetailsRepository.findById(activeWorkId).orElse(null);
        if(work==null) return null;
        work.setStartTime(request.getStartTime());
        work.setEndTime(request.getEndTime());
        work.setWorkHours(request.getWorkHours());
        work.setProjectActivity(request.getProjectActivity());
        work.setAssignedWork(request.getAssignedWork());
        work.setStatus(request.getStatus());
        work.setRemarks(request.getRemarks());

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        work.setProject(project);

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (request.getWorkHours() != null) {
            updateProjectWorkingHours(project, activity, request.getWorkHours());
        }

        return workDetailsRepository.save(work);
    }


    public WorkDetailsResponse getActiveWorkByEmployee(Long employeeId) {
        Optional<WorkDetails> workOpt = workDetailsRepository
                .findTopByEmployeeIdAndEndTimeIsNullOrderByIdDesc(employeeId);

        if (workOpt.isEmpty()) return null;

        WorkDetails work = workOpt.get();

        String employeeName = work.getEmployee().getName();
        String managerName = work.getManager().getName();
        String projectName = work.getProject() != null ? work.getProject().getProjectName() : "";
        String activityName = work.getActivity() != null ? work.getActivity().getActivityName() : "";

        return new WorkDetailsResponse(
                work.getId(),
                employeeName,
                work.getEmployee().getId(),
                managerName,
                work.getManager().getId(),
                projectName,
                activityName,
                work.getDate(),
                work.getWorkHours(),
                work.getStartTime(),
                work.getEndTime(),
                work.getProjectActivity(),
                work.getAssignedWork(),
                work.getStatus(),
                work.getRemarks(),
                work.getProject().getId(),
                work.getActivity().getId()
        );
    }

    public WorkDetailsResponse getByDetailsId(Long id) {
        WorkDetails work =  workDetailsRepository.findById(id).orElse(null);
        if(work==null) return null;

        String employeeName = work.getEmployee().getName();
        String managerName = work.getManager().getName();
        String projectName = work.getProject() != null ? work.getProject().getProjectName() : "";
        String activityName = work.getActivity() != null ? work.getActivity().getActivityName() : "";
        return new WorkDetailsResponse(
                work.getId(),
                employeeName,
                work.getEmployee().getId(),
                managerName,
                work.getManager().getId(),
                projectName,
                activityName,
                work.getDate(),
                work.getWorkHours(),
                work.getStartTime(),
                work.getEndTime(),
                work.getProjectActivity(),
                work.getAssignedWork(),
                work.getStatus(),
                work.getRemarks(),
                work.getProject().getId(),
                work.getActivity().getId()
        );
    }

    public void makeChangeInActivity(Project project, Activity activity, boolean isAdd, double hours) {
        String type = activity.getMainType().toLowerCase();
        BigDecimal hrs = BigDecimal.valueOf(hours);

        // Update specific time
        switch (type) {
            case "modelling":
                project.setModellingTime(isAdd
                        ? project.getModellingTime().add(hrs)
                        : project.getModellingTime().subtract(hrs));
                break;

            case "checking":
                project.setCheckingTime(isAdd
                        ? project.getCheckingTime().add(hrs)
                        : project.getCheckingTime().subtract(hrs));
                break;

            case "detailing":
                project.setDetailingTime(isAdd
                        ? project.getDetailingTime().add(hrs)
                        : project.getDetailingTime().subtract(hrs));
                break;
        }

        // Update total working hours
        project.setWorkingHours(isAdd
                ? project.getWorkingHours().add(hrs)
                : project.getWorkingHours().subtract(hrs));

        projectRepository.save(project);
    }


    public WorkDetailsResponse editWorkDetail(long id, WorkDetailsRequest request) {
        WorkDetails oldWork = workDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work detail not found for id: " + id));

        // ✅ Fetch related entities
        Employee manager = employeeRepository.findById(request.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        Double oldHours = oldWork.getWorkHours() != null ? oldWork.getWorkHours() : 0.0;
        Double newHours = request.getWorkHours() != null ? request.getWorkHours() : oldHours;

        // ✅ Update working hour tracking correctly
        if (!Objects.equals(oldWork.getProject().getId(), project.getId())) {
            // Project changed
            Project oldProject = oldWork.getProject();

            // Subtract old hours from old project
            makeChangeInActivity(oldProject, oldWork.getActivity(), false, oldHours);

            // Add new hours to new project
            makeChangeInActivity(project, activity, true, newHours);

        } else if (!Objects.equals(oldWork.getActivity().getMainType(), activity.getMainType())) {
            // Activity type changed
            makeChangeInActivity(oldWork.getProject(), oldWork.getActivity(), false, oldHours);
            makeChangeInActivity(oldWork.getProject(), activity, true, newHours);

        } else if (!Objects.equals(oldHours, newHours)) {
            // Only hours changed
            makeChangeInActivity(oldWork.getProject(), oldWork.getActivity(), false, oldHours);
            makeChangeInActivity(oldWork.getProject(), activity, true, newHours);
        }

        // ✅ Update other fields
        oldWork.setManager(manager);
        oldWork.setProject(project);
        oldWork.setActivity(activity);
        oldWork.setDate(request.getDate());
        oldWork.setWorkHours(newHours);
        oldWork.setStartTime(request.getStartTime());
        oldWork.setEndTime(request.getEndTime());
        oldWork.setProjectActivity(request.getProjectActivity());
        oldWork.setAssignedWork(request.getAssignedWork());
        oldWork.setStatus(request.getStatus());
        oldWork.setRemarks(request.getRemarks());

        return convertToResponse(workDetailsRepository.save(oldWork));
    }


}

