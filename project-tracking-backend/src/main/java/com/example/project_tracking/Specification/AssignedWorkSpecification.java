package com.example.project_tracking.Specification;

import com.example.project_tracking.Model.AssignedWork;
import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Model.AssignedWork;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class AssignedWorkSpecification {
    public static Specification<AssignedWork> notDeleted() {
        return (root, query, cb) ->
                cb.or(cb.isNull(root.get("isDeleted")), cb.isFalse(root.get("isDeleted")));
    }


    public static Specification<AssignedWork> hasStatus(String status) {
        return (root, query, cb) ->
                (status == null || status.isBlank()) ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<AssignedWork> employeeNameContains(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            Join<AssignedWork, Employee> employee = root.join("employee");
            Join<AssignedWork,Project> project = root.join("project");
            return cb.or(cb.like(cb.lower(employee.get("name")), "%" + term.toLowerCase() + "%"),
                    cb.like(cb.lower(project.get("projectName")), "%" + term.toLowerCase() + "%")
                    );
        };
    }

    public static Specification<AssignedWork> dateFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null ? null : cb.greaterThanOrEqualTo(root.get("assignedDate"), from);
    }

    public static Specification<AssignedWork> dateTo(LocalDate to) {
        return (root, query, cb) ->
                to == null ? null : cb.lessThanOrEqualTo(root.get("assignedDate"), to);
    }

    public static Specification<AssignedWork> hasManagerId(Long managerId) {
        return (root, query, cb) -> {
            if (managerId == null) return null;
            Join<AssignedWork, Employee> manager = root.join("manager");
            return cb.equal(manager.get("empId"), managerId);
        };
    }
}
