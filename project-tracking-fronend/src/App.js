
import React from 'react';
import Login from './pages/Login.js'
import {  Routes, Route } from 'react-router-dom';
import EmployeeWorkForm from './components/Employee/EmployeeWorkForm.js'
import LeavePermissionForm from './components/Employee/LeavePermissionForm.js';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee/work" element={<EmployeeWorkForm />} />
          <Route path="/employee/leave" element={<LeavePermissionForm />} />
        </Routes>
    </div>
  );
}

export default App;
