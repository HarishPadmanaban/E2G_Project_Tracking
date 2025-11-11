package com.example.project_tracking.Model;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "leave_balance")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private int casualLeaves;
    private int sickLeaves;
    private int marriageLeaves;
    private int maternityLeaves;
    private int year;
    private double permissionBalance;

    public LeaveBalance() {
    }

    public LeaveBalance(Employee employee) {
        this.employee = employee;
        casualLeaves = 12;
        sickLeaves = 8;
        marriageLeaves = 14;
        maternityLeaves = 14;
        year = LocalDate.now().getYear();
        permissionBalance = 2.0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public int getCasualLeaves() { return casualLeaves; }
    public void setCasualLeaves(int casualLeaves) { this.casualLeaves = casualLeaves; }

    public int getSickLeaves() { return sickLeaves; }
    public void setSickLeaves(int sickLeaves) { this.sickLeaves = sickLeaves; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getMarriageLeaves() {
        return marriageLeaves;
    }

    public void setMarriageLeaves(int marriageLeaves) {
        this.marriageLeaves = marriageLeaves;
    }

    public int getMaternityLeaves() {
        return maternityLeaves;
    }

    public void setMaternityLeaves(int maternityLeaves) {
        this.maternityLeaves = maternityLeaves;
    }

    public double getPermissionBalance() {
        return permissionBalance;
    }

    public void setPermissionBalance(double permissionHoursBalance) {
        this.permissionBalance = permissionHoursBalance;
    }
}

