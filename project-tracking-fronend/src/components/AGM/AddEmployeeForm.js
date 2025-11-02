import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/AGM/AddActivity.module.css"; // reuse same CSS
import { useNavigate } from "react-router-dom";

const AddEmployeeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    designation: "",
    reportingTo: "",
    username: "",
    password: "",
  });


  const [managers, setManagers] = useState([]);

  const designations = [
    "Assistant General Manager",
    "Project Manager",
    "Project Coordinator",
    "Admin",
    "Senior Checker",
    "Junior Checker",
    "Senior Detailer",
    "Junior Detailer",
    "Senior Modeller",
    "Junior Modeller"
  ];

  // Fetch manager list from backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee/getallmanagers")
      .then((res) => setManagers(res.data))
      .catch(() => setManagers([]));
  }, []);

  console.table(managers);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mapDesignationToRole = (designation) => {
    if (designation.toLowerCase().includes("checker")) return "Checker";
    if (designation.toLowerCase().includes("modeller")) return "Modeller";
    if (designation.toLowerCase().includes("detailer")) return "Detailer";
    return designation; // fallback
  };


  const handleSubmit = async () => {
    // Basic validation
    if (!formData.empId.trim()) return alert("⚠️ Enter Employee ID");
    if (!formData.name.trim()) return alert("⚠️ Enter Employee Name");
    if (!formData.designation) return alert("⚠️ Select Designation");
    if (!formData.reportingTo && !["Assistant General Manager"].includes(formData.designation)) {
      return alert("⚠️ Select Reporting Manager");
    }
    if (!formData.username.trim()) return alert("⚠️ Enter Username");
    if (!formData.password.trim()) return alert("⚠️ Enter Password");
    //if (formData.password.length <=6 ) return alert("⚠️ Password Must greater than 6");
    if (formData.designation === "Project Manager" || formData.designation === "Assistant General Manager") formData.isManager = true;
    if (formData.designation === "Project Coordinator") formData.isTL = true;
    try {
      console.log(formData);
      const payload = {
        empId: Number(formData.empId),
        name: formData.name,
        designation: formData.designation,
        designationCategory: mapDesignationToRole(formData.designation),
        reportingTo:
          formData.reportingTo === ""
            ? null
            : { empId: Number(formData.reportingTo) },
        tl: formData.designation === "Project Coordinator",
        manager: ["Project Manager", "Assistant General Manager"].includes(formData.designation),
        username: formData.username,
        password: formData.password
      };



      console.log(payload); // check
      await axios.post("http://localhost:8080/employee/addemployee", payload);
      alert("✅ Employee added successfully!");
      setFormData({
        empId: "",
        name: "",
        designation: "",
        reportingTo: "",
        username: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add employee");
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
          name="reportingTo"
          value={formData.reportingTo}
          onChange={handleChange}
        >
          <option value="">Select Manager</option>
          {managers.map((m) => (
            <option key={m.id} value={m.empId}>
              {m.name} ({m.designation})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fld}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fld}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        Add Employee
      </button>
    </div>
  );
};

export default AddEmployeeForm;
