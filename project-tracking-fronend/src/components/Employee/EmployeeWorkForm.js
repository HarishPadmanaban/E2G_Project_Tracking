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
     if (!isFormValid(false)) {
      alert("Please fill in all required fields before starting.");
      return;
    }
    const now = new Date();
    const start = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    setFormData((prev) => ({ ...prev, startTime: start }));
    setIsRunning(true);
    setStopDisabled(true);  // disable stop initially
    setSubmitDisabled(true);

    // Enable STOP after 2 minutes
    setTimeout(() => {
      setStopDisabled(false);
    }, 2 * 60 * 1000); // 2 minutes
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
    setStartDisabled(true);      // 👈 Start disabled after stop
    setSubmitDisabled(false);// enable submit after stop
  }
};



  const handleSubmit = (e) => {
  e.preventDefault();
  if (!employee) return;
  if (!isFormValid(true)) {
    alert("Please fill in all required fields before submitting.");
    return;
  }
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
setFormData({
        projectId: "",
        clientName: "",
        activityId: "",
        category: "",
        projectActivityType: "",
        startTime: "",
        endTime: "",
        workHours: "",
        projectActivity: "",
        assignedWork: "",
        status: "Pending",
        remarks: ""
      });
      setSubmitDisabled(true);   // Disable Submit
      setStartDisabled(false);
//   axios
//     .post("http://localhost:8080/api/userform", payload)
//     .then(() => {
//       alert("Work submitted successfully!");
//       setFormData({
//         projectId: "",
//         clientName: "",
//         activityId: "",
//         category: "",
//         startTime: "",
//         endTime: "",
//         workHours: "",
//         projectActivity: "",
//         assignedWork: "",
//         status: "Pending",
//         remarks: ""
//       });
//       setSubmitDisabled(true);
//       setStartDisabled(false);
//     })
//     .catch((err) => {
//       console.error("❌ Error submitting work:", err);
//       alert("Submission failed!");
//     });
};
const isFormValid = (checkStatus = false) => {
  const {
    projectId,
    projectActivityType,
    activityId,
    category,
    projectActivity,
    assignedWork,
    status
  } = formData;

  const baseFieldsFilled = (
    projectId &&
    projectActivityType &&
    activityId &&
    category &&
    projectActivity &&
    assignedWork
  );

  // If checkStatus is true, also validate `status`
  return checkStatus ? baseFieldsFilled && status : baseFieldsFilled;
};



  if (loading) return <p>Loading employee details...</p>;

 return (
  <div>
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Employee details */}
        <div className={styles.topRow}>
          <div className={styles.field}>
            <label>Employee ID</label>
            <input type="text" value={employee.empId} readOnly placeholder="Employee ID" required />
          </div>

          <div className={styles.field}>
            <label>Employee Name</label>
            <input type="text" value={employee.name} readOnly placeholder="Employee Name" required />
          </div>

          <div className={styles.field}>
            <label>Designation</label>
            <input type="text" value={employee.designation} readOnly placeholder="Designation" required />
          </div>
        </div>

        {/* Project row */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Project Name</label>
            <select name="projectId" value={formData.projectId} onChange={handleProjectChange}>
              <option value="">Project Name</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.projectName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Client Name</label>
            <input type="text" value={formData.clientName} readOnly placeholder="Client Name" />
          </div>

          <div className={styles.field}>
            <label>Date</label>
            <input type="text" value={new Date().toISOString().split("T")[0]} readOnly placeholder="Date" />
          </div>
        </div>

        {/* Activity row */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Activity Type</label>
            <select name="projectActivityType" value={formData.projectActivityType} onChange={handleChange}>
              <option value="">Activity Type</option>
              <option value="Modelling">Modelling</option>
              <option value="Checking">Checking</option>
              <option value="Detailing">Detailing</option>
              <option value="Common">Common</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Activity</label>
            <select name="activityId" value={formData.activityId} onChange={handleActivityChange}>
              <option value="">Activity</option>
              {filteredActivities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.activityName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Category</label>
            <input type="text" value={formData.category} readOnly placeholder="Category" />
          </div>
        </div>

        {/* Time row */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Start Time</label>
            <input type="text" value={formData.startTime} readOnly placeholder="Start Time" />
          </div>

          <div className={styles.field}>
            <label>End Time</label>
            <input type="text" value={formData.endTime} readOnly placeholder="End Time" />
          </div>

          <div className={styles.field}>
            <label>Work Hours</label>
            <input type="text" value={formData.workHours} readOnly placeholder="Work Hours" />
          </div>
        </div>

        {/* Work details */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Project Activity</label>
            <select name="projectActivity" value={formData.projectActivity} onChange={handleChange}>
              <option value="">Project Activity</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Bug Fixing">Bug Fixing</option>
              <option value="Documentation">Documentation</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Assigned Work</label>
            <input
              type="text"
              name="assignedWork"
              value={formData.assignedWork}
              onChange={handleChange}
              placeholder="Assigned Work"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Remarks"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.row}>
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStartStop}
              className={`${styles.startBtn} ${startDisabled ? styles.buttonDisabled : ""}`}
              disabled={startDisabled}
            >
              Start
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartStop}
              className={`${styles.stopBtn} ${stopDisabled ? styles.buttonDisabled : ""}`}
              disabled={stopDisabled}
            >
              {stopDisabled ? "Stop (Wait 2 mins)" : "Stop"}
            </button>
          )}

          <button
            type="submit"
            className={`${styles.submitBtn} ${submitDisabled ? styles.buttonDisabled : ""}`}
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
