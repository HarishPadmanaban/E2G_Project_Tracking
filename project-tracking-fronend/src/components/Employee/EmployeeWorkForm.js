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
const [activeWorkId, setActiveWorkId] = useState(() => {
  return localStorage.getItem("activeWorkId") || null;
});

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

  useEffect(() => {
  if (activeWorkId) {
    localStorage.setItem("activeWorkId", activeWorkId);
  } else {
    localStorage.removeItem("activeWorkId");
  }
}, [activeWorkId]);


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
useEffect(() => {
  if (!employee || !employee.id) return;

  // 🟢 CASE 1: Use activeWorkId if available (Stopped but not submitted)
  console.log(activeWorkId);
  if (activeWorkId) {
    axios
      .get(`http://localhost:8080/workdetails/${activeWorkId}`)
      .then((res) => {
        const work = res.data;
        console.log(activeWorkId);
        console.log(work);
        if (!work) return;

        const selectedProject = projects.find(
          (proj) => proj.id.toString() === work.projectId?.toString()
        );
        const selectedActivity = activities.find(
          (act) => act.id.toString() === work.activityId?.toString()
        );

        // ✅ Autofill form for stopped work
        setFormData({
          projectId: work.projectId?.toString() || "",
          clientName: selectedProject ? selectedProject.clientName : "",
          projectActivityType: selectedActivity ? selectedActivity.mainType : "",
          activityId: work.activityId?.toString() || "",
          category: selectedActivity ? selectedActivity.category : "",
          startTime: work.startTime ? work.startTime.substring(0, 5) : "",
          endTime: work.endTime ? work.endTime.substring(0, 5) : "",
          workHours: work.workHours || "",
          projectActivity: work.projectActivity || "",
          assignedWork: work.assignedWork || "",
          status: work.status || "Pending",
          remarks: work.remarks || "",
        });

        // ⚙️ Preserve existing button state logic — don't force any change
        if (!work.endTime) {
           setIsRunning(true);
          setStartDisabled(true);
          setSubmitDisabled(true);
          // Calculate if stop should be enabled based on elapsed time
          const now = new Date();
          const [startH, startM] = work.startTime.split(":").map(Number);
          const startDate = new Date();
          startDate.setHours(startH, startM, 0);
          const diffMs = now - startDate;
          
          if (diffMs >= 2 * 60 * 1000) {
            setStopDisabled(false);
          } else {
            setStopDisabled(true);
            setTimeout(() => setStopDisabled(false), 2 * 60 * 1000 - diffMs);
          }
        } else {
          // stopped work — ready to submit
          setIsRunning(false);
          setStartDisabled(true);
          setStopDisabled(true);
          setSubmitDisabled(false);
        }
      })
      .catch((err) => console.error("Error fetching work by ID:", err));
  } else {
    // 🟢 CASE 2: Check for currently active running work
    axios
      .get(`http://localhost:8080/workdetails/active/${employee.id}`)
      .then((res) => {
        const active = res.data;

        if (active && !active.endTime) {
          const selectedProject = projects.find(
            (proj) => proj.id.toString() === active.projectId?.toString()
          );
          const selectedActivity = activities.find(
            (act) => act.id.toString() === active.activityId?.toString()
          );

          // Store running work ID
          setActiveWorkId(active.id);

          // ✅ Autofill for running session
          setFormData({
            projectId: active.projectId?.toString() || "",
            clientName: selectedProject ? selectedProject.clientName : "",
            projectActivityType: selectedActivity ? selectedActivity.mainType : "",
            activityId: active.activityId?.toString() || "",
            category: selectedActivity ? selectedActivity.category : "",
            startTime: active.startTime ? active.startTime.substring(0, 5) : "",
            endTime: "",
            workHours: "",
            projectActivity: active.projectActivity || "",
            assignedWork: active.assignedWork || "",
            status: active.status || "Pending",
            remarks: active.remarks || "",
          });

          // ⚙️ Maintain button states as before
          setIsRunning(true);
          setStartDisabled(true);
          setSubmitDisabled(true);

          const now = new Date();
          const [startH, startM] = active.startTime.split(":").map(Number);
          const startDate = new Date();
          startDate.setHours(startH, startM, 0);

          const diffMs = now - startDate;
          if (diffMs >= 2 * 60 * 1000) {
            setStopDisabled(false);
          } else {
            setStopDisabled(true);
            setTimeout(() => setStopDisabled(false), 2 * 60 * 1000 - diffMs);
          }
        } else {
          // No active work found — stay idle
          setIsRunning(false);
          setStartDisabled(false);
          setStopDisabled(true);
          setSubmitDisabled(true);
        }
      })
      .catch((err) => console.error("Error fetching active work:", err));
  }
}, [employee, projects, activities, activeWorkId]);






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
  if (!isFormValid(false)) {
    alert("Please fill in all required fields before starting.");
    return;
  }

  const now = new Date();
  const start = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

  const payload = {
    employeeId: employee.id,
    managerId: employee.reportingToId,
    projectId: formData.projectId,
    activityId: formData.activityId,
    date: new Date().toISOString().split("T")[0],
    startTime: start + ":00",
    projectActivity: formData.projectActivity,
    assignedWork: formData.assignedWork,
    status: formData.status,
    remarks: formData.remarks
  };

  axios.post("http://localhost:8080/workdetails/save", payload)
    .then((res) => {
      const workId = res.data.id; // <-- get the ID
    setActiveWorkId(workId);  
      setFormData((prev) => ({ ...prev, startTime: start }));
      setIsRunning(true);
      setStopDisabled(true);
      setSubmitDisabled(true);

      // Enable STOP after 2 minutes
      setTimeout(() => setStopDisabled(false), 2 * 60 * 1000);
    })
    .catch((err) => {
      console.error("Error starting work:", err);
      alert("Could not start activity.");
    });
}
 else {
  const now = new Date();
  const end = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

  const [startH, startM] = formData.startTime.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  if (diffMinutes < 0) diffMinutes += 24 * 60;
  const diffHours = (diffMinutes / 60).toFixed(2);

  axios.put(`http://localhost:8080/workdetails/stop/${employee.id}`, null, {
  params: {
    endTime: end + ":00",
    workHours: diffHours
  }
})
  .then(() => {
    setFormData((prev) => ({
      ...prev,
      endTime: end,
      workHours: diffHours
    }));
    setIsRunning(false);
    setStopDisabled(true);
    setStartDisabled(true);
    setSubmitDisabled(false);
  })
  .catch((err) => console.error("Error stopping work:", err));
}
};



  const handleSubmit = (e) => {
  e.preventDefault();
  if (!employee) return;
  console.log(formData);
  if (!isFormValid(true)) {
    console.log(formData);
    alert("Please fill in all required fields before submitting.");
    return;
  }
  const payload = {
    employeeId: employee.id,  // camelCase
    managerId: employee.reportingToId,  // camelCase
    projectId: formData.projectId,  // camelCase
    activityId: formData.activityId,  // camelCase
    date: new Date().toISOString().split("T")[0],
    workHours: parseFloat(formData.workHours),  // camelCase + convert to number
    startTime: formData.startTime + ":00",  // camelCase + add seconds for LocalTime
    endTime: formData.endTime + ":00",  // camelCase + add seconds for LocalTime
    projectActivity: formData.projectActivity,  // camelCase
    assignedWork: formData.assignedWork,  // camelCase
    status: formData.status,
    remarks: formData.remarks
  };

  // 🟢 Print the entire data clearly before sending
  console.log("📦 Submitting Work Form Data:", payload);
  axios
    .put(`http://localhost:8080/workdetails/savefinal`, payload, {
      params: { activeWorkId: activeWorkId } // ✅ send activeWorkId as query param
    })
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
      setActiveWorkId(null);
    })
    .catch((err) => {
      console.error("❌ Error submitting work:", err);
      alert("Submission failed!");
    });
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
              <option value="IFRA">IFRA</option>
              <option value="Client Rework">Client Rework</option>
              <option value="Internal Rework">Internal Rework</option>
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
