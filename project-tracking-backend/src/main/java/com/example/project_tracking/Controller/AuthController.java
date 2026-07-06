package com.example.project_tracking.Controller;

import com.example.project_tracking.DTO.DataTransfer;
import com.example.project_tracking.DTO.LoginRequest;
import com.example.project_tracking.DataLoader.SecurityMigrationRunner;
import com.example.project_tracking.Service.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins="*")
public class AuthController {

    @Autowired
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final EmployeeService employeeService;
    @Autowired
    private final SecurityMigrationRunner migrationService;

    public AuthController(AuthenticationManager authenticationManager, EmployeeService employeeService, SecurityMigrationRunner migrationService) {
        this.authenticationManager = authenticationManager;
        this.employeeService = employeeService;
        this.migrationService = migrationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
                                   HttpServletRequest request) {

        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            request.getSession(true).setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    context
            );

            // 🔥 Fetch employee details (empId = username)
            Long empId = Long.parseLong(loginRequest.getUsername());

            DataTransfer emp = employeeService.getEmployeeById(empId);

            if (emp == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // 🔥 Get authority
            String authority = authentication.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority();

            // 🔥 Attach authority
            emp.setAuthority(authority);

            return ResponseEntity.ok(emp);

        } catch (BadCredentialsException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");

        }
    }

    @GetMapping("/")
    public String testing()
    {
        return "Testing Endpoint";
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/security")
    public ResponseEntity<String> migrateSecurity() {

        migrationService.migrate();

        return ResponseEntity.ok("Security migration completed successfully.");
    }
}