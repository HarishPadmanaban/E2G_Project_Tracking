package com.example.project_tracking.DataLoader;

import com.example.project_tracking.DataLoader.Reset.EmployeeResetter;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Repository.EmployeeRepository;
import com.opencsv.CSVReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;

@Component
@Order(2)
public class CSVLoader implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeResetter resetter;

    public CSVLoader(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (employeeRepository.count() > 0) {
            return; // prevent duplicate inserts
        }
        //resetter.resetEmployeeTable();
        Map<Long, Employee> tempMap = new HashMap<>();
        List<String[]> rows;

        try (Reader reader = new InputStreamReader(
                getClass().getResourceAsStream("/data/employees.csv"))) {

            CSVReader csvReader = new CSVReader(reader);
            rows = csvReader.readAll();
        }

        // Step 1: Insert employees WITHOUT reportingTo
        for (int i = 1; i < rows.size(); i++) { // skip header
            String[] row = rows.get(i);
            //System.out.println(Arrays.toString(row));
            Employee emp = new Employee();
            emp.setEmpId(Long.parseLong(row[0]));
            emp.setName(row[1]);
            emp.setDesignation(row[2]);
            emp.setIsManager("1".equals(row[3]));
            emp.setIsTL("1".equals(row[4]));
            emp.setUsername(row[6]);
            //emp.setPassword(row[8]);
            emp.setDesignationCategory(row[8]);
            String pass = emp.getEmpId()+"@123";
            emp.setPassword(pass);

            Employee saved = employeeRepository.save(emp);
            tempMap.put(Long.parseLong(row[0]), saved);
        }

        // Step 2: Update reportingTo relationships
        for (int i = 1; i < rows.size(); i++) {
            String[] row = rows.get(i);
            String reportingToStr = row[5];

            if (reportingToStr != null && !reportingToStr.isBlank()) {
                Long currentId = Long.parseLong(row[0]);
                Long reportingToId = Long.parseLong(reportingToStr);

                Employee emp = tempMap.get(currentId);
                Employee manager = tempMap.get(reportingToId);

                emp.setReportingTo(manager);
                employeeRepository.save(emp);
            }
        }
        System.out.println("✅ Employee CSV loaded successfully!");
    }
}
