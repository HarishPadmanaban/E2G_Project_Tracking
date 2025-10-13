import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useEmployee } from "../context/EmployeeContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { employee } = useEmployee();
  const navigate = useNavigate();

  useEffect(() => {
  if (!employee) return;

  if (employee.manager) {
    navigate("/manager/work", { replace: true });
  } else if (
    employee.designation === "Admin" ||
    employee.designation === "Assistant General Manager"
  ) {
    navigate("/admin", { replace: true });
  } else {
    navigate("/employee/work", { replace: true });
  }
}, [employee, navigate]);

  return <LoginForm />;
};

export default Login;