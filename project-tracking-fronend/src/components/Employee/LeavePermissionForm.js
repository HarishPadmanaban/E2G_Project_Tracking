import React, { useState,useEffect } from "react";
import styles from "../../styles/Employee/LeavePermissionForm.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import axios from "axios";

const LeavePermissionForm = () => {
  const {employee,loading} = useEmployee();
  const [formData, setFormData] = useState({
    employeeId: employee?.id || "",      // from logged-in user
    managerId: employee?.reportingToId || "",
    type: "", // Leave / Permission
    leaveDuration: "", // One Day / Multiple Days
    fromDate: "",
    toDate: "",
    leaveDays: "",
    leaveType: "", // CL/SL/LOP
    reason: "",
    permissionInTime: "",
    permissionOutTime: "",
    permissionHours: "",
    permissionMinutes: "",
  });

   useEffect(() => {
    if (!loading && !employee) {
      alert("Employee not found or not logged in!");
    }
  }, [loading, employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Leave days calculation
  const calculateLeaveDays = (from, to) => {
    if (from && to) {
      const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;
      setFormData((prev) => ({ ...prev, leaveDays: diff }));
    }
  };

  // Permission time calculation
  const calculatePermissionTime = (inTime, outTime) => {
  if (inTime && outTime) {
    const inDate = new Date(`1970-01-01T${inTime}:00`);
    const outDate = new Date(`1970-01-01T${outTime}:00`);

    // If In time is smaller than Out time (e.g., crosses midnight)
    if (inDate < outDate) {
      inDate.setDate(inDate.getDate() + 1);
    }

    const diffMs = inDate - outDate; // difference in milliseconds
    const diffMinutes = diffMs / (1000 * 60); // difference in minutes

    const hours = diffMinutes / 60; // hours as decimal
    const minutes = diffMinutes;    // total minutes

    setFormData((prev) => ({
      ...prev,
      permissionHours: hours.toFixed(2), // 1.50 hours
      permissionMinutes: minutes,        // total minutes
    }));
  }
};


  const handleSubmit = async (e) => {
  e.preventDefault();
    console.log(formData);
  const validation = validateForm();
  if (!validation.valid) {
    alert(validation.msg);
    return;
  }

  try {
    const payload = {
  employee: { id: employee.id },       // 👈 nested object
  manager: { id: employee.reportingToId }, // 👈 nested object
  type: formData.type,
  leaveDuration: formData.leaveDuration,
  fromDate: formData.fromDate || null,
  toDate: formData.toDate || null,
  leaveDays: formData.leaveDays || 0,
  leaveType: formData.leaveType || null,
  reason: formData.reason,
  permissionInTime: formData.permissionInTime || null,
  permissionOutTime: formData.permissionOutTime || null,
  permissionHours: formData.permissionHours || null,
  permissionMinutes: formData.permissionMinutes || null,
  appliedDate: new Date().toISOString().split("T")[0],
};

const response = await axios.post("http://localhost:8080/leave/apply", payload);
    console.log(response);
    if (response.status === 200 || response.status === 201) {
      alert("✅ Leave/Permission submitted successfully!");
      
      // Reset form after success
      setFormData({
        type: "",
        leaveDuration: "",
        fromDate: "",
        toDate: "",
        leaveDays: "",
        leaveType: "",
        reason: "",
        permissionInTime: "",
        permissionOutTime: "",
        permissionHours: "",
        permissionMinutes: "",
      });
    } else {
      alert("⚠️ Failed to submit Leave/Permission!");
    }

  } catch (error) {
    console.error("❌ Error submitting Leave/Permission:", error);
    alert("❌ Failed to save Leave/Permission!");
  }
};

  const validateForm = () => {
  if (!employee) return { valid: false, msg: "Employee not found or not logged in!" };

  if (!formData.type) return { valid: false, msg: "Please select Leave or Permission type." };

  if (formData.type === "Leave") {
    if (!formData.leaveDuration) return { valid: false, msg: "Please select Leave Duration." };

    if (formData.leaveDuration === "One Day" && !formData.fromDate)
      return { valid: false, msg: "Please select Leave Date." };

    if (formData.leaveDuration === "Multiple Days") {
      if (!formData.fromDate || !formData.toDate)
        return { valid: false, msg: "Please select both From and To Dates." };
    }

    if (!formData.leaveType) return { valid: false, msg: "Please select Leave Type." };
    if (!formData.reason.trim()) return { valid: false, msg: "Please provide a reason for Leave." };
  }

  if (formData.type === "Permission") {
    if (!formData.fromDate) return { valid: false, msg: "Please select a Date for Permission." };
    if (!formData.permissionOutTime || !formData.permissionInTime)
      return { valid: false, msg: "Please fill both Out Time and In Time." };
    if (!formData.reason.trim()) return { valid: false, msg: "Please provide a reason for Permission." };
  }

  return { valid: true };
};


  return (
  <div>
    <div className={styles.container}>
      <h2>Leave / Permission Form</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Employee Info */}
        <div className={styles.field}>
          <label>Employee ID</label>
          <input type="text" value={employee.empId || ""} readOnly />
        </div>

        <div className={styles.field}>
          <label>Employee Name</label>
          <input type="text" value={employee.name || ""} readOnly />
        </div>

        <div className={styles.field}>
          <label>Role</label>
          <input type="text" value={employee.designation || ""} readOnly />
        </div>

        <div className={styles.field}>
          <label>Applied Date</label>
          <input type="text" value={new Date().toISOString().split("T")[0]} readOnly />
        </div>

        {/* Type Selection */}
        <div className={styles.field}>
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="Leave">Leave</option>
            <option value="Permission">Permission</option>
          </select>
        </div>

        {/* Leave Form */}
        {formData.type === "Leave" && (
          <>
            <div className={styles.field}>
              <label>Leave Duration</label>
              <select
                name="leaveDuration"
                value={formData.leaveDuration}
                onChange={handleChange}
              >
                <option value="">Select Duration</option>
                <option value="One Day">One Day</option>
                <option value="Multiple Days">Multiple Days</option>
              </select>
            </div>

            {formData.leaveDuration === "One Day" && (
              <>
                <div className={styles.field}>
                  <label>Leave Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({ ...formData, fromDate: e.target.value, leaveDays: 1 })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label>No of Days</label>
                  <input type="number" value={formData.leaveDays || 1} readOnly />
                </div>
              </>
            )}

            {formData.leaveDuration === "Multiple Days" && (
              <>
                <div className={styles.field}>
                  <label>From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, fromDate: e.target.value }));
                      calculateLeaveDays(e.target.value, formData.toDate);
                    }}
                  />
                </div>

                <div className={styles.field}>
                  <label>To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, toDate: e.target.value }));
                      calculateLeaveDays(formData.fromDate, e.target.value);
                    }}
                  />
                </div>

                <div className={styles.field}>
                  <label>No of Days</label>
                  <input type="number" value={formData.leaveDays || ""} readOnly />
                </div>
              </>
            )}

            <div className={styles.field}>
              <label>Leave Type</label>
              <select name="leaveType" value={formData.leaveType} onChange={handleChange}>
                <option value="">Select Leave Type</option>
                <option value="CL">CL</option>
                <option value="SL">SL</option>
                <option value="LOP">LOP</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for Leave"
              />
            </div>
          </>
        )}

        {/* Permission Form */}
        {formData.type === "Permission" && (
          <>
            <div className={styles.field}>
              <label>Date</label>
              <input
                type="date"
                name="fromDate"
                min={new Date().toISOString().split("T")[0]}
                value={formData.fromDate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>Out Time (Leave Time)</label>
              <input
                type="time"
                name="permissionOutTime"
                value={formData.permissionOutTime}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, permissionOutTime: e.target.value }));
                  if (formData.permissionInTime) {
                    calculatePermissionTime(formData.permissionInTime, e.target.value);
                  }
                }}
              />
            </div>

            <div className={styles.field}>
              <label>In Time (Return Time)</label>
              <input
                type="time"
                name="permissionInTime"
                value={formData.permissionInTime}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, permissionInTime: e.target.value }));
                  if (formData.permissionOutTime) {
                    calculatePermissionTime(e.target.value, formData.permissionOutTime);
                  }
                }}
              />
            </div>

            <div className={styles.field}>
              <label>Permission Hours</label>
              <input type="text" value={formData.permissionHours} readOnly />
            </div>

            <div className={styles.field}>
              <label>Permission Minutes</label>
              <input type="text" value={formData.permissionMinutes} readOnly />
            </div>

            <div className={styles.field}>
              <label>Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for Permission"
              />
            </div>
          </>
        )}

        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>
    </div>
  </div>
);
};

export default LeavePermissionForm;
