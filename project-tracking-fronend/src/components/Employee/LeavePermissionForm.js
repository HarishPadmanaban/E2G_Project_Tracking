import React, { useState } from "react";
import styles from "../../styles/Employee/LeavePermissionForm.module.css";

const LeavePermissionForm = () => {
  const [employee] = useState({
    id: 101,
    emp_id: "EMP101",
    name: "Harish Padmanaban",
    designation: "Software Engineer",
  });

  const [formData, setFormData] = useState({
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


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    alert("Leave/Permission submitted!");
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
  };

  return (
    <div>
        
        <div className={styles.header}>
                <h1>E2G ENGINEERING SERVICES PRIVATE LIMITED</h1>
        </div>

        <div className={styles.container}>
      <h2>Leave / Permission Form</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Employee Info */}
        <label>Employee ID</label>
        <input type="text" value={employee.emp_id} readOnly />

        <label>Employee Name</label>
        <input type="text" value={employee.name} readOnly />

        <label>Role</label>
        <input type="text" value={employee.designation} readOnly />

        <label>Applied Date</label>
        <input type="text" value={new Date().toISOString().split("T")[0]} readOnly />

        {/* Type Selection */}
        <label>Type</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="Leave">Leave</option>
          <option value="Permission">Permission</option>
        </select>

        {/* Leave Form */}
        {formData.type === "Leave" && (
          <>
            <label>Leave Duration</label>
            <select name="leaveDuration" value={formData.leaveDuration} onChange={handleChange}>
              <option value="">Select Duration</option>
              <option value="One Day">One Day</option>
              <option value="Multiple Days">Multiple Days</option>
            </select>

            {formData.leaveDuration === "One Day" && (
              <>
                <label>Leave Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={(e) =>
                    setFormData({ ...formData, fromDate: e.target.value, leaveDays: 1 })
                  }
                />
                <label>No of Days</label>
                <input type="number" value={formData.leaveDays || 1} readOnly />
              </>
            )}

            {formData.leaveDuration === "Multiple Days" && (
              <>
                <label>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, fromDate: e.target.value }));
                    calculateLeaveDays(e.target.value, formData.toDate);
                  }}
                />
                <label>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, toDate: e.target.value }));
                    calculateLeaveDays(formData.fromDate, e.target.value);
                  }}
                />
                <label>No of Days</label>
                <input type="number" value={formData.leaveDays || ""} readOnly />
              </>
            )}

            <label>Leave Type</label>
            <select name="leaveType" value={formData.leaveType} onChange={handleChange}>
              <option value="">Select Leave Type</option>
              <option value="CL">CL</option>
              <option value="SL">SL</option>
              <option value="LOP">LOP</option>
            </select>

            <label>Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Reason for Leave"
            />
          </>
        )}

        {/* Permission Form */}
        {/* Permission Form */}
{formData.type === "Permission" && (
  <>
    <label>Date</label>
    <input
      type="date"
      name="fromDate"
      value={formData.fromDate}
      onChange={handleChange}
    />

    <label>Out Time (Leave Time)</label>
    <input
      type="time"
      name="permissionOutTime"
      value={formData.permissionOutTime}
      onChange={(e) => {
        setFormData((prev) => ({ ...prev, permissionOutTime: e.target.value }));
        // Only calculate if In Time already exists
        if (formData.permissionInTime) {
          calculatePermissionTime(formData.permissionInTime, e.target.value);
        }
      }}
    />

    <label>In Time (Return Time)</label>
    <input
      type="time"
      name="permissionInTime"
      value={formData.permissionInTime}
      onChange={(e) => {
        setFormData((prev) => ({ ...prev, permissionInTime: e.target.value }));
        // Calculate hours/minutes after both Out and In times exist
        if (formData.permissionOutTime) {
          calculatePermissionTime(e.target.value, formData.permissionOutTime);
        }
      }}
    />

    <label>Permission Hours</label>
    <input type="text" value={formData.permissionHours} readOnly />

    <label>Permission Minutes</label>
    <input type="text" value={formData.permissionMinutes} readOnly />

    <label>Reason</label>
    <textarea
      name="reason"
      value={formData.reason}
      onChange={handleChange}
      placeholder="Reason for Permission"
    />
  </>
)}


        <button type="submit" className={styles.submitBtn}>Submit</button>
      </form>
    </div>
        
    </div>
  );
};

export default LeavePermissionForm;
