import React, { useEffect, useState } from "react";
import axios from "axios";
import { useEmployee } from "../../context/EmployeeContext";
import styles from "../../styles/Employee/LeavePermissionForm.module.css";

const ManagerProjectActions = () => {
  const { employee, loading } = useEmployee();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [extraHours, setExtraHours] = useState("");
  const [tab, setTab] = useState("Send Request");
  const [requestType, setRequestType] = useState("");
  const [reason, setReason] = useState("");
  const [newCompletionDate, setNewCompletionDate] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  const fetchProjects = async () => {
    if (!employee?.empId) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/project/manager/${employee.empId}/active`
      );
      setProjects(res.data);
    } catch (err) {
      console.error("Error loading projects", err);
    }
  };

  const handleSubmitProjectUpdate = async () => {
    if (!selectedProject) return;

    try {
      // ✅ Update Status → Completed
      if (
        selectedProject.projectStatus === true &&
        selectedStatus === "Completed"
      ) {
        await axios.put(
          `http://localhost:8080/project/toggle-status/${selectedProject.id}`
        );
        alert("Project marked as completed ✅");
      }

      // ✅ Update Project Activity
      if (
        selectedActivity &&
        selectedActivity !== selectedProject.projectActivityStatus
      ) {
        await axios.put(
          `http://localhost:8080/project/update-activity/${selectedProject.id}`,
          null,
          {
            params: { activity: selectedActivity },
          }
        );
        alert("Project activity updated ✅");
      }

      fetchProjects();
      resetFields();
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    }
  };

  const resetFields = () => {
    setSelectedProject(null);
    setRequestType("");
    setReason("");
    setExtraHours("");
    setNewCompletionDate("");
    setSelectedStatus("");
    setSelectedActivity("");
  };


  useEffect(() => {
    fetchProjects();
  }, [employee]);

  const handleSendRequest = async () => {
  if (!selectedProject) {
    alert("Select a project");
    return;
  }

  if (!requestType) {
    alert("Select request type");
    return;
  }

  const agmId = Number(1001); 
  const projectName = selectedProject.projectName;// make sure this exists
  const projectId = selectedProject.id;

  let title = "";
  let message = "";

  if (requestType === "EXTRA_HOURS") {
    if (!extraHours || extraHours <= 0) {
      alert("Enter valid extra hours");
      return;
    }
    title = "Extra Hours Request";
    message = `Project: ${projectName} | projectId=${projectId} | Requesting ${extraHours} extra hours. Reason: ${reason}`;
  }

  if (requestType === "COMPLETION_EXTENSION") {
    if (!newCompletionDate) {
      alert("Select new completion date");
      return;
    }
    title = "Completion Date Extension";
    message = `Project: ${projectName} | projectId=${projectId} | Request to extend completion date to ${newCompletionDate}. Reason: ${reason}`;
  }

  const url =
    `http://localhost:8080/notifications/create` +
    `?senderId=${employee.empId}` +
    `&receiverId=${agmId}` +
    `&title=${encodeURIComponent(title)}` +
    `&message=${encodeURIComponent(message)}` +
    `&type=${requestType}`;

  try {
    await axios.post(url);
    alert("Request sent ✅");

    // Clear the form
    setRequestType("");
    setExtraHours("");
    resetFields();
    setNewCompletionDate("");
    setReason("");
  } catch (err) {
    console.error(err);
    alert("Failed to send request ❌");
  }
};


  const handleProjectChange = (e) => {
    const p = projects.find((proj) => proj.id === parseInt(e.target.value));
    setSelectedProject(p || null);
    setSelectedStatus(p ? (p.projectStatus ? "Active" : "Completed") : "");
    setSelectedActivity(p?.projectActivityStatus || "");

    // 🔹 Reset request fields when project changes
    setRequestType("");
    setExtraHours("");
    setReason("");
    setNewCompletionDate("");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 style={{ marginBottom: "20px" }}>Project Management</h2>

      {/* Filter Tabs */}
      <div className={styles.filterButtons}>
        {["Send Request", "Project Completion"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setTab(item);
              setSelectedProject(null);
              setExtraHours("");
              setSelectedStatus("");
              setSelectedActivity("");
              setRequestType("");
              setReason("");
              setNewCompletionDate("");
            }}
            className={`${styles.filterBtn} ${
              tab === item ? styles.active : ""
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* TAB 1 - Send Request */}
      {tab === "Send Request" && (
        <>
          <div className={styles.fld}>
            <label>Select Project</label>
            <select value={selectedProject?.id || ""} onChange={handleProjectChange}>
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.projectName} ({proj.clientName})
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Only show request type if project selected */}
          {selectedProject && (
            <div className={styles.fld}>
              <label>Request Type</label>
              <select
                value={requestType}
                onChange={(e) => {
                  setRequestType(e.target.value);
                  setExtraHours("");
                  setReason("");
                  setNewCompletionDate("");
                }}
              >
                <option value="">Select Request Type</option>
                <option value="EXTRA_HOURS">Extra Hours Request</option>
                <option value="COMPLETION_EXTENSION">Completion Date Extension</option>
              </select>
            </div>
          )}

          {/* ✅ Show form ONLY if project selected + request type selected */}
          {selectedProject && requestType === "EXTRA_HOURS" && (
            <>
              <div className={styles.fld}>
                <label>Extra Hours Needed</label>
                <input
                  type="number"
                  value={extraHours}
                  onChange={(e) => setExtraHours(e.target.value)}
                />
              </div>

              <div className={styles.fld}>
                <label>Reason</label>
                <textarea
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for extra hours"
                />
              </div>

              <button className={styles.submitBtn} onClick={handleSendRequest}>
                Send Request
              </button>
            </>
          )}

          {selectedProject && requestType === "COMPLETION_EXTENSION" && (
            <>
              <div className={styles.fld}>
                <label>New Completion Date</label>
                <input
                  type="date"
                  value={newCompletionDate}
                  onChange={(e) => setNewCompletionDate(e.target.value)}
                />
              </div>

              <div className={styles.fld}>
                <label>Reason</label>
                <textarea
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for extension"
                />
              </div>

              <button className={styles.submitBtn} onClick={handleSendRequest}>
                Send Request
              </button>
            </>
          )}
        </>
      )}
      {tab === "Project Completion" && (
        <>
          <div className={styles.fld}>
            <label>Select Project</label>
            <select
              value={selectedProject?.id || ""}
              onChange={handleProjectChange}
            >
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.projectName} ({proj.clientName})
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <>
              <div className={styles.fld}>
                <label>Current Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className={styles.fld}>
                <label>Project Activity</label>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                >
                  <option value="">Select Activity</option>
                  <option value="IFRA">IFRA</option>
                  <option value="Client Rework">Client Rework</option>
                  <option value="Internal Rework">Internal Rework</option>
                </select>
              </div>

              <button
                className={styles.submitBtn}
                onClick={handleSubmitProjectUpdate}
              >
                Submit
              </button>
            </>
          )}
        </>
      )}
      
    </div>
  );
};

export default ManagerProjectActions;
