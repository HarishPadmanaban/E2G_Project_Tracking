package com.example.project_tracking.Specification;

import com.example.project_tracking.Model.Activity;
import org.springframework.data.jpa.domain.Specification;

public class ActivitySpecification {

    public static Specification<Activity> notDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("softDelete"));
    }

    public static Specification<Activity> hasType(String type)
    {
        return ((root, query, criteriaBuilder) ->
                (type == null || type.equalsIgnoreCase("All")) ? null :
                        criteriaBuilder.equal(root.get("mainType"),type)
                );
    }

    public static Specification<Activity> hasCategory(String category)
    {
        return ((root, query, criteriaBuilder) ->
                (category == null || category.equalsIgnoreCase("All")) ? null :
                        criteriaBuilder.equal(root.get("category"),category)
        );
    }

    public static Specification<Activity> hasSearchTerm(String term)
    {
        if(term == null || term.isBlank()) return null;
        String like = "%"+term.toLowerCase()+"%";
        return (root, query, cb) ->
                    cb.like(root.get("activityName"),like);
    }
}
