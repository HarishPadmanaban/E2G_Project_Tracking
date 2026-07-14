package com.example.project_tracking.Specification;


import com.example.project_tracking.Model.AssignedWork;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Model.WorkDetails;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class WorkDetailsSpecification {

    public static Specification<WorkDetails> notDeleted() {
        return (root, query, cb) ->
                cb.or(cb.isNull(root.get("is_Deleted")), cb.isFalse(root.get("is_Deleted")));
    }

    public static Specification<WorkDetails> belongsToProject(Long projectId) {
        return (root, query, cb) -> {
            if (projectId == null) return null;
            Join<WorkDetails, AssignedWork> assigned = root.join("assignedWorkId");
            Join<AssignedWork, Project> project = assigned.join("project");
            return cb.equal(project.get("id"), projectId);
        };
    }

    public static Specification<WorkDetails> hasStatus(String status) {
        return (root, query, cb) ->
                (status == null || status.isBlank()) ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<WorkDetails> employeeNameContains(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            Join<WorkDetails, AssignedWork> assigned = root.join("assignedWorkId");
            Join<AssignedWork, Employee> employee = assigned.join("employee");
            return cb.like(cb.lower(employee.get("name")), "%" + term.toLowerCase() + "%");
        };
    }

    public static Specification<WorkDetails> dateFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null ? null : cb.greaterThanOrEqualTo(root.get("date"), from);
    }

    public static Specification<WorkDetails> dateTo(LocalDate to) {
        return (root, query, cb) ->
                to == null ? null : cb.lessThanOrEqualTo(root.get("date"), to);
    }

    public static Specification<WorkDetails> hasManagerId(Long managerId) {
        return (root, query, cb) -> {
            if (managerId == null) return null;
            Join<WorkDetails, AssignedWork> assigned = root.join("assignedWorkId");
            Join<AssignedWork, Employee> manager = assigned.join("manager");
            return cb.equal(manager.get("empId"), managerId);
        };
    }

    public static Specification<WorkDetails> searchTerm(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            Join<WorkDetails, AssignedWork> assigned = root.join("assignedWorkId");
            Join<AssignedWork, Employee> employee = assigned.join("employee");
            Join<AssignedWork, Employee> manager = assigned.join("manager");
            Join<AssignedWork, Project> project = assigned.join("project");

            String like = "%" + term.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(employee.get("name")), like),
                    cb.like(cb.lower(manager.get("name")), like),
                    cb.like(cb.lower(project.get("projectName")), like)
            );
        };
    }
}
