// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "../../styles/AGM/EditProject.module.css";
// import { useEmployee } from "../../context/EmployeeContext";
// import { useNavigate } from "react-router-dom";

// const EditWorkDetails = () => {
//     const { employee, loading } = useEmployee();
//     const navigate = useNavigate();

//     const [workDetails, setWorkDetails] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [selectedWork, setSelectedWork] = useState(null);
//     const [managerList, setManagerList] = useState([]);
//     const [projectList, setProjectList] = useState([]);
//     const [filters, setFilters] = useState({
//         manager: "All",
//         project: "All",
//         dateFrom: "",
//         dateTo: "",
//         search: "",
//     });

//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const recordsPerPage = 20;

//     useEffect(() => {
//         const fetchWorkDetails = async () => {
//             try {
//                 // ✅ API call to backend
//                 const response = await axios.get("http://localhost:8080/workdetails/all");

//                 // assuming response.data is an array of objects like the one you shared
//                 const data = response.data;

//                 // sort by date (latest first)
//                 const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));

//                 setWorkDetails(sorted);
//                 setFilteredData(sorted);

//                 // Extract unique managers and projects
//                 const managers = [...new Set(sorted.map((w) => w.managerName))];
//                 const projects = [...new Set(sorted.map((w) => w.projectName))];
//                 setManagerList(managers);
//                 setProjectList(projects);
//             } catch (error) {
//                 console.error("❌ Failed to fetch work details:", error);
//             }
//         };

//         fetchWorkDetails();
//     }, []);


//     useEffect(() => {
//         let data = [...workDetails];

//         if (filters.manager !== "All") {
//             data = data.filter((w) => w.managerName === filters.manager);
//         }

//         if (filters.project !== "All") {
//             data = data.filter((w) => w.projectName === filters.project);
//         }

//         if (filters.dateFrom && filters.dateTo) {
//             const from = new Date(filters.dateFrom);
//             const to = new Date(filters.dateTo);
//             data = data.filter((w) => {
//                 const workDate = new Date(w.date);
//                 return workDate >= from && workDate <= to;
//             });
//         } else if (filters.dateFrom) {
//             const from = new Date(filters.dateFrom);
//             data = data.filter((w) => new Date(w.date) >= from);
//         } else if (filters.dateTo) {
//             const to = new Date(filters.dateTo);
//             data = data.filter((w) => new Date(w.date) <= to);
//         }

//         if (filters.search.trim() !== "") {
//             const term = filters.search.toLowerCase();
//             data = data.filter(
//                 (w) =>
//                     w.employeeName.toLowerCase().includes(term) ||
//                     w.projectName.toLowerCase().includes(term) ||
//                     w.managerName.toLowerCase().includes(term)
//             );
//         }

//         data.sort((a, b) => new Date(b.date) - new Date(a.date));
//         setFilteredData(data);
//         setCurrentPage(1); // reset to page 1 when filters change
//     }, [filters, workDetails]);

//     const clearFilters = () => {
//         setFilters({
//             manager: "All",
//             project: "All",
//             dateFrom: "",
//             dateTo: "",
//             search: "",
//         });
//         setFilteredData(workDetails);
//         setCurrentPage(1);
//     };

//     const handleViewDetails = (work) => {
//         setSelectedWork(work);
//     };

//     // Pagination Logic
//     const totalPages = Math.ceil(filteredData.length / recordsPerPage);
//     const startIndex = (currentPage - 1) * recordsPerPage;
//     const currentRecords = filteredData.slice(
//         startIndex,
//         startIndex + recordsPerPage
//     );

//     const handlePageChange = (pageNum) => {
//         if (pageNum >= 1 && pageNum <= totalPages) {
//             setCurrentPage(pageNum);
//         }
//     };

//     return (
//         <div className={styles.tableContainer}>
//             <h2 className={styles.title}>Work Details Management</h2>

//             {!selectedWork && (
//                 <>
//                     <div className={styles.filterBar}>
//                         <div className={styles.searchBox}>
//                             <input
//                                 type="text"
//                                 placeholder="Search employee, project, or manager..."
//                                 value={filters.search}
//                                 onChange={(e) =>
//                                     setFilters({ ...filters, search: e.target.value })
//                                 }
//                                 className={styles.searchInput}
//                             />
//                         </div>

//                         <select
//                             value={filters.manager}
//                             onChange={(e) =>
//                                 setFilters({ ...filters, manager: e.target.value })
//                             }
//                             className={styles.filterSelect}
//                         >
//                             <option value="All">All Managers</option>
//                             {managerList.map((m) => (
//                                 <option key={m} value={m}>
//                                     {m}
//                                 </option>
//                             ))}
//                         </select>

