import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import styles from "../../styles/AGM/EditProject.module.css"
import { useEmployee } from "../../context/EmployeeContext";
import AssignProjectForm from './AssignProjectForm';
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const EditProject = () => {
  const { employee, loading } = useEmployee();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [managerList, setManagerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
  const [managers, setManagers] = useState({}); // { empId: name }
const [selectedManager, setSelectedManager] = useState(""); // "" = All

  const [formData, setFormData] = useState({
    id: "",
    projectName: "",
    clientName: "",
    assignedHours: "",
    modellingHours: "",
    checkingHours: "",
    detailingHours: "",
    studyHours: "",
    managerId: "",
    projectStatus: ""
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !employee) navigate("/");
  }, [employee, loading, navigate]);

  // Fetch manager list once
useEffect(() => {
  axiosInstance.get("/employee/getallmanagers").then((res) => {
    const mgrMap = {};
    res.data.forEach((m) => {
      mgrMap[m.empId] = m.name;
    });
    setManagers(mgrMap);
  });
}, []);

const fetchProjects = async () => {
  try {
    const endpoint = selectedManager
      ? `/project/${selectedManager}`
      : `/project/`;

    const res = await axiosInstance.get(endpoint, {
      params: { query: searchTerm || undefined },
    });

    const withNames = res.data.map((p) => ({
      ...p,
      managerName: managers[p.managerId] || "—",
    }));
    setProjects(withNames);
  } catch (err) {
    console.error(err);
  }
};

// Debounce: fires on mount too, once managers are loaded
useEffect(() => {
  const timer = setTimeout(() => {
    fetchProjects();
  }, 300);
  return () => clearTimeout(timer);
}, [selectedManager, searchTerm, managers]);




  // Filter projects based on selected filters
  useEffect(() => {
    let data = [...projects];

    // Filter by Manager
    if (selectedManager !== "All") {
      data = data.filter((p) => p.managerName === selectedManager);
    }

    // Filter by Search Term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      data = data.filter((p) =>
        p.projectName?.toLowerCase().includes(term) ||
        p.clientName?.toLowerCase().includes(term) ||
        p.id?.toString().includes(term) ||
        p.managerName?.toLowerCase().includes(term)
      );
    }

    // Sort by project ID
    data.sort((a, b) => a.id - b.id);

    setFilteredProjects(data);
  }, [selectedManager, searchTerm, projects]);

  // 🔹 Clear Filters
  const clearFilters = () => {
  setSelectedManager("");
  setSearchTerm("");
};

  // When clicking edit, populate form
  const handleEdit = (project) => {
    setSelectedProject(project);
    console.log(project);
    setFormData({
      id: project.id,
      projectName: project.projectName,
      clientName: project.clientName,
      assignedHours: project.assignedHours,
      modellingHours: project.modellingHours,
      checkingHours: project.checkingHours,
      studyHours: project.studyHours,
      detailingHours: project.detailingHours,
      managerId: project.managerId,
      projectStatus: project.projectStatus ? "Pending" : "Completed",
      projectActivityStatus: project.projectActivityStatus,
      plannedIfaDate: project.plannedIfaDate,
      actualIfaDate: project.actualIfaDate,
      plannedReifaDate: project.plannedReifaDate,
      actualReifaDate: project.actualReifaDate,
      plannedIfcDate: project.plannedIfcDate,
      actualIfcDate: project.actualIfcDate,
      plannedReifcDate: project.plannedReifcDate,
      actualReifcDate: project.actualReifcDate,
    });
  };

  // Delete Project
  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axiosInstance.put(`/project/soft-delete/${projectId}`);
        showToast("🗑️ Project deleted successfully!", "success");
        await fetchProjects(); 
      } catch (error) {
        showToast("Error deleting project!", "error");
      }
    }
  };


  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData };

    if (["assignedHours", "modellingHours", "checkingHours", "detailingHours", "studyHours"].includes(name)) {
      updatedData[name] = Number(value);

      if (["modellingHours", "checkingHours", "detailingHours", "studyHours"].includes(name)) {
        updatedData.assignedHours =
          Number(updatedData.modellingHours || 0) +
          Number(updatedData.checkingHours || 0) +
          Number(updatedData.detailingHours || 0) +
          Number(updatedData.studyHours || 0);
      }
    } else {
      updatedData[name] = value;
    }

    setFormData(updatedData);
  };

  // Save updated project
  const handleSave = async () => {
    try {
      const updatedPayload = {
        id: formData.id,
        projectName: formData.projectName,
        clientName: formData.clientName,
        assignedHours: Number(formData.assignedHours),
        modellingHours: Number(formData.modellingHours),
        checkingHours: Number(formData.checkingHours),
        detailingHours: Number(formData.detailingHours),
        studyHours: Number(formData.studyHours),
        managerId: Number(formData.managerId),
        projectStatus: formData.projectStatus === "Pending",
        plannedIfaDate: formData.plannedIfaDate,
        actualIfaDate: formData.actualIfaDate,
        plannedIfcDate: formData.plannedIfcDate,
        actualIfcDate: formData.actualIfcDate,
        plannedReifaDate: formData.plannedReifaDate,
        actualReifaDate: formData.actualReifaDate,
        plannedReifcDate: formData.plannedReifcDate,
        actualReifcDate: formData.actualReifcDate,
      };

      console.log(updatedPayload);
      await axiosInstance.put(`/project/editproject`, updatedPayload);

      showToast("✅ Project updated successfully!", "success");
      setSelectedProject(null);

      // Refresh list
       await fetchProjects(); 
    } catch (error) {

      showToast("Error updating project!", "error");
    }
  };

  return (
    <div className={styles.tableContainer}>
      {<h2 className={styles.title}>Project Management</h2>}

      {!selectedProject && (
        <>
          {/* Filters */}
          <div className={styles.filterBar}>
            {/* Search Filter */}
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search projects, clients"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Manager Filter */}
            <select
  value={selectedManager}
  onChange={(e) => setSelectedManager(e.target.value)}
  className={styles.filterSelect}
>
  <option value="">All Managers</option>
  {Object.entries(managers).map(([id, name]) => (
    <option key={id} value={id}>
      {name}
    </option>
  ))}
</select>

            {/* Clear Button */}
            <button className={styles.clearBtn} onClick={clearFilters}>
              Clear Filters
            </button>

            <button
              className={styles.addBtn}
              onClick={() => navigate("/manager/add-project")}
            >
              + Assign Project
            </button>
          </div>

          {/* Projects Table */}
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Client</th>
                <th>Manager</th>
                <th>Assigned Hours</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.noData}>
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id}>
                    <td>{proj.id}</td>
                    <td>{proj.projectName}</td>
                    <td>{proj.clientName}</td>
                    <td>{proj.managerName || "—"}</td>
                    <td>{proj.assignedHours}</td>
                    <td className={
                      proj.projectStatus
                        ? styles.statusInProgress
                        : styles.statusCompleted
                    }>{proj.projectStatus ? "In-Progress" : "Completed"}</td>

                    <td>
                      <div style={{ display: "flex" }}>
                        <button
                          className={`${styles.actionBtn}`}
                          onClick={() => handleEdit(proj)}
                        >
                          ✏️Edit
                        </button>

                        <button
                          className={`${styles.actionBtn}`}
                          onClick={() => handleDelete(proj.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {selectedProject && (
        <div className={styles.formContainer}>
          <button
            className={styles.backbtn}
            onClick={() => setSelectedProject(null)}
          >
            Back
          </button>
          <h3 className={styles.formTitle}>Edit Project Details</h3>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Assigned Hours</label>
              <input
                type="number"
                name="assignedHours"
                value={formData.assignedHours}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className={styles.formField}>
              <label>Modeling Hours</label>
              <input
                type="number"
                name="modellingHours"
                value={formData.modellingHours}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Checking Hours</label>
              <input
                type="number"
                name="checkingHours"
                value={formData.checkingHours}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Detailing Hours</label>
              <input
                type="number"
                name="detailingHours"
                value={formData.detailingHours}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Study Hours</label>
              <input
                type="number"
                name="studyHours"
                value={formData.studyHours}
                onChange={handleChange}
              />
            </div>

            {
              formData.projectActivityStatus === "IFA" && (
                <>
                <br></br>
                  <div className={styles.formField}>
                    <label>Planned IFA Date</label>
                    <input
                      type="date"
                      name="plannedIfaDate"
                      value={formData.plannedIfaDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Actual IFA Date</label>
                    <input
                      type="date"
                      name="actualIfaDate"
                      value={formData.actualIfaDate}
                      onChange={handleChange}
                    />
                  </div>
                  <br></br>
                </>

              )
            }

            {
              formData.projectActivityStatus !== "IFA" && (
                <>
                <br></br>
                  <div className={styles.formField}>
                    <label>Planned IFA Date</label>
                    <input
                      type="date"
                      name="plannedIfaDate"
                      value={formData.plannedIfaDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Actual IFA Date</label>
                    <input
                      type="date"
                      name="actualIfaDate"
                      value={formData.actualIfaDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Planned IFC Date</label>
                    <input
                      type="date"
                      name="plannedIfcDate"
                      value={formData.plannedIfcDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Actual IFC Date</label>
                    <input
                      type="date"
                      name="actualIfcDate"
                      value={formData.actualIfcDate}
                      onChange={handleChange}
                    />
                  </div>
                </>

              )
            }

            

            <div className={styles.formField}>
              <label>Planned IFA Date</label>
              <input
                type="date"
                name="plannedIfaDate"
                value={formData.plannedIfaDate}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label>Actual IFA Date</label>
              <input
                type="date"
                name="actualIfaDate"
                value={formData.actualIfaDate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Planned REIFA Date</label>
              <input
                type="date"
                name="plannedReifaDate"
                value={formData.plannedReifaDate}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label>Actual REIFA Date</label>
              <input
                type="date"
                name="actualReifaDate"
                value={formData.actualReifaDate}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label>Planned IFC Date</label>
              <input
                type="date"
                name="plannedIfcDate"
                value={formData.plannedIfcDate}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label>Actual IFC Date</label>
              <input
                type="date"
                name="actualIfcDate"
                value={formData.actualIfcDate}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label>Planned REIFC Date</label>
              <input
                type="date"
                name="plannedReifcDate"
                value={formData.plannedReifcDate}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formField}>
              <label>Actual REIFC Date</label>
              <input
                type="date"
                name="actualReifcDate"
                value={formData.actualReifcDate}
                onChange={handleChange}
              />
            </div>

          

            <div className={styles.fld} >
              <label>Status :</label>
              <button
                type="button"
                className={`${styles.statusBtn} ${formData.projectStatus === "Completed" ? styles.completed : styles.pending}`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    projectStatus: formData.projectStatus === "Pending" ? "Completed" : "Pending"
                  })
                }
              >
                {formData.projectStatus}
              </button>
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.actionBtn} onClick={handleSave}>
              Save
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setSelectedProject(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProject;