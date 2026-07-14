import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import styles from "../../styles/Manager/ViewRequests.module.css";
import XLSX from "xlsx-js-style";


  const ViewApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [showCustomBox, setShowCustomBox] = useState(false);

  // fetch manager list once (or derive from a dedicated /employee/getallmanagers endpoint)
  useEffect(() => {
    axiosInstance.get("/employee/getallmanagers").then((res) => {
      const mgrMap = {};
      res.data.forEach((m) => {
        mgrMap[m.empId] = m.name;
      });
      setManagerList(mgrMap);
    });
  }, []);


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
    const { from, to } = computeDateRange();
    const res = await axiosInstance.get("/leave/all", {
      params: {
        managerId: selectedManager || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        from,
        to,
      },
    });
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedManager, statusFilter, dateFilter, customRange]);

  const clearFilters = () => {
    setSelectedManager("");
    setStatusFilter("All");
    setDateFilter("All");
    setCustomRange({ from: "", to: "" });
    setShowCustomBox(false);
  };


  

  const exportToExcel = () => {
    if (requests.length === 0) {
      alert("No data available to export!");
      return;
    }

    const worksheetData = requests.map((r) => ({
      Manager: r.managerName || "-",
      Employee: r.employeeName || "-",
      AppliedDate: r.appliedDate || "-",
      Type: r.type || "-",
      From: r.fromDate || "-",
      To: r.toDate || "-",
      LeaveType:
        r.type === "Leave" ? r.leaveType || "-" : "-",
      LeaveDays:
        r.type === "Leave" ? r.leaveDays || "-" : "-",
      PermissionInTime:
        r.type === "Permission" ? r.permissionInTime || "-" : "-",
      PermissionOutTime:
        r.type === "Permission" ? r.permissionOutTime || "-" : "-",
      PermissionHours:
        r.type === "Permission" ? r.permissionHours || "-" : "-",
      Reason: r.reason || "-",
      Status: r.status || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });

        if (!worksheet[cellAddress]) continue;

        if (R === 0) {
          worksheet[cellAddress].s = {
            font: {
              bold: true,
              sz: 12,
            },
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        } else {
          worksheet[cellAddress].s = {
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }
      }
    }

    // Auto-fit columns
    const colWidths = Object.keys(worksheetData[0]).map((key) => ({
      wch: Math.max(
        key.length + 5,
        ...worksheetData.map(
          (row) => String(row[key] || "").length + 3
        )
      ),
    }));

    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

    const managerName =
      selectedManager !== "All"
        ? selectedManager.replace(/\s+/g, "_")
        : "All_Managers";

    const statusName =
      statusFilter !== "All"
        ? statusFilter
        : "All_Status";

    const dateName =
      dateFilter !== "All"
        ? dateFilter.replace(/\s+/g, "_")
        : "All_Dates";

    const fileName = `Leave_Requests_${managerName}_${statusName}_${dateName}_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Leave Request Overview</h2>

      {/* Filters */}
      <div className="filterBarWrapper"></div>
      <div className={styles.filterBar}>
        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => {
            const value = e.target.value;
            setDateFilter(value);
            // show box only when "Custom" is chosen
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


        {/* Manager Filter */}
        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Managers</option>
  {Object.entries(managerList).map(([id, name]) => (
    <option key={id} value={id}>
      {name}
    </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Clear Button */}
        <button className={styles.clearBtn} onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Custom Date Picker - shows below menu */}
      {showCustomBox && (
        <div className={styles.dateRangeBox}>
          <div className={styles.dateInputs}>
            <label>
              From:
              <input
                type="date"
                value={customRange.from}
                onChange={(e) => {
                  const updated = { ...customRange, from: e.target.value };
                  setCustomRange(updated);
                  // ✅ Close when both dates selected
                  if (updated.from && updated.to) {
                    setShowCustomBox(false);
                  }
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
                  // ✅ Close when both dates selected
                  if (updated.from && updated.to) {
                    setShowCustomBox(false);
                  }
                }}
              />
            </label>
          </div>
        </div>
      )}

      <button className={styles.exportBtn} onClick={exportToExcel}>
        Export to Excel
      </button>


      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>Manager</th>
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
                  <td>{r.managerName || "-"}</td>
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
                        : r.status === "Rejected"
                          ? styles.statusRejected
                          : styles.statusPending
                    }
                  >
                    {r.status}
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

export default ViewApprovedRequests;