import React, { useState, useEffect } from "react";
import styles from "../../styles/Employee/LeavePermissionForm.module.css"; // reuse same CSS
import { useEmployee } from "../../context/EmployeeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectAssignmentForm = () => {
  const { employee, loading } = useEmployee();
  const navigate = useNavigate(); // 👈 added

  useEffect(() => {
    if (!loading && !employee) {
      navigate("/"); // 👈 redirect to login page
    }
  }, [employee, loading, navigate]);
  const managerIdToUse = employee?.manager ? employee.id : employee?.reportingToId;
  const [projects, setProjects] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);
  useEffect(() => {
    if (!managerIdToUse) return;

    const proj = axios
      .get(`http://localhost:8080/project/manager/${managerIdToUse}/active`) // Dummy backend endpoint
      .then((proj) => {
        const inProgress = proj.data.filter((p) => p.workingHours === 0);
        console.log(proj.data);
        setProjects(inProgress);
      })
      .catch((err) => console.error(err));
  }, [managerIdToUse]);


  useEffect(() => {
    if (!managerIdToUse) return;

    console.log(managerIdToUse);
    const res = axios
      .get(`http://localhost:8080/employee/gettls?mgrid=${managerIdToUse}`) // Dummy backend endpoint
      .then((res) => {
        console.log(res.data);
        setTeamLeads(res.data);
      })
      .catch((err) => console.error(err));
  }, [managerIdToUse]);

  const [formData, setFormData] = useState({
    projectId: "",
    tl1: "",
    modellingHours: "",
    checkingHours: "",
    detailingHours: "",
  });

  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectChange = (e) => {
    const selected = projects.find(
      (p) => p.id === parseInt(e.target.value)
    );
    setSelectedProject(selected);
    setFormData({
      projectId: selected?.id || "",
      tl1: "",
      modellingHours: "",
      checkingHours: "",
      detailingHours: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.projectId) {
      alert("⚠️ Please select a project.");
      return false;
    }

    if (!formData.tl1) {
      alert("⚠️ Please select Team Lead.");
      return false;
    }

    if (
      !formData.modellingHours ||
      !formData.checkingHours ||
      !formData.detailingHours
    ) {
      alert("⚠️ Please fill all hour fields (Modelling, Checking, Detailing).");
      return false;
    }

    if (
      Number(formData.modellingHours) <= 0 ||
      Number(formData.checkingHours) <= 0 ||
      Number(formData.detailingHours) <= 0
    ) {
      alert("⚠️ Hours must be greater than 0.");
      return false;
    }

    const total =
      Number(formData.modellingHours) +
      Number(formData.checkingHours) +
      Number(formData.detailingHours);

    if (selectedProject && total !== selectedProject.assignedHours) {
      alert(
        `❌ Total assigned hours (${total}) must match project total (${selectedProject.assignedHours}).`
      );
      return false;
    }

    const payload = {
      tlId: Number(formData.tl1),
      modellingHours: Number(formData.modellingHours),
      checkingHours: Number(formData.checkingHours),
      detailingHours: Number(formData.detailingHours),
    };

    try {
      const res = axios.put(
        `http://localhost:8080/project/${formData.projectId}/add-hours`,
        null, // No request body
        {
          params: {
            tlId: formData.tl1,
            modellingHours: formData.modellingHours,
            checkingHours: formData.checkingHours,
            detailingHours: formData.detailingHours,
          }
        }
      );
      alert("✅ Project updated successfully!");
      setFormData({
        projectId: "",
        tl1: "",
        modellingHours: "",
        checkingHours: "",
        detailingHours: "",
      });
      setSelectedProject(null);
      console.log(payload);
      const updatedProjects = axios.get(`http://localhost:8080/project/manager/${managerIdToUse}/active`);
      const inProgress = updatedProjects.data.filter((p) => p.workingHours === 0 && p.modellingHours === 0 && p.checkingHours === 0 && p.detailingHours === 0);
      setProjects(inProgress);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("❌ Failed to update project");
    }
  };


  if (loading) return <div>Loading...</div>;
  if (!employee) return <div>Employee not logged in</div>;

  return (
    <div className={styles.container}>
      <h2>Project Distribution</h2>

      {/* Project Dropdown */}
      <div className={styles.fld}>
        <label>Choose Project</label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleProjectChange}
        >
          <option value="">Select Project</option>
          {projects
            .filter((p) => p.projectStatus)
            .map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.projectName} ({proj.clientName})
              </option>
            ))}
        </select>
      </div>

      {/* Show next fields only after project selection */}
      {selectedProject && (
        <>
          <div className={styles.fld}>
            <label style={{ "marginBottom": "8px" }}>Assigned Hours (Total)</label>
            <input
              type="text"
              value={selectedProject.assignedHours}
              readOnly
            />
          </div>

          <div className={styles.fld}>
            <label>Choose TL1</label>
            <select
              name="tl1"
              value={formData.tl1}
              onChange={handleChange}
            >
              <option value="">Select Team Lead 1</option>
              {teamLeads.map((tl) => (
                <option key={tl.id} value={tl.id}>
                  {tl.name}
                </option>
              ))}
            </select>
          </div>


          {/* Assigned Hours Inputs */}
          <div className={styles.fld}>
            <label>Modelling Hours</label>
            <input
              type="number"
              name="modellingHours"
              value={formData.modellingHours}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fld}>
            <label>Checking Hours</label>
            <input
              type="number"
              name="checkingHours"
              value={formData.checkingHours}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fld}>
            <label>Detailing Hours</label>
            <input
              type="number"
              name="detailingHours"
              value={formData.detailingHours}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            className={styles.submitBtn}
            onClick={validateForm}
          >
            Assign
          </button>
        </>
      )}
    </div>
  );
};

export default ProjectAssignmentForm;