//                         <select
//                             value={filters.project}
//                             onChange={(e) =>
//                                 setFilters({ ...filters, project: e.target.value })
//                             }
//                             className={styles.filterSelect}
//                         >
//                             <option value="All">All Projects</option>
//                             {projectList.map((p) => (
//                                 <option key={p} value={p}>
//                                     {p}
//                                 </option>
//                             ))}
//                         </select>

//                         <div className={styles.dateRange}>
//                             <label>From: </label>
//                             <input
//                                 type="date"
//                                 value={filters.dateFrom}
//                                 onChange={(e) =>
//                                     setFilters({ ...filters, dateFrom: e.target.value })
//                                 }
//                                 className={styles.filterSelect}
//                             />
//                             <label>To: </label>
//                             <input
//                                 type="date"
//                                 value={filters.dateTo}
//                                 onChange={(e) =>
//                                     setFilters({ ...filters, dateTo: e.target.value })
//                                 }
//                                 className={styles.filterSelect}
//                             />
//                         </div>

//                         <button className={styles.clearBtn} onClick={clearFilters}>
//                             Clear Filters
//                         </button>
//                     </div>

//                     <table className={styles.detailsTable}>
//                         <thead>
//                             <tr>
//                                 <th>Date</th>
//                                 <th>Employee</th>
//                                 <th>Project</th>
//                                 <th>Manager</th>
//                                 <th>Total Hours</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {currentRecords.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className={styles.noData}>
//                                         No records found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 currentRecords.map((w) => (
//                                     <tr key={w.id}>
//                                         <td>{w.date}</td>
//                                         <td>{w.employeeName}</td>
//                                         <td>{w.projectName}</td>
//                                         <td>{w.managerName}</td>
//                                         <td>{w.workHours}</td>
//                                         <td>
//                                             <button
//                                                 className={styles.actionBtn}
//                                                 onClick={() => handleViewDetails(w)}
//                                             >
//                                                 View Details
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>

//                     {/* ✅ Compact Pagination Section */}
//                     <div className={styles.paginationContainer}>
//                         <button
//                             className={styles.pageBtn}
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             disabled={currentPage === 1}
//                         >
//                             Previous
//                         </button>

//                         {(() => {
//                             const pages = [];
//                             const maxVisible = 2; // show ±2 around current page

//                             for (let i = 1; i <= totalPages; i++) {
//                                 if (
//                                     i === 1 || // always show first page
//                                     i === totalPages || // always show last page
//                                     (i >= currentPage - maxVisible && i <= currentPage + maxVisible)
//                                 ) {
//                                     pages.push(
//                                         <button
//                                             key={i}
//                                             onClick={() => handlePageChange(i)}
//                                             className={`${styles.pageBtn} ${currentPage === i ? styles.activePage : ""
//                                                 }`}
//                                         >
//                                             {i}
//                                         </button>
//                                     );
//                                 } else if (
//                                     (i === currentPage - maxVisible - 1 && i > 1) ||
//                                     (i === currentPage + maxVisible + 1 && i < totalPages)
//                                 ) {
//                                     pages.push(
//                                         <span key={`dots-${i}`} className={styles.ellipsis}>
//                                             …
//                                         </span>
//                                     );
//                                 }
//                             }

//                             return pages;
//                         })()}

//                         <button
//                             className={styles.pageBtn}
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             disabled={currentPage === totalPages}
//                         >
//                             Next
//                         </button>

//                         <span className={styles.pageInfo}>
//                             Page {currentPage} of {totalPages}
//                         </span>
//                     </div>

//                 </>
//             )}

//             {selectedWork && (
//                 <div className={styles.viewSection}>
//                     <h3>Work Details</h3>
//                     <p>
//                         <strong>Date:</strong> {selectedWork.date}
//                     </p>
//                     <p>
//                         <strong>Employee:</strong> {selectedWork.employeeName}
//                     </p>
//                     <p>
//                         <strong>Project:</strong> {selectedWork.projectName}
//                     </p>
//                     <p>
//                         <strong>Manager:</strong> {selectedWork.managerName}
//                     </p>
//                     <p>
//                         <strong>Total Hours:</strong> {selectedWork.totalHours}
//                     </p>

//                     <button
//                         className={styles.clearBtn}
//                         onClick={() => setSelectedWork(null)}
//                     >
//                         Back
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EditWorkDetails;
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/AGM/EditProject.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import ViewWorkDetails from "./ViewWorkDetails"; // ✅ import your ViewWorkForm component

