package com.example.project_tracking.Controller;


import com.example.project_tracking.DTO.DataTransfer;
import com.example.project_tracking.DTO.LoginRequest;
import com.example.project_tracking.Service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
@CrossOrigin(origins="*")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request)
    {
        //System.out.println(request.getUsername()+" "+request.getPassword());
        DataTransfer emp = employeeService.userLogin(request.getUsername(),request.getPassword());
        if(emp==null){
            return new ResponseEntity<String>(HttpStatus.UNAUTHORIZED);
        }
        System.out.println(emp.toString());
        return ResponseEntity.ok(emp);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getById(@RequestParam long id)
    {
        DataTransfer emp = employeeService.getEmployeeById(id);
        if(emp==null){
            return new ResponseEntity<String>(HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(emp);
    }
}
