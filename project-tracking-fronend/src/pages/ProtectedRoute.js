import React from "react";
import { Navigate } from "react-router-dom";
import { useEmployee } from "../context/EmployeeContext";

const ProtectedRoute = ({ children }) => {
  const { employee } = useEmployee();

  if (!employee) {
    return <Navigate to="/" replace />; // redirect to login
  }

  return children;
};

export default ProtectedRoute;
