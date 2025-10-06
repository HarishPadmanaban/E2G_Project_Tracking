package com.example.project_tracking.DataLoader.Reset;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class EmployeeResetter {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void resetEmployeeTable() {
        // Delete all data
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=0");
        jdbcTemplate.execute("DELETE FROM employee");
        jdbcTemplate.execute("ALTER TABLE employee AUTO_INCREMENT = 1");
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");

    }
}

