package com.example.project_tracking.DTO;

import jakarta.persistence.Column;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectResponse {

    private Long id;
    private String projectName;
    private String clientName;
    private Long managerId;
    private String managerName; // extra field
    private Long tlId;
    private String tlName;

    private BigDecimal assignedHours;
    private BigDecimal workingHours;
    private LocalDate assignedDate;
    private Boolean projectStatus;
    private Boolean softDelete;

    private BigDecimal modellingHours;
    private BigDecimal checkingHours;
    private BigDecimal detailingHours;

    private BigDecimal modellingTime;
    private BigDecimal checkingTime;
    private BigDecimal detailingTime;

    private LocalDate startDate;
    private LocalDate completedDate;

    private BigDecimal studyHours;
    private BigDecimal studyHoursTracking;

    private BigDecimal extraHours;
    private BigDecimal extraHoursTracking;

    private String projectActivityStatus;

    private LocalDate plannedStartDate;

    private BigDecimal ifaGivenHours;

    private BigDecimal ifcGivenHours;

    private BigDecimal ifaExtraHours;

    private BigDecimal ifcExtraHours;

    private BigDecimal ifaProdHours ;

    private BigDecimal ifcProdHours ;

    private BigDecimal ifaExtraProdHours ;

    private BigDecimal ifcExtraProdHours ;

    private LocalDate plannedIfaDate;

    private LocalDate actualIfaDate;

    private LocalDate plannedIfcDate;

    private LocalDate actualIfcDate;

    private String extraHoursNote;

    private LocalDate plannedReifaDate;

    private LocalDate actualReifaDate;

    private LocalDate plannedReifcDate;

    private LocalDate actualReifcDate;

    public String getProjectActivityStatus() {
        return projectActivityStatus;
    }

    public void setProjectActivityStatus(String projectActivityStatus) {
        this.projectActivityStatus = projectActivityStatus;
    }

    public LocalDate getPlannedStartDate() {
        return plannedStartDate;
    }

    public void setPlannedStartDate(LocalDate plannedStartDate) {
        this.plannedStartDate = plannedStartDate;
    }

    public BigDecimal getIfaGivenHours() {
        return ifaGivenHours;
    }

    public void setIfaGivenHours(BigDecimal ifaGivenHours) {
        this.ifaGivenHours = ifaGivenHours;
    }

    public BigDecimal getIfcGivenHours() {
        return ifcGivenHours;
    }

    public void setIfcGivenHours(BigDecimal ifcGivenHours) {
        this.ifcGivenHours = ifcGivenHours;
    }

    public BigDecimal getIfaExtraHours() {
        return ifaExtraHours;
    }

    public void setIfaExtraHours(BigDecimal ifaExtraHours) {
        this.ifaExtraHours = ifaExtraHours;
    }

    public BigDecimal getIfcExtraHours() {
        return ifcExtraHours;
    }

    public void setIfcExtraHours(BigDecimal ifcExtraHours) {
        this.ifcExtraHours = ifcExtraHours;
    }

    public BigDecimal getIfaProdHours() {
        return ifaProdHours;
    }

    public void setIfaProdHours(BigDecimal ifaProdHours) {
        this.ifaProdHours = ifaProdHours;
    }

    public BigDecimal getIfcProdHours() {
        return ifcProdHours;
    }

    public void setIfcProdHours(BigDecimal ifcProdHours) {
        this.ifcProdHours = ifcProdHours;
    }

    public BigDecimal getIfaExtraProdHours() {
        return ifaExtraProdHours;
    }

    public void setIfaExtraProdHours(BigDecimal ifaExtraProdHours) {
        this.ifaExtraProdHours = ifaExtraProdHours;
    }

    public BigDecimal getIfcExtraProdHours() {
        return ifcExtraProdHours;
    }

    public void setIfcExtraProdHours(BigDecimal ifcExtraProdHours) {
        this.ifcExtraProdHours = ifcExtraProdHours;
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

    public String getExtraHoursNote() {
        return extraHoursNote;
    }

    public void setExtraHoursNote(String extraHoursNote) {
        this.extraHoursNote = extraHoursNote;
    }

    public LocalDate getPlannedReifaDate() {
        return plannedReifaDate;
    }

    public void setPlannedReifaDate(LocalDate plannedReifaDate) {
        this.plannedReifaDate = plannedReifaDate;
    }

    public LocalDate getActualReifaDate() {
        return actualReifaDate;
    }

    public void setActualReifaDate(LocalDate actualReifaDate) {
        this.actualReifaDate = actualReifaDate;
    }

    public LocalDate getPlannedReifcDate() {
        return plannedReifcDate;
    }

    public void setPlannedReifcDate(LocalDate plannedReifcDate) {
        this.plannedReifcDate = plannedReifcDate;
    }

    public LocalDate getActualReifcDate() {
        return actualReifcDate;
    }

    public void setActualReifcDate(LocalDate actualReifcDate) {
        this.actualReifcDate = actualReifcDate;
    }

    public ProjectResponse() {
    }

    public ProjectResponse(Long id, String projectName, String clientName, Long managerId, String managerName, Long tlId, String tlName, BigDecimal assignedHours, BigDecimal workingHours, LocalDate assignedDate, Boolean projectStatus, Boolean softDelete, BigDecimal modellingHours, BigDecimal checkingHours, BigDecimal detailingHours, BigDecimal modellingTime, BigDecimal checkingTime, BigDecimal detailingTime, LocalDate startDate, LocalDate completedDate, BigDecimal studyHours, BigDecimal studyHoursTracking, BigDecimal extraHours, BigDecimal extraHoursTracking,String projectActivityStatus) {
        this.id = id;
        this.projectName = projectName;
        this.clientName = clientName;
        this.managerId = managerId;
        this.managerName = managerName;
        this.tlId = tlId;
        this.tlName = tlName;
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
        this.startDate = startDate;
        this.completedDate = completedDate;
        this.studyHours = studyHours;
        this.studyHoursTracking = studyHoursTracking;
        this.extraHours = extraHours;
        this.extraHoursTracking = extraHoursTracking;
        this.projectActivityStatus = projectActivityStatus;
    }

    public ProjectResponse(Long id, String projectName, String clientName, Long managerId,
                           String managerName, BigDecimal assignedHours, BigDecimal workingHours,
                           LocalDate assignedDate, Boolean projectStatus, Boolean softDelete,
                           BigDecimal modellingHours, BigDecimal checkingHours, BigDecimal detailingHours,
                           BigDecimal modellingTime, BigDecimal checkingTime, BigDecimal detailingTime,String projectActivityStatus) {
        this.id = id;
        this.projectName = projectName;
        this.clientName = clientName;
        this.managerId = managerId;
        this.managerName = managerName;
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
        this.projectActivityStatus = projectActivityStatus;
    }

    public ProjectResponse(Long id, String projectName, String clientName, Long managerId, String managerName, BigDecimal assignedHours, BigDecimal workingHours, LocalDate assignedDate, Boolean projectStatus, Boolean softDelete, BigDecimal modellingHours, BigDecimal checkingHours, BigDecimal detailingHours, BigDecimal modellingTime, BigDecimal checkingTime, BigDecimal detailingTime, LocalDate startDate, LocalDate completedDate, BigDecimal studyHours, BigDecimal studyHoursTracking, BigDecimal extraHours, BigDecimal extraHoursTracking,String projectActivityStatus) {
        this.id = id;
        this.projectName = projectName;
        this.clientName = clientName;
        this.managerId = managerId;
        this.managerName = managerName;
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
        this.startDate = startDate;
        this.completedDate = completedDate;
        this.studyHours = studyHours;
        this.studyHoursTracking = studyHoursTracking;
        this.extraHours = extraHours;
        this.extraHoursTracking = extraHoursTracking;
        this.projectActivityStatus = projectActivityStatus;
    }

    public ProjectResponse(Long id, String projectName, String clientName, Long managerId, String managerName, Long tlId, String tlName, BigDecimal assignedHours, BigDecimal workingHours, LocalDate assignedDate, Boolean projectStatus, Boolean softDelete, BigDecimal modellingHours, BigDecimal checkingHours, BigDecimal detailingHours, BigDecimal modellingTime, BigDecimal checkingTime, BigDecimal detailingTime, LocalDate startDate, LocalDate completedDate, BigDecimal studyHours, BigDecimal studyHoursTracking, BigDecimal extraHours, BigDecimal extraHoursTracking, String projectActivityStatus, LocalDate plannedStartDate, BigDecimal ifaGivenHours, BigDecimal ifcGivenHours, BigDecimal ifaExtraHours, BigDecimal ifcExtraHours, BigDecimal ifaProdHours, BigDecimal ifcProdHours, BigDecimal ifaExtraProdHours, BigDecimal ifcExtraProdHours, LocalDate plannedIfaDate, LocalDate actualIfaDate, LocalDate plannedIfcDate, LocalDate actualIfcDate, String extraHoursNote, LocalDate plannedReifaDate, LocalDate actualReifaDate, LocalDate plannedReifcDate, LocalDate actualReifcDate) {
        this.id = id;
        this.projectName = projectName;
        this.clientName = clientName;
        this.managerId = managerId;
        this.managerName = managerName;
        this.tlId = tlId;
        this.tlName = tlName;
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
        this.startDate = startDate;
        this.completedDate = completedDate;
        this.studyHours = studyHours;
        this.studyHoursTracking = studyHoursTracking;
        this.extraHours = extraHours;
        this.extraHoursTracking = extraHoursTracking;
        this.projectActivityStatus = projectActivityStatus;
        this.plannedStartDate = plannedStartDate;
        this.ifaGivenHours = ifaGivenHours;
        this.ifcGivenHours = ifcGivenHours;
        this.ifaExtraHours = ifaExtraHours;
        this.ifcExtraHours = ifcExtraHours;
        this.ifaProdHours = ifaProdHours;
        this.ifcProdHours = ifcProdHours;
        this.ifaExtraProdHours = ifaExtraProdHours;
        this.ifcExtraProdHours = ifcExtraProdHours;
        this.plannedIfaDate = plannedIfaDate;
        this.actualIfaDate = actualIfaDate;
        this.plannedIfcDate = plannedIfcDate;
        this.actualIfcDate = actualIfcDate;
        this.extraHoursNote = extraHoursNote;
        this.plannedReifaDate = plannedReifaDate;
        this.actualReifaDate = actualReifaDate;
        this.plannedReifcDate = plannedReifcDate;
        this.actualReifcDate = actualReifcDate;
    }

    // ===== Getters and Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public BigDecimal getAssignedHours() { return assignedHours; }
    public void setAssignedHours(BigDecimal assignedHours) { this.assignedHours = assignedHours; }

    public BigDecimal getWorkingHours() { return workingHours; }
    public void setWorkingHours(BigDecimal workingHours) { this.workingHours = workingHours; }

    public LocalDate getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDate assignedDate) { this.assignedDate = assignedDate; }

    public Boolean getProjectStatus() { return projectStatus; }
    public void setProjectStatus(Boolean projectStatus) { this.projectStatus = projectStatus; }

    public Boolean getSoftDelete() { return softDelete; }
    public void setSoftDelete(Boolean softDelete) { this.softDelete = softDelete; }

    public BigDecimal getModellingHours() { return modellingHours; }
    public void setModellingHours(BigDecimal modellingHours) { this.modellingHours = modellingHours; }

    public BigDecimal getCheckingHours() { return checkingHours; }
    public void setCheckingHours(BigDecimal checkingHours) { this.checkingHours = checkingHours; }

    public BigDecimal getDetailingHours() { return detailingHours; }
    public void setDetailingHours(BigDecimal detailingHours) { this.detailingHours = detailingHours; }

    public BigDecimal getModellingTime() { return modellingTime; }
    public void setModellingTime(BigDecimal modellingTime) { this.modellingTime = modellingTime; }

    public BigDecimal getCheckingTime() { return checkingTime; }
    public void setCheckingTime(BigDecimal checkingTime) { this.checkingTime = checkingTime; }

    public BigDecimal getDetailingTime() { return detailingTime; }
    public void setDetailingTime(BigDecimal detailingTime) { this.detailingTime = detailingTime; }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDate completedDate) {
        this.completedDate = completedDate;
    }

    public BigDecimal getStudyHours() {
        return studyHours;
    }

    public void setStudyHours(BigDecimal studyHours) {
        this.studyHours = studyHours;
    }

    public BigDecimal getStudyHoursTracking() {
        return studyHoursTracking;
    }

    public void setStudyHoursTracking(BigDecimal studyHoursTracking) {
        this.studyHoursTracking = studyHoursTracking;
    }

    public BigDecimal getExtraHours() {
        return extraHours;
    }

    public void setExtraHours(BigDecimal extraHours) {
        this.extraHours = extraHours;
    }

    public BigDecimal getExtraHoursTracking() {
        return extraHoursTracking;
    }

    public void setExtraHoursTracking(BigDecimal extraHoursTracking) {
        this.extraHoursTracking = extraHoursTracking;
    }

    public Long getTlId() {
        return tlId;
    }

    public void setTlId(Long tlId) {
        this.tlId = tlId;
    }

    public String getTlName() {
        return tlName;
    }

    public void setTlName(String tlName) {
        this.tlName = tlName;
    }
}

