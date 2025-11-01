package com.example.project_tracking.Repository;

import com.example.project_tracking.Model.WorkDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkDetailsRepository extends JpaRepository<WorkDetails,Long> {
    List<WorkDetails> findByEmployee_EmpId(Long employeeId);

    List<WorkDetails> findByManager_EmpId(Long managerId);

    List<WorkDetails> findByProjectId(Long projectId);

    List<WorkDetails> findByActivityId(Long activityId);

    Optional<WorkDetails> findTopByEmployee_EmpIdAndEndTimeIsNullOrderByIdDesc(Long employeeId);

    @Query("SELECT w FROM WorkDetails w WHERE w.employee.id = :employeeId AND w.project.id = :projectId")
    List<WorkDetails> findByEmployeeAndProject(@Param("employeeId") Long employeeId,
                                               @Param("projectId") Long projectId);

    @Query("SELECT w FROM WorkDetails w WHERE w.manager.id = :managerId AND w.project.id = :projectId")
    List<WorkDetails> findByManagerAndProject(@Param("managerId") Long managerId,
                                              @Param("projectId") Long projectId);

    @Query("SELECT w FROM WorkDetails w WHERE w.project.id = :projectId AND w.activity.id = :activityId")
    List<WorkDetails> findByProjectAndActivity(@Param("projectId") Long projectId,
                                               @Param("activityId") Long activityId);

    @Query("SELECT w FROM WorkDetails w WHERE w.project.projectStatus = true")
    List<WorkDetails> findAllByActiveProjectStatus();
}
