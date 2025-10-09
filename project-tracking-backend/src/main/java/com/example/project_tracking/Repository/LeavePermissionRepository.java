package com.example.project_tracking.Repository;

import com.example.project_tracking.Model.LeavePermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeavePermissionRepository extends JpaRepository<LeavePermission,Long> {
    List<LeavePermission> findByEmployeeId(Long employeeId);
    List<LeavePermission> findByManagerId(Long managerId);
}