const EditWorkDetails = () => {
  const { employee, loading } = useEmployee();

  const [workDetails, setWorkDetails] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [filters, setFilters] = useState({
    manager: "All",
    project: "All",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // ✅ For showing ViewWorkForm
  const [selectedWork, setSelectedWork] = useState(null);

  useEffect(() => {
    const fetchWorkDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/workdetails/all");
        const data = response.data;
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWorkDetails(sorted);
        setFilteredData(sorted);

        const managers = [...new Set(sorted.map((w) => w.managerName))];
        const projects = [...new Set(sorted.map((w) => w.projectName))];
        setManagerList(managers);
        setProjectList(projects);
      } catch (error) {
        console.error("❌ Failed to fetch work details:", error);
      }
    };

    fetchWorkDetails();
  }, []);

  useEffect(() => {
    let data = [...workDetails];

    if (filters.manager !== "All") {
      data = data.filter((w) => w.managerName === filters.manager);
    }

    if (filters.project !== "All") {
      data = data.filter((w) => w.projectName === filters.project);
    }

    if (filters.dateFrom && filters.dateTo) {
      const from = new Date(filters.dateFrom);
      const to = new Date(filters.dateTo);
      data = data.filter((w) => {
        const workDate = new Date(w.date);
        return workDate >= from && workDate <= to;
      });
    } else if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      data = data.filter((w) => new Date(w.date) >= from);
    } else if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      data = data.filter((w) => new Date(w.date) <= to);
    }

    if (filters.search.trim() !== "") {
      const term = filters.search.toLowerCase();
      data = data.filter(
        (w) =>
          w.employeeName.toLowerCase().includes(term) ||
          w.projectName.toLowerCase().includes(term) ||
          w.managerName.toLowerCase().includes(term)
      );
    }

    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredData(data);
    setCurrentPage(1);
  }, [filters, workDetails]);

  const clearFilters = () => {
    setFilters({
      manager: "All",
      project: "All",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
    setFilteredData(workDetails);
    setCurrentPage(1);
  };

  // ✅ When clicking "View/Edit", render ViewWorkForm
  const handleViewDetails = (work) => {
    setSelectedWork(work);
  };

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredData.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  if (loading) return <p>Loading...</p>;

  // ✅ If a record is selected, show ViewWorkForm
  if (selectedWork) {
    console.log(selectedWork);
    const handleWorkUpdated = (updatedWork) => {
  setWorkDetails((prev) =>
    prev.map((w) => (w.id === updatedWork.id ? { ...w, ...updatedWork } : w))
  );
  setFilteredData((prev) =>
    prev.map((w) => (w.id === updatedWork.id ? { ...w, ...updatedWork } : w))
  );

  // ✅ Also update selectedWork in case you go back immediately
  setSelectedWork(updatedWork);
};

    return (
  <ViewWorkDetails
    work={selectedWork}
    onBack={() => setSelectedWork(null)}
    onUpdate={(updatedWork) => handleWorkUpdated(updatedWork)} // ✅ new prop
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
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className={styles.searchInput}
          />
        </div>

        <select
          value={filters.manager}
          onChange={(e) => setFilters({ ...filters, manager: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="All">All Managers</option>
          {managerList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="All">All Projects</option>
          {projectList.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <div className={styles.dateRange}>
          <label>From: </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
            className={styles.filterSelect}
          />
          <label>To: </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              setFilters({ ...filters, dateTo: e.target.value })
            }
            className={styles.filterSelect}
          />
        </div>

        <button className={styles.clearBtn} onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* ✅ Work Table */}
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
          {currentRecords.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.noData}>
                No records found.
              </td>
            </tr>
          ) : (
            currentRecords.map((w) => (
              <tr key={w.id}>
                <td>{w.date}</td>
                <td>{w.employeeName}</td>
                <td>{w.projectName}</td>
                <td>{w.managerName}</td>
                <td>{w.workHours}</td>
                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleViewDetails(w)}
                  >
                    View / Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Pagination */}
      <div className={styles.paginationContainer}>
        <button
          className={styles.pageBtn}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {(() => {
          const pages = [];
          const maxVisible = 2;

          for (let i = 1; i <= totalPages; i++) {
            if (
              i === 1 ||
              i === totalPages ||
              (i >= currentPage - maxVisible && i <= currentPage + maxVisible)
            ) {
              pages.push(
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`${styles.pageBtn} ${
                    currentPage === i ? styles.activePage : ""
                  }`}
                >
                  {i}
                </button>
              );
            } else if (
              (i === currentPage - maxVisible - 1 && i > 1) ||
              (i === currentPage + maxVisible + 1 && i < totalPages)
            ) {
              pages.push(
                <span key={`dots-${i}`} className={styles.ellipsis}>
                  …
                </span>
              );
            }
          }
          return pages;
        })()}

        <button
          className={styles.pageBtn}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default EditWorkDetails;
