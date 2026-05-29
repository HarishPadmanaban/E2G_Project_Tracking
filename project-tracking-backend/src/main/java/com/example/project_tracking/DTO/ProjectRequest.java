package com.example.project_tracking.DTO;

import org.hibernate.id.BulkInsertionCapableIdentifierGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectRequest {
    private Long id;
    private String projectName;
    private String clientName;
    private BigDecimal assignedHours;
    private BigDecimal modellingHours;
    private BigDecimal checkingHours;
    private BigDecimal detailingHours;
    private BigDecimal studyHours;
    private Long managerId;
    private boolean projectStatus;
    private LocalDate plannedIfaDate;
    private LocalDate actualIfaDate;
    private LocalDate plannedIfcDate;
    private LocalDate actualIfcDate;
<<<<<<< Updated upstream
    public ProjectRequest() {
    }

    public ProjectRequest(Long id, String projectName, String clientName, BigDecimal assignedHours, BigDecimal modellingHours, BigDecimal checkingHours, BigDecimal detailingHours, BigDecimal studyHours, Long managerId, boolean projectStatus, LocalDate plannedIfaDate, LocalDate actualIfaDate, LocalDate plannedIfcDate, LocalDate actualIfcDate) {
=======
    private LocalDate plannedReifaDate;
    private LocalDate actualReifaDate;
    private LocalDate plannedReifcDate;
    private LocalDate actualReifcDate;
    public ProjectRequest() {
    }

    public ProjectRequest(Long id, String projectName, String clientName, BigDecimal assignedHours, BigDecimal modellingHours, BigDecimal checkingHours, BigDecimal detailingHours, BigDecimal studyHours, Long managerId, boolean projectStatus, LocalDate plannedIfaDate, LocalDate actualIfaDate, LocalDate plannedIfcDate, LocalDate actualIfcDate, LocalDate plannedReifaDate, LocalDate actualReifaDate, LocalDate plannedReifcDate, LocalDate actualReifcDate) {
>>>>>>> Stashed changes
        this.id = id;
        this.projectName = projectName;
        this.clientName = clientName;
        this.assignedHours = assignedHours;
        this.modellingHours = modellingHours;
        this.checkingHours = checkingHours;
        this.detailingHours = detailingHours;
        this.studyHours = studyHours;
        this.managerId = managerId;
        this.projectStatus = projectStatus;
        this.plannedIfaDate = plannedIfaDate;
        this.actualIfaDate = actualIfaDate;
        this.plannedIfcDate = plannedIfcDate;
        this.actualIfcDate = actualIfcDate;
<<<<<<< Updated upstream
=======
        this.plannedReifaDate = plannedReifaDate;
        this.actualReifaDate = actualReifaDate;
        this.plannedReifcDate = plannedReifcDate;
        this.actualReifcDate = actualReifcDate;
>>>>>>> Stashed changes
    }

    public BigDecimal getStudyHours() {
        return studyHours;
    }

    public void setStudyHours(BigDecimal studyHours) {
        this.studyHours = studyHours;
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

    public BigDecimal getAssignedHours() {
        return assignedHours;
    }

    public void setAssignedHours(BigDecimal assignedHours) {
        this.assignedHours = assignedHours;
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

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public LocalDate getPlannedIfaDate() {
        return plannedIfaDate;
    }

    public void setPlannedIfaDate(LocalDate plannedIfaDate) {
        this.plannedIfaDate = plannedIfaDate;
    }

    public LocalDate getActualIfaDate() {
        return actualIfaDate;
    }

    public void setActualIfaDate(LocalDate actualIfaDate) {
        this.actualIfaDate = actualIfaDate;
    }

    public LocalDate getPlannedIfcDate() {
        return plannedIfcDate;
    }

    public void setPlannedIfcDate(LocalDate plannedIfcDate) {
        this.plannedIfcDate = plannedIfcDate;
    }

    public LocalDate getActualIfcDate() {
        return actualIfcDate;
    }

    public void setActualIfcDate(LocalDate actualIfcDate) {
        this.actualIfcDate = actualIfcDate;
    }

<<<<<<< Updated upstream
=======
    public LocalDate getPlannedReifaDate() {
        return plannedReifaDate;
    }

    public void setPlannedReifaDate(LocalDate plannedReifaDate) {
        this.plannedReifaDate = plannedReifaDate;
    }

    public LocalDate getactualReifaDate() {
        return actualReifaDate;
    }

    public void setactualReifaDate(LocalDate actualReifaDate) {
        this.actualReifaDate = actualReifaDate;
    }

    public LocalDate getPlannedReifcDate() {
        return plannedReifcDate;
    }

    public void setPlannedReifcDate(LocalDate plannedReifcDate) {
        this.plannedReifcDate = plannedReifcDate;
    }

    public LocalDate getactualReifcDate() {
        return actualReifcDate;
    }

    public void setactualReifcDate(LocalDate actualReifcDate) {
        this.actualReifcDate = actualReifcDate;
    }

>>>>>>> Stashed changes
    public boolean isProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(boolean projectStatus) {
        this.projectStatus = projectStatus;
    }
}
