
import React, { useEffect, useState } from "react";
import styles from "../../styles/Manager/ManagerDashboard.module.css";
import axiosInstance from "../axiosConfig.js";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const ManagerDashboard = () => {
  const employee = JSON.parse(sessionStorage.getItem("employee"));
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const [worklogPage, setWorklogPage] = useState(0);        // zero-indexed, matches Spring's Pageable
  const [worklogTotalPages, setWorklogTotalPages] = useState(0);


    const isAGM =
  employee?.designation?.trim() === "Assistant IT Manager" ||
  employee?.designation?.trim() === "Assistant General Manager";

  useEffect(() => {
    if (showWorklogs) setCurrentPage(0);
  }, [showWorklogs]);

  const fetchWorklogs = async (projectId, pageNum) => {
    try {
      const res = await axiosInstance.get(`/workdetails/project/${projectId}/paged`, {
        params: {
          page: pageNum,
          size: itemsPerPage,
          status: filterStatus || undefined,
          employeeName: filterEmployee || undefined,
          from: filterFromDate || undefined,
          to: filterToDate || undefined,
          sortBy: "date",
          sortDir: "desc",
        },
      });
      setWorklogs(res.data.content);
      setWorklogTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  // Refetch whenever the modal is open and page/filters change
  useEffect(() => {
    if (!showWorklogs || !selectedProject) return;

    const timer = setTimeout(() => {
      fetchWorklogs(selectedProject.id, worklogPage);
    }, 300);

    return () => clearTimeout(timer);
  }, [showWorklogs, selectedProject, worklogPage, filterStatus, filterEmployee, filterFromDate, filterToDate]);

  // Reset to page 0 whenever a filter changes (otherwise you might land on a page that no longer exists)
  useEffect(() => {
    setWorklogPage(0);
  }, [filterStatus, filterEmployee, filterFromDate, filterToDate]);

useEffect(() => {
  if (!employee?.empId) return;

  if (isAGM) {
    axiosInstance
      .get("/employee/getallmanagers")
      .then((res) => {
        const mgrMap = {};

        res.data.forEach((m) => {
          mgrMap[m.empId] = m.name;
        });

        setManagers(mgrMap);
      })
      .catch((err) => {
        console.error("Failed to fetch managers:", err);
      });
  }
}, [employee, isAGM]);


  console.log(projects);

  useEffect(() => {
    if (!employee.empId) return;

    const timer = setTimeout(() => {
      fetchProjects(filter, searchTerm, selectedManager);
    }, 300); // debounce ALL filter changes, not just search

    return () => clearTimeout(timer);
  }, [filter, searchTerm, selectedManager, employee.empId]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "a") {
        e.preventDefault();

        setSelectedProjectIds(
          filteredProjects.map((p) => p.id)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [filteredProjects]);

  const applyFilter = (projList, category, searchText, managerId) => {
    let result = projList;

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

  const fetchProjects = async (
    status = filter,
    search = searchTerm,
    manager = selectedManager
  ) => {
    try {
      const params = {};

      // Status
      if (status !== "All") {
        params.projectStatus =
          status === "In Progress" ? "Pending" : "Completed";
      }

      // Search
      if (search.trim()) {
        params.query = search;
      }

      let endpoint =
        status === "All"
          ? (isAGM
            ? "/project/"
            : `/project/${employee.manager ? employee.empId : employee.reportingToId}`)
          : (isAGM
            ? "/project/all"
            : `/project/all/${employee.manager ? employee.empId : employee.reportingToId}`);


      if (manager) {
        endpoint = status === "All" ?
          `/project/${manager}`
          :
          `/project/all/${manager}`;
      }

      const res = await axiosInstance.get(endpoint, { params });
      console.log("number 1")
      setProjects(res.data);
      setFilteredProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = async (category) => {
    setFilter(category);
    //await fetchProjectsByStatus(category);
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    //applyFilter(projects, filter, text, selectedManager);
  };

  const handleManagerFilter = (e) => {
    const id = e.target.value;
    setSelectedManager(id);
    //applyFilter(projects, filter, searchTerm, id);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedManager("");
    applyFilter(projects, filter, "", "");
  };

  const exportSelectedProjects = () => {
    const projectsToExport = filteredProjects.filter((p) =>
      selectedProjectIds.includes(p.id)
    );

    if (projectsToExport.length === 0) {
      alert("Please select at least one project.");
      return;
    }
    console.log(filteredProjects);
    // Prepare Excel data
    const excelData = projectsToExport.map((project, index) => {

      const row = {
        "Project ID": project.id,
        "Project Name": project.projectName,
        "Client Name": project.clientName || "Unknown",
      };

      // Add Manager Name only for AGM
      if (isAGM) {
        row["Manager Name"] =
          project.managerName || "Unknown";
      }

      // Remaining fields
      row["Project Coordinator"] =
        project.tlName || "Not Assigned";

      row["Awarded Date"] = project.assignedDate || "Not Assigned";
      row["Planned Start Date"] = project.plannedStartDate || "Not Assigned";
      row["Actual Start Date"] = project.startDate || "Not Assigned";
      row["Completion Date"] = project.completedDate || "Not Assigned";
      row["Project Activity Status"] =
        project.projectActivityStatus || "Not Assigned";

      row["IFA Given Hours"] = project.ifaGivenHours || 0;
      row["IFC Given Hours"] = project.ifcGivenHours || 0;

      row["IFA Production Hours"] = project.ifaProdHours || 0;
      row["IFC Production Hours"] = project.ifcProdHours || 0;

      row["IFA Extra Hours Requested"] =
        project.ifaExtraHours || 0;

      row["IFA Extra Hours Used"] =
        project.ifaExtraProdHours || 0;

      row["IFC Extra Hours Requested"] =
        project.ifcExtraHours || 0;

      row["IFC Extra Hours Used"] =
        project.ifcExtraProdHours || 0;

      row["Extra Hours Notes"] =
        project.extraHoursNote || "No Notes";

      row["Total Working Hours"] =
        project.workingHours || 0;

      row["Planned IFA Date"] =
        project.plannedIfaDate || "Not Assigned";

      row["Actual IFA Date"] =
        project.actualIfaDate || "Not Assigned";

      row["Planned REIFA Date"] =
        project.plannedReifaDate || "Not Assigned";

      row["Actual REIFA Date"] =
        project.actualReifaDate || "Not Assigned";

      row["Planned IFC Date"] =
        project.plannedIfcDate || "Not Assigned";

      row["Actual IFC Date"] =
        project.actualIfcDate || "Not Assigned";

      row["Planned REIFC Date"] =
        project.plannedReifcDate || "Not Assigned";

      row["Actual REIFC Date"] =
        project.actualReifcDate || "Not Assigned";

      row["Modeling Hours Assigned"] =
        project.modellingHours || 0;

      row["Modeling Hours Used"] =
        project.modellingTime || 0;

      row["Checking Hours Assigned"] =
        project.checkingHours || 0;

      row["Checking Hours Used"] =
        project.checkingTime || 0;

      row["Detailing Hours Assigned"] =
        project.detailingHours || 0;

      row["Detailing Hours Used"] =
        project.detailingTime || 0;

      row["Study Hours Assigned"] =
        project.studyHours || 0;

      row["Study Hours Used"] =
        project.studyHoursTracking || 0;

      return row;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {

        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });

        if (!worksheet[cellAddress]) continue;

        // Header Row
        if (R === 0) {
          worksheet[cellAddress].s = {
            font: {
              bold: true,
              sz: 12,
            },
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }

        // Entire Table Styling
        else {
          worksheet[cellAddress].s = {
            alignment: {
              vertical: "center",
              horizontal: "center",
              wrapText: true,
              indent: 1, // acts like left padding
            },

            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }
      }
    }
    // Auto-fit columns
    const colWidths = Object.keys(excelData[0]).map((key) => ({
      wch: Math.max(
        key.length + 8,
        ...excelData.map((row) => String(row[key] || "").length + 5)
      ),
    }));

    worksheet["!cols"] = colWidths;

    worksheet["!cols"] = colWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

    // Download
    const managerName =
      isAGM && selectedManager
        ? (managers[selectedManager] || "Manager")
          .replace(/\s+/g, "_")
        : "General";

    const fileName = `Projects_Report_${managerName}_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };


  const handleProjectClick = async (project) => {
    try {
      setSelectedProject(project);

      // 🔹 Get Worklogs for this project
      const worklogRes = await axiosInstance.get(`/workdetails/project/${project.id}`);
      const projectWorklogs = worklogRes.data;


      // 🔹 Get all assigned members
      const empRes = await axiosInstance.get(`/project-assignment/employees/${project.id}`);
      const allMembers = empRes.data.filter(emp => emp.empId !== project.tlId);

      // 🔹 Filter out members with 0 total work hours in this project
      const membersWithWork = allMembers.filter(member => {
        const totalWork = projectWorklogs
          .filter(log => log.employeeId === member.empId)
          .reduce((sum, log) => sum + (parseFloat(log.workHours) || 0), 0);

        return totalWork > 0;
      });


      setSelectedProjectMembers(membersWithWork);

      // 🔹 Get Project Coordinator (TL)


      setShowModal(true);
      setShowResources(false);
      setShowWorklogs(false);

    } catch (err) {

    }
  };

  const handleProjectSelection = (index, e) => {
    const projectId = filteredProjects[index].id;

    // SHIFT selection
    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);

      const rangeIds = filteredProjects
        .slice(start, end + 1)
        .map((p) => p.id);

      if (e.ctrlKey) {
        setSelectedProjectIds((prev) => [
          ...new Set([...prev, ...rangeIds]),
        ]);
      } else {
        setSelectedProjectIds(rangeIds);
      }

      return;
    }

    // CTRL selection
    if (e.ctrlKey) {
      setSelectedProjectIds((prev) =>
        prev.includes(projectId)
          ? prev.filter((id) => id !== projectId)
          : [...prev, projectId]
      );

      setLastSelectedIndex(index);
      return;
    }

    // Normal click
    setSelectedProjectIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );

    setLastSelectedIndex(index);
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

      <button
        type="button"
        onClick={() => setShowExportModal(true)}
        style={{
          marginBottom: "10px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Export Projects
      </button>


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
      ${p.modellingHours === 0 || p.modellingHours === null ? styles.highlightRow : ""}
      ${((p.assignedHours || 0) + (p.extraHours || 0) - p.workingHours) <= 10
                    ? styles.redAlertRow
                    : ""}
    `}
              >

                <td>{p.id}</td>
                <td>{p.projectName}</td>
                <td>{p.clientName}</td>

                {(employee.designation.trim() === "Assistant General Manager" ||
                  employee.designation === "Assistant IT Manager") && (
                    <td>{p.managerName || "Unknown"}</td>
                  )}
                <td>{p.tlName || "Not assigned"}</td>
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
                            <td>{selectedProject.managerName || "Unknown"}</td>
                            <th>TL Name</th>
                            <td colSpan="3">{selectedProject.tlName}</td>
                          </>
                        ) : (
                          <>
                            <th>TL Name</th>
                            <td>{selectedProject.tlName}</td>
                          </>
                        )}
                      </tr>

                      <tr>

                        <th>IFA (Worked / Assigned)</th>
                        <td>{selectedProject.ifaProdHours || 0} / {selectedProject.ifaGivenHours || 0} </td>
                        <th>IFC (Worked / Assigned)</th>
                        <td>{selectedProject.ifcProdHours || 0} / {selectedProject.ifcGivenHours || 0}</td>

                      </tr>


                      <tr>
                        <th>Modeling Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.modellingTime || "0"} / {selectedProject.modellingHours || "0"}
                        </td>
                        <th>Checking Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.checkingTime || "0"} / {selectedProject.checkingHours || "0"}
                        </td>
                      </tr>

                      <tr>
                        <th>Detailing Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.detailingTime || "0"} / {selectedProject.detailingHours || "0"}
                        </td>
                        <th>Study Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.studyHoursTracking || "0"} / {selectedProject.studyHours || "0"}
                        </td>
                      </tr>

                      <tr>
                        <th>Special Hours <br></br>Worked</th>
                        <td>
                          {selectedProject.specialHoursTracking || "0"}
                        </td>
                        <th>Extra Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.extraHoursTracking || "0"} / {selectedProject.extraHours || "0"}
                        </td>
                      </tr>

                      <tr>
                        <th>IFA Extra Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.ifaExtraProdHours || "0"} / {selectedProject.ifaExtraHours || "0"}
                        </td>
                        <th>IFC Extra Hours <br></br>(Worked / Assigned)</th>
                        <td>
                          {selectedProject.ifcExtraProdHours || "0"} / {selectedProject.ifcExtraHours || "0"}
                        </td>
                      </tr>


                      <tr>
                        <th>Assigned Date</th>
                        <td>{selectedProject.assignedDate || "—"}</td>
                        <th>Completion Date</th>
                        <td>{selectedProject.completedDate || "—"}</td>

                      </tr>

                      <tr>
                        <th>Planned Start Date</th>
                        <td>{selectedProject.plannedStartDate || "—"}</td>
                        <th>Actual Start Date</th>
                        <td>{selectedProject.startDate || "—"}</td>
                      </tr>
                      <tr>
                        <th>Planned IFA Date</th>
                        <td>{selectedProject.plannedIfaDate || "Not Assigned"}</td>

                        <th>Actual IFA Date</th>
                        <td>{selectedProject.actualIfaDate || "Not Assigned"}</td>
                      </tr>

                      <tr>
                        <th>Planned REIFA Date</th>
                        <td>{selectedProject.plannedReifaDate || "Not Assigned"}</td>
                        <th>Actual REIFA Date</th>
                        <td>{selectedProject.actualReifaDate || "Not Assigned"}</td>
                      </tr>
                      <tr>
                        <th>Planned IFC Date</th>
                        <td>{selectedProject.plannedIfcDate || "Not Assigned"}</td>
                        <th>Actual IFC Date</th>
                        <td>{selectedProject.actualIfcDate || "Not Assigned"}</td>
                      </tr>
                      <tr>
                        <th>Planned REIFC Date</th>
                        <td>{selectedProject.plannedReifcDate || "Not Assigned"}</td>
                        <th>Actual REIFC Date</th>
                        <td>{selectedProject.actualReifcDate || "Not Assigned"}</td>
                      </tr>

                      <tr>
                        <th>Project Status</th>
                        <td colSpan="2">
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
                      onClick={() => {
                        setWorklogPage(0);
                        setShowWorklogs(true);
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

                  <div className={styles.resourcesTableWrapper}>

                    <table className={styles.resourcesTable}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Employee</th>
                          <th>Assigned Work</th>
                          <th>Activity Name</th>
                          <th>Status</th>
                          <th>Hours Worked</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {worklogs.length === 0 ? (
                          <tr>
                            <td colSpan="6" className={styles.noData}>No worklogs found.</td>
                          </tr>
                        ) : (
                          worklogs.map((log) => (
                            <tr key={log.id}>
                              <td>{log.date}</td>
                              <td>{log.employeeName}</td>
                              <td>{log.assignedWork}</td>
                              <td>{log.activityName}</td>
                              <td>{log.status}</td>
                              <td>{log.workHours}</td>
                              <td>{log.remarks}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>


                    {/* ✅ Numbered Pagination */}
                    {worklogTotalPages > 1 && (
                      <div className={styles.paginationContainer}>
                        <button
                          className={styles.paginationBtn}
                          disabled={worklogPage === 0}
                          onClick={() => setWorklogPage((p) => Math.max(p - 1, 0))}
                        >
                          « Prev
                        </button>

                        {Array.from({ length: worklogTotalPages }, (_, i) => i)
                          .filter(
                            (p) =>
                              p === 0 ||
                              p === worklogTotalPages - 1 ||
                              (p >= worklogPage - 2 && p <= worklogPage + 2)
                          )
                          .map((p, idx, arr) => {
                            if (idx > 0 && arr[idx - 1] !== p - 1) {
                              return (
                                <React.Fragment key={`ellipsis-${p}`}>
                                  <span className={styles.ellipsis}>...</span>
                                  <button
                                    className={`${styles.pageNumber} ${worklogPage === p ? styles.activePage : ""}`}
                                    onClick={() => setWorklogPage(p)}
                                  >
                                    {p + 1}
                                  </button>
                                </React.Fragment>
                              );
                            }
                            return (
                              <button
                                key={p}
                                className={`${styles.pageNumber} ${worklogPage === p ? styles.activePage : ""}`}
                                onClick={() => setWorklogPage(p)}
                              >
                                {p + 1}
                              </button>
                            );
                          })}

                        <button
                          className={styles.paginationBtn}
                          disabled={worklogPage === worklogTotalPages - 1}
                          onClick={() => setWorklogPage((p) => Math.min(p + 1, worklogTotalPages - 1))}
                        >
                          Next »
                        </button>
                      </div>
                    )}

                  </div>

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

      {showExportModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0 }}>Select Projects to Export</h3>

              <button
                onClick={() => setShowExportModal(false)}

                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "24px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  lineHeight: 1,

                }}
              >
                ✕
              </button>
            </div>

            <p>
              Shift + Click = Range Select
            </p>

            <div
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                border: "1px solid #ddd",
              }}
            >
              <table className={styles.projectsTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Project ID</th>
                    <th>Project Name</th>
                    <th>Client</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project, index) => (
                    <tr
                      key={project.id}
                      onClick={(e) =>
                        handleProjectSelection(index, e)
                      }
                      style={{
                        cursor: "pointer",
                        background: selectedProjectIds.includes(project.id)
                          ? "#dbeafe"
                          : "",
                      }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProjectIds.includes(
                            project.id
                          )}
                          readOnly
                        />
                      </td>
                      <td>{project.id}</td>
                      <td>{project.projectName}</td>
                      <td>{project.clientName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                className={styles.actionBtn}
                onClick={() => {
                  exportSelectedProjects();
                  setShowExportModal(false);
                }}
              >
                Export Selected
              </button>

              <button
                className={styles.actionBtn}
                onClick={() => {
                  setSelectedProjectIds(
                    filteredProjects.map((p) => p.id)
                  );
                }}
              >
                Select All
              </button>

              <button
                className={styles.clearBtn}
                onClick={() => {
                  setSelectedProjectIds([]);
                }}
              >
                Clear
              </button>

            </div>
          </div>
        </div>
      )}

    </div>


  );


};

export default ManagerDashboard;
