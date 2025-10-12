package com.example.project_tracking.Controller;

import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
