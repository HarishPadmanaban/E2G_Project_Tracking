package com.example.project_tracking.Controller;

import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/project")
@CrossOrigin(origins="*")
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
    public ResponseEntity<?> createProject(@RequestBody Project p)
    {
        projectService.createProject(p);
        return ResponseEntity.ok("Saved Successfully");
    }

    @GetMapping("/manager/{managerId}/active")
    public ResponseEntity<List<Project>> getActiveProjectsByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(projectService.getActiveProjectsByManager(managerId));
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
}
