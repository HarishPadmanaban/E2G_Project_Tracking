package com.example.project_tracking.DTO;

import com.example.project_tracking.Model.Employee;

public class DataTransfer {
    private Long id;
    private String empId;
    private String name;
    private String designation;
    private Boolean isManager = false;
    private Boolean isTL = false;
    private Long reportingToId;      // Only send the manager's ID


    public DataTransfer(Long id, String empId, String name, String designation,
                        Boolean isManager, Boolean isTL, Employee reportingTo) {
        this.id = id;
        this.empId = empId;
        this.name = name;
        this.designation = designation;
        this.isManager = isManager;
        this.isTL = isTL;

        // Safely extract reportingTo info
        if (reportingTo != null) {
            this.reportingToId = reportingTo.getId();
        } else {
            this.reportingToId = null;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Boolean getManager() {
        return isManager;
    }

    public void setManager(Boolean manager) {
        isManager = manager;
    }

    public Boolean getTL() {
        return isTL;
    }

    public void setTL(Boolean TL) {
        isTL = TL;
    }

    public Long getReportingToId() {
        return reportingToId;
    }

    public void setReportingToId(Long reportingToId) {
        this.reportingToId = reportingToId;
    }
}
