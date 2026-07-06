package com.example.project_tracking.DataLoader;

import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Role;
import com.example.project_tracking.Model.UserRole;
import com.example.project_tracking.Repository.EmployeeRepository;
import com.example.project_tracking.Repository.RoleRepository;
import com.example.project_tracking.Repository.UserRoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SecurityMigrationRunner{

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public SecurityMigrationRunner(EmployeeRepository employeeRepository,
                                   RoleRepository roleRepository,
                                   UserRoleRepository userRoleRepository,
                                   PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public void migrate() {

        List<Employee> employees = employeeRepository.findAll();

        for (Employee employee : employees) {

            // Encode password only if it is not already BCrypt
            if (!employee.getPassword().startsWith("$2a$")
                    && !employee.getPassword().startsWith("$2b$")
                    && !employee.getPassword().startsWith("$2y$")) {

                employee.setPassword(
                        passwordEncoder.encode(employee.getPassword()));

                employeeRepository.save(employee);
            }

            // Skip if role already assigned
            if (userRoleRepository.existsByUser(employee)) {
                continue;
            }

            UserRole userRole = new UserRole();
            userRole.setUser(employee);
            userRole.setRole(getRole(employee.getDesignationCategory()));

            userRoleRepository.save(userRole);
        }

        System.out.println("Security migration completed successfully.");
    }

    private Role getRole(String category) {

        String roleName = switch (category.toLowerCase()) {
            case "admin", "assistant general manager" -> "ROLE_ADMIN";
            case "project manager" -> "ROLE_MANAGER";
            case "project coordinator" -> "ROLE_PROJECT_COORDINATOR";
            default -> "ROLE_EMPLOYEE";
        };

        return roleRepository.findByName(roleName)
                .orElseThrow(() ->
                        new RuntimeException("Role not found: " + roleName));
    }
}

