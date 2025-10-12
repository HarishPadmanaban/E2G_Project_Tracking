import React, { useState, useEffect } from "react";
import styles from "../../styles/Employee/LeavePermissionForm.module.css"; // reuse same CSS
import { useEmployee } from "../../context/EmployeeContext";

const ProjectAssignmentForm = () => {
  const { employee, loading } = useEmployee();

  // 🧩 Dummy Project Data
  const [projects] = useState([
    {
      id: 1,
      projectName: "Alpha Tower",
      clientName: "ABC Constructions",
      assignedHours: 500,
      workingHours: 120.5,
      managerId: 3,
      projectStatus: true,
      assignedDate: "2025-01-10",
    },
    {
      id: 2,
      projectName: "Skyline Plaza",
      clientName: "XYZ Developers",
      assignedHours: 400,
      workingHours: 220,
      managerId: 3,
      projectStatus: false,
      assignedDate: "2025-02-01",
    },
    {
      id: 3,
      projectName: "Green Valley",
      clientName: "Eco Builders",
      assignedHours: 350,
      workingHours: 140,
      managerId: 3,
      projectStatus: false,
      assignedDate: "2025-03-12",
    },
    {
      id: 4,
      projectName: "Sunrise Heights",
      clientName: "Urban Infra",
      assignedHours: 600,
      workingHours: 200,
      managerId: 3,
      projectStatus: true,
      assignedDate: "2025-04-20",
    },
  ]);

  // 🧠 Dummy TL Dropdowns
  const [teamLeads] = useState([
    { id: 101, name: "TL1 - John" },
    { id: 102, name: "TL2 - Maria" },
    { id: 103, name: "TL3 - Kiran" },
    { id: 104, name: "TL4 - Priya" },
  ]);

  const [formData, setFormData] = useState({
    projectId: "",
    tl1: "",
    tl2: "",
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
      tl2: "",
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

  if (!formData.tl1 || !formData.tl2) {
    alert("⚠️ Please select both Team Leads.");
    return false;
  }

  if (formData.tl1 === formData.tl2) {
    alert("⚠️ TL1 and TL2 cannot be the same person.");
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

  alert("✅ Details Submitted!!!"); // ✅ all good
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
            <label style={{marginTop:"8px;"}}>Assigned Hours (Total)</label>
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

          <div className={styles.fld}>
            <label>Choose TL2</label>
            <select
              name="tl2"
              value={formData.tl2}
              onChange={handleChange}
            >
              <option value="">Select Team Lead 2</option>
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
