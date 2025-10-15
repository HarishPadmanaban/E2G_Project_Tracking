import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Manager/ViewRequests.module.css";
import { useEmployee } from "../../context/EmployeeContext";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const { employee, loading } = useEmployee();

  useEffect(() => {
    if (!employee?.id) return;

    axios
      .get(`http://localhost:8080/leave/manager/${employee.id}`)
      .then((res) => {
        console.log(res.data);
        setRequests(res.data);
        // default filter: Pending requests
        const pending = res.data.filter((r) => r.status === "Pending");
        setFilteredRequests(pending);
        setFilter("Pending");
      })
      .catch((err) => console.error(err));
  }, [employee]);

  // Filter change handler
  const handleFilter = (category) => {
    setFilter(category);
    const filtered = requests.filter((r) => r.status === category);
    setFilteredRequests(filtered);
  };

  const handleApprove = (id) => {
    console.log("Approved:", id);
    axios.put(`http://localhost:8080/leave/status/${id}`, null, {
      params: { status: "Approved" },
    });
    alert("Request Approved✅");

    // update UI instantly
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
    setFilteredRequests((prev) =>
      prev.filter((r) => r.id !== id) // remove from Pending view
    );
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
    axios.delete(`http://localhost:8080/leave/${id}`);
    alert("Request Rejected❌");

    setRequests((prev) => prev.filter((r) => r.id !== id));
    setFilteredRequests((prev) => prev.filter((r) => r.id !== id));
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
            className={`${styles.filterBtn} ${filter === category ? styles.active : ""
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
                  {filter !== "Approved" && (
                    <td>
                      {r.status === "Pending" && (
                        <>
                          <button className={styles.approveBtn} onClick={() => handleApprove(r.id)}>
                            ✓
                          </button>
                          <button className={styles.rejectBtn} onClick={() => handleReject(r.id)}>
                            ✕
                          </button>
                        </>
                      )}
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
