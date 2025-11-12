// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "../../styles/Employee/LeavePermissionForm.module.css";

// const EditEmployee = () => {
//   const [employees, setEmployees] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [formData, setFormData] = useState({
//     empId: "",
//     name: "",
//     designation: "",
//     reportingTo: "",
//     username: "",
//     password: "",
//   });

//   const designations = [
//     "Assistant General Manager",
//     "Project Manager",
//     "Admin",
//     "Project Coordinator",
//     "Employee",
//   ];

//   useEffect(() => {
//     fetchEmployees();
//     fetchManagers();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/employee/getallemployees");
//       setEmployees(res.data);
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     }
//   };

//   const fetchManagers = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/employee/getallmanagers");
//       setManagers(res.data);
//     } catch (error) {
//       console.error("Error fetching managers:", error);
//     }
//   };

//   const handleEdit = (emp) => {
//     setEditingEmployee(emp.id);
//     setFormData({
//       empId: emp.empId,
//       name: emp.name,
//       designation: emp.designation,
//       reportingTo: emp.reportingTo?.id || "",
//       username: emp.username,
//       password: emp.password || "",
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async () => {
//     if (!formData.empId.trim() || !formData.name.trim()) {
//       alert("⚠️ Please fill all required fields.");
//       return;
//     }

//     try {
//       const payload = {
//         empId: formData.empId,
//         name: formData.name,
//         designation: formData.designation,
//         username: formData.username,
//         password: formData.password,
//         reportingTo: { id: formData.reportingTo },
//         isManager: ["Project Manager", "Assistant General Manager"].includes(formData.designation),
//         isTL: formData.designation === "Project Coordinator",
//       };

//       await axios.put(`http://localhost:8080/employee/update/${editingEmployee}`, payload);
//       alert("✅ Employee updated successfully!");
//       setEditingEmployee(null);
//       fetchEmployees();
//     } catch (error) {
//       console.error(error);
//       alert("❌ Failed to update employee");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Edit Employees</h2>

//       {/* Employee Table */}
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Emp ID</th>
//             <th>Name</th>
//             <th>Designation</th>
//             <th>Manager</th>
//             <th>Username</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employees.map((emp) => (
//             <tr key={emp.id}>
//               <td>{emp.empId}</td>
//               <td>{emp.name}</td>
//               <td>{emp.designation}</td>
//               <td>{emp.reportingTo?.name || "—"}</td>
//               <td>{emp.username}</td>
//               <td>
//                 <button
//                   className={styles.submitBtn}
//                   onClick={() => handleEdit(emp)}
//                 >
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Edit Form */}
//       {editingEmployee && (
//         <div className={styles.formPopup}>
//           <h3>Edit Employee Details</h3>

//           <div className={styles.fld}>
//             <label>Employee ID</label>
//             <input type="text" name="empId" value={formData.empId} onChange={handleChange} />
//           </div>

//           <div className={styles.fld}>
//             <label>Full Name</label>
//             <input type="text" name="name" value={formData.name} onChange={handleChange} />
//           </div>

//           <div className={styles.fld}>
//             <label>Designation</label>
//             <select name="designation" value={formData.designation} onChange={handleChange}>
//               <option value="">Select Designation</option>
//               {designations.map((d, i) => (
//                 <option key={i} value={d}>{d}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles.fld}>
//             <label>Reporting Manager</label>
//             <select name="reportingTo" value={formData.reportingTo} onChange={handleChange}>
//               <option value="">Select Manager</option>
//               {managers.map((m) => (
//                 <option key={m.id} value={m.id}>
//                   {m.name} ({m.designation})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className={styles.fld}>
//             <label>Username</label>
//             <input type="text" name="username" value={formData.username} onChange={handleChange} />
//           </div>

//           <div className={styles.fld}>
//             <label>Password</label>
//             <input type="password" name="password" value={formData.password} onChange={handleChange} />
//           </div>

//           <div>
//             <button className={styles.submitBtn} onClick={handleUpdate}>Save Changes</button>
//             <button className={styles.cancelBtn} onClick={() => setEditingEmployee(null)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditEmployee;


import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/AGM/EditProject.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import AddEmployeeForm from './AddEmployeeForm';
import { useToast } from "../../context/ToastContext";

const designationToRole = {
  "Assistant General Manager": "Manager",
  "Project Manager": "Manager",
  "Admin": "Admin",
  "Project Coordinator": "Coordinator",
  "Senior Checker": "Checker",
  "Junior Checker": "Checker",
  "Senior Detailer": "Detailer",
  "Junior Detailer": "Detailer",
  "Senior Modeller": "Modeller",
  "Junior Modeller": "Modeller"
};


