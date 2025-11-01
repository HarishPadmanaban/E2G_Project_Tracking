package com.example.project_tracking.Controller;

import com.example.project_tracking.DTO.ProjectRequest;
import com.example.project_tracking.DTO.ProjectResponse;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/project")
@CrossOrigin(origins="http://localhost:3000")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectsByManagerId(@PathVariable long id)
    {
        System.out.println(id);
        return ResponseEntity.ok(projectService.getProjectsByManager(id));
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllProjects()
    {

        return ResponseEntity.ok(projectService.getAll());
    }

    @PostMapping("/save")
    public ResponseEntity<?> createProject(@RequestParam String projectName,String clientName,Long pmId,BigDecimal totalHours)
    {
        projectService.createProject(projectName,clientName,pmId,totalHours);
        return ResponseEntity.ok("Saved Successfully");
    }

    @GetMapping("/manager/{managerId}/active")
    public ResponseEntity<List<Project>> getActiveProjectsByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(projectService.getActiveProjectsByManager(managerId));
    }

    @GetMapping("/manager/{managerId}/not-assigned")
    public ResponseEntity<List<Project>> getActiveProjectsByManagerNotAssigned(@PathVariable Long managerId) {
        return ResponseEntity.ok(projectService.getProjectsByManagerNotAssigned(managerId));
    }

    @PutMapping("/{projectId}/add-hours")
    public Project addProjectHours(
            @PathVariable Long projectId,
            @RequestParam Long tlId,
            @RequestParam BigDecimal modellingHours,
            @RequestParam BigDecimal checkingHours,
            @RequestParam BigDecimal detailingHours
    ) {
        return projectService.updateProjectHours(tlId,projectId, modellingHours, checkingHours, detailingHours);
    }

    @PutMapping("/editproject")
    public ResponseEntity<?> editProject(@RequestBody ProjectRequest project)
    {
        return ResponseEntity.ok(projectService.editProject(project));
    }

    @PutMapping("/toggle-status/{id}")
    public ResponseEntity<ProjectResponse> changeStatus(@PathVariable Long id){
        return ResponseEntity.ok(projectService.toggleStatus(id));
    }

    @PutMapping("/set-extra-hours/{id}")
    public ResponseEntity<ProjectResponse> setExtraHours(@PathVariable Long id,@RequestParam BigDecimal extraHours){
        return ResponseEntity.ok(projectService.setExtra(id,extraHours));
    }
}
