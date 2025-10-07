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
  if (!employee || !employee.reportingToId) return;

  console.log("Fetching projects for managerId:", employee.reportingToId);

  // Fetch projects by managerId
  axios
    .get(`http://localhost:8080/project/${employee.reportingToId}`)
    .then((res) => {
      setProjects(res.data);
      console.log("Fetched projects:", res.data);
    })
    .catch((err) => console.error("Error fetching projects:", err));

  // Fetch all activities
  axios
    .get("http://localhost:8080/activity/")
    .then((res) => {
      setActivities(res.data);
      console.log("Fetched activities:", res.data);
    })
    .catch((err) => console.error("Error fetching activities:", err));
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

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // If employee chooses the main type (Modelling / Checking / etc.)
  if (name === "projectActivityType") {
    const filtered = activities.filter(
      (act) => act.mainType && act.mainType.toLowerCase() === value.toLowerCase()
    );
    setFilteredActivities(filtered);

    // Reset activity and category
    setFormData((prev) => ({
      ...prev,
      projectActivityType: value,
      activityId: "",
      category: "",
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
    clientName: selectedProject ? selectedProject.clientName : ""
  });
};


  const handleActivityChange = (e) => {
  const selectedActivity = activities.find(
    (act) => act.id.toString() === e.target.value
  );

  setFormData((prev) => ({
    ...prev,
    activityId: e.target.value,
    category: selectedActivity ? selectedActivity.category : "",
  }));
};


  const handleStartStop = () => {
  if (!isRunning) {
    // START clicked
    const now = new Date();
    const start = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    setFormData((prev) => ({ ...prev, startTime: start }));
    setIsRunning(true);
    setStartDisabled(true);
    setStopDisabled(true);  // disable stop initially
    setSubmitDisabled(true);

    // Enable STOP after 5 minutes
    setTimeout(() => {
      setStopDisabled(false);
    }, 1 * 60 * 1000); // 5 minutes
  } else {
    // STOP clicked
    const now = new Date();
    const end = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    const [startH, startM] = formData.startTime.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startTotalMin = startH * 60 + startM;
    const endTotalMin = endH * 60 + endM;
    let diffMinutes = endTotalMin - startTotalMin;
    if (diffMinutes < 0) diffMinutes += 24 * 60;

    const diffHours = (diffMinutes / 60).toFixed(2);

    setFormData((prev) => ({
      ...prev,
      endTime: end,
      workHours: diffHours
    }));

    // Update states
    setIsRunning(false);
    setStopDisabled(true);
    setSubmitDisabled(false); // enable submit after stop
  }
};



  const handleSubmit = (e) => {
  e.preventDefault();
  if (!employee) return;

  const payload = {
    employee_id: employee.id,
    manager_id: employee.reportingToId,
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

  // 🟢 Print the entire data clearly before sending
  console.log("📦 Submitting Work Form Data:", payload);

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
      console.error("❌ Error submitting work:", err);
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
            <input type="text" value={employee.emp_id} readOnly placeholder="Employee ID" required/>
            <input type="text" value={employee.name} readOnly placeholder="Employee Name" required/>
            <input type="text" value={employee.designation} readOnly placeholder="Designation" required/>
          </div>

          {/* Project row */}
          <div className={styles.row}>
            <select name="projectId" value={formData.projectId} onChange={handleProjectChange}>
  <option value="">Project Name</option>
  {projects.map((proj) => (
    <option key={proj.id} value={proj.id}>
      {proj.projectName}
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
      {act.activityName}
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

          {/* START / STOP / SUBMIT Buttons */}
<div className={styles.row}>
  {!isRunning ? (
    <button
      type="button"
      onClick={handleStartStop}
      className={styles.startBtn}
      disabled={startDisabled}
    >
      Start
    </button>
  ) : (
    <button
      type="button"
      onClick={handleStartStop}
      className={styles.stopBtn}
      disabled={stopDisabled}
    >
      {stopDisabled ? "Stop (Wait 5 mins)" : "Stop"}
    </button>
  )}

  <button
    type="submit"
    className={styles.submitBtn}
    disabled={submitDisabled}
  >
    Submit Work
  </button>
</div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeWorkForm;