const EditEmployee = () => {
  const { employee, loading } = useEmployee();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {showToast} = useToast();

  const [designations] = useState([
    "Assistant General Manager",
    "Project Manager",
    "Project Coordinator",
    "Admin",
    "Senior Checker",
    "Junior Checker",
    "Senior Detailer",
    "Junior Detailer",
    "Senior Modeller",
    "Junior Modeller"
  ]);

  const [managerList, setManagerList] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    empId: "",
    name: "",
    designation: "",
    reportingTo: "",
    isManager: false,
    isTL: false,
    username: "",
    password: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !employee) navigate("/");
  }, [employee, loading, navigate]);

  // Fetch employees + managers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await axios.get("http://localhost:8080/employee/getallemployees");
        setEmployees(empRes.data);
        setFilteredEmployees(empRes.data);

        const mgrRes = await axios.get("http://localhost:8080/employee/getallmanagers");
        setManagerList(mgrRes.data);
      } catch (err) {
        console.error("❌ Failed to fetch employees:", err);
      }
    };
    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let data = [...employees];

    if (selectedDesignation !== "All") {
      data = data.filter((emp) => emp.designation === selectedDesignation);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (e) =>
          e.name?.toLowerCase().includes(term) ||
          String(e.empId).toLowerCase().includes(term)
          ||
          e.designation?.toLowerCase().includes(term)
      );
    }

    data.sort((a, b) => a.id - b.id);
    setFilteredEmployees(data);
  }, [searchTerm, selectedDesignation, employees]);

  // Clear filters
  const clearFilters = () => {
    setSelectedDesignation("All");
    setSearchTerm("");
    setFilteredEmployees(employees);
  };

  // Handle edit click
  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      id: emp.id,
      empId: emp.empId,
      name: emp.name,
      designation: emp.designation,
      reportingTo: emp.reportingTo?.empId || "",
      isManager: emp.manager,
      isTL: emp.tl,
      username: emp.username || "",
      password: emp.password || "",
    });
    setIsViewing(false);  // ✅ make sure View is closed
    setIsEditing(true);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeClick = (empId) => {
    axios
      .get(`http://localhost:8080/project-assignment/projects/${empId}`)
      .then((res) => {
        setSelectedProjects(res.data);
        setShowModal(true);
      })
      .catch((err) => console.error("Error fetching employee projects:", err));
  };

  // Save employee changes
  const handleSave = async () => {
    try {
      const role = designationToRole[formData.designation] || "Employee";
      const payload = {
        empId: Number(formData.empId),
        name: formData.name,
        designation: formData.designation,
        designationCategory: role,
        isManager: ["Project Manager", "Assistant General Manager"].includes(formData.designation),
        isTL: formData.designation === "Project Coordinator",
        username: formData.username,
        password: formData.password,
        reportingTo:
          formData.reportingTo === ""
            ? null
            : { empId: Number(formData.reportingTo) },
      };
      console.log(payload);


      await axios.put("http://localhost:8080/employee/editemployee", payload);
      showToast("✅ Employee updated successfully!","success");
      setSelectedEmployee(null);

      // Refresh list
      const refreshed = await axios.get("http://localhost:8080/employee/getallemployees");
      setEmployees(refreshed.data);
      setFilteredEmployees(refreshed.data);
    } catch (error) {
      console.error("❌ Error updating employee:", error);
      showToast("Error updating employee!","error");
    }
  };

  console.log(filteredEmployees);

  return (
    <div className={styles.tableContainer}>
      {<h2 className={styles.title}>Employee Management</h2>}

      {!selectedEmployee && (
        <>
          {/* Filters */}
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search employee name, ID, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="All">All Designations</option>
              {designations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button className={styles.clearBtn} onClick={clearFilters}>
              Clear Filters
            </button>
            <button
              className={styles.addBtn}
              onClick={() => navigate("/manager/add-employee")}
            >
              + Add Employee
            </button>
          </div>

          {/* Employees Table */}
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Reporting To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.noData}>
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} >
                    <td onClick={() => handleEmployeeClick(emp.empId)}>{emp.empId}</td>
                    <td onClick={() => handleEmployeeClick(emp.empId)}>{emp.name}</td>
                    <td onClick={() => handleEmployeeClick(emp.empId)}>{emp.designation}</td>
                    <td onClick={() => handleEmployeeClick(emp.empId)}>{emp.reportingTo?.name || "--"}</td>                    
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(emp)}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {selectedEmployee && (
        <div className={styles.formContainer}>
          <button
            className={styles.backbtn}
            onClick={() => { setSelectedEmployee(null); setIsEditing(false); }}
          >
            Back
          </button>
          <h3 className={styles.formTitle}>Edit Employee Details</h3>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Employee ID</label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className={styles.formField}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              >
                <option value="">Select Designation</option>
                {designations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label>Reporting Manager</label>
              <select
                name="reportingTo"
                value={formData.reportingTo}
                onChange={handleChange}
              >
                <option value="">Select Manager</option>
                {managerList.map((m) => (
                  <option key={m.id} value={m.empId}>
                    {m.name} ({m.designation})
                  </option>
                ))}
              </select>
            </div>


          </div>

          <div className={styles.formActions}>
            <button className={styles.actionBtn} onClick={handleSave}>
              Save
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setSelectedEmployee(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Projects Working</h3>
            <table className={styles.memberTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedProjects.length === 0 ? (
                  <tr>
                    <td colSpan="13" className={styles.noData}>
                      No records found.
                    </td>
                  </tr>
                ) : (

                  selectedProjects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.id}</td>
                      <td>{project.projectName}</td>
                    </tr>
                  ))

                )}
              </tbody>
            </table>

            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>)}
    </div>
  );
};

export default EditEmployee;
