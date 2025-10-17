  import React, { useEffect, useState } from "react";
  import { useEmployee } from "../../context/EmployeeContext.js";
  import axios from "axios";
  import styles from "../../styles/Manager/ManagerDashboard.module.css"; // CSS module import

  const ManagerDashboard = () => {
    const { employee } = useEmployee();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filter, setFilter] = useState("In Progress");
    const [managers, setManagers] = useState({});

  useEffect(() => {
    if (!employee?.id) return;

    const isAGM = employee.designation === "Assistant General Manager";

    // Use appropriate ID depending on role
    const managerIdToUse = employee.manager ? employee.id : employee.reportingToId;

    // Choose the endpoint dynamically
    const endpoint = isAGM
      ? `http://localhost:8080/project/` // 👈 new AGM endpoint
      : `http://localhost:8080/project/${managerIdToUse}`; // 👈 existing endpoint

    axios
      .get(endpoint)
      .then((res) => {
        setProjects(res.data);
       //console.log(res.data);
        const inProgress = res.data.filter((p) => p.projectStatus === true);
        setFilteredProjects(inProgress);
        setFilter("In Progress");
        if (isAGM) {
    axios.get("http://localhost:8080/employee/getallmanagers")
      .then((res) => {
        const mgrMap = {};
        res.data.forEach(m => {
          mgrMap[m.id] = m.name;
        });
        setManagers(mgrMap);
        //console.log(mgrMap);
      })
      .catch(err => console.error("Error fetching managers:", err));
  }
      })
      .catch((err) => console.error(err));
  }, [employee]);

    //console.log("Projects:", projects);


    const handleFilter = (category) => {
      setFilter(category);

      if (category === "All") {
        setFilteredProjects(projects);
      } else {
        const filtered = projects.filter((p) => {
          if (category === "Completed") return p.projectStatus === false;
          if (category === "In Progress") return p.projectStatus === true;
          return false;
        });
        setFilteredProjects(filtered);
      }
    };

    return (

      <div className={styles.dashboardContainer}>
        <h2 className={styles.dashboardTitle}>
          {employee ? `${employee.name}'s Dashboard` : "Manager Dashboard"}
        </h2>

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

        <table className={styles.projectsTable}>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Client Name</th>
              {employee.designation === "Assistant General Manager" && <th>Manager Name</th>}
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
                <tr key={p.id}
                className={p.modellingHours === 0 ? styles.highlightRow : ""}
                >
                  <td>{p.id}</td>
                  <td>{p.projectName}</td>
                  <td>{p.clientName}</td>
                  {employee.designation === "Assistant General Manager" && (
          <td>{managers[p.managerId] || "Unknown"}</td>
        )}
                  <td>{p.assignedHours}</td>
                  <td>{p.workingHours}</td>
                  <td className={p.projectStatus ? styles.statusInProgress : styles.statusCompleted}>
                    {p.projectStatus ? "In-Progress" : "Completed"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  export default ManagerDashboard;
