package com.example.project_tracking.DTO;

/**
 * One flat row emitted by the backend for the Work Analysis Pivot Table.
 * The frontend only needs to render these rows; zero transformation required.
 *
 * Change from previous version:
 *   Added `mainType` field — sourced from Activity.mainType (Modeling / Checking / Detailing).
 *   Carried here so the frontend can filter by it without any string manipulation.
 *   The constructor gains one extra parameter; the field is added to hiddenAttributes
 *   in the frontend so it doesn't appear as a pivot dimension unless the user drags it in.
 */
public class PivotRowDTO {

    private int    id;
    private String employee;
    private String designation;
    private String manager;
    /** Format: "ProjectName (N hrs)" — assigned hours already embedded */
    private String project;
    private String activity;
    /** Activity.mainType — e.g. "Modeling", "Checking", "Detailing", "Studying" */
    private String mainType;
    private String status;
    private double workHours;
    private String date;
    private String assignedWork;

    // ── constructors ─────────────────────────────────────────────────────────

    public PivotRowDTO() {}

    public PivotRowDTO(int id, String employee, String designation,String manager, String project,
                       String activity, String mainType, String status,
                       double workHours, String date, String assignedWork) {
        this.id           = id;
        this.employee     = employee;
        this.designation = designation;
        this.manager      = manager;
        this.project      = project;
        this.activity     = activity;
        this.mainType     = mainType;
        this.status       = status;
        this.workHours    = workHours;
        this.date         = date;
        this.assignedWork = assignedWork;

    }

    // ── getters / setters ─────────────────────────────────────────────────────

    public int getId()                      { return id; }
    public void setId(int id)               { this.id = id; }

    public String getEmployee()             { return employee; }
    public void setEmployee(String e)       { this.employee = e; }

    public String getManager()              { return manager; }
    public void setManager(String m)        { this.manager = m; }

    public String getProject()              { return project; }
    public void setProject(String p)        { this.project = p; }

    public String getActivity()             { return activity; }
    public void setActivity(String a)       { this.activity = a; }

    public String getMainType()             { return mainType; }
    public void setMainType(String t)       { this.mainType = t; }

    public String getStatus()               { return status; }
    public void setStatus(String s)         { this.status = s; }

    public double getWorkHours()            { return workHours; }
    public void setWorkHours(double h)      { this.workHours = h; }

    public String getDate()                 { return date; }
    public void setDate(String d)           { this.date = d; }

    public String getAssignedWork()         { return assignedWork; }
    public void setAssignedWork(String aw)  { this.assignedWork = aw; }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
