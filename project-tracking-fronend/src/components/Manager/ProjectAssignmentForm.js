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
  const [showResourceModal, setShowResourceModal] = useState(false); // ✅ NEW
  const [selectedRole, setSelectedRole] = useState("Modeller"); // ✅ NEW
  const [selectedResources, setSelectedResources] = useState([]); // ✅ NEW

  // ✅ replace dummyEmployees with objects that include name & designation
  const dummyEmployees = {
    Modeller: [
      { id: 101, name: "Arun Kumar", designation: "Modeller - Senior" },
      { id: 102, name: "Priya R", designation: "Modeller - Junior" },
      { id: 103, name: "Sanjay T", designation: "Modeller - Trainee" },
    ],
    Checker: [
      { id: 201, name: "Rita Singh", designation: "Checker - Senior" },
      { id: 202, name: "Vikram P", designation: "Checker - Junior" },
    ],
    Designer: [
      { id: 301, name: "Kavya M", designation: "Designer - Senior" },
      { id: 302, name: "Deepak L", designation: "Designer - Trainee" },
    ],
  };

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

  // ✅ updated toggle so we store role, name & designation in selectedResources
  const toggleResourceSelection = (emp) => {
    setSelectedResources((prev) => {
      const exists = prev.find((r) => r.id === emp.id && r.role === selectedRole);
      if (exists) {
        return prev.filter((r) => !(r.id === emp.id && r.role === selectedRole));
      }
      // store useful info for later API payload
      return [...prev, { id: emp.id, name: emp.name, designation: emp.designation, role: selectedRole }];
    });
  };


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
            className={styles.ResourceBtn}
            onClick={() => setShowResourceModal(true)}
          >
            Assign Resources ({selectedResources.length} Selected)
          </button>

          <button
            type="button"
            className={styles.submitBtn}
            onClick={validateForm}
          >
            Assign
          </button>
        </>
      )}
      {/* ✅ Keep Modal Outside So form doesn't hide */}
      {showResourceModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3 style={{ marginBottom: "10px" }}>Select Resources</h3>

            <div className={styles.filterRow}>
              {["Modeller", "Checker", "Designer"].map((role) => (
                <button
                  key={role}
                  className={`${styles.roleBtn} ${selectedRole === role ? styles.activeRole : ""}`}
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className={styles.modalContent}>
              {dummyEmployees[selectedRole].map((emp) => {
                const checked = selectedResources.some((r) => r.id === emp.id && r.role === selectedRole);
                return (
                  <label key={emp.id} className={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleResourceSelection(emp)}
                    />

                    <div className={styles.empInfo}>
                      <div className={styles.empName}>{emp.name}</div>
                      <div className={styles.empDesignation}>{emp.designation}</div>
                    </div>

                    {/* optional: show role tag on the far right */}
                    <div className={styles.empRoleTag}>{selectedRole}</div>
                  </label>
                );
              })}
            </div>


            <div className={styles.modalActions}>
              <button
                className={styles.doneBtn}
                onClick={() => setShowResourceModal(false)}
              >
                Done
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowResourceModal(false)}
              >
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

// import React, { useState, useEffect } from "react";
// import styles from "../../styles/Employee/LeavePermissionForm.module.css";
// import { useEmployee } from "../../context/EmployeeContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ProjectAssignmentForm = () => {
//   const { employee, loading } = useEmployee();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !employee) {
//       navigate("/");
//     }
//   }, [employee, loading, navigate]);

//   const managerIdToUse = employee?.manager ? employee.id : employee?.reportingToId;

//   const [projects, setProjects] = useState([]);
//   const [teamLeads, setTeamLeads] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);

//   const [showResourceModal, setShowResourceModal] = useState(false); // ✅ NEW
//   const [selectedRole, setSelectedRole] = useState("Modeller"); // ✅ NEW
//   const [selectedResources, setSelectedResources] = useState([]); // ✅ NEW

//   // ✅ Dummy employees by role
//   const dummyEmployees = {
//     Modeller: [
//       { id: 101, name: "Modeller - Senior" },
//       { id: 102, name: "Modeller - Junior" },
//       { id: 103, name: "Modeller - Trainee" },
//     ],
//     Checker: [
//       { id: 201, name: "Checker - Senior" },
//       { id: 202, name: "Checker - Junior" },
//     ],
//     Designer: [
//       { id: 301, name: "Designer - Senior" },
//       { id: 302, name: "Designer - Trainee" },
//     ],
//   };

//   const [formData, setFormData] = useState({
//     projectId: "",
//     tl1: "",
//     modellingHours: "",
//     checkingHours: "",
//     detailingHours: "",
//   });

//   useEffect(() => {
//     if (!managerIdToUse) return;

//     axios
//       .get(`http://localhost:8080/project/manager/${managerIdToUse}/active`)
//       .then((proj) => {
//         const inProgress = proj.data.filter((p) => p.workingHours === 0);
//         setProjects(inProgress);
//       })
//       .catch((err) => console.error(err));
//   }, [managerIdToUse]);

//   useEffect(() => {
//     if (!managerIdToUse) return;
//     axios
//       .get(`http://localhost:8080/employee/gettls?mgrid=${managerIdToUse}`)
//       .then((res) => setTeamLeads(res.data))
//       .catch((err) => console.error(err));
//   }, [managerIdToUse]);

//   const handleProjectChange = (e) => {
//     const selected = projects.find((p) => p.id === parseInt(e.target.value));
//     setSelectedProject(selected);
//     setFormData({
//       projectId: selected?.id || "",
//       tl1: "",
//       modellingHours: "",
//       checkingHours: "",
//       detailingHours: "",
//     });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const toggleResourceSelection = (emp) => {
//     setSelectedResources((prev) => {
//       const exists = prev.find((r) => r.id === emp.id);
//       if (exists) {
//         return prev.filter((r) => r.id !== emp.id);
//       }
//       return [...prev, emp];
//     });
//   };

//   const validateForm = () => {
//     if (!formData.projectId) {
//       alert("⚠️ Please select a project.");
//       return;
//     }

//     alert("✅ Assigned Resources: " + JSON.stringify(selectedResources));
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Project Distribution</h2>

//       {/* Project Dropdown */}
//       <div className={styles.fld}>
//         <label>Choose Project</label>
//         <select name="projectId" value={formData.projectId} onChange={handleProjectChange}>
//           <option value="">Select Project</option>
//           {projects.map((proj) => (
//             <option key={proj.id} value={proj.id}>
//               {proj.projectName} ({proj.clientName})
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedProject && (
//         <>
//           <div className={styles.fld}>
//             <label>Assigned Hours (Total)</label>
//             <input type="text" value={selectedProject.assignedHours} readOnly />
//           </div>

//           <div className={styles.fld}>
//             <label>Choose TL1</label>
//             <select name="tl1" value={formData.tl1} onChange={handleChange}>
//               <option value="">Select Team Lead 1</option>
//               {teamLeads.map((tl) => (
//                 <option key={tl.id} value={tl.id}>
//                   {tl.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* ✅ Assign Resources Button */}
//           <button
//             type="button"
//             className={styles.submitBtn}
//             onClick={() => setShowResourceModal(true)}
//           >
//             Assign Resources ({selectedResources.length} Selected)
//           </button>

//           {/* ✅ Modal for selecting employees */}
//           {showResourceModal && (
//             <div className={styles.modalOverlay}>
//               <div className={styles.modalBox}>
//                 <h3>Select Resources</h3>

//                 <div className={styles.filterRow}>
//                   {["Modeller", "Checker", "Designer"].map((role) => (
//                     <button
//                       key={role}
//                       className={`${styles.roleBtn} ${
//                         selectedRole === role ? styles.activeRole : ""
//                       }`}
//                       onClick={() => setSelectedRole(role)}
//                     >
//                       {role}
//                     </button>
//                   ))}
//                 </div>

//                 <div className={styles.modalContent}>
//                   {dummyEmployees[selectedRole].map((emp) => (
//                     <label key={emp.id} className={styles.checkItem}>
//                       <input
//                         type="checkbox"
//                         checked={selectedResources.some((r) => r.id === emp.id)}
//                         onChange={() => toggleResourceSelection(emp)}
//                       />
//                       {emp.name}
//                     </label>
//                   ))}
//                 </div>

//                 <div className={styles.modalActions}>
//                   <button
//                     className={styles.submitBtn}
//                     onClick={() => setShowResourceModal(false)}
//                   >
//                     Done ✅
//                   </button>
//                   <button
//                     className={styles.closeBtn}
//                     onClick={() => setShowResourceModal(false)}
//                   >
//                     Cancel ❌
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           <button type="button" className={styles.submitBtn} onClick={validateForm}>
//             Assign
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProjectAssignmentForm;
