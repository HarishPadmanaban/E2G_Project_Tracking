package com.example.project_tracking.Repository;

import com.example.project_tracking.Model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity,Long> {
}
