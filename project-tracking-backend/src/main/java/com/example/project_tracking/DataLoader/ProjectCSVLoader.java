package com.example.project_tracking.DataLoader;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Repository.ProjectRepository;
import com.opencsv.CSVReader;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@Order(3) // Executes after Employee loader
public class ProjectCSVLoader implements CommandLineRunner {

    private final ProjectRepository projectRepository;

    public ProjectCSVLoader(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        List<String[]> rows;
        try (Reader reader = new InputStreamReader(
                getClass().getResourceAsStream("/data/project.csv"))) {

            CSVReader csvReader = new CSVReader(reader);
            rows = csvReader.readAll();
        }

        // Insert projects
        for (int i = 1; i < rows.size(); i++) { // skip header
            String[] row = rows.get(i);

            Project project = new Project();
            project.setProjectName(row[1].trim());
            project.setClientName(row[2].trim());
            project.setManagerId(Long.parseLong(row[3].trim()));
            project.setAssignedHours(new BigDecimal(row[4].trim()));
            project.setWorkingHours(new BigDecimal(row[5].trim()));
            project.setAssignedDate(LocalDate.parse(row[6].trim()));
            project.setProjectStatus(Boolean.parseBoolean(row[7].trim()));
            project.setSoftDelete(Boolean.parseBoolean(row[8].trim()));

            // Initialize split-up hours & times to zero
            project.setModellingHours(BigDecimal.ZERO);
            project.setCheckingHours(BigDecimal.ZERO);
            project.setDetailingHours(BigDecimal.ZERO);
            project.setModellingTime(LocalTime.of(0, 0, 0));
            project.setCheckingTime(LocalTime.of(0, 0, 0));
            project.setDetailingTime(LocalTime.of(0, 0, 0));

            projectRepository.save(project);
        }

        System.out.println("✅ Project CSV loaded successfully!");
    }
}
