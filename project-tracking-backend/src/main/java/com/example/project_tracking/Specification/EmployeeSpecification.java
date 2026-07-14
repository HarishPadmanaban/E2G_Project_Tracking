package com.example.project_tracking.Specification;

import com.example.project_tracking.Model.AssignedWork;
import com.example.project_tracking.Model.Employee;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecification {

    public static Specification<Employee> notDeleted()
    {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isFalse(root.get("softDelete"));
    }

    public static Specification<Employee> hasDesignation(String designation) {
        return (root, query, cb) ->
                (designation == null || designation.equalsIgnoreCase("All"))
                        ? null
                        : cb.like(cb.lower(root.get("designation")),"%" + designation.trim() +"%");
        // cb.trim(...) guards against the same "designation has stray whitespace"
        // issue your frontend currently works around with .trim().trim().trim()
    }

    public static Specification<Employee> hasManagerId(Long managerId) {
        return (root, query, cb) -> {
            if (managerId == null) return null;
            Join<AssignedWork, Employee> manager = root.join("reportingTo");
            return cb.equal(manager.get("empId"), managerId);
        };
    }

    public static Specification<Employee> searchTerm(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            String like = "%" + term.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(cb.trim(root.get("designation"))), like),
                    cb.like(root.get("empId").as(String.class), "%" + term + "%")
            );
        };
    }
}
