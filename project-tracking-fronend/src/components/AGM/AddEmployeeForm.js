import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Employee/LeavePermissionForm.module.css"; // reuse same CSS

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    designation: "",
    reportingTo: "",
  });


  const [managers, setManagers] = useState([]);

  const designations = [
    "Assistant General Manager",
    "Project Manager",
    "Admin",
    "Project Coordinator",
    "Employee",
  ];

  // Fetch manager list from backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee/getallmanagers")
      .then((res) => setManagers(res.data))
      .catch(() => setManagers([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.empId.trim()) return alert("⚠️ Enter Employee ID");
    if (!formData.name.trim()) return alert("⚠️ Enter Employee Name");
    if (!formData.designation) return alert("⚠️ Select Designation");
    if (!formData.reportingId) return alert("⚠️ Select Reporting Manager");
    if (formData.designation === "Project Manager") formData.isManager = true;
    if (formData.designation === "Project Coordinator") formData.isTL = true;
    try {
      console.log(formData);
      const payload = {
        empId: formData.empId,
        name: formData.name,
        designation: formData.designation,
        isManager: formData.designation === "Project Manager",
        isTL: formData.designation === "Project Coordinator",
        username: formData.empId,       // generate username
        password: formData.empId + "123", // generate password
        reportingTo: { id: formData.reportingTo } // send nested object
      };

      console.log(payload); // check
      await axios.post("http://localhost:8080/employee/addemployee", payload);
      await axios.post("http://localhost:8080/employee/addemployee", formData); // dummy endpoint
      alert("✅ Employee added successfully!");
      setFormData({
        empId: "",
        name: "",
        designation: "",
        reportingId: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add employee");
      setFormData({
        empId: "",
        name: "",
        designation: "",
        reportingId: "",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Employee</h2>

      <div className={styles.fld}>
        <label>Employee ID</label>
        <input
          type="text"
          name="empId"
          value={formData.empId}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fld}>
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fld}>
        <label>Designation</label>
        <select
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        >
          <option value="">Select Designation</option>
          {designations.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fld}>
        <label>Reporting Manager</label>
        <select
          name="reportingId"
          value={formData.reportingId}
          onChange={handleChange}
        >
          <option value="">Select Manager</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.designation})
            </option>
          ))}
        </select>
      </div>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        Add Employee
      </button>
    </div>
  );
};

export default AddEmployeeForm;
