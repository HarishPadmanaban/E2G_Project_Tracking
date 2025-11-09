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
  const [tl, setTl] = useState({});
  const [selectedManager, setSelectedManager] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectMembers, setSelectedProjectMembers] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [worklogs, setWorklogs] = useState([]);
  const [showWorklogs, setShowWorklogs] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showResourcesOverlay, setShowResourcesOverlay] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // adjust if needed
  const startIndex = (currentPage - 1) * itemsPerPage;


  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    let filtered = worklogs;

    if (filterFromDate)
      filtered = filtered.filter((log) => new Date(log.date) >= new Date(filterFromDate));

    if (filterToDate)
      filtered = filtered.filter((log) => new Date(log.date) <= new Date(filterToDate));


    if (filterEmployee.trim())
      filtered = filtered.filter((log) =>
        log.employeeName.toLowerCase().includes(filterEmployee.toLowerCase())
      );

    if (filterStatus)
      filtered = filtered.filter((log) => log.status === filterStatus);

    setFilteredLogs(filtered);
  }, [filterFromDate, filterToDate, filterEmployee, filterStatus, worklogs]);



  useEffect(() => {
    if (showWorklogs) setCurrentPage(1);
  }, [showWorklogs]);

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
    //console.log(managerIdToUse)

    const endpoint = isAGM
      ? `http://localhost:8080/project/`
      : `http://localhost:8080/project/${managerIdToUse}`;

    axios
      .get(endpoint)
      .then((res) => {
        setProjects(res.data);
        console.log(res.data);
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

  //console.log(filteredProjects);
  //console.table(managers);



  useEffect(() => {
    if (!projects.length) return;

    projects.forEach(async (p) => {
      try {
        const res = await axios.get(
          `http://localhost:8080/employee/gettls?mgrid=${p.managerId}`
        );
        const tlMap = {};
        res.data.forEach((tl) => {
          tlMap[tl.empId] = tl.name;
        });

        setTl((prev) => ({
          ...prev,
          [p.id]: tlMap[p.tlId] || "Not Assigned", // map project id → TL name
        }));
      } catch (err) {
        console.error(`Error fetching TL for project ${p.id}:`, err);
        setTl((prev) => ({
          ...prev,
          [p.id]: "Not Assigned",
        }));
      }
    });
  }, [projects]);

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

  const handleProjectClick = async (project) => {
    try {
      setSelectedProject(project);

      // 🔹 Get Worklogs for this project
      const worklogRes = await axios.get(`http://localhost:8080/workdetails/project/${project.id}`);
      const projectWorklogs = worklogRes.data;
      console.log(projectWorklogs)
      console.log("========")

      // 🔹 Get all assigned members
      const empRes = await axios.get(`http://localhost:8080/project-assignment/employees/${project.id}`);
      const allMembers = empRes.data.filter(emp => emp.empId !== project.tlId);
      console.log("all members:");
      console.log(allMembers);

      // 🔹 Filter out members with 0 total work hours in this project
      const membersWithWork = allMembers.filter(member => {
        const totalWork = projectWorklogs
          .filter(log => log.employeeId === member.empId)
          .reduce((sum, log) => sum + (parseFloat(log.workHours) || 0), 0);

        return totalWork > 0;
      });

      console.log("filtered members");
      console.log(membersWithWork);

      setSelectedProjectMembers(membersWithWork);

      // 🔹 Get Project Coordinator (TL)
      if (project.tlId) {
        try {
          const tlsRes = await axios.get(`http://localhost:8080/employee/gettls?mgrid=${project.managerId}`);
          const matchedTl = tlsRes.data.find(tl => tl.empId === project.tlId);
          setSelectedCoordinator(matchedTl ? matchedTl.name : "TL Not Found");
        } catch (err) {
          console.error("❌ Failed to fetch TL list:", err);
          setSelectedCoordinator("Error loading coordinator");
        }
      } else {
        setSelectedCoordinator("Not Assigned");
      }

      setShowModal(true);
      setShowResources(false);
      setShowWorklogs(false);

    } catch (err) {
      console.error("Error loading project details:", err);
    }
  };


  console.log(selectedProjectMembers)

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
            <th>Project Coordinator</th>
            <th>Assigned Hours</th>
            <th>Extra Hours</th>
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
                onClick={() => handleProjectClick(p)}
                key={p.id}
                className={`
      ${p.modellingHours === 0 ? styles.highlightRow : ""}
      ${((p.assignedHours || 0) + (p.extraHours || 0) - p.workingHours) <= 10
                    ? styles.redAlertRow
                    : ""}
    `}
              >

                <td>{p.id}</td>
                <td>{p.projectName}</td>
                <td>{p.clientName}</td>

                {(employee.designation === "Assistant General Manager" ||
                  employee.designation === "Admin") && (
                    <td>{managers[p.managerId] || "Unknown"}</td>
                  )}
                <td>{tl[p.id] || "Not assigned"}</td>
                <td>{p.assignedHours}</td>
                <td>{p.extraHours || "--"}</td>
                <td>{p.workingHours}</td>
                <td
                  className={
                    p.projectStatus
                      ? styles.statusInProgress
                      : styles.statusCompleted
                  }
                >
                  {p.projectStatus
                    ? p.projectActivityStatus
                      ? `${p.projectActivityStatus} In-Progress`
                      : "In-Progress"
                    : "Completed"}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={`${styles.modal} ${styles.largeModal}`} onClick={(e) => e.stopPropagation()}>

            {/* ✅ Project Summary Section */}
            {/* <div className={styles.projectSummaryTableContainer}>
    <h2 className={styles.projectSummaryTitle}>Project Details</h2>

    <table className={styles.projectSummaryHorizontalTable}>
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Client Name</th>
          <th>Assigned Hours</th>
          <th>Worked Hours</th>
          <th>Project Coordinator</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{selectedProject.projectName}</td>
          <td>{selectedProject.clientName}</td>
          <td>{selectedProject.assignedHours}</td>
          <td>{selectedProject.workingHours}</td>
          <td>{selectedCoordinator}</td>
        </tr>
      </tbody>
    </table> */}

            <div className={styles.projectSummaryActions}>

            </div>
            {/* </div> */}
            {showModal && selectedProject && (
              <div className={styles.overlay} onClick={() => setShowModal(false)}>
                <div
                  className={`${styles.modal} ${styles.largeModal}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ===== PROJECT DETAILS SECTION ===== */}
                  <h2 className={styles.projectDetailsTitle}>Project Details</h2>

                  <table className={styles.projectDetailsTable}>
                    <tbody>
                      <tr>
                        <th>Project Name</th>
                        <td>{selectedProject.projectName}</td>
                        <th>Client Name</th>
                        <td>{selectedProject.clientName}</td>
                      </tr>

                      <tr>


                        {/* ✅ Show Manager only if AGM/Admin */}
                        {isAGM ? (
                          <>
                            <th>Manager Name</th>
                            <td>{managers[selectedProject.managerId] || "Unknown"}</td>
                            <th>TL Name</th>
                            <td colSpan="3">{selectedCoordinator}</td>
                          </>
                        ) : (
                          <>
                            <th>TL Name</th>
                            <td>{selectedCoordinator}</td>
                          </>
                        )}
                      </tr>

                      <tr>
                        <th>Assigned Hours</th>
                        <td>{selectedProject.assignedHours}</td>
                        <th>Worked Hours</th>
                        <td>{selectedProject.workingHours}</td>
                      </tr>

                      <tr>
                        <th>Modelling Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.modellingTime} / {selectedProject.modellingHours}
                        </td>
                        <th>Checking Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.checkingTime} / {selectedProject.checkingHours}
                        </td>
                      </tr>

                      <tr>
                        <th>Detailing Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.detailingTime} / {selectedProject.detailingHours}
                        </td>
                        <th>Assigned Date</th>
                        <td>{selectedProject.assignedDate || "—"}</td>
                      </tr>

                      <tr>
                        <th>Start Date</th>
                        <td>{selectedProject.startDate || "—"}</td>
                        <th>Completed Date</th>
                        <td>{selectedProject.completedDate || "—"}</td>
                      </tr>

                      <tr>
                        <th>Project Status</th>
                        <td colSpan="3">
                          {selectedProject.projectStatus
                            ? selectedProject.projectActivityStatus
                              ? `${selectedProject.projectActivityStatus} In-Progress`
                              : "In-Progress"
                            : "Completed"}
                        </td>
                      </tr>
                    </tbody>
                  </table>


                  {/* ===== ACTION BUTTONS ===== */}
                  <div className={styles.projectActionButtons}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => setShowResourcesOverlay(true)}
                    >
                      View Assigned Resources
                    </button>

                    <button
                      className={styles.actionBtn}
                      onClick={async () => {
                        try {
                          // 🔹 Temporary Dummy Worklog Data for Pagination Test
                          const res = await axios.get(`http://localhost:8080/workdetails/project/${selectedProject.id} `);
                          setWorklogs(res.data);

                          setShowWorklogs(true);
                        } catch (err) {
                          console.error("Error fetching worklogs:", err);
                        }
                      }}
                    >
                      View Worklogs
                    </button>

                    <button
                      className={styles.closeBtn}
                      onClick={() => setShowModal(false)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* ✅ Worklogs Section */}
            {showWorklogs && (
              <div className={styles.overlay} onClick={() => setShowWorklogs(false)}>
                <div
                  className={`${styles.modal} ${styles.worklogModal}`}

                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className={styles.projectDetailsTitle}>Worklogs</h2>
                  {/* ✅ Filters Section */}
                  <div className={styles.worklogFilters}>
                    <div>
                      <label>From:</label>
                      <input
                        type="date"
                        value={filterFromDate}
                        onChange={(e) => setFilterFromDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label>To:</label>
                      <input
                        type="date"
                        value={filterToDate}
                        onChange={(e) => setFilterToDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Employee:</label>
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={filterEmployee}
                        onChange={(e) => setFilterEmployee(e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Status:</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <button
                      className={styles.clearBtn}
                      onClick={() => {
                        setFilterFromDate("");
                        setFilterToDate("");
                        setFilterEmployee("");
                        setFilterStatus("");
                      }}
                      style={{ marginTop: "20px" }}
                    >
                      Clear
                    </button>
                  </div>

                  <table className={styles.resourcesTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Assigned Work</th>
                        <th>Activity Name</th>
                        <th>Status</th>
                        <th>Hours Worked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLogs.length === 0 ? (
                        <tr>
                          <td colSpan="6" className={styles.noData}>No worklogs found.</td>
                        </tr>
                      ) : (
                        currentLogs.map((log) => (
                          <tr key={log.id}>
                            <td>{log.date}</td>
                            <td>{log.employeeName}</td>
                            <td>{log.assignedWork}</td>
                            <td>{log.activityName}</td>
                            <td>{log.status}</td>
                            <td>{log.workHours}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* ✅ Numbered Pagination */}
                  {worklogs.length > itemsPerPage && (
                    <div className={styles.paginationContainer}>
                      <button
                        className={styles.paginationBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      >
                        « Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                        )
                        .map((page, idx, arr) => {
                          // Add ellipsis between gaps
                          if (idx > 0 && arr[idx - 1] !== page - 1) {
                            return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <span className={styles.ellipsis}>...</span>
                                <button
                                  key={page}
                                  className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ""
                                    }`}
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            );
                          }
                          return (
                            <button
                              key={page}
                              className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ""
                                }`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          );
                        })}

                      <button
                        className={styles.paginationBtn}
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                      >
                        Next »
                      </button>
                    </div>
                  )}

                  <button
                    className={styles.closeBtn}
                    onClick={() => setShowWorklogs(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}




            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
              X
            </button>
            <button
              className={styles.viewResourcesBtn}
              onClick={() => setShowResourcesOverlay(true)}
            >
              View Assigned Resources
            </button>
          </div>
        </div>
      )}

      {showResourcesOverlay && (
        <div className={styles.resourcesOverlay}>
          <div className={styles.resourcesOverlayContent}>
            <div className={styles.resourcesOverlayHeader}>
              <h3>Assigned Resources</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowResourcesOverlay(false)}
              >
                ✕
              </button>
            </div>

            <table className={styles.resourcesTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member Name</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                {selectedProjectMembers.length > 0 ? (
                  selectedProjectMembers.map((member, index) => (
                    <tr key={index}>
                      <td>{member.empId}</td>
                      <td>{member.name}</td>
                      <td>{member.designation || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No resources assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}



    </div>
  );
};

export default ManagerDashboard;
