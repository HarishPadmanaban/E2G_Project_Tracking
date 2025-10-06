import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Employee/EmployeeWorkForm.module.css";
import { useEmployee } from "../../context/EmployeeContext";

const EmployeeWorkForm = () => {
  const { employee,loading } = useEmployee();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [startDisabled, setStartDisabled] = useState(false);
  const [stopDisabled, setStopDisabled] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [formData, setFormData] = useState({
    projectId: "",
    clientName: "",
    projectActivityType: "", 
    activityId: "",
    category: "",
    startTime: "",
    endTime: "",
    workHours: "",
    projectActivity: "",
    assignedWork: "",
    status: "Pending",
    remarks: ""
  });

  const [isRunning, setIsRunning] = useState(false);

  // Fetch projects and activities when employee context is available
  useEffect(() => {
    if (employee) {
     if (!employee || !employee.reportingToId) return;
  console.log("Fetching projects for managerId:", employee.reportingToId);
      axios
        .get(`http://localhost:8080/project/${employee.reporting_toId}`)
        .then((res) => {
    setProjects(res.data);
    console.log("Fetched projects:", res.data);
  })
        .catch((err) => console.error("Error fetching projects:", err));

      // Fetch all activities
      console.log(employee);
      console.log(projects);
      axios
        .get("http://localhost:8080/activity/")
        .then((res) => {
    setActivities(res.data);
    console.log("Fetched activities:", res.data); // ✅ actual data here
  })
        .catch((err) => console.error("Error fetching activities:", err));
        console.log(activities);
    }
  }, [employee]);

  useEffect(() => {
  // Prevent going back to login when on employee pages
  const handlePopState = () => {
    if (window.location.pathname.startsWith("/employee")) {
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  // Push a dummy entry to block going back
  window.history.pushState(null, "", window.location.pathname);
  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);

useEffect(() => {
  setFilteredActivities(activities);
}, [activities]);


  const handleChange = (e) => {
  const { name, value } = e.target;

  // Update the form data normally
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));

  // If the field changed is Activity Type, filter activities
  if (name === "projectActivityType") {
    const filtered = activities.filter(
      (act) => act.category.toLowerCase() === value.toLowerCase()
    );
    setFilteredActivities(filtered);

    // Reset previously selected activity
    setFormData((prev) => ({
      ...prev,
      activityId: "",
      category: value
    }));
  }
};


  const handleProjectChange = (e) => {
    const selectedProject = projects.find(
      (proj) => proj.id.toString() === e.target.value
    );
    setFormData({
      ...formData,
      projectId: e.target.value,
      clientName: selectedProject ? selectedProject.client_name : ""
    });
  };

  const handleActivityChange = (e) => {
    const selectedActivity = activities.find(
      (act) => act.id.toString() === e.target.value
    );
    setFormData({
      ...formData,
      activityId: e.target.value,
      category: selectedActivity ? selectedActivity.category : ""
    });
  };

  const handleStartStop = () => {
    if (!isRunning) {
      const start = new Date().toLocaleTimeString("en-IN", { hour12: false });
      setFormData({ ...formData, startTime: start });
      setIsRunning(true);

      setStartDisabled(true);
      setStopDisabled(false);

      setTimeout(() => setStartDisabled(false), 300000); 
    } else {
      const end = new Date().toLocaleTimeString("en-IN", { hour12: false });
      const startTime = new Date(`1970-01-01T${formData.startTime}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      const diffHours = (endTime - startTime) / (1000 * 60 * 60);

      setFormData({
        ...formData,
        endTime: end,
        workHours: diffHours.toFixed(2)
      });

      setIsRunning(false);
      setStopDisabled(true);
      setSubmitDisabled(false);
      setStartDisabled(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employee) return;

    const payload = {
      employee_id: employee.id,
      manager_id: employee.reporting_to,
      project_id: formData.projectId,
      activity_id: formData.activityId,
      date: new Date().toISOString().split("T")[0],
      work_hours: formData.workHours,
      start_time: formData.startTime,
      end_time: formData.endTime,
      project_activity: formData.projectActivity,
      assigned_work: formData.assignedWork,
      status: formData.status,
      remarks: formData.remarks
    };

    axios
      .post("http://localhost:8080/api/userform", payload)
      .then(() => {
        alert("Work submitted successfully!");
        setFormData({
          projectId: "",
          clientName: "",
          activityId: "",
          category: "",
          startTime: "",
          endTime: "",
          workHours: "",
          projectActivity: "",
          assignedWork: "",
          status: "Pending",
          remarks: ""
        });
        setSubmitDisabled(true);
        setStartDisabled(false);
      })
      .catch((err) => {
        console.error("Error submitting work:", err);
        alert("Submission failed!");
      });
  };

  if (loading) return <p>Loading employee details...</p>;

  return (
    <div>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Employee details */}
          <div className={styles.topRow}>
            <input type="text" value={employee.emp_id} readOnly placeholder="Employee ID" />
            <input type="text" value={employee.name} readOnly placeholder="Employee Name" />
            <input type="text" value={employee.designation} readOnly placeholder="Designation" />
          </div>

          {/* Project row */}
          <div className={styles.row}>
            <select name="projectId" value={formData.projectId} onChange={handleProjectChange}>
              <option value="">Project Name</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.project_name}
                </option>
              ))}
            </select>
            <input type="text" value={formData.clientName} readOnly placeholder="Client Name" />
            <input type="text" value={new Date().toISOString().split("T")[0]} readOnly placeholder="Date" />
          </div>

          {/* Activity row */}
          <div className={styles.row}>
            <select name="projectActivityType" value={formData.projectActivityType} onChange={handleChange}>
              <option value="">Activity Type</option>
              <option value="Modelling">Modelling</option>
              <option value="Checking">Checking</option>
              <option value="Detailing">Detailing</option>
              <option value="Common">Common</option>
            </select>
            <select name="activityId" value={formData.activityId} onChange={handleActivityChange}>
              <option value="">Activity</option>
              {filteredActivities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.activity_name}
                </option>
              ))}
            </select>
            <input type="text" value={formData.category} readOnly placeholder="Category" />
            
          </div>

          {/* Time row */}
          <div className={styles.row}>
            <input type="text" value={formData.startTime} readOnly placeholder="Start Time" />
            <input type="text" value={formData.endTime} readOnly placeholder="End Time" />
            <input type="text" value={formData.workHours} readOnly placeholder="Work Hours" />
          </div>

          {/* Work details */}
          <div className={styles.row}>
            <select name="projectActivity" value={formData.projectActivity} onChange={handleChange}>
              <option value="">Project Activity</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Bug Fixing">Bug Fixing</option>
              <option value="Documentation">Documentation</option>
            </select>
            <input
              type="text"
              name="assignedWork"
              value={formData.assignedWork}
              onChange={handleChange}
              placeholder="Assigned Work"
            />
          </div>

          <div className={styles.row}>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Remarks"
            />
          </div>

          {/* Start/Stop Button */}
          <button
            type="button"
            onClick={handleStartStop}
            className={isRunning ? styles.stopBtn : styles.startBtn}
            disabled={isRunning ? stopDisabled : startDisabled}
          >
            {isRunning ? "Stop" : "Start"}
          </button>

          {/* Submit Button */}
          {!stopDisabled && (
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitDisabled}
            >
              Submit Work
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmployeeWorkForm;
