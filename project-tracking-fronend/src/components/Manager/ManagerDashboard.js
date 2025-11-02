// import React, { useEffect, useState } from "react";
// import { useEmployee } from "../../context/EmployeeContext.js";
// import axios from "axios";
// import styles from "../../styles/Manager/ManagerDashboard.module.css"; // CSS module import

// const ManagerDashboard = () => {
//   const { employee } = useEmployee();
//   const [projects, setProjects] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [filter, setFilter] = useState("In Progress");
//   const [managers, setManagers] = useState({});

//   useEffect(() => {
//     if (!employee?.id) return;

//     // ✅ Admin should have same access as AGM
//     const isAGM =
//       employee.designation === "Assistant General Manager" ||
//       employee.designation === "Admin";

//     // Use appropriate ID depending on role
//     const managerIdToUse = employee.manager ? employee.id : employee.reportingToId;

//     // Choose the endpoint dynamically
//     const endpoint = isAGM
//       ? `http://localhost:8080/project/` // 👈 AGM & Admin endpoint
//       : `http://localhost:8080/project/${managerIdToUse}`; // 👈 existing manager endpoint

//     axios
//       .get(endpoint)
//       .then((res) => {
//         setProjects(res.data);
//         console.log(res.data);
//         const inProgress = res.data.filter((p) => p.projectStatus === true);
//         setFilteredProjects(inProgress);
//         setFilter("In Progress");

//         // ✅ Fetch all managers only for AGM & Admin
//         if (isAGM) {
//           axios
//             .get("http://localhost:8080/employee/getallmanagers")
//             .then((res) => {
//               const mgrMap = {};
//               res.data.forEach((m) => {
//                 mgrMap[m.id] = m.name;
//               });
//               setManagers(mgrMap);
//             })
//             .catch((err) => console.error("Error fetching managers:", err));
//         }
//       })
//       .catch((err) => console.error(err));
//   }, [employee]);

//   const handleFilter = (category) => {
//     setFilter(category);

//     if (category === "All") {
//       setFilteredProjects(projects);
//     } else {
//       const filtered = projects.filter((p) => {
//         if (category === "Completed") return p.projectStatus === false;
//         if (category === "In Progress") return p.projectStatus === true;
//         return false;
//       });
//       console.log(filteredProjects);
//       setFilteredProjects(filtered);
//     }
//   };

//   return (
//     <div className={styles.dashboardContainer}>
//       <h2 className={styles.dashboardTitle}>
//         {employee ? `${employee.name}'s Dashboard` : "Manager Dashboard"}
//       </h2>

//       <div className={styles.filterButtons}>
//         {["In Progress", "Completed", "All"].map((category) => (
//           <button
//             key={category}
//             onClick={() => handleFilter(category)}
//             className={`${styles.filterBtn} ${
//               filter === category ? styles.active : ""
//             }`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       <table className={styles.projectsTable}>
//         <thead>
//           <tr>
//             <th>Project ID</th>
//             <th>Project Name</th>
//             <th>Client Name</th>
//             {(employee.designation === "Assistant General Manager" ||
//               employee.designation === "Admin") && <th>Manager Name</th>}
//             <th>Assigned Hours</th>
//             <th>Working Hours</th>
//             <th>Project Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredProjects.length === 0 ? (
//             <tr>
//               <td colSpan="5" className={styles.noData}>
//                 No projects found.
//               </td>
//             </tr>
//           ) : (
//             filteredProjects.map((p) => (
//               <tr
//                 key={p.id}
//                 className={p.modellingHours === 0 ? styles.highlightRow : ""}
//               >
//                 <td>{p.id}</td>
//                 <td>{p.projectName}</td>
//                 <td>{p.clientName}</td>
//                 {(employee.designation === "Assistant General Manager" ||
//                   employee.designation === "Admin") && (
//                   <td>{managers[p.managerId] || "Unknown"}</td>
//                 )}
//                 <td>{p.assignedHours}</td>
//                 <td>{p.workingHours}</td>
//                 <td
//                   className={
//                     p.projectStatus
//                       ? styles.statusInProgress
//                       : styles.statusCompleted
//                   }
//                 >
//                   {p.projectStatus ? "In-Progress" : "Completed"}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ManagerDashboard;


import React, { useEffect, useState } from "react";
import { useEmployee } from "../../context/EmployeeContext.js";
import axios from "axios";
import styles from "../../styles/Manager/ManagerDashboard.module.css";

