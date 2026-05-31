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
 * Change from previous version:
 *   PivotRowDTO constructor call gains one argument — activity.getMainType().
 *   capitalizeMainType() normalises the raw DB value ("modeling" → "Modeling")
 *   so it matches the filter labels shown in the frontend dropdown exactly.
 *   No other logic is changed.
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

    public PivotResponseDTO getPivotForAGM() {
        List<WorkDetails> works = workDetailsRepository.findAllByActiveProjectStatus();
        return buildResponse(works, true);
    }

    public PivotResponseDTO getPivotForManager(Long managerId) {
        List<WorkDetails> works = workDetailsRepository
                .findByAssignedWorkId_Manager_EmpId(managerId);
        return buildResponse(works, false);
    }

    // ── core builder ─────────────────────────────────────────────────────────

    private PivotResponseDTO buildResponse(List<WorkDetails> works, boolean includeManagerList) {

        Map<Long, String> projectLabelMap = buildProjectLabelMap();

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

            // ── NEW: read mainType from Activity, normalise capitalisation ──
            String mainType = activity != null && activity.getMainType() != null
                    ? capitalizeMainType(activity.getMainType())
                    : "Unknown";

            PivotRowDTO row = new PivotRowDTO(
                    idx++,
                    emp      != null ? emp.getName()              : "Unknown",
                    mgr      != null ? mgr.getName()              : "Unknown",
                    projectLabel,
                    activity != null ? activity.getActivityName() : "No Activity",
                    mainType,                                        // ← NEW
                    w.getStatus()       != null ? w.getStatus()       : "Unknown",
                    w.getWorkHours()    != null ? w.getWorkHours()    : 0.0,
                    w.getDate()         != null ? w.getDate().toString() : "",
                    w.getAssignedWork() != null ? w.getAssignedWork() : ""
            );
            rows.add(row);
        }

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

    // ── helpers ───────────────────────────────────────────────────────────────

    /**
     * Normalises Activity.mainType to title-case so it matches the
     * frontend dropdown labels: "Modeling" / "Checking" / "Detailing" / "Studying".
     * Handles DB values stored as all-lowercase ("modeling") or mixed case.
     */
    private String capitalizeMainType(String raw) {
        if (raw == null || raw.isBlank()) return "Unknown";
        String trimmed = raw.trim();
        return Character.toUpperCase(trimmed.charAt(0)) + trimmed.substring(1).toLowerCase();
    }

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
                        (a, b) -> a
                ));
    }
}