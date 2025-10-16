import React, { useState, useEffect } from "react";
import styles from "../../styles/Employee/LeavePermissionForm.module.css"; // reuse CSS
import axios from "axios";

const AssignProjectForm = () => {
  const [pms, setPMs] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    pmId: "",
    totalHours: "",
  });

  // Fetch PMs
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee/getallmanagers") // replace with real endpoint
      .then((res) => {setPMs(res.data);console.log(res.data);})
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.projectName) return alert("⚠️ Enter Project Name");
    if (!formData.clientName) return alert("⚠️ Enter Client Name");
    if (!formData.pmId) return alert("⚠️ Select a PM");
    if (!formData.totalHours || Number(formData.totalHours) <= 0)
      return alert("⚠️ Enter total hours > 0");

    try {
      await axios.post(
        `http://localhost:8080/project/save`,
        null,
        {
          params: {
            projectName:formData.projectName,
            clientName: formData.clientName,
            pmId: formData.pmId,
            totalHours: formData.totalHours,
          },
        }
      );
      alert("✅ Project assigned successfully!");
      setFormData({ projectName: "", clientName: "", pmId: "", totalHours: "" });
    } catch (error) {
      console.error(error);
      setFormData({ projectName: "", clientName: "", pmId: "", totalHours: "" });
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
            <option key={pm.id} value={pm.id}>
              {pm.name}
            </option>
          ))}
        </select>
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
