package com.example.project_tracking.Controller;
import com.example.project_tracking.Model.LeavePermission;
import com.example.project_tracking.Service.LeavePermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/leave")
@CrossOrigin(origins = "*")
public class LeavePermissionController {

    private final LeavePermissionService leavePermissionService;

    public LeavePermissionController(LeavePermissionService leavePermissionService) {
        this.leavePermissionService = leavePermissionService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeavePermission leavePermission) {
        leavePermissionService.saveLeavePermission(leavePermission);
        return ResponseEntity.ok("Successfully saved");
    }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<?> getByEmployee(@PathVariable Long empId) {
        return ResponseEntity.ok(leavePermissionService.getRequestsByEmployeeId(empId));
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<?> getByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(leavePermissionService.getRequestsByManagerId(managerId));
    }

    @GetMapping("/{id}")
    public LeavePermission getById(@PathVariable Long id) {
        return leavePermissionService.getRequestById(id)
                .orElseThrow(() -> new RuntimeException("Leave/Permission not found"));
    }

    @PutMapping("/status/{id}")
    public LeavePermission updateStatus(@PathVariable Long id, @RequestParam String status) {
        return leavePermissionService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable Long id) {
        leavePermissionService.deleteRequest(id);
    }
}

