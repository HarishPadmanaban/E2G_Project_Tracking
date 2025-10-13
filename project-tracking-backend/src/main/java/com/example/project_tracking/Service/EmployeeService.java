package com.example.project_tracking.Service;

import com.example.project_tracking.DTO.DataTransfer;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
                    employee.getManager(),  // isManager
                    employee.getTL(),       // isTL
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
                    employee.getManager(),  // isManager
                    employee.getTL(),       // isTL
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
}
