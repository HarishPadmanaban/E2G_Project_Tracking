import React, { useEffect, useState } from "react";
import styles from "../../styles/Manager/ViewRequests.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import { useToast } from "../../context/ToastContext";
import axiosInstance from "../axiosConfig";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const { employee, loading } = useEmployee();
  const { showToast } = useToast();
  

  const fetchRequests = async () => {
  if (!employee?.empId) return;

  try {
    const [pendingRes, approvedRes] = await Promise.all([
      axiosInstance.get(`/leave/manager/${employee.empId}`),
      axiosInstance.get(`/leave/manager-approved/${employee.empId}`),
    ]);

    const allRequests = [...pendingRes.data, ...approvedRes.data];
    setRequests(allRequests);

    

    // Maintain current filter after refresh
    const filtered = allRequests.filter((r) =>
      filter === "All" ? true : r.status === filter
    );
    setFilteredRequests(filtered);
  } catch (err) {
    
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
    await axiosInstance.put(`/leave/status/${id}`, null, {
      params: { status: "Approved" },
    });
    showToast("Request Approved ✅","success");
    await fetchRequests(); // 🔁 refetch after approval
    window.dispatchEvent(new Event("refreshPendingCount"));
  } catch (err) {
    
    const backendMsg =
            err.response?.data?.message || err.response?.data || "Something went wrong while stopping work!";
    showToast(backendMsg,"error");
  }
};

const handleReject = async (id) => {
  try {
    await axiosInstance.delete(`/leave/${id}`);
    showToast("Request Rejected ❌","success");
    await fetchRequests(); // 🔁 refetch after rejection
    window.dispatchEvent(new Event("refreshPendingCount"));
  } catch (err) {
    
    showToast("Failed to reject request!","error");
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
