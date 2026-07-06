package com.example.project_tracking.Repository;

import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    boolean existsByUser(Employee user);
}