const ManagerDashboard = () => {
  const { employee } = useEmployee();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState("In Progress");
  const [managers, setManagers] = useState({});
  const [selectedManager, setSelectedManager] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectMembers, setSelectedProjectMembers] = useState([]);

  const isAGM =
    employee?.designation === "Assistant General Manager" ||
    employee?.designation === "Admin";

  useEffect(() => {
    if (!employee.empId) return;

    //const managerIdToUse = employee.manager ? employee.id : employee.reportingToId;
    // ✅ Admin should have same access as AGM
    const isAGM =
      employee.designation === "Assistant General Manager" ||
      employee.designation === "Admin";

    // Use appropriate ID depending on role
    const managerIdToUse = employee.manager ? employee.empId : employee.reportingToId;
    console.log(isAGM)
    console.log(managerIdToUse)

    const endpoint = isAGM
      ? `http://localhost:8080/project/`
      : `http://localhost:8080/project/${managerIdToUse}`;

    axios
      .get(endpoint)
      .then((res) => {
        setProjects(res.data);
        const inProgress = res.data.filter((p) => p.projectStatus === true);
        setFilteredProjects(inProgress);
        setFilter("In Progress");

        if (isAGM) {
          axios
            .get("http://localhost:8080/employee/getallmanagers")
            .then((res) => {
              const mgrMap = {};
              res.data.forEach((m) => {
                mgrMap[m.empId] = m.name;
              });
              setManagers(mgrMap);
            })
            .catch((err) => console.error("Error fetching managers:", err));
        }
      })
      .catch((err) => console.error(err));
  }, [employee]);

  console.log(filteredProjects);
  console.table(managers);

  const applyFilter = (projList, category, searchText, managerId) => {
    let result = projList;

    if (category !== "All") {
      result = result.filter((p) =>
        category === "Completed" ? !p.projectStatus : p.projectStatus
      );
    }

    if (searchText.trim() !== "") {
      const term = searchText.toLowerCase();
      result = result.filter(
        (p) =>
          p.projectName.toLowerCase().includes(term) ||
          p.clientName.toLowerCase().includes(term)
      );
    }

    if (managerId) {
      result = result.filter((p) => p.managerId === parseInt(managerId));
    }

    setFilteredProjects(result);
  };

  const handleFilter = (category) => {
    setFilter(category);
    applyFilter(projects, category, searchTerm, selectedManager);
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    applyFilter(projects, filter, text, selectedManager);
  };

  const handleManagerFilter = (e) => {
    const id = e.target.value;
    setSelectedManager(id);
    applyFilter(projects, filter, searchTerm, id);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedManager("");
    applyFilter(projects, filter, "", "");
  };

  const handleProjectClick = (projectId) => {
    // 🔥 Dummy data for now — Replace later by backend
    setSelectedProjectMembers([
      { id: 1, name: "John Doe", hours: 40 },
      { id: 2, name: "Priya", hours: 32 },
      { id: 3, name: "David", hours: 28 },
    ]);

    axios.get(`http://localhost:8080/project-assignment/employees/${projectId}`).then(res => {
       setSelectedProjectMembers(res.data)
    });

    setShowModal(true);
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>
        {employee ? `${employee.name}'s Dashboard` : "Manager Dashboard"}
      </h2>

      {/* ✅ Existing Status Filter Buttons */}
      <div className={styles.filterButtons}>
        {["In Progress", "Completed", "All"].map((category) => (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            className={`${styles.filterBtn} ${filter === category ? styles.active : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ✅ Only visible for AGM & Admin */}
      {(
        <div className={styles.topFilterRow}>
          {/* LEFT: Search Bar */}
          <input
            type="text"
            placeholder="Search project/client..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />

          {/* RIGHT SIDE: Manager Dropdown + Clear */}
          {isAGM && <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            <select
              value={selectedManager}
              onChange={handleManagerFilter}
              className={styles.filterSelect}
            >
              <option value="">Select Manager</option>
              {Object.entries(managers).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          
            <button onClick={clearFilters} className={styles.clearBtn}>
              Clear
            </button>
          </div>}
        </div>
      )}

      {/* ✅ Table Section */}
      <table className={styles.projectsTable}>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Project Name</th>
            <th>Client Name</th>
            {isAGM && <th>Manager Name</th>}
            <th>Assigned Hours</th>
            <th>Working Hours</th>
            <th>Project Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredProjects.length === 0 ? (
            <tr>
              <td colSpan="5" className={styles.noData}>
                No projects found.
              </td>
            </tr>
          ) : (
            filteredProjects.map((p) => (
              <tr
                onClick={() => handleProjectClick(p.id)}
                key={p.id}
                className={p.modellingHours === 0 ? styles.highlightRow : ""}
              >
                <td>{p.id}</td>
                <td>{p.projectName}</td>
                <td>{p.clientName}</td>
                {(employee.designation === "Assistant General Manager" ||
                  employee.designation === "Admin") && (
                    <td>{managers[p.managerId] || "Unknown"}</td>
                  )}
                <td>{p.assignedHours}</td>
                <td>{p.workingHours}</td>
                <td
                  className={
                    p.projectStatus
                      ? styles.statusInProgress
                      : styles.statusCompleted
                  }
                >
                  {p.projectStatus ? "In-Progress" : "Completed"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Project Members</h3>
            <table className={styles.memberTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member Name</th>
                  <th>Worked Hours</th>
                </tr>
              </thead>
              <tbody>
                {selectedProjectMembers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.empId}</td>
                    <td>{m.name}</td>
                    <td>{m.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
