package com.example.project_tracking.Repository;

import com.example.project_tracking.Model.LeavePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface LeavePermissionRepository extends JpaRepository<LeavePermission,Long>, JpaSpecificationExecutor<LeavePermission> {
    List<LeavePermission> findByEmployee_EmpId(Long employeeId);
    List<LeavePermission> findByManager_EmpId(Long managerId);
}
