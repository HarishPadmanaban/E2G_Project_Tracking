import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Manager/ViewRequests.module.css"; // new CSS file
import { useEmployee } from "../../context/EmployeeContext";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const { employee, loading } = useEmployee();

  useEffect(() => {
    if (!employee?.id) return;

    axios
      .get(`http://localhost:8080/leave/manager/${employee.id}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, [employee]);

  const handleApprove = (id) => {
    console.log("Approved:", id);
    // axios.post(`/api/approve/${id}`);
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
    // axios.post(`/api/reject/${id}`);
  };

  if (loading) return <div className={styles.noData}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Leave & Permission Requests</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Applied</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Leave Type</th>
              <th>No. Days</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Hours</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="13" className={styles.noData}>
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.employee?.id || "-"}</td>
                  <td>{r.employee?.name || "-"}</td>
                  <td>{r.appliedDate || "-"}</td>
                  <td>{r.type}</td>
                  <td>{r.fromDate || "-"}</td>
                  <td>{r.toDate || "-"}</td>
                  <td>{r.type === "Leave" ? r.leaveType || "-" : "-"}</td>
                  <td>{r.type === "Leave" ? r.leaveDays || "-" : "-"}</td>
                  <td>{r.type === "Permission" ? r.permissionInTime || "-" : "-"}</td>
                  <td>{r.type === "Permission" ? r.permissionOutTime || "-" : "-"}</td>
                  <td>{r.type === "Permission" ? r.permissionHours || "-" : "-"}</td>
                  <td>{r.reason || "-"}</td>
                  <td>
                    <button className={styles.approveBtn} onClick={() => handleApprove(r.id)}>✓</button>
                    <button className={styles.rejectBtn} onClick={() => handleReject(r.id)}>✕</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRequests;
