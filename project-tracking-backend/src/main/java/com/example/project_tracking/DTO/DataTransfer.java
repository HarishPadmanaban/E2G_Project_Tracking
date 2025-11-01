package com.example.project_tracking.DTO;

import com.example.project_tracking.Model.Employee;

public class DataTransfer {
    private Long empId;
    private String name;
    private String designation;
    private Boolean isManager = false;
    private Boolean isTL = false;
    private Long reportingToId;      // Only send the manager's ID


    public DataTransfer( Long empId, String name, String designation,
                        Boolean isManager, Boolean isTL, Employee reportingTo) {
        this.empId = empId;
        this.name = name;
        this.designation = designation;
        this.isManager = isManager;
        this.isTL = isTL;

        // Safely extract reportingTo info
        if (reportingTo != null) {
            this.reportingToId = reportingTo.getEmpId();
        } else {
            this.reportingToId = null;
        }
    }


    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
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
