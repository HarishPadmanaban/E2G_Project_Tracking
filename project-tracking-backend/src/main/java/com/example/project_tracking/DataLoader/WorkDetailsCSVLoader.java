package com.example.project_tracking.DataLoader;
import com.example.project_tracking.Model.WorkDetails;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Model.Activity;
import com.example.project_tracking.Repository.WorkDetailsRepository;
import com.example.project_tracking.Repository.EmployeeRepository;
import com.example.project_tracking.Repository.ProjectRepository;
import com.example.project_tracking.Repository.ActivityRepository;
import com.opencsv.CSVReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Component
@Order(4) // Executes after Project loader
public class WorkDetailsCSVLoader implements CommandLineRunner {

    private final WorkDetailsRepository workDetailsRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final ActivityRepository activityRepository;

    @Autowired
    public WorkDetailsCSVLoader(WorkDetailsRepository workDetailsRepository,
                                EmployeeRepository employeeRepository,
                                ProjectRepository projectRepository,
                                ActivityRepository activityRepository) {
        this.workDetailsRepository = workDetailsRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (workDetailsRepository.count() > 0) {
            return; // prevent duplicate inserts
        }

        List<String[]> rows;
        try (Reader reader = new InputStreamReader(
                getClass().getResourceAsStream("/data/details.csv"))) {

            CSVReader csvReader = new CSVReader(reader);
            rows = csvReader.readAll();
        }

        int successCount = 0;
        int errorCount = 0;

        // Insert work details
        for (int i = 1; i < rows.size(); i++) { // skip header
            try {
                String[] row = rows.get(i);

                // Find related entities
                Optional<Employee> employee = employeeRepository.findById(Long.parseLong(row[0].trim()));
                Optional<Employee> manager = employeeRepository.findById(Long.parseLong(row[1].trim()));
                Optional<Project> project = projectRepository.findById(Long.parseLong(row[2].trim()));
                Optional<Activity> activity = activityRepository.findById(Long.parseLong(row[3].trim()));

                // Check if all required entities exist
                if (employee.isEmpty() || manager.isEmpty() || project.isEmpty() || activity.isEmpty()) {
                    System.err.println("❌ Skipping worklog - Missing related entity for row: " + String.join(",", row));
                    errorCount++;
                    continue;
                }

                WorkDetails workDetails = new WorkDetails();
                workDetails.setEmployee(employee.get());
                workDetails.setManager(manager.get());
                workDetails.setProject(project.get());
                workDetails.setActivity(activity.get());
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                workDetails.setDate(LocalDate.parse(row[4].trim(), formatter));
                workDetails.setWorkHours(Double.parseDouble(row[5].trim()));
                workDetails.setStartTime(LocalTime.parse(row[6].trim()));
                workDetails.setEndTime(LocalTime.parse(row[7].trim()));
                workDetails.setProjectActivity(row[8].trim());
                workDetails.setAssignedWork(row[9].trim());
                workDetails.setStatus(row[10].trim());
                workDetails.setRemarks(row[11].trim());

                workDetailsRepository.save(workDetails);
                successCount++;

            } catch (Exception e) {
                System.err.println("❌ Error processing worklog row " + i + ": " + e.getMessage());
                errorCount++;
            }
        }

        System.out.println("✅ WorkDetails CSV loaded successfully!");
        System.out.println("📊 Successfully loaded: " + successCount + " records");
        if (errorCount > 0) {
            System.out.println("⚠️  Failed to load: " + errorCount + " records");
        }
    }
}
