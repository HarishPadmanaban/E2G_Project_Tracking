import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Manager/ViewRequests.module.css";
import { useEmployee } from "../../context/EmployeeContext";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const { employee, loading } = useEmployee();

  const fetchRequests = async () => {
  if (!employee?.id) return;

  try {
    const [pendingRes, approvedRes] = await Promise.all([
      axios.get(`http://localhost:8080/leave/manager/${employee.empId}`),
      axios.get(`http://localhost:8080/leave/manager-approved/${employee.empId}`),
    ]);

    const allRequests = [...pendingRes.data, ...approvedRes.data];
    setRequests(allRequests);

    console.log(allRequests)

    // Maintain current filter after refresh
    const filtered = allRequests.filter((r) =>
      filter === "All" ? true : r.status === filter
    );
    setFilteredRequests(filtered);
  } catch (err) {
    console.error("Error fetching leave data:", err);
  }
};


  useEffect(() => {
  fetchRequests();
}, [employee]);


  // Filter change handler
  const handleFilter = (category) => {
    setFilter(category);
    const filtered = requests.filter((r) => r.status === category);
    setFilteredRequests(filtered);
  };

  const handleApprove = async (id) => {
  try {
    await axios.put(`http://localhost:8080/leave/status/${id}`, null, {
      params: { status: "Approved" },
    });
    alert("Request Approved ✅");
    await fetchRequests(); // 🔁 refetch after approval
    window.dispatchEvent(new Event("refreshPendingCount"));
  } catch (err) {
    console.error("Approval failed:", err);
    alert("Failed to approve request!");
  }
};

const handleReject = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/leave/${id}`);
    alert("Request Rejected ❌");
    await fetchRequests(); // 🔁 refetch after rejection
    window.dispatchEvent(new Event("refreshPendingCount"));
  } catch (err) {
    console.error("Rejection failed:", err);
    alert("Failed to reject request!");
  }
};


  if (loading) return <div className={styles.noData}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Leave & Permission Requests</h2>

      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        {["Pending", "Approved"].map((category) => (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            className={`${styles.filterBtn} ${
              filter === category ? styles.active : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.requestTable}>
          <thead>
            <tr>
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
              <th>Status</th>
              {filter !== "Approved" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="13" className={styles.noData}>
                  No requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((r) => (
                <tr key={r.id}>
                  <td>{r.employeeName || "-"}</td>
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
                  <td
                    className={
                      r.status === "Approved"
                        ? styles.statusApproved
                        : styles.statusPending
                    }
                  >
                    {r.status}
                  </td>
                  {filter !== "Approved" && r.status === "Pending" && (
                    <td>
                      <button
                        className={styles.approveBtn}
                        onClick={() => handleApprove(r.id)}
                      >
                        ✓
                      </button>
                      <button
                        className={styles.rejectBtn}
                        onClick={() => handleReject(r.id)}
                      >
                        ✕
                      </button>
                    </td>
                  )}
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
