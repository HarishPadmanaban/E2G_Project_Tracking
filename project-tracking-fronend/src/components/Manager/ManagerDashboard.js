import React, { useEffect, useState } from "react";
import { useEmployee } from "../../context/EmployeeContext.js";
import axios from "axios";

const ManagerDashboard = () => {
  const { employee } = useEmployee();
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!employee) return;

    const managerIdToUse = employee.manager ? employee.id : employee.reportingToId;

    console.log("Fetching projects for managerId:", managerIdToUse);

    axios
      .get(`http://localhost:8080/project/${managerIdToUse}`)
      .then((res) => {
        setProjects(res.data);
        console.log("Fetched projects:", res.data);
      })
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:8080/activity/")
      .then((res) => {
        setActivities(res.data);
        console.log("Fetched activities:", res.data);
      })
      .catch((err) => console.error(err));
  }, [employee]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manager Dashboard</h2>
      
      <h3>Projects</h3>
      {projects.length === 0 ? (
        <p>No projects assigned.</p>
      ) : (
        <ul>
          {projects.map((p) => (
            <li key={p.id}>{p.projectName}</li>
          ))}
        </ul>
      )}

      <h3>Activities</h3>
      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <ul>
          {activities.map((a) => (
            <li key={a.id}>{a.activityName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagerDashboard;
