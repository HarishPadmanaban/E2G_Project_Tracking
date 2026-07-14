package com.example.project_tracking.Specification;
import com.example.project_tracking.Model.Project;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ProjectSpecification {

    public static Specification<Project> notDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("softDelete"));
    }

    public static Specification<Project> hasManagerId(Long managerId) {
        return (root, query, cb) ->
                managerId == null ? null : cb.equal(root.get("managerId"), managerId);
    }

    public static Specification<Project> hasStatus(Boolean projectStatus) {
        return (root, query, cb) ->
                projectStatus == null ? null : cb.equal(root.get("projectStatus"), projectStatus);
    }

    public static Specification<Project> searchTerm(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            String like = "%" + term.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("projectName")), like),
                    cb.like(cb.lower(root.get("clientName")), like)
            );
        };
    }
}