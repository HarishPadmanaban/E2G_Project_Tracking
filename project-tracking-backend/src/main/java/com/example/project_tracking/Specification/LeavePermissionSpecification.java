package com.example.project_tracking.Specification;

import com.example.project_tracking.Model.Employee;
import com.example.project_tracking.Model.LeavePermission;
import com.example.project_tracking.Model.Project;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class LeavePermissionSpecification {

    public static Specification<LeavePermission> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("isActive"));
    }

    public static Specification<LeavePermission> hasManagerId(Long managerId) {
        return (root, query, cb) -> {
            if (managerId == null) return null;
            Join<LeavePermission, Employee> manager = root.join("manager");
            return cb.equal(manager.get("id"), managerId);
        };
    }

    public static Specification<LeavePermission> hasStatus(String status) {
        return (root, query, cb) ->
                (status == null || status.equalsIgnoreCase("All")) ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<LeavePermission> appliedFrom(LocalDate from) {
        return (root, query, cb) ->
                from == null ? null : cb.greaterThanOrEqualTo(root.get("appliedDate"), from);
    }

    public static Specification<LeavePermission> appliedTo(LocalDate to) {
        return (root, query, cb) ->
                to == null ? null : cb.lessThanOrEqualTo(root.get("appliedDate"), to);
    }

    public static Specification<LeavePermission> searchTerm(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            Join<LeavePermission, Employee> manager = root.join("employee");
            String like = "%" + term.toLowerCase() + "%";
            return cb.like(cb.lower(root.get("name")), like);
        };
    }
}