package com.example.project_tracking.Service;

import com.example.project_tracking.DTO.DataTransfer;
import com.example.project_tracking.DTO.ProjectRequest;
import com.example.project_tracking.DTO.WorkDetailsResponse;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Model.WorkDetails;
import com.example.project_tracking.Repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    private  final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public DataTransfer userLogin(String username, String password) {
        Employee employee = employeeRepository.findByUsernameAndPassword(username, password)
                .orElse(null);

        if (employee != null) {
            // Map Employee entity to DataTransfer DTO
            return new DataTransfer(
                    employee.getId(),
                    employee.getEmpId(),
                    employee.getName(),
                    employee.getDesignation(),
                    employee.getIsManager(),  // isManager
                    employee.getIsTL(),       // isTL
                    employee.getReportingTo() // reporting manager, DTO constructor handles null
            );
        } else {
            return null; // Will trigger 401 in controller
        }
    }

    public DataTransfer getEmployeeById(long id)
    {
        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee != null) {
            // Map Employee entity to DataTransfer DTO
            return new DataTransfer(
                    employee.getId(),
                    employee.getEmpId(),
                    employee.getName(),
                    employee.getDesignation(),
                    employee.getIsManager(),  // isManager
                    employee.getIsTL(),       // isTL
                    employee.getReportingTo() // reporting manager, DTO constructor handles null
            );
        } else {
            return null; // Will trigger 401 in controller
        }
    }

    public List<Employee> getTLsUnderManager(Long managerId) {
        return employeeRepository.findByIsTLTrueAndReportingToId(managerId);
    }

    public List<Employee> getAllManagers() {
        return employeeRepository.findByIsManagerTrue();
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public void addEmployee(Employee employee)
    {
        if(employee.getReportingTo()!=null)
        {
            Long id = employee.getReportingTo().getId();
            Employee manager = employeeRepository.findById(id).orElse(null);
            employee.setReportingTo(manager);
        }
        employeeRepository.save(employee);
    }

    public List<DataTransfer> getEmployeesByManagerId(Long mgrid) {
        Employee emp = employeeRepository.findById(mgrid).orElse(null);
        if(emp==null) return null;
        return employeeRepository.findByReportingTo(emp).stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public Employee editEmployee(Employee employee)
    {
        Employee old = employeeRepository.findById(employee.getId()).orElse(null);
        old.setName(employee.getName());
        old.setDesignation(employee.getDesignation());
        old.setIsTL(employee.getIsTL());
        old.setIsManager(employee.getIsManager());
        old.setReportingTo(employee.getReportingTo());
        employeeRepository.save(old);
        return old;
    }

    private DataTransfer convertToResponse(Employee employee) {
        return new DataTransfer(
                employee.getId(),
                employee.getEmpId(),
                employee.getName(),
                employee.getDesignation(),
                employee.getIsManager(),  // isManager
                employee.getIsTL(),       // isTL
                employee.getReportingTo() // reporting manager, DTO constructor handles null
        );
    }
}
