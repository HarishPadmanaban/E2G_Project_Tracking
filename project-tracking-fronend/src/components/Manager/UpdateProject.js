import React, { useEffect, useState } from "react";
import axios from "axios";
import { useEmployee } from "../../context/EmployeeContext";
import styles from "../../styles/Employee/LeavePermissionForm.module.css";

const ManagerProjectActions = () => {
  const { employee, loading } = useEmployee();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [extraHours, setExtraHours] = useState("");
  const [tab, setTab] = useState("Add Hours"); // ✅ tab state

  const fetchProjects = async () => {
    if (!employee?.empId) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/project/${employee.empId}`
      );
      setProjects(res.data);
    } catch (err) {
      console.error("Error loading projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [employee]);

  const handleProjectChange = (e) => {
    const p = projects.find((proj) => proj.id === parseInt(e.target.value));
    setSelectedProject(p || null);
  };

  const handleAddHours = async () => {
    if (!extraHours || extraHours <= 0) {
      alert("Enter valid extra hours!");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/project/set-extra-hours/${selectedProject.id}?extraHours=${extraHours}`,
      );
      console.log(selectedProject.id+"\n"+extraHours);
      alert("Extra hours added ✅");
      setExtraHours("");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to update hours");
    }
  };

  const handleCompletionToggle = async () => {
    try {
      await axios.put(
        `http://localhost:8080/project/toggle-status/${selectedProject.id}`
      );
      alert("Project status updated ✅");
      fetchProjects();
      setSelectedProject(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 style={{ marginBottom: "20px" }}>Project Management</h2>

      {/* ✅ Filter Buttons UI like your screenshot */}
      <div className={styles.filterButtons}>
        {["Add Hours", "Project Completion"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setTab(item);
              setSelectedProject(null);
              setExtraHours("");
            }}
            className={`${styles.filterBtn} ${
              tab === item ? styles.active : ""
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* ✅ Shared → Select Project Dropdown */}
      <div className={styles.fld}>
        <label>Select Project</label>
        <select onChange={handleProjectChange}>
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.projectName} ({proj.clientName})
            </option>
          ))}
        </select>
      </div>

      {/* ✅ TAB 1 - Add Hours */}
      {tab === "Add Hours" && selectedProject && (
        <>
          <div className={styles.fld}>
            <label>Assigned Hours</label>
            <input type="text" readOnly value={selectedProject.assignedHours} />
          </div>

          <div className={styles.fld}>
            <label>Add Extra Hours</label>
            <input
              type="number"
              value={extraHours}
              onChange={(e) => setExtraHours(e.target.value)}
            />
          </div>

          <button className={styles.submitBtn} onClick={handleAddHours}>
            Add Hours
          </button>
        </>
      )}

      {/* ✅ TAB 2 - Mark as Completed */}
      {tab === "Project Completion" && selectedProject && (
        <>
          <div className={styles.fld}>
            <label>Current Status</label>
            <input
              type="text"
              readOnly
              value={selectedProject.projectStatus ? "Active" : "Completed"}
            />
          </div>

          <button
            className={styles.submitBtn}
            onClick={handleCompletionToggle}
            disabled={!selectedProject.projectStatus} // ✅ disables if already completed
          >
            {selectedProject.projectStatus
              ? "Mark as Completed"
              : "Already Completed"}
          </button>
        </>
      )}
    </div>
  );
};

export default ManagerProjectActions;
