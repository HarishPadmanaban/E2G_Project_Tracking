package com.example.project_tracking.Service;

import com.example.project_tracking.DTO.LeavePermissionResponse;
import com.example.project_tracking.Model.LeavePermission;
import com.example.project_tracking.Repository.LeavePermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeavePermissionService {

    private final LeavePermissionRepository leavePermissionRepository;

    public LeavePermissionService(LeavePermissionRepository leavePermissionRepository) {
        this.leavePermissionRepository = leavePermissionRepository;
    }

    // Save leave/permission request (still uses entity)
    public void saveLeavePermission(LeavePermission leavePermission) {
        leavePermissionRepository.save(leavePermission);
    }

    // Get all requests as DTOs
    public List<LeavePermissionResponse> getAllRequests() {
        return leavePermissionRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get request by ID as DTO
    public Optional<LeavePermissionResponse> getRequestById(Long id) {
        return leavePermissionRepository.findById(id)
                .map(this::mapToDTO);
    }

    // Get requests by Employee ID as DTOs
    public List<LeavePermissionResponse> getRequestsByEmployeeId(Long empId) {
        return leavePermissionRepository.findByEmployeeId(empId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get requests by Manager ID as DTOs
    public List<LeavePermissionResponse> getRequestsByManagerId(Long managerId) {
        return leavePermissionRepository.findByManagerId(managerId)
                .stream()
                .filter(r -> "Pending".equalsIgnoreCase(r.getStatus()) && Boolean.TRUE.equals(r.isActive()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Soft delete request
    public void deleteRequest(Long id) {
        LeavePermission leave = leavePermissionRepository.findById(id).orElse(null);
        if (leave != null) {
            leave.setActive(false);
            leavePermissionRepository.save(leave); // persist soft delete
        }
    }

    // Update status and return DTO
    public LeavePermissionResponse updateStatus(Long id, String status) {
        LeavePermission req = leavePermissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave/Permission not found"));
        req.setStatus(status);
        LeavePermission updated = leavePermissionRepository.save(req);
        return mapToDTO(updated);
    }

    // -----------------------
    // Helper method to convert entity → DTO
    private LeavePermissionResponse mapToDTO(LeavePermission lp) {
        return new LeavePermissionResponse(
                lp.getId(),
                lp.getEmployee().getName(),
                lp.getManager().getName(),
                lp.getType(),
                lp.getLeaveDuration(),
                lp.getFromDate(),
                lp.getToDate(),
                lp.getLeaveDays(),
                lp.getLeaveType(),
                lp.getReason(),
                lp.getAppliedDate(),
                lp.getPermissionInTime(),
                lp.getPermissionOutTime(),
                lp.getPermissionHours(),
                lp.getStatus(),
                lp.isActive()
        );
    }
}
