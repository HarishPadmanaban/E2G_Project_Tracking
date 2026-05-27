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

        private Long tlId;

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
        private BigDecimal modellingTime;
        private BigDecimal checkingTime;
        private BigDecimal detailingTime;

        // Project timeline
        private LocalDate startDate;
        private LocalDate completedDate;

        // Study section
        private BigDecimal studyHours;
        private BigDecimal studyHoursTracking;

        // Extra work section
        private BigDecimal extraHours;
        private BigDecimal extraHoursTracking;

        @Column(name = "project_activity_status")
        private String projectActivityStatus;

        @Column(name = "remainder_sent_date")
        private LocalDate remainderSentDate;

        @Column(name = "planned_start_date")
        private LocalDate plannedStartDate;

        @Column(name = "ifa_given_hours")
        private BigDecimal ifaGivenHours;

        @Column(name = "ifc_given_hours")
        private BigDecimal ifcGivenHours;

        @Column(name = "ifa_extra_hours")
        private BigDecimal ifaExtraHours;

        @Column(name = "ifc_extra_hours")
        private BigDecimal ifcExtraHours;

        @Column(name = "ifa_prod_hours")
        private BigDecimal ifaProdHours = BigDecimal.ZERO;

        @Column(name = "ifc_prod_hours")
        private BigDecimal ifcProdHours = BigDecimal.ZERO;

        @Column(name = "ifa_extra_prod_hours")
        private BigDecimal ifaExtraProdHours = BigDecimal.ZERO;

        @Column(name = "ifc_extra_prod_hours")
        private BigDecimal ifcExtraProdHours = BigDecimal.ZERO;


        public Project() {
        }

        public Project(Long id, String projectName, String clientName, Long managerId, BigDecimal assignedHours, BigDecimal workingHours, LocalDate assignedDate, Boolean projectStatus, Boolean softDelete, BigDecimal modellingHours, BigDecimal checkingHours, BigDecimal detailingHours, BigDecimal modellingTime, BigDecimal checkingTime, BigDecimal detailingTime) {
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

        public Project(
                Long id,
                String projectName,
                String clientName,
                Long managerId,
                Long tlId,
                BigDecimal assignedHours,
                BigDecimal workingHours,
                LocalDate assignedDate,
                Boolean projectStatus,
                Boolean softDelete,

                BigDecimal modellingHours,
                BigDecimal checkingHours,
                BigDecimal detailingHours,

                BigDecimal modellingTime,
                BigDecimal checkingTime,
                BigDecimal detailingTime,

                LocalDate startDate,
                LocalDate completedDate,
                LocalDate plannedStartDate,

                BigDecimal studyHours,
                BigDecimal studyHoursTracking,

                BigDecimal extraHours,
                BigDecimal extraHoursTracking,

                BigDecimal ifaGivenHours,
                BigDecimal ifcGivenHours,
                BigDecimal ifaExtraHours,
                BigDecimal ifcExtraHours,

                BigDecimal ifaProdHours,
                BigDecimal ifcProdHours,
                BigDecimal ifaExtraProdHours,
                BigDecimal ifcExtraProdHours,

                String projectActivityStatus,
                LocalDate remainderSentDate
        ) {
            this.id = id;
            this.projectName = projectName;
            this.clientName = clientName;
            this.managerId = managerId;
            this.tlId = tlId;
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
            this.plannedStartDate = plannedStartDate;

            this.studyHours = studyHours;
            this.studyHoursTracking = studyHoursTracking;

            this.extraHours = extraHours;
            this.extraHoursTracking = extraHoursTracking;

            this.ifaGivenHours = ifaGivenHours;
            this.ifcGivenHours = ifcGivenHours;
            this.ifaExtraHours = ifaExtraHours;
            this.ifcExtraHours = ifcExtraHours;

            this.ifaProdHours = ifaProdHours;
            this.ifcProdHours = ifcProdHours;
            this.ifaExtraProdHours = ifaExtraProdHours;
            this.ifcExtraProdHours = ifcExtraProdHours;

            this.projectActivityStatus = projectActivityStatus;
            this.remainderSentDate = remainderSentDate;
        }

        public Long getTlId() {
            return tlId;
        }

        public void setTlId(Long tlId) {
            this.tlId = tlId;
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

        public BigDecimal getModellingTime() {
            return modellingTime;
        }

        public void setModellingTime(BigDecimal modellingTime) {
            this.modellingTime = modellingTime;
        }

        public BigDecimal getCheckingTime() {
            return checkingTime;
        }

        public void setCheckingTime(BigDecimal checkingTime) {
            this.checkingTime = checkingTime;
        }

        public BigDecimal getDetailingTime() {
            return detailingTime;
        }

        public void setDetailingTime(BigDecimal detailingTime) {
            this.detailingTime = detailingTime;
        }

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

        public String getProjectActivityStatus() {
            return projectActivityStatus;
        }

        public void setProjectActivityStatus(String projectActivityStatus) {
            this.projectActivityStatus = projectActivityStatus;
        }

        public LocalDate getRemainderSentDate() {
            return remainderSentDate;
        }

        public void setRemainderSentDate(LocalDate remainderSentDate) {
            this.remainderSentDate = remainderSentDate;
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

        @Override
        public String toString() {
            return "Project{" +
                    "id=" + id +
                    ", projectName='" + projectName + '\'' +
                    ", clientName='" + clientName + '\'' +
                    ", managerId=" + managerId +
                    ", tlId=" + tlId +
                    ", assignedHours=" + assignedHours +
                    ", workingHours=" + workingHours +
                    ", assignedDate=" + assignedDate +
                    ", projectStatus=" + projectStatus +
                    ", softDelete=" + softDelete +
                    ", modellingHours=" + modellingHours +
                    ", checkingHours=" + checkingHours +
                    ", detailingHours=" + detailingHours +
                    ", modellingTime=" + modellingTime +
                    ", checkingTime=" + checkingTime +
                    ", detailingTime=" + detailingTime +
                    ", startDate=" + startDate +
                    ", completedDate=" + completedDate +
                    ", studyHours=" + studyHours +
                    ", studyHoursTracking=" + studyHoursTracking +
                    ", extraHours=" + extraHours +
                    ", extraHoursTracking=" + extraHoursTracking +
                    ", plannedStartDate=" + plannedStartDate +
                    ", ifaGivenHours=" + ifaGivenHours +
                    ", ifcGivenHours=" + ifcGivenHours +
                    ", ifaExtraHours=" + ifaExtraHours +
                    ", ifcExtraHours=" + ifcExtraHours +
                    ", ifaProdHours=" + ifaProdHours +
                    ", ifcProdHours=" + ifcProdHours +
                    ", ifaExtraProdHours=" + ifaExtraProdHours +
                    ", ifcExtraProdHours=" + ifcExtraProdHours +
                    '}';
        }
    }

