package com.example.project_tracking.Model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String projectName;

    private String clientName;

    @Column(nullable = false)
    private Long managerId;

    private BigDecimal assignedHours;
    private BigDecimal workingHours;
    private LocalDate assignedDate;

    private Boolean projectStatus = true;
    private Boolean softDelete = false;

    // Split-up hours
    private BigDecimal modellingHours;
    private BigDecimal checkingHours;
    private BigDecimal detailingHours;

    // Time tracking for split-ups
    private LocalTime modellingTime;
    private LocalTime checkingTime;
    private LocalTime detailingTime;

    // Idle project flag

    public Project() {
    }

    public Project(Long id, String projectName, String clientName, Long managerId, BigDecimal assignedHours, BigDecimal workingHours, LocalDate assignedDate, Boolean projectStatus, Boolean softDelete, BigDecimal modellingHours, BigDecimal checkingHours, BigDecimal detailingHours, LocalTime modellingTime, LocalTime checkingTime, LocalTime detailingTime) {
        this.id = id;
        this.projectName = projectName;
        this.clientName = clientName;
        this.managerId = managerId;
        this.assignedHours = assignedHours;
        this.workingHours = workingHours;
        this.assignedDate = assignedDate;
        this.projectStatus = projectStatus;
        this.softDelete = softDelete;
        this.modellingHours = modellingHours;
        this.checkingHours = checkingHours;
        this.detailingHours = detailingHours;
        this.modellingTime = modellingTime;
        this.checkingTime = checkingTime;
        this.detailingTime = detailingTime;
    }

    public Project(Long id, String projectName, String clientName, Long managerId, BigDecimal assignedHours, BigDecimal workingHours, LocalDate assignedDate, Boolean projectStatus, Boolean softDelete) {
        this.id = id;
        this.projectName = projectName;
        this.clientName = clientName;
        this.managerId = managerId;
        this.assignedHours = assignedHours;
        this.workingHours = workingHours;
        this.assignedDate = assignedDate;
        this.projectStatus = projectStatus;
        this.softDelete = softDelete;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public BigDecimal getAssignedHours() {
        return assignedHours;
    }

    public void setAssignedHours(BigDecimal assignedHours) {
        this.assignedHours = assignedHours;
    }

    public BigDecimal getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(BigDecimal workingHours) {
        this.workingHours = workingHours;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }

    public Boolean getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(Boolean projectStatus) {
        this.projectStatus = projectStatus;
    }

    public Boolean getSoftDelete() {
        return softDelete;
    }

    public void setSoftDelete(Boolean softDelete) {
        this.softDelete = softDelete;
    }

    public BigDecimal getModellingHours() {
        return modellingHours;
    }

    public void setModellingHours(BigDecimal modellingHours) {
        this.modellingHours = modellingHours;
    }

    public BigDecimal getCheckingHours() {
        return checkingHours;
    }

    public void setCheckingHours(BigDecimal checkingHours) {
        this.checkingHours = checkingHours;
    }

    public BigDecimal getDetailingHours() {
        return detailingHours;
    }

    public void setDetailingHours(BigDecimal detailingHours) {
        this.detailingHours = detailingHours;
    }

    public LocalTime getModellingTime() {
        return modellingTime;
    }

    public void setModellingTime(LocalTime modellingTime) {
        this.modellingTime = modellingTime;
    }

    public LocalTime getCheckingTime() {
        return checkingTime;
    }

    public void setCheckingTime(LocalTime checkingTime) {
        this.checkingTime = checkingTime;
    }

    public LocalTime getDetailingTime() {
        return detailingTime;
    }

    public void setDetailingTime(LocalTime detailingTime) {
        this.detailingTime = detailingTime;
    }
}

