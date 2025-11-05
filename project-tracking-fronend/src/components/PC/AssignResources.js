import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Employee/LeavePermissionForm.module.css";
import { useEmployee } from "../../context/EmployeeContext";

const AssignActivityForm = () => {
  const { employee } = useEmployee();
  const managerId = employee?.empId;

  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);

  const [formData, setFormData] = useState({
    projectId: "",
    activityType: "",
    activityId: "",
    employeeId: "",
    assignedActivity: "",
  });

  const idToUse = employee.tl ? employee.reportingToId : employee.empId;


  // ✅ Fetch Projects
  useEffect(() => {
    if (!employee || !employee.reportingToId) return;

    axios
      .get(`http://localhost:8080/project/${idToUse}`) // Dummy API
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
  }, [managerId]);

  // ✅ Fetch Employees
  useEffect(() => {
    if (!formData.projectId) {
      setEmployees([]);
      return;
    }

    axios
      .get(`http://localhost:8080/project-assignment/employees/${formData.projectId}`)
      .then((res) => {
        if (res.data.length === 0) {
          // If no employees assigned to this project, get all employees under manager
          axios
            .get(`http://localhost:8080/employee/getbymgr?mgrid=${employee.reportingToId}`)
            .then((mgrRes) => setEmployees(mgrRes.data))
            .catch((err) => console.error("Error fetching employees under manager:", err));
        } else {
          setEmployees(res.data);
        }
      })
      .catch((err) => console.error("Error fetching project employees:", err));
  }, [formData.projectId, employee.reportingToId]);


  // ✅ Fetch Activities based on type
  useEffect(() => {
    axios
      .get("http://localhost:8080/activity/")
      .then((res) => {
        setActivities(res.data);
        setFilteredActivities(res.data); // default
      })
      .catch((err) => console.error("Error fetching activities:", err));
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "activityType") {
      const filtered = activities.filter(
        (act) =>
          act.mainType &&
          act.mainType.toLowerCase() === value.toLowerCase()
      );
      setFilteredActivities(filtered);
      setFormData((prev) => ({
        ...prev,
        activityType: value,
        activityId: "",
      }));
    }
  };

  const handleActivityChange = (e) => {
    const selectedActivity = activities.find((act) => act.id.toString() === e.target.value);

    setFormData((prev) => ({
      ...prev,
      activityId: e.target.value,
      category: selectedActivity ? selectedActivity.category : "",
    }));
  };


  // ✅ Submit
  const handleSubmit = () => {
    if (!formData.projectId || !formData.activityId || !formData.employeeId) {
      alert("⚠ Please fill all required fields");
      return;
    }

    const payload = {
      projectId: Number(formData.projectId),
      activityId: Number(formData.activityId),
      employeeId: Number(formData.employeeId),
      managerId: Number(managerId), // optional if backend expects it
      assignedById: Number(managerId), // optional
      description: formData.assignedActivity, // keep it as string
    };


    //console.log(payload);

    axios
      .post("http://localhost:8080/assigned-work", payload) // Dummy POST
      .then((res) => {
        alert("✅ Activity Assigned Successfully");
        setFormData({
          projectId: "",
          activityType: "",
          activityId: "",
          employeeId: "",
          assignedActivity: "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to assign activity");
      });
  };

  return (
    <div className={styles.container}>
      <h2>Assign Activity</h2>

      {/* Project Dropdown */}
      <div className={styles.fld}>
        <label>Select Project</label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.projectName}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Type Dropdown */}
      <div className={styles.fld}>
        <label>Activity Type</label>
        <select
          name="activityType"
          value={formData.activityType}
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          <option value="Modelling">Modelling</option>
          <option value="Checking">Checking</option>
          <option value="Detailing">Detailing</option>
          <option value="Common">Common</option>
        </select>
      </div>

      {/* Activity Dropdown */}
      <div className={styles.fld}>
        <label>Activity</label>
        <select name="activityId" value={formData.activityId} onChange={handleActivityChange}>
          <option value="">Select Activity</option>
          {filteredActivities.map((act) => (
            <option key={act.id} value={act.id}>
              {act.activityName}
            </option>
          ))}
        </select>

      </div>

      {/* Employee Dropdown */}
      <div className={styles.fld}>
        <label>Assign To</label>
        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e.empId} value={e.empId}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assigned Hours */}
      <div className={styles.fld}>
        <label>Assign Activity</label>
        <input
          type="text"
          name="assignedActivity"
          value={formData.assignedActivity}
          onChange={handleChange}
          placeholder="Enter Activity"
        />
      </div>

      <button className={styles.submitBtn} type="button" onClick={handleSubmit}>
        Assign
      </button>
    </div>
  );
};

export default AssignActivityForm;
