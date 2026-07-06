package com.example.project_tracking.Controller;
import com.example.project_tracking.DTO.PivotResponseDTO;
import com.example.project_tracking.DTO.WorkDetailsRequest;
import com.example.project_tracking.DTO.WorkDetailsResponse;
import com.example.project_tracking.Service.PivotService;
import com.example.project_tracking.Service.WorkDetailsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/workdetails")
@CrossOrigin(origins = "*")
public class WorkDetailsController {

    private final WorkDetailsService workDetailsService;
    private final PivotService pivotService;

    public WorkDetailsController(WorkDetailsService workDetailsService,PivotService pivotService) {
        this.workDetailsService = workDetailsService;
        this.pivotService = pivotService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllLogsByprojectStatus()
    {
        return ResponseEntity.ok(workDetailsService.getAllLogsByProjectStatus());
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/pivot/agm")
    public ResponseEntity<PivotResponseDTO> getPivotForAGM(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        return ResponseEntity.ok(pivotService.getPivotForAGM(from, to));
    }

    @PreAuthorize("hasAnyRole('MANAGER')")
    @GetMapping("/pivot/manager/{managerId}")
    public ResponseEntity<PivotResponseDTO> getPivotForManager(
            @PathVariable Long managerId,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        return ResponseEntity.ok(pivotService.getPivotForManager(managerId, from, to));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/")
    public ResponseEntity<?> getAllLogs()
    {
        return ResponseEntity.ok(workDetailsService.getAll());
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/save")
    public ResponseEntity<?> saveWorkDetails(@RequestBody WorkDetailsRequest workDetails) {
        System.out.println(workDetails.toString());
        WorkDetailsResponse saved = workDetailsService.saveWorkDetails(workDetails);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<?> getDetails(@PathVariable Long id)
    {
        return ResponseEntity.ok(workDetailsService.getByDetailsId(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/active/{employeeId}")
    public ResponseEntity<WorkDetailsResponse> getActiveWork(@PathVariable Long employeeId) {
        WorkDetailsResponse activeWork = workDetailsService.getActiveWorkByEmployee(employeeId);
        return ResponseEntity.ok(activeWork);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/assigned-work/{id}")
    public ResponseEntity<?> getAssigned(@PathVariable Long id)
    {
        return ResponseEntity.ok(workDetailsService.getAssignedWork(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/employee/{id}")
    public ResponseEntity<List<WorkDetailsResponse>> getByEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(workDetailsService.getByEmployee(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/manager/{id}")
    public ResponseEntity<List<WorkDetailsResponse>> getByManager(@PathVariable Long id) {
        return ResponseEntity.ok(workDetailsService.getByManager(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/project/{id}")
    public ResponseEntity<List<WorkDetailsResponse>> getByProject(@PathVariable Long id) {
        return ResponseEntity.ok(workDetailsService.getByProject(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/activity/{id}")
    public ResponseEntity<List<WorkDetailsResponse>> getByActivity(@PathVariable Long id) {
        return ResponseEntity.ok(workDetailsService.getByActivity(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/employee/{empId}/project/{projId}")
    public ResponseEntity<List<WorkDetailsResponse>> getByEmployeeAndProject(@PathVariable Long empId, @PathVariable Long projId) {
        return ResponseEntity.ok(workDetailsService.getByEmployeeAndProject(empId, projId));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/manager/{mgrId}/project/{projId}")
    public ResponseEntity<List<WorkDetailsResponse>> getByManagerAndProject(@PathVariable Long mgrId, @PathVariable Long projId) {
        return ResponseEntity.ok(workDetailsService.getByManagerAndProject(mgrId, projId));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/project/{projId}/activity/{actId}")
    public ResponseEntity<List<WorkDetailsResponse>> getByProjectAndActivity(@PathVariable Long projId, @PathVariable Long actId) {
        return ResponseEntity.ok(workDetailsService.getByProjectAndActivity(projId, actId));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/stop/{employeeId}")
    public ResponseEntity<WorkDetailsResponse> stopWork(
            @PathVariable Long employeeId) {

        WorkDetailsResponse updated =
                workDetailsService.stopWork(employeeId);

        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/savefinal")
    public ResponseEntity<WorkDetailsResponse> saveFinal(@RequestBody WorkDetailsRequest request , @RequestParam Long activeWorkId) {
        System.out.println(request.toString());
        System.out.println(activeWorkId);
        WorkDetailsResponse saved = workDetailsService.saveFinalWork(request,activeWorkId);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/edit-log/{id}")
    public ResponseEntity<?> editWorkLog(@PathVariable long id,@RequestBody WorkDetailsRequest workDetails)
    {
        return ResponseEntity.ok(workDetailsService.editWorkDetail(id,workDetails));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/work/discard/{id}")
    public ResponseEntity<String> discardWork(@PathVariable Long id) {
        //System.out.println(id);
        workDetailsService.discardWork(id);
        return ResponseEntity.ok("Work entry discarded successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/rebuild-hours")
    public String rebuild() {

        workDetailsService.rebuildAllProjectHoursFromWorkDetails();

        return "Rebuild completed";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/fix-negative")
    public String fixNegative() {

        workDetailsService.fixNegativeWorkHours();

        return "Fixed!!!";
    }



}

