import React, { useEffect, useState } from "react";
import styles from "../../styles/Manager/ViewRequests.module.css";
import { useToast } from "../../context/ToastContext";
import axiosInstance from "../axiosConfig";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("Pending"); // "Pending" | "Approved"
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [showCustomBox, setShowCustomBox] = useState(false);


  const employee = JSON.parse(sessionStorage.getItem("employee"));
  const { showToast } = useToast();

  const toISO = (d) => d.toISOString().slice(0, 10);

  const computeDateRange = () => {
    const today = new Date();
    switch (dateFilter) {
      case "Today":
        return { from: toISO(today), to: toISO(today) };
      case "Yesterday": {
        const y = new Date();
        y.setDate(today.getDate() - 1);
        return { from: toISO(y), to: toISO(y) };
      }
      case "Last 7 Days": {
        const past = new Date();
        past.setDate(today.getDate() - 7);
        return { from: toISO(past), to: toISO(today) };
      }
      case "Last 30 Days": {
        const past = new Date();
        past.setDate(today.getDate() - 30);
        return { from: toISO(past), to: toISO(today) };
      }
      case "Custom":
        return customRange.from && customRange.to
          ? { from: customRange.from, to: customRange.to }
          : { from: undefined, to: undefined };
      default:
        return { from: undefined, to: undefined };
    }
  };

  const fetchRequests = async () => {
    if (!employee?.empId) return;

    try {
      const { from, to } = computeDateRange();
      const res = await axiosInstance.get("/leave/all", {
        params: {
          managerId: employee.empId,
          status: filter, // "Pending" or "Approved"
          search: searchText || undefined,
          from,
          to,
        },
      });
      setRequests(res.data);
    } catch (err) {
      showToast("Failed to load requests", "error");
    }
  };

  // debounce search; refetch instantly for filter/date changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 300);
    return () => clearTimeout(timer);
  }, [employee, filter, dateFilter, customRange, searchText]);

  const handleFilter = (category) => setFilter(category);

  const handleSearch = (e) => setSearchText(e.target.value);

  const clearSearch = () => setSearchText("");

  const clearDateFilters = () => {
    setDateFilter("All");
    setCustomRange({ from: "", to: "" });
    setShowCustomBox(false);
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/leave/status/${id}`, null, {
        params: { status: "Approved" },
      });
      showToast("Request Approved ✅", "success");
      await fetchRequests();
      window.dispatchEvent(new Event("refreshPendingCount"));
    } catch (err) {
      const backendMsg =
        err.response?.data?.message || err.response?.data || "Something went wrong!";
      showToast(backendMsg, "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.delete(`/leave/${id}`);
      showToast("Request Rejected ❌", "success");
      await fetchRequests();
      window.dispatchEvent(new Event("refreshPendingCount"));
    } catch (err) {
      showToast("Failed to reject request!", "error");
    }
  };






  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Leave & Permission Requests</h2>

      <div className={styles.filterButtons}>
        {["Pending", "Approved"].map((category) => (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            className={`${styles.filterBtn} ${filter === category ? styles.active : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.filterBar}>
        <select
          value={dateFilter}
          onChange={(e) => {
            const value = e.target.value;
            setDateFilter(value);
            setShowCustomBox(value === "Custom");
          }}
          className={styles.filterSelect}
        >
          <option value="All">All Dates</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Custom">Custom Range</option>
        </select>

        <button className={styles.clearBtn} onClick={clearDateFilters}>
          Clear
        </button>
      </div>

      {showCustomBox && (
        <div className={styles.dateRangeBox}>
          <label>
            From:
            <input
              type="date"
              value={customRange.from}
              onChange={(e) => {
                const updated = { ...customRange, from: e.target.value };
                setCustomRange(updated);
                if (updated.from && updated.to) setShowCustomBox(false);
              }}
            />
          </label>
          <label>
            To:
            <input
              type="date"
              value={customRange.to}
              onChange={(e) => {
                const updated = { ...customRange, to: e.target.value };
                setCustomRange(updated);
                if (updated.from && updated.to) setShowCustomBox(false);
              }}
            />
          </label>
        </div>
      )}

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by employee name..."
          value={searchText}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        {searchText && (
          <button className={styles.clearButton} onClick={clearSearch} title="Clear">
            ✕
          </button>
        )}
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
            {requests.length === 0 ? (
              <tr>
                <td colSpan="13" className={styles.noData}>No requests found.</td>
              </tr>
            ) : (
              requests.map((r) => (
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
                  <td className={r.status === "Approved" ? styles.statusApproved : styles.statusPending}>
                    {r.status}
                  </td>
                  {filter !== "Approved" && r.status === "Pending" && (
                    <td>
                      <button className={styles.approveBtn} onClick={() => handleApprove(r.id)}>✓</button>
                      <button className={styles.rejectBtn} onClick={() => handleReject(r.id)}>✕</button>
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