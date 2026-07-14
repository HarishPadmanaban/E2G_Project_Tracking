import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import styles from "../../styles/AGM/EditProject.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import ViewWorkDetails from "./ViewWorkDetails";

const EditWorkDetails = () => {
  const employee = JSON.parse(sessionStorage.getItem("employee"));

  const [workDetails, setWorkDetails] = useState([]); // current page's rows
  const [managers, setManagers] = useState({}); // { empId: name }
  const [projects, setProjects] = useState([]); // [{ id, projectName }]

  const [filters, setFilters] = useState({
    managerId: "",
    projectId: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(0); // zero-indexed
  const [totalPages, setTotalPages] = useState(0);
  const recordsPerPage = 20;

  const [selectedWork, setSelectedWork] = useState(null);

  // Fetch manager list once
  useEffect(() => {
    axiosInstance.get("/employee/getallmanagers").then((res) => {
      const mgrMap = {};
      res.data.forEach((m) => (mgrMap[m.empId] = m.name));
      setManagers(mgrMap);
    });
  }, []);

  // Fetch project list, scoped to selected manager
  useEffect(() => {
    const endpoint = filters.managerId
      ? `/project/all/${filters.managerId}`
      : `/project/all`;

    axiosInstance.get(endpoint).then((res) => {
      setProjects(res.data);
      // reset project filter if it's no longer valid for this manager
      if (filters.projectId && !res.data.some((p) => p.id === Number(filters.projectId))) {
        setFilters((prev) => ({ ...prev, projectId: "" }));
      }
    });
  }, [filters.managerId]);

  const fetchWorkDetails = async () => {
    try {
      const res = await axiosInstance.get("/workdetails/filtered", {
        params: {
          managerId: filters.managerId || undefined,
          projectId: filters.projectId || undefined,
          from: filters.dateFrom || undefined,
          to: filters.dateTo || undefined,
          search: filters.search || undefined,
          page: currentPage,
          size: recordsPerPage,
        },
      });
      setWorkDetails(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  // Debounced fetch on any filter/page change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkDetails();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, currentPage]);

  // Reset to page 0 whenever a filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [filters.managerId, filters.projectId, filters.dateFrom, filters.dateTo, filters.search]);

  const clearFilters = () => {
    setFilters({ managerId: "", projectId: "", dateFrom: "", dateTo: "", search: "" });
  };

  const handleViewDetails = (work) => setSelectedWork(work);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) setCurrentPage(pageNum);
  };



  if (selectedWork) {
    const handleWorkUpdated = (updatedWork) => {
      setWorkDetails((prev) =>
        prev.map((w) => (w.id === updatedWork.id ? { ...w, ...updatedWork } : w))
      );
      setSelectedWork(updatedWork);
    };

    return (
      <ViewWorkDetails
        work={selectedWork}
        onBack={() => setSelectedWork(null)}
        onUpdate={handleWorkUpdated}
      />
    );
  }

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>Work Details Management</h2>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search employee, project, or manager..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className={styles.searchInput}
          />
        </div>

        <select
          value={filters.managerId}
          onChange={(e) => setFilters({ ...filters, managerId: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="">All Managers</option>
          {Object.entries(managers).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select
          value={filters.projectId}
          onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.projectName}</option>
          ))}
        </select>

        <div className={styles.dateRange}>
          <label>From: </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className={styles.filterSelect}
          />
          <label>To: </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className={styles.filterSelect}
          />
        </div>

        <button className={styles.clearBtn} onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <table className={styles.detailsTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Project</th>
            <th>Manager</th>
            <th>Total Hours</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workDetails.length === 0 ? (
            <tr><td colSpan="6" className={styles.noData}>No records found.</td></tr>
          ) : (
            workDetails.map((w) => (
              <tr key={w.id}>
                <td>{w.date}</td>
                <td>{w.employeeName}</td>
                <td>{w.projectName}</td>
                <td>{w.managerName}</td>
                <td>{w.workHours}</td>
                <td>
                  <button className={styles.actionBtn} onClick={() => handleViewDetails(w)}>
                    View / Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.paginationContainer}>
        <button
          className={styles.pageBtn}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>

        {(() => {
          const pages = [];
          const maxVisible = 2;
          for (let i = 0; i < totalPages; i++) {
            if (
              i === 0 ||
              i === totalPages - 1 ||
              (i >= currentPage - maxVisible && i <= currentPage + maxVisible)
            ) {
              pages.push(
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`${styles.pageBtn} ${currentPage === i ? styles.activePage : ""}`}
                >
                  {i + 1}
                </button>
              );
            } else if (
              (i === currentPage - maxVisible - 1 && i > 0) ||
              (i === currentPage + maxVisible + 1 && i < totalPages - 1)
            ) {
              pages.push(<span key={`dots-${i}`} className={styles.ellipsis}>…</span>);
            }
          }
          return pages;
        })()}

        <button
          className={styles.pageBtn}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>

        <span className={styles.pageInfo}>
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default EditWorkDetails;