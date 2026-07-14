package com.example.project_tracking.Repository;

import com.example.project_tracking.Model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity,Long>, JpaSpecificationExecutor<Activity> {
    List<Activity> findBySoftDeleteFalse();
}
