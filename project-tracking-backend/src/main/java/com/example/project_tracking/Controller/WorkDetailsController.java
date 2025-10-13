package com.example.project_tracking.Controller;

import com.example.project_tracking.DTO.WorkDetailsRequest;
import com.example.project_tracking.DTO.WorkDetailsResponse;
import com.example.project_tracking.Model.WorkDetails;
import com.example.project_tracking.Service.WorkDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workdetails")
@CrossOrigin(origins = "*")
public class WorkDetailsController {

    private final WorkDetailsService workDetailsService;

    public WorkDetailsController(WorkDetailsService workDetailsService) {
        this.workDetailsService = workDetailsService;
    }

    @GetMapping
    public ResponseEntity<?> getAllLogs()
    {
        return ResponseEntity.ok(workDetailsService.getAll());
    }

    @PostMapping("/save")
    public ResponseEntity<WorkDetails> saveWorkDetails(@RequestBody WorkDetailsRequest workDetails) {
        WorkDetails saved = workDetailsService.saveWorkDetails(workDetails);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<List<WorkDetailsResponse>> getByEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(workDetailsService.getByEmployee(id));
    }

    @GetMapping("/manager/{id}")
    public ResponseEntity<List<WorkDetailsResponse>> getByManager(@PathVariable Long id) {
        return ResponseEntity.ok(workDetailsService.getByManager(id));
    }

    @GetMapping("/project/{id}")
    public ResponseEntity<List<WorkDetailsResponse>> getByProject(@PathVariable Long id) {
        return ResponseEntity.ok(workDetailsService.getByProject(id));
    }

    @GetMapping("/activity/{id}")
    public ResponseEntity<List<WorkDetailsResponse>> getByActivity(@PathVariable Long id) {
        return ResponseEntity.ok(workDetailsService.getByActivity(id));
    }

    @GetMapping("/employee/{empId}/project/{projId}")
    public ResponseEntity<List<WorkDetailsResponse>> getByEmployeeAndProject(@PathVariable Long empId, @PathVariable Long projId) {
        return ResponseEntity.ok(workDetailsService.getByEmployeeAndProject(empId, projId));
    }

    @GetMapping("/manager/{mgrId}/project/{projId}")
    public ResponseEntity<List<WorkDetailsResponse>> getByManagerAndProject(@PathVariable Long mgrId, @PathVariable Long projId) {
        return ResponseEntity.ok(workDetailsService.getByManagerAndProject(mgrId, projId));
    }

    @GetMapping("/project/{projId}/activity/{actId}")
    public ResponseEntity<List<WorkDetailsResponse>> getByProjectAndActivity(@PathVariable Long projId, @PathVariable Long actId) {
        return ResponseEntity.ok(workDetailsService.getByProjectAndActivity(projId, actId));
    }
}

