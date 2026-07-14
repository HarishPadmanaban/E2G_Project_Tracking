package com.example.project_tracking.Repository;

import com.example.project_tracking.Model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Long> , JpaSpecificationExecutor<Employee> {
    Optional<Employee> findByUsername(String username);


    // Fetch by username and password (for login verification)
    Optional<Employee> findByUsernameAndPassword(String username, String password);
    //Optional<Employee> findByUsername(String username);

    // You can also fetch manager or TL specific employees
    List<Employee> findByReportingTo(Employee e);
    List<Employee> findByIsTLTrueAndReportingTo_EmpId(Long managerEmpId);
    List<Employee> findByIsManagerTrue();
    List<Employee> findByReportingToAndEmpIdNotIn(Employee reportingTo, List<Long> empIds);

    @Query("""
       SELECT e
       FROM Employee e
       LEFT JOIN FETCH e.userRoles ur
       LEFT JOIN FETCH ur.role
       WHERE e.username = :username
       """)
    Optional<Employee> findByUsernameWithRoles(String username);
}
