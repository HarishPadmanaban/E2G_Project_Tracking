package com.example.project_tracking.Model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "work_details")

public class WorkDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnore
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    @JsonIgnore
    private Employee manager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    @JsonIgnore
    private Activity activity;

    private LocalDate date;
    private Double workHours;
    private LocalTime startTime;
    private LocalTime endTime;
    private String projectActivity;
    private String assignedWork;
    private String status;
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_work_id")
    private AssignedWork assignedWorkId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Employee getManager() {
        return manager;
    }

    public void setManager(Employee manager) {
        this.manager = manager;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getWorkHours() {
        return workHours;
    }

    public void setWorkHours(Double workHours) {
        this.workHours = workHours;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getProjectActivity() {
        return projectActivity;
    }

    public void setProjectActivity(String projectActivity) {
        this.projectActivity = projectActivity;
    }

    public String getAssignedWork() {
        return assignedWork;
    }

    public void setAssignedWork(String assignedWork) {
        this.assignedWork = assignedWork;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public AssignedWork getAssignedWorkId() {
        return assignedWorkId;
    }

    public void setAssignedWorkId(AssignedWork assignedWorkId) {
        this.assignedWorkId = assignedWorkId;
    }

    @Override
    public String toString() {
        return "WorkDetails{" +
                "id=" + id +
                ", employee=" + employee +
                ", manager=" + manager +
                ", project=" + project +
                ", activity=" + activity +
                ", date=" + date +
                ", workHours=" + workHours +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", projectActivity='" + projectActivity + '\'' +
                ", assignedWork='" + assignedWork + '\'' +
                ", status='" + status + '\'' +
                ", remarks='" + remarks + '\'' +
                '}';
    }
}

