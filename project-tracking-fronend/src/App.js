
import React from 'react';
import Login from './pages/Login.js'
import {  Routes, Route } from 'react-router-dom';
import EmployeeWorkForm from './components/Employee/EmployeeWorkForm.js'
import LeavePermissionForm from './components/Employee/LeavePermissionForm.js';
import ProtectedRoute from './pages/ProtectedRoute.js';
import EmployeeNavbar from './components/Employee/EmployeeNavbar.js';
import { useEmployee } from './context/EmployeeContext.js';

function App() {

  const { employee,loading  } = useEmployee();

  //if (loading) return <p>Loading...Please Wait</p>;

  return (
    <div className="App">
      {employee && <EmployeeNavbar />} 
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee/work" element={
            <ProtectedRoute>
              <EmployeeWorkForm />
            </ProtectedRoute>} />
          <Route path="/employee/leave" element={<ProtectedRoute><LeavePermissionForm /></ProtectedRoute>} />
        </Routes>
    </div>
  );
}

export default App;
