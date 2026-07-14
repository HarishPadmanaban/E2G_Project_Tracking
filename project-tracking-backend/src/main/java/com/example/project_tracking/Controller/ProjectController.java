package com.example.project_tracking.Controller;

import com.example.project_tracking.DTO.ProjectRequest;
import com.example.project_tracking.DTO.ProjectResponse;
import com.example.project_tracking.Model.Project;
import com.example.project_tracking.Service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/project")
@CrossOrigin(origins="*")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectsByManagerId(@PathVariable long id)
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getProjectsByManagerId(@PathVariable long id)
//    {
//        System.out.println(id);
//        return ResponseEntity.ok(projectService.getProjectsByManager(id));
//    }

    @GetMapping(value = {"/","/{mgrId}"})
    public ResponseEntity<?> getAllProjects(@PathVariable(required = false) Long mgrId,@RequestParam(required = false) String query)
    {
        return ResponseEntity.ok(projectService.getAll(mgrId,query));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/")
    public ResponseEntity<?> getAllProjects()
    @GetMapping(value = {"/all","/all/{mgrId}"})
    public ResponseEntity<?> getProjectsByProjectStatus(@RequestParam(required = false) String projectStatus,@PathVariable(required = false) Long mgrId,@RequestParam(required = false) String query)
    {
        return ResponseEntity.ok(projectService.getProjectsByProjectStatus(projectStatus,mgrId,query));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/save")
    public ResponseEntity<?> createProject(@RequestParam String projectName,@RequestParam String clientName,@RequestParam Long pmId,@RequestParam Long agmId,@RequestParam BigDecimal totalHours,@RequestParam LocalDate awardedDate,@RequestParam LocalDate plannedStartDate,@RequestParam LocalDate completedDate,@RequestParam BigDecimal ifaGivenHours, @RequestParam BigDecimal ifcGivenHours)
    {
        projectService.createProject(projectName,clientName,pmId,agmId,totalHours,awardedDate,plannedStartDate,completedDate,ifaGivenHours,ifcGivenHours);
        return ResponseEntity.ok("Saved Successfully");
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/manager/{managerId}/active")
    public ResponseEntity<List<Project>> getActiveProjectsByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(projectService.getActiveProjectsByManager(managerId));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/manager/{managerId}/not-assigned")
    public ResponseEntity<List<Project>> getActiveProjectsByManagerNotAssigned(@PathVariable Long managerId) {
        return ResponseEntity.ok(projectService.getProjectsByManagerNotAssigned(managerId));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/{projectId}/add-hours")
    public Project addProjectHours(
            @PathVariable Long projectId,
            @RequestParam Long tlId,
            @RequestParam BigDecimal modellingHours,
            @RequestParam BigDecimal checkingHours,
            @RequestParam BigDecimal detailingHours,
            @RequestParam BigDecimal studyHours,
            @RequestParam String projectActivity,
            @RequestParam LocalDate startDate
            ) {
        return projectService.updateProjectHours(tlId,projectId, modellingHours, checkingHours, detailingHours,studyHours,projectActivity,startDate);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/editproject")
    public ResponseEntity<?> editProject(@RequestBody ProjectRequest project)
    {
        return ResponseEntity.ok(projectService.editProject(project));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/toggle-status/{id}")
    public ResponseEntity<ProjectResponse> changeStatus(@PathVariable Long id){
        return ResponseEntity.ok(projectService.toggleStatus(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/set-extra-hours/{id}")
    public ResponseEntity<ProjectResponse> setExtraHours(@PathVariable Long id,@RequestParam BigDecimal extraHours,@RequestParam String extraHoursNote){
        //System.out.println(id+"\n"+extraHours);
        return ResponseEntity.ok(projectService.setExtra(id,extraHours,extraHoursNote));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/extend/{id}")
    public ResponseEntity<ProjectResponse> extendCompletedDate(@PathVariable Long id,@RequestParam LocalDate completedDate){
        //System.out.println(id+"\n"+extraHours);
        return ResponseEntity.ok(projectService.extendCompletedDate(id,completedDate));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/get-by-tl/{id}")
    public ResponseEntity<?> getProjectsByTlId(@PathVariable Long id)
    {
        return ResponseEntity.ok(projectService.getProjectsByTl(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/update-activity/{id}")
    public ResponseEntity<?> setActivityStatus(@PathVariable Long id,@RequestParam String activity)
    {
        return ResponseEntity.ok(projectService.setActivity(id,activity));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("soft-delete/{id}")
    public ResponseEntity<?> softDelete(@PathVariable Long id)
    {
        return ResponseEntity.ok(projectService.softDelete(id));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("ifa-date/{id}")
    public ResponseEntity<?> updateIfaDate(@PathVariable Long id,@RequestParam LocalDate plannedIfaDate,@RequestParam LocalDate actualIfaDate,@RequestParam String projectActivityStatus)
    {
        return ResponseEntity.ok(projectService.updateIfaDate(id,plannedIfaDate,actualIfaDate,projectActivityStatus));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("ifc-date/{id}")
    public ResponseEntity<?> updateIfcDate(@PathVariable Long id, @RequestParam LocalDate plannedIfcDate, @RequestParam LocalDate actualIfcDate,@RequestParam String projectActivityStatus)
    {
        //System.out.println(plannedIfcDate +"\n" + actualIfcDate);
        return ResponseEntity.ok(projectService.updateIfcDate(id,plannedIfcDate,actualIfcDate,projectActivityStatus));
    }

}
