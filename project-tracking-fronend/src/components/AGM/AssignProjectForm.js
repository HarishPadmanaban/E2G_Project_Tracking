import React, { useState, useEffect } from "react";
import styles from "../../styles/AGM/AddActivity.module.css"; // reuse CSS
import axios from "axios";
import { useEmployee } from "../../context/EmployeeContext";

const AssignProjectForm = () => {
   const { employee } = useEmployee();
  const [pms, setPMs] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    pmId: "",
    totalHours: "",
    awardedDate: "",
    startDate: "",
    completionDate: "",
  });

  // Fetch PMs
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee/getallmanagers") // replace with real endpoint
      .then((res) => {
        const filteredPMs = res.data.filter((emp) => emp.designation === "Project Manager");
        setPMs(filteredPMs); console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.projectName) return alert("⚠️ Enter Project Name");
    if (!formData.clientName) return alert("⚠️ Enter Client Name");
    if (!formData.pmId) return alert("⚠️ Select a PM");
    if (!formData.awardedDate) return alert("⚠️ Enter Awarded Date");
    if (!formData.startDate) return alert("⚠️ Enter Start Date");
    if (!formData.completionDate) return alert("⚠️ Enter Completion Date");
    if (!formData.totalHours || Number(formData.totalHours) <= 0)
      return alert("⚠️ Enter total hours > 0");

    console.log(formData);

    try {
      await axios.post(
        `http://localhost:8080/project/save`,
        null,
        {
          params: {
            projectName: formData.projectName,
            clientName: formData.clientName,
            pmId: formData.pmId,
            agmId: employee.empId,
            totalHours: formData.totalHours,
            awardedDate: formData.awardedDate,
            startDate: formData.startDate,
            completionDate: formData.completionDate
          },
        }
      );
      alert("✅ Project assigned successfully!");
      setFormData({
        projectName: "", clientName: "", pmId: "", totalHours: "", awardedDate: "", startDate: "",completionDate: ""
      });
    } catch (error) {
      console.error(error);
      setFormData({
        projectName: "", clientName: "", pmId: "", totalHours: "", awardedDate: "", startDate: "",completionDate: ""
      });
      alert("❌ Failed to assign project");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Assign Project to PM</h2>

      {/* Project Name */}
      <div className={styles.fld}>
        <label>Project Name</label>
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
        />
      </div>

      {/* Client Name */}
      <div className={styles.fld}>
        <label>Client Name</label>
        <input
          type="text"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
        />
      </div>

      {/* PM Dropdown */}
      <div className={styles.fld}>
        <label>Choose PM</label>
        <select name="pmId" value={formData.pmId} onChange={handleChange}>
          <option value="">Select PM</option>
          {pms.map((pm) => (
            <option key={pm.empId} value={pm.empId}>
              {pm.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fld}>
        <label>Awarded Date</label>
        <input
          type="date"
          name="awardedDate"
          value={formData.awardedDate}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fld}>
        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className={styles.fld}>
        <label>Completion Date</label>
        <input
          type="date"
          name="completionDate"
          value={formData.completionDate}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Total Hours */}
      <div className={styles.fld}>
        <label>Total Hours</label>
        <input
          type="number"
          name="totalHours"
          value={formData.totalHours}
          onChange={handleChange}
        />
      </div>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        Assign Project
      </button>
    </div>
  );
};

export default AssignProjectForm;
