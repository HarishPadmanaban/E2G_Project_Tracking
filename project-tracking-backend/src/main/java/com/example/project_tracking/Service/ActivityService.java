package com.example.project_tracking.Service;

import com.example.project_tracking.Model.Activity;
import com.example.project_tracking.Repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {
    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> findAllActivity()
    {
        return activityRepository.findAll();
    }
}
