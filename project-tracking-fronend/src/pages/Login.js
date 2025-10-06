import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useEmployee } from "../context/EmployeeContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { employee } = useEmployee();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to employee work page
    if (employee) {
      navigate("/employee/work", { replace: true });
    }
  }, [employee, navigate]);

  return <LoginForm />;
};

export default Login;