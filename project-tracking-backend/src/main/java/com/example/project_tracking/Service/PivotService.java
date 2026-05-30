package com.example.project_tracking.Service;

import com.example.project_tracking.DTO.PivotResponseDTO;
import com.example.project_tracking.DTO.PivotRowDTO;
import com.example.project_tracking.Model.WorkDetails;
import com.example.project_tracking.Model.AssignedWork;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Activity;
import com.example.project_tracking.Repository.WorkDetailsRepository;
import com.example.project_tracking.Repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Builds the display-ready pivot payload.
 *
 * Processing that previously lived in WorkPivotTable.js:
 *   ① Parallel fetch of workDetails + projects  →  now a single service call
 *   ② projectMap lookup to inject assignedHours into the project label
 *   ③ Flat-row construction  (Employee, Manager, Project, Activity …)
 *   ④ Manager list extraction (for AGM dropdown)
 *   ⑤ isAGM routing logic (all-work vs manager-scoped)
 *
 * The frontend now only renders the pre-built {@link PivotResponseDTO}.
 */
@Service
public class PivotService {

    private final WorkDetailsRepository workDetailsRepository;
    private final ProjectRepository     projectRepository;

    public PivotService(WorkDetailsRepository workDetailsRepository,
                        ProjectRepository projectRepository) {
        this.workDetailsRepository = workDetailsRepository;
        this.projectRepository     = projectRepository;
    }

    // ── public API ────────────────────────────────────────────────────────────

    /**
     * Returns pivot data for an AGM (all active-project work logs).
     * Manager list is populated so the dropdown can be rendered.
     */
    public PivotResponseDTO getPivotForAGM() {
        List<WorkDetails> works = workDetailsRepository.findAllByActiveProjectStatus();
        return buildResponse(works, true);
    }

    /**
     * Returns pivot data scoped to a single manager's work logs.
     * Manager list is empty (not needed for non-AGM users).
     */
    public PivotResponseDTO getPivotForManager(Long managerId) {
        List<WorkDetails> works = workDetailsRepository
                .findByAssignedWorkId_Manager_EmpId(managerId);
        return buildResponse(works, false);
    }

    // ── core builder ─────────────────────────────────────────────────────────

    private PivotResponseDTO buildResponse(List<WorkDetails> works, boolean includeManagerList) {

        // ① Build projectId → assignedHours lookup (replaces frontend projectMap)
        Map<Long, String> projectLabelMap = buildProjectLabelMap();

        // ② Map each WorkDetails to a flat PivotRowDTO
        List<PivotRowDTO> rows = new ArrayList<>();
        int idx = 0;
        for (WorkDetails w : works) {
            if (Boolean.TRUE.equals(w.getIs_Deleted())) continue;

            AssignedWork aw = w.getAssignedWorkId();
            if (aw == null) continue;

            Employee emp      = aw.getEmployee();
            Employee mgr      = aw.getManager();
            Project  project  = aw.getProject();
            Activity activity = aw.getActivity();

            String projectLabel = project != null
                    ? projectLabelMap.getOrDefault(project.getId(), project.getProjectName())
                    : "Unassigned";

            PivotRowDTO row = new PivotRowDTO(
                    idx++,
                    emp      != null ? emp.getName()              : "Unknown",
                    mgr      != null ? mgr.getName()              : "Unknown",
                    projectLabel,
                    activity != null ? activity.getActivityName() : "No Activity",
                    w.getStatus()       != null ? w.getStatus()       : "Unknown",
                    w.getWorkHours()    != null ? w.getWorkHours()    : 0.0,
                    w.getDate()         != null ? w.getDate().toString() : "",
                    w.getAssignedWork() != null ? w.getAssignedWork() : ""
            );
            rows.add(row);
        }

        // ③ Build sorted manager list (AGM only)
        List<String> managerList = Collections.emptyList();
        if (includeManagerList) {
            managerList = rows.stream()
                    .map(PivotRowDTO::getManager)
                    .filter(m -> m != null && !m.isBlank() && !"Unknown".equals(m))
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());
        }

        return new PivotResponseDTO(rows, managerList);
    }

    /**
     * Creates a map from projectId → "ProjectName (N hrs)" label
     * exactly matching the frontend's string template:
     *   `${item.projectName || "Unassigned"} (${assigned} hrs)`
     */
    private Map<Long, String> buildProjectLabelMap() {
        return projectRepository.findAll().stream()
                .collect(Collectors.toMap(
                        Project::getId,
                        p -> {
                            String hrs = p.getAssignedHours() != null
                                    ? p.getAssignedHours().stripTrailingZeros().toPlainString()
                                    : "0";
                            return p.getProjectName() + " (" + hrs + " hrs)";
                        },
                        (a, b) -> a   // keep first on key collision (shouldn't happen)
                ));
    }
}
