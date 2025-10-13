import React, { useEffect, useState } from "react";
import { useEmployee } from "../../context/EmployeeContext.js";
import axios from "axios";
import styles from "../../styles/Manager/ManagerDashboard.module.css"; // CSS module import

const ManagerDashboard = () => {
  const { employee } = useEmployee();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState("In Progress");

  useEffect(() => {
    if (!employee) return;

    const managerIdToUse = employee.manager ? employee.id : employee.reportingToId;

    const res = axios
      .get(`http://localhost:8080/project/${managerIdToUse}`) // Dummy backend endpoint
      .then((res) => {
        setProjects(res.data);
        const inProgress = res.data.filter((p) => p.projectStatus === true);
        setFilteredProjects(inProgress);
        setFilter("In Progress");
      })
      .catch((err) => console.error(err));
  }, [employee]);
  console.log("Projects:", projects);


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
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.projectName}</td>
                <td>{p.clientName}</td>
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
