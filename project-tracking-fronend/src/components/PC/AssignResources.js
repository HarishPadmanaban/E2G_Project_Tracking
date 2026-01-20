import React, { useEffect, useState } from "react";
import styles from "../../styles/Employee/LeavePermissionForm.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import { useToast } from "../../context/ToastContext";
import axiosInstance from "../axiosConfig";


const AssignActivityForm = () => {
  const { employee } = useEmployee();
  const managerId = employee?.empId;
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("assign");
  const [assignedWorks, setAssignedWorks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(assignedWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssignedWorks = assignedWorks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, assignedWorks]);


  const [formData, setFormData] = useState({
    projectId: "",
    activityType: "",
    activityId: "",
    employeeId: "",
    assignedActivity: "",
  });

  const { showToast } = useToast();

  const idToUse = employee.tl ? employee.reportingToId : employee.empId;


  // ✅ Fetch Projects
  useEffect(() => {
    if (!employee || !employee.reportingToId) return;

    axiosInstance
      .get(`/project/${idToUse}`) // Dummy API
      .then((res) => {


        setProjects(res.data);
      })
      .catch((err) => console.error(err));
  }, [managerId]);

  // ✅ Fetch Employees
  useEffect(() => {
    if (!formData.projectId) {
      setEmployees([]);
      return;
    }



    axiosInstance
      .get(`/project-assignment/employees/${formData.projectId}`)
      .then((res) => {

        if (res.data.length === 0) {
          // If no employees assigned to this project, get all employees under manager
          axiosInstance
            .get(`/employee/getbymgr?mgrid=${idToUse}`)
            .then((mgrRes) => setEmployees(mgrRes.data))
            .catch((err) => console.error("Error fetching employees under manager:", err));
        } else {
          setEmployees(res.data);
        }
      })
      .catch((err) => console.error("Error fetching project employees:", err));
  }, [formData.projectId, employee.reportingToId]);


  // ✅ Fetch Activities based on type
  useEffect(() => {
    axiosInstance
      .get("/activity/")
      .then((res) => {
        setActivities(res.data);
        setFilteredActivities(res.data); // default
      })
      .catch((err) => console.error("Error fetching activities:", err));
  }, []);

  useEffect(() => {
    if (activeTab !== "view") return;

    axiosInstance
      .get(`/assigned-work/manager/${idToUse}`)
      .then((res) => setAssignedWorks(res.data))
      .catch((err) => console.error("Error fetching assigned work:", err));
  }, [activeTab, idToUse]);


  const handlePendingRowClick = async (work) => {
    // ✔ Match any status that CONTAINS "PENDING"
    if (!work.status || !work.status.toUpperCase().includes("PENDING")) return;

    const confirm = window.confirm(
      "Do you wish to reassign the work?"
    );

    if (!confirm) return;

    try {
      await axiosInstance.post(
        "/notifications/create",
        null,
        {
          params: {
            senderId: idToUse,
            receiverId: work.employeeId,
            title: "Activity Reassign",
            message: `Manager wants to reassign the activity "${work.activityName}" for project "${work.projectName}".`,
            type: "REASSIGN_REQUEST",
          },
        }
      );

      showToast("📢 Reassign notification sent!", "success");
    } catch (error) {
      console.error(error);
      showToast("❌ Failed to send notification", "error");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "activityType") {
      const filtered = activities.filter(
        (act) =>
          act.mainType &&
          act.mainType.toLowerCase() === value.toLowerCase()
      );
      setFilteredActivities(filtered);
      setFormData((prev) => ({
        ...prev,
        activityType: value,
        activityId: "",
      }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assigned work?")) {
      try {
        await axiosInstance.delete(`/assigned-work/${id}`);
        showToast("🗑️ Assigned work deleted successfully!", "success");

        // Remove deleted work from the table
        const updated = assignedWorks.filter((e) => e.id !== id);
        setEmployees(updated);
        setAssignedWorks(updated);
      } catch (error) {
        showToast("Error deleting work!", "error");
      }
    }
  };



  const handleActivityChange = (e) => {
    const selectedActivity = activities.find((act) => act.id.toString() === e.target.value);

    setFormData((prev) => ({
      ...prev,
      activityId: e.target.value,
      category: selectedActivity ? selectedActivity.category : "",
    }));
  };


  // ✅ Submit
  const handleSubmit = () => {
    if (!formData.projectId || !formData.activityId || !formData.employeeId) {
      showToast("⚠ Please fill all required fields", "warning");
      return;
    }

    const payload = {
      projectId: Number(formData.projectId),
      activityId: Number(formData.activityId),
      employeeId: Number(formData.employeeId),
      managerId: Number(idToUse), // optional if backend expects it
      assignedById: Number(managerId), // optional
      description: formData.assignedActivity, // keep it as string
    };



    axiosInstance
      .post("/assigned-work", payload) // Dummy POST
      .then((res) => {
        showToast("✅ Activity Assigned Successfully", "success");
        setFormData({
          projectId: "",
          activityType: "",
          activityId: "",
          employeeId: "",
          assignedActivity: "",
        });
      })
      .catch((err) => {
        console.error(err);
        showToast("❌ Failed to assign activity", "error");
      });
  };

  const filteredAssignedWorks = assignedWorks.filter((work) => {
    const matchesStatus =
      statusFilter === "ALL" || work.status === statusFilter;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      work.projectName?.toLowerCase().includes(search) ||
      work.employeeName?.toLowerCase().includes(search) ||
      work.employeeId?.toString().includes(search);

    return matchesStatus && matchesSearch;
  });


  return (
    <div
      className={`${styles.container} ${activeTab === "view" ? styles.viewContainer : ""
        }`}
    >

      <h2>Activity Management</h2>

      <div className={styles.filterButtons}>
        <button
          onClick={() => setActiveTab("assign")}
          className={`${styles.filterBtn} ${activeTab === "assign" ? styles.active : ""}`}
        >
          Assign Work
        </button>

        <button
          className={`${styles.filterBtn} ${activeTab === "view" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("view")}
        >
          View Assigned Work
        </button>
      </div>


      {/* Project Dropdown */}
      {activeTab === "assign" && (<><div className={styles.fld}>
        <label>Select Project</label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.projectName}
            </option>
          ))}
        </select>
      </div>

        {/* Activity Type Dropdown */}
        <div className={styles.fld}>
          <label>Activity Type</label>
          <select
            name="activityType"
            value={formData.activityType}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="Modeling">Modeling</option>
            <option value="Checking">Checking</option>
            <option value="Detailing">Detailing</option>
            <option value="Studying">Studying</option>
            <option value="Common">Common</option>
          </select>
        </div>

        {/* Activity Dropdown */}
        <div className={styles.fld}>
          <label>Activity</label>
          <select name="activityId" value={formData.activityId} onChange={handleActivityChange}>
            <option value="">Select Activity</option>
            {filteredActivities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.activityName}
              </option>
            ))}
          </select>

        </div>

        {/* Employee Dropdown */}
        <div className={styles.fld}>
          <label>Assign To</label>
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.empId} value={e.empId}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned Hours */}
        <div className={styles.fld}>
          <label>Assign Activity</label>
          <input
            type="text"
            name="assignedActivity"
            value={formData.assignedActivity}
            onChange={handleChange}
            placeholder="Enter Activity"
          />
        </div>
      </>)}

      {activeTab === "assign" && <button className={styles.submitBtn} type="button" onClick={handleSubmit}>
        Assign
      </button>}

      {activeTab === "view" && (
        <div className={styles.viewContainer}>
          {/* Filters */}
          <div className={styles.topFilterRow}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search project or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            {/* Status Filter */}
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <button
                className={styles.clearBtn}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
              >
                Clear
              </button>
            </div>
          </div>


          {/* Table */}
          <table className={styles.projectsTable}>
            <thead>
              <tr>
                <th>Assigned Date</th>
                <th>Employee Name</th>
                <th>Project</th>
                <th>Assigned By</th>
                <th>Activity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssignedWorks.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.noData}>
                    No assigned work found.
                  </td>
                </tr>
              ) : (
                filteredAssignedWorks.map((work) => (
                  <tr
                    key={work.id}
                    onClick={() => handlePendingRowClick(work)}
                    className={
                      work.status?.toUpperCase().includes("PENDING")
                        ? styles.clickableRow
                        : ""
                    }
                  >

                    <td>{work.assignedDate}</td>
                    <td>{work.employeeName}</td>
                    <td>{work.projectName}</td>
                    <td>{work.assignedByName}</td>
                    <td>{work.activityName}</td>
                    <td>{work.description}</td>


                    <td
                      className={
                        work.status === "COMPLETED"
                          ? styles.statusCompleted
                          : styles.statusInProgress
                      }
                    >
                      {work.status.toUpperCase()}
                    </td>
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(work.id);
                        }}
                      >
                        🗑️
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {filteredAssignedWorks.length > itemsPerPage && (
            <div className={styles.paginationContainer}>
              <button
                className={styles.paginationBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                « Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                )
                .map((page, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className={styles.ellipsis}>...</span>
                        <button
                          className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ""
                            }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }

                  return (
                    <button
                      key={page}
                      className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ""
                        }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                className={styles.paginationBtn}
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next »
              </button>
            </div>
          )}


        </div>
      )}

    </div>
  );
};

export default AssignActivityForm;
