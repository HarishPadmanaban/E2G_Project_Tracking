
import React from 'react';
import Login from './pages/Login.js'
import { Routes, Route } from 'react-router-dom';
import EmployeeWorkForm from './components/Employee/EmployeeWorkForm.js'
import LeavePermissionForm from './components/Employee/LeavePermissionForm.js';
import ProtectedRoute from './pages/ProtectedRoute.js';
import EmployeeNavbar from './components/Employee/EmployeeNavbar.js';
import { useEmployee } from './context/EmployeeContext.js';
import ManagerDashboard from './components/Manager/ManagerDashboard.js';
import ManagerNavbar from './components/Manager/ManagerNavbar.js';
import WorkPivotTable from './components/Manager/WorkPivotTable.js';
import ViewRequests from './components/Manager/ViewRequests.js';
import ViewApprovedRequests from './components/AGM/ViewApprovedRequests.js';
import EmployeeManagementPage from './components/AGM/EmployeeManagementPage.js';
import ProjectAssignmentForm from './components/Manager/ProjectAssignmentForm.js';

  const Unauthorized = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Access Denied 🚫</h1>
    <p>You do not have permission to view this page.</p>
  </div>
);

function App() {

  const { employee, loading } = useEmployee();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            border: "6px solid #e2e8f0",
            borderTop: "6px solid #2563eb",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        />
        <p
          style={{
            fontSize: "18px",
            color: "#2d3748",
            fontWeight: 500,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Loading... Please wait
        </p>

        {/* Add the animation keyframes inline using a <style> tag */}
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
      </div>
    );
  }


  return (
    <div className="App">
      {employee && !employee.manager && employee.designation !== "Assistant General Manager" && <EmployeeNavbar />}
{employee && employee.manager && employee.designation !== "Assistant General Manager" && <ManagerNavbar />}
{employee && employee.designation === "Assistant General Manager" && <ManagerNavbar />}

      <Routes>
        <Route path="/" element={<Login />} />        
        <Route
  path="/manager/assign-project"
  element={
    <ProtectedRoute allowedRoles={["Assistant General Manager", "Admin"]}>
      <EmployeeManagementPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/view-approved-request"
  element={
    <ProtectedRoute allowedRoles={["Assistant General Manager","Project Manager", "Admin"]}>
      <ViewApprovedRequests />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/analysis"
  element={
    <ProtectedRoute allowedRoles={["Project Manager", "Admin", "Assistant General Manager"]}>
      <WorkPivotTable />
    </ProtectedRoute>
  }
/>

<Route
    path="/manager/assign-tl"
    element={
      <ProtectedRoute allowedRoles={["Project Manager"]}>
        <ProjectAssignmentForm />
      </ProtectedRoute>
    }
  />

<Route
  path="/manager/view-requests"
  element={
    <ProtectedRoute allowedRoles={["Project Manager", "Assistant General Manager"]}>
      <ViewRequests />
    </ProtectedRoute>
  }
/>

        <Route path="/employee/work" element={
      <ProtectedRoute excludedRoles={["Project Manager", "Admin", "Assistant General Manager"]}>
            <EmployeeWorkForm />
          </ProtectedRoute>} />
        <Route path="/employee/leave" element={      <ProtectedRoute excludedRoles={["Assistant General Manager"]}>
<LeavePermissionForm /></ProtectedRoute>} />
        <Route path="/manager/work" element={
          <ProtectedRoute allowedRoles={["Assistant General Manager","Project Manager", "Admin"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </div>
  );
}

export default App;
