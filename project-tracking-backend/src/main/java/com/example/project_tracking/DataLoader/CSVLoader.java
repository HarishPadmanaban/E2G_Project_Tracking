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
                getClass().getResourceAsStream("/data/employee1.csv"))) {

            CSVReader csvReader = new CSVReader(reader);
            rows = csvReader.readAll();
        }

        // Step 1: Insert employees WITHOUT reportingTo
        for (int i = 1; i < rows.size(); i++) { // skip header
            String[] row = rows.get(i);

            Employee emp = new Employee();
            emp.setEmpId(row[1]);
            emp.setName(row[2]);
            emp.setDesignation(row[3]);
            emp.setManager(Boolean.parseBoolean(row[4]));
            emp.setTL(Boolean.parseBoolean(row[5]));
            emp.setUsername(row[7]);
            emp.setPassword(row[8]);

            Employee saved = employeeRepository.save(emp);
            tempMap.put(Long.parseLong(row[0]), saved);
        }

        // Step 2: Update reportingTo relationships
        for (int i = 1; i < rows.size(); i++) {
            String[] row = rows.get(i);
            String reportingToStr = row[6];

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
