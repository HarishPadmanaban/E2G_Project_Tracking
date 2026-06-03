import React, { useState, useEffect } from "react";
import styles from "../../styles/AGM/AddActivity.module.css"; // reuse CSS
import axiosInstance from "../axiosConfig";
import { useToast } from "../../context/ToastContext";
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
  const { showToast } = useToast();
  

  // Fetch PMs
  useEffect(() => {
    axiosInstance
      .get("/employee/getallmanagers") // replace with real endpoint
      .then((res) => {
        const filteredPMs = res.data.filter((emp) => emp.designation.trim() === "Project Manager" || emp.designation.trim() ==="Senior Project Manager");
        setPMs(filteredPMs);
      })
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.projectName) return showToast("⚠️ Enter Project Name","warning");
    if (!formData.clientName) return showToast("⚠️ Enter Client Name","warning");
    if (!formData.pmId) return showToast("⚠️ Select a PM","warning");
    if (!formData.awardedDate) return showToast("⚠️ Enter Awarded Date","warning");
    if (!formData.startDate) return showToast("⚠️ Enter Start Date","warning");
    if (!formData.completionDate) return showToast("⚠️ Enter Completion Date","warning");
    if (!formData.totalHours || Number(formData.totalHours) <= 0)
      return showToast("⚠️ Enter total hours > 0","warning");
    if (!formData.ifaHours || Number(formData.ifaHours) <= 0)
      return showToast("⚠️ Enter IFA hours > 0","warning");
    if (!formData.ifcHours || Number(formData.ifcHours) <= 0)
      return showToast("⚠️ Enter IFC hours > 0","warning");
    if(Number(formData.ifaHours)+Number(formData.ifcHours) !== Number(formData.totalHours))
      return showToast("⚠️ IFA and IFC Hours should equal Total Hours","warning");

    try {
      await axiosInstance.post(
        `/project/save`,
        null,
        {
          params: {
            projectName: formData.projectName,
            clientName: formData.clientName,
            pmId: formData.pmId,
            agmId: employee.empId,
            totalHours: formData.totalHours,
            awardedDate: formData.awardedDate,
            plannedStartDate: formData.startDate,
            completedDate: formData.completionDate,
            ifaGivenHours: formData.ifaHours,
            ifcGivenHours: formData.ifcHours
          },
        }
      );
      showToast("✅ Project assigned successfully!","success");
      setFormData({
        projectName: "", clientName: "", pmId: "", totalHours: "", awardedDate: "", startDate: "",completionDate: "",ifaHours:"",ifcHours:""
      });
    } catch (error) {
  
      setFormData({
        projectName: "", clientName: "", pmId: "", totalHours: "", awardedDate: "", startDate: "",completionDate: "",ifaHours:"",ifcHours:""
      });
      showToast("❌ Failed to assign project","error");
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
          {pms.filter((pm) => pm.empId!==1004 && pm.empId!==1196)
          .map((pm) => (
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
        <label>Planned Start Date</label>
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

      <div className={styles.fld}>
        <label>IFA Hours</label>
        <input
          type="number"
          name="ifaHours"
          value={formData.ifaHours}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fld}>
        <label>IFC Hours</label>
        <input
          type="number"
          name="ifcHours"
          value={formData.ifcHours}
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
