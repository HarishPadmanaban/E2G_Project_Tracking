import React, { useState, useEffect } from "react";
import styles from "../../styles/Employee/LeavePermissionForm.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectAssignmentForm = () => {
  const { employee, loading } = useEmployee();
  const navigate = useNavigate();

  const managerIdToUse = employee?.manager ? employee.empId : employee?.reportingToId;

  const [projects, setProjects] = useState([]);
  const [employeesByRole, setEmployeesByRole] = useState({
    Modeller: [],
    Checker: [],
    Detailer: []
  });

  const [formData, setFormData] = useState({
    projectId: ""
  });

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Modeller");
  const [selectedResources, setSelectedResources] = useState([]);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!loading && !employee) {
      navigate("/");
    }
  }, [employee, loading, navigate]);

  // ✅ Fetch Manager Projects
  useEffect(() => {
    if (!managerIdToUse) return;
    axios
      .get(`http://localhost:8080/project/manager/${managerIdToUse}/active`)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
  }, [managerIdToUse]);

  // ✅ Fetch Employees under Manager
  useEffect(() => {
    if (!managerIdToUse) return;
    axios
      .get(`http://localhost:8080/employee/getbymgr`, {
        params: { mgrid: managerIdToUse },
      })
      .then((res) => {
        const all = res.data;
        const grouped = {
          Modeller: all.filter(emp => emp.role?.toLowerCase().includes("modeller")),
          Checker: all.filter(emp => emp.role?.toLowerCase().includes("checker")),
          Detailer: all.filter(emp => emp.role?.toLowerCase().includes("detailer")),
        };
        setEmployeesByRole(grouped);
      })
      .catch((err) => console.error(err));
  }, [managerIdToUse]);

  // ✅ Select project
  const handleProjectChange = (e) => {
    setFormData({ projectId: e.target.value });
  };

  // ✅ Select employees into array by role
  const toggleResourceSelection = (emp) => {
    setSelectedResources((prev) => {
      const exists = prev.find((r) => r.empId === emp.empId);
      if (exists) {
        return prev.filter((r) => r.empId !== emp.empId);
      }
      return [...prev, emp];
    });
  };

  // ✅ Final Assign API Call
  const handleAssign = async () => {
    if (!formData.projectId) return alert("⚠ Select a project");
    if (selectedResources.length === 0) return alert("⚠ Select resources");

    const payload = {
      project_id: formData.projectId,
      employeeIds: selectedResources.map((e) => e.empId),
    };

    try {
      await axios.post(`http://localhost:8080/project-assignment/assign`, payload);
      alert("✅ Resources Assigned Successfully!");

      setSelectedResources([]);
      setShowResourceModal(false);
      setFormData({ projectId: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to assign resources");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Project Resource Assignment</h2>

      {/* ✅ Project Dropdown */}
      <div className={styles.fld}>
        <label>Select Project</label>
        <select name="projectId" value={formData.projectId} onChange={handleProjectChange}>
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.projectName} ({proj.clientName})
            </option>
          ))}
        </select>
      </div>

      {formData.projectId && (
        <>
          <button className={styles.ResourceBtn} onClick={() => setShowResourceModal(true)}>
            Assign Resources ({selectedResources.length})
          </button>

          <button className={styles.submitBtn} onClick={handleAssign}>
            Assign
          </button>
        </>
      )}

      {/* ✅ Resource Modal */}
      {showResourceModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Select Resources</h3>

            <div className={styles.filterRow}>
              {["Modeller", "Checker", "Detailer"].map((role) => (
                <button
                  key={role}
                  className={`${styles.roleBtn} ${
                    selectedRole === role ? styles.activeRole : ""
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className={styles.modalContent}>
              {employeesByRole[selectedRole].map((emp) => {
                const checked = selectedResources.some((r) => r.empId === emp.empId);
                return (
                  <label key={emp.empId} className={styles.checkItem}>
                    <input type="checkbox" checked={checked} onChange={() => toggleResourceSelection(emp)} />
                    <div className={styles.empInfo}>
                      <div className={styles.empName}>{emp.name}</div>
                      <div className={styles.empDesignation}>{emp.designation}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className={styles.modalActions}>
              <button className={styles.doneBtn} onClick={() => setShowResourceModal(false)}>
                Done
              </button>
              <button className={styles.cancelBtn} onClick={() => setShowResourceModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectAssignmentForm;
