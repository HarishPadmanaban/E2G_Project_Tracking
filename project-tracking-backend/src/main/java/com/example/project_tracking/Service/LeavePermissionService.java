package com.example.project_tracking.Service;
import com.example.project_tracking.Model.LeavePermission;
import com.example.project_tracking.Repository.LeavePermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeavePermissionService {

    private final LeavePermissionRepository leavePermissionRepository;

    public LeavePermissionService(LeavePermissionRepository leavePermissionRepository) {
        this.leavePermissionRepository = leavePermissionRepository;
    }

    public LeavePermission saveLeavePermission(LeavePermission leavePermission) {
        return leavePermissionRepository.save(leavePermission);
    }

    public List<LeavePermission> getAllRequests() {
        return leavePermissionRepository.findAll();
    }

    public Optional<LeavePermission> getRequestById(Long id) {
        return leavePermissionRepository.findById(id);
    }

    public List<LeavePermission> getRequestsByEmployeeId(Long empId) {
        return leavePermissionRepository.findByEmployeeId(empId);
    }

    public List<LeavePermission> getRequestsByManagerId(Long managerId) {
        return leavePermissionRepository.findByManagerId(managerId);
    }

    public void deleteRequest(Long id) {
        //leavePermissionRepository.deleteById(id);
        LeavePermission leave = leavePermissionRepository.findById(id).orElse(null);
        if(leave!=null){
            leave.setActive(false);
        }
    }

    public LeavePermission updateStatus(Long id, String status) {
        LeavePermission req = leavePermissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave/Permission not found"));
        req.setStatus(status);
        return leavePermissionRepository.save(req);
    }
}

