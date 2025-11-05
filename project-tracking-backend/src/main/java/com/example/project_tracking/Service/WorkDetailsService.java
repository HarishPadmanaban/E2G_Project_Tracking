package com.example.project_tracking.Service;
import com.example.project_tracking.DTO.AssignedWorkRequest;
import com.example.project_tracking.DTO.WorkDetailsRequest;
import com.example.project_tracking.DTO.WorkDetailsResponse;
import com.example.project_tracking.Model.*;
import com.example.project_tracking.Repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
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
    private final AssignedWorkRepository assignedWorkRepository;

    public WorkDetailsService(WorkDetailsRepository workDetailsRepository,
                              EmployeeRepository employeeRepository,
                              ProjectRepository projectRepository,
                              ActivityRepository activityRepository,
                              AssignedWorkRepository assignedWorkRepository) {
        this.workDetailsRepository = workDetailsRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.activityRepository = activityRepository;
        this.assignedWorkRepository = assignedWorkRepository;
    }

    public List<WorkDetailsResponse> getAll() {
        return workDetailsRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<WorkDetailsResponse> getAllLogsByProjectStatus() {
        return new ArrayList<>(workDetailsRepository.findAllByActiveProjectStatus()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public WorkDetailsResponse saveWorkDetails(WorkDetailsRequest request) {
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

        AssignedWork assigned = assignedWorkRepository.findById(request.getAssignedWorkId()).orElseThrow(()-> new RuntimeException("No assigned work is found"));

        workDetails.setAssignedWorkId(assigned);
        workDetails.setActivity(activity);
        workDetails.setDate(request.getDate());
        workDetails.setWorkHours(request.getWorkHours());
        workDetails.setStartTime(request.getStartTime());
        workDetails.setEndTime(request.getEndTime());
        workDetails.setProjectActivity(request.getProjectActivity());
        workDetails.setAssignedWork(request.getAssignedWork());
        workDetails.setStatus(request.getStatus());
        workDetails.setRemarks(request.getRemarks());
        
        return convertToResponse(workDetailsRepository.save(workDetails));
    }

    private void updateProjectWorkingHours(Project project, Activity activity, Double workHours) {
        String mainType = activity.getMainType().toLowerCase();
        BigDecimal newWorkHours = BigDecimal.valueOf(workHours);

        BigDecimal targetHours;
        BigDecimal currentTime;

        switch (mainType) {
            case "modelling":
                targetHours = project.getModellingHours() != null ? project.getModellingHours() : BigDecimal.ZERO;
                currentTime = project.getModellingTime() != null ? project.getModellingTime() : BigDecimal.ZERO;
                if (currentTime.add(newWorkHours).compareTo(targetHours) > 0) {
                    throw new RuntimeException("Modelling hours exceeded for project: " + project.getProjectName());
                }
                project.setModellingTime(currentTime.add(newWorkHours));
                break;

            case "checking":
                targetHours = project.getCheckingHours() != null ? project.getCheckingHours() : BigDecimal.ZERO;
                currentTime = project.getCheckingTime() != null ? project.getCheckingTime() : BigDecimal.ZERO;
                if (currentTime.add(newWorkHours).compareTo(targetHours) > 0) {
                    throw new RuntimeException("Checking hours exceeded for project: " + project.getProjectName());
                }
                project.setCheckingTime(currentTime.add(newWorkHours));
                break;

            case "detailing":
                targetHours = project.getDetailingHours() != null ? project.getDetailingHours() : BigDecimal.ZERO;
                currentTime = project.getDetailingTime() != null ? project.getDetailingTime() : BigDecimal.ZERO;
                if (currentTime.add(newWorkHours).compareTo(targetHours) > 0) {
                    throw new RuntimeException("Detailing hours exceeded for project: " + project.getProjectName());
                }
                project.setDetailingTime(currentTime.add(newWorkHours));
                break;

            default:
                throw new RuntimeException("Unknown main_type: " + mainType);
        }

        // Update total working hours
        BigDecimal currentWorkingHours = project.getWorkingHours() != null ? project.getWorkingHours() : BigDecimal.ZERO;
        project.setWorkingHours(currentWorkingHours.add(newWorkHours));

        projectRepository.save(project);
    }


    public List<WorkDetailsResponse> getByEmployee(Long employeeId) {
        return workDetailsRepository.findByEmployee_EmpId(employeeId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ 4. Get all logs by manager ID
    public List<WorkDetailsResponse> getByManager(Long managerId) {
        return workDetailsRepository.findByManager_EmpId(managerId)
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
                work.getEmployee().getEmpId(),
                work.getManager() != null ? work.getManager().getName() : null,
                work.getManager().getEmpId(),
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
                work.getActivity().getId(),
                work.getAssignedWorkId() != null ? work.getAssignedWorkId().getId() : null
        );
    }

    public WorkDetailsResponse stopWork(Long employeeId, String endTime, String workHoursStr) {
        WorkDetails work = workDetailsRepository
                .findTopByEmployee_EmpIdAndEndTimeIsNullOrderByIdDesc(employeeId)
                .orElseThrow(() -> new RuntimeException("No active work found for employee"));

        LocalTime startTime = work.getStartTime();
        LocalTime newEndTime = LocalTime.parse(endTime);

        // 2️⃣ Calculate work duration in hours BEFORE setting end time
        Duration duration = Duration.between(startTime, newEndTime);
        double calculatedHours = duration.toMinutes() / 60.0;

        // 3️⃣ Fetch related Project and Activity
        Project project = work.getProject();
        Activity activity = work.getActivity();

        // 4️⃣ Validate project-level target hours BEFORE saving
        validateTargetHours(project, activity, calculatedHours, true);

        // 5️⃣ If validation passes, set end time and work hours
        work.setEndTime(newEndTime);
        work.setWorkHours(calculatedHours);

        return convertToResponse(workDetailsRepository.save(work));
    }


    public WorkDetailsResponse saveFinalWork(WorkDetailsRequest request, Long activeWorkId) {
        WorkDetails work = workDetailsRepository.findById(activeWorkId).orElse(null);
        if(work==null) return null;
        work.setStartTime(request.getStartTime());
        work.setEndTime(request.getEndTime());
        work.setWorkHours(request.getWorkHours());
        work.setProjectActivity(request.getProjectActivity());
        work.setAssignedWork(request.getAssignedWork());
        work.setStatus(request.getStatus());
        work.setRemarks(request.getRemarks());

        if(request.getStatus().trim().toLowerCase().equals("completed")){
            AssignedWork assignedWork = assignedWorkRepository.findById(request.getAssignedWorkId()).orElseThrow(()-> new RuntimeException("No assigned activity found"));
            assignedWork.setStatus(request.getStatus().trim());
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        work.setProject(project);

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (request.getWorkHours() != null) {
            updateProjectWorkingHours(project, activity, request.getWorkHours());
        }

        return convertToResponse(workDetailsRepository.save(work));
    }


    public WorkDetailsResponse getActiveWorkByEmployee(Long employeeId) {
        Optional<WorkDetails> workOpt = workDetailsRepository
                .findTopByEmployee_EmpIdAndEndTimeIsNullOrderByIdDesc(employeeId);

        if (workOpt.isEmpty()) return null;

        WorkDetails work = workOpt.get();

        String employeeName = work.getEmployee().getName();
        String managerName = work.getManager().getName();
        String projectName = work.getProject() != null ? work.getProject().getProjectName() : "";
        String activityName = work.getActivity() != null ? work.getActivity().getActivityName() : "";

        return new WorkDetailsResponse(
                work.getId(),
                employeeName,
                work.getEmployee().getEmpId(),
                managerName,
                work.getManager().getEmpId(),
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
                work.getActivity().getId(),
                work.getAssignedWorkId() != null ? work.getAssignedWorkId().getId() : null

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
                work.getEmployee().getEmpId(),
                managerName,
                work.getManager().getEmpId(),
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
                work.getActivity().getId(),
                work.getAssignedWorkId() != null ? work.getAssignedWorkId().getId() : null
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

    private void validateTargetHours(Project project, Activity activity, double newHours, boolean isAdd) {
        String type = activity.getMainType().toLowerCase();
        BigDecimal hrs = BigDecimal.valueOf(newHours);

        switch (type) {
            case "modelling":
                BigDecimal modTime = project.getModellingTime() != null ? project.getModellingTime() : BigDecimal.ZERO;
                BigDecimal modTarget = project.getModellingHours() != null ? project.getModellingHours() : BigDecimal.ZERO;
                if (isAdd && modTime.add(hrs).compareTo(modTarget) > 0) {
                    throw new RuntimeException("Cannot add work: Modelling hours will exceed target limit for project " + project.getProjectName());
                }
                break;

            case "checking":
                BigDecimal checkTime = project.getCheckingTime() != null ? project.getCheckingTime() : BigDecimal.ZERO;
                BigDecimal checkTarget = project.getCheckingHours() != null ? project.getCheckingHours() : BigDecimal.ZERO;
                if (isAdd && checkTime.add(hrs).compareTo(checkTarget) > 0) {
                    throw new RuntimeException("Cannot add work: Checking hours will exceed target limit for project " + project.getProjectName());
                }
                break;

            case "detailing":
                BigDecimal detTime = project.getDetailingTime() != null ? project.getDetailingTime() : BigDecimal.ZERO;
                BigDecimal detTarget = project.getDetailingHours() != null ? project.getDetailingHours() : BigDecimal.ZERO;
                if (isAdd && detTime.add(hrs).compareTo(detTarget) > 0) {
                    throw new RuntimeException("Cannot add work: Detailing hours will exceed target limit for project " + project.getProjectName());
                }
                break;

            default:
                throw new RuntimeException("Unknown main type: " + type);
        }
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

        if (!Objects.equals(oldWork.getProject().getId(), project.getId())) {
            // Project changed
            Project oldProject = oldWork.getProject();

            // Subtract old hours from old project
            makeChangeInActivity(oldProject, oldWork.getActivity(), false, oldHours);

            // ✅ Validate before adding to new project
            validateTargetHours(project, activity, newHours, true);
            makeChangeInActivity(project, activity, true, newHours);

        } else if (!Objects.equals(oldWork.getActivity().getMainType(), activity.getMainType())) {
            // Activity type changed
            makeChangeInActivity(oldWork.getProject(), oldWork.getActivity(), false, oldHours);

            // ✅ Validate before adding new activity type
            validateTargetHours(oldWork.getProject(), activity, newHours, true);
            makeChangeInActivity(oldWork.getProject(), activity, true, newHours);

        } else if (!Objects.equals(oldHours, newHours)) {
            // Only hours changed
            double diff = newHours - oldHours;
            if (diff > 0) {
                // ✅ Check if adding the difference will exceed limit
                validateTargetHours(oldWork.getProject(), oldWork.getActivity(), diff, true);
                makeChangeInActivity(oldWork.getProject(), oldWork.getActivity(), true, diff);
            } else {
                makeChangeInActivity(oldWork.getProject(), oldWork.getActivity(), false, Math.abs(diff));
            }
        }

        // ✅ Update other fields
        System.out.println(request.getStatus());
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

    public void discardWork(Long workId) {
        WorkDetails work = workDetailsRepository.findById(workId)
                .orElseThrow(() -> new RuntimeException("Work entry not found for ID: " + workId));
        System.out.println(work.toString());
        workDetailsRepository.delete(work);
    }

    public WorkDetailsResponse getAssignedWork(Long id) {
        WorkDetails work = workDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work entry not found for ID: " + id));
        System.out.println(work.toString());
        System.out.println(work.getAssignedWorkId().getId());
        return convertToResponse(work);
    }
}

