import React, { useEffect, useState } from "react";
import { useEmployee } from "../../context/EmployeeContext";
import axios from "axios";
import styles from "../../styles/Manager/ManagerDashboard.module.css";

const EmployeesUnderManager = () => {
    const { employee } = useEmployee();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [designationFilter, setDesignationFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);


    useEffect(() => {
        if (!employee?.empId) return;

        axios
            .get(`http://localhost:8080/employee/getbymgr?mgrid=${employee.empId}`)
            .then((res) => {
                setEmployees(res.data);
                setFilteredEmployees(res.data);
            })
            .catch((err) => console.error("Error fetching employees:", err));
    }, [employee]);

    const applyFilter = (list, search, designation) => {
        let result = list;

        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.name.toLowerCase().includes(term) ||
                    e.empId.toString().toLowerCase().includes(term)
            );
        }

        if (designation) {
            result = result.filter((e) =>
                e.designation.toLowerCase().includes(designation.toLowerCase())
            );
        }

        setFilteredEmployees(result);
    };

    const handleSearch = (e) => {
        const text = e.target.value;
        setSearchTerm(text);
        applyFilter(employees, text, designationFilter);
    };

    const handleDesignationFilter = (e) => {
        const value = e.target.value;
        setDesignationFilter(value);
        applyFilter(employees, searchTerm, value);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setDesignationFilter("");
        setFilteredEmployees(employees);
    };

    const handleEmployeeClick = async (empId) => {
  try {
    // First, find the clicked employee object
    const selectedEmp = employees.find((e) => e.empId === empId);
    setSelectedEmp(selectedEmp);

    let res;
    if (
      selectedEmp.designation.toLowerCase().includes("project coordinator")
    ) {
      // ✅ If the clicked employee is a manager → fetch projects under this manager
      res = await axios.get(`http://localhost:8080/project/get-by-tl/${empId}`);
    } else {
      // ✅ Else → fetch projects the employee is assigned to
      res = await axios.get(`http://localhost:8080/project-assignment/projects/${empId}`);
    }

    const projectsWithCoordinator = await Promise.all(
      res.data.map(async (proj) => {
        //console.log(proj)
        if (proj.tlId) {
          const tlRes = await axios.get(
            `http://localhost:8080/employee/${proj.tlId}`
          );
          //console.log(tlRes);
          return { ...proj, coordinatorName: tlRes.data.name };
        }
        return proj;
      })
    );

    setSelectedProjects(projectsWithCoordinator);
    setShowModal(true);
  } catch (err) {
    console.error("Error fetching employee/manager projects:", err);
  }
};



    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.dashboardTitle}>Employee List</h2>

            {/* ✅ Filters */}
            <div className={styles.topFilterRow}>
                <input
                    type="text"
                    placeholder="Search id/name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className={styles.searchInput}

                />

                <div style={{ marginLeft: "auto", display: "flex", gap: "15px", marginRight: "18px" }}>
                    <select
                        value={designationFilter}
                        onChange={handleDesignationFilter}
                        className={styles.filterSelect}
                    >
                        <option value="">All Designation</option>
                        <option value="checker">Checker</option>
                        <option value="detailer">Detailer</option>
                        <option value="modeller">Modeller</option>
                    </select>

                    <button onClick={clearFilters} className={styles.clearBtn}>
                        Clear
                    </button>

                </div>
            </div>

            {/* ✅ Table */}
            <table className={styles.projectsTable}>
                <thead>
                    <tr>
                        <th>Emp ID</th>
                        <th>Name</th>
                        <th>Designation</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredEmployees.length === 0 ? (
                        <tr>
                            <td colSpan="3" className={styles.noData}>
                                No employees found.
                            </td>
                        </tr>
                    ) : (
                        filteredEmployees.map((emp) => (
                            <tr key={emp.empId} onClick={() => handleEmployeeClick(emp.empId)}>
                                <td>{emp.empId}</td>
                                <td>{emp.name}</td>
                                <td>{emp.designation}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {showModal && (
                <div className={styles.overlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Projects Working</h3>
                        <table className={styles.memberTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Project Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan="13" className={styles.noData}>
                                            No records found.
                                        </td>
                                    </tr>
                                ) : (

                                    selectedProjects.map((project) => (
      <tr key={project.id}>
        <td>{project.id}</td>
        <td>
          {project.projectName}
          {selectedEmp &&
            !selectedEmp.designation
              .toLowerCase()
              .includes("project coordinator") &&
            project.coordinatorName && (
              <span
                style={{
                  color: "#007bff",
                  marginLeft: "8px",
                  fontSize: "16px",
                }}
              >
                ({project.coordinatorName})
              </span>
            )}
        </td>
      </tr>
    ))

                                )}
                            </tbody>
                        </table>

                        <button className={styles.closeBtn} onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>)}
        </div>
    );
};

export default EmployeesUnderManager;
