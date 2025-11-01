import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    console.log(employeeId);
    if (employeeId) {
  axios
    .get("http://localhost:8080/employee/get", {
      params: { id: employeeId },
    })
    .then((res) => setEmployee(res.data))
    .catch(() => setEmployee(null))
    .finally(() => setLoading(false));
} else {
  setLoading(false);
}
  }, []);

  const login = (employeeData) => {
    console.log(employeeData)
    setEmployee(employeeData);
    // Store only the internal primary key in localStorage
    localStorage.setItem("employeeId", employeeData.empId);
};

  const logout = () => {
  setEmployee(null);
  localStorage.removeItem("employeeId");

  // Clear browser history by replacing current state
  navigate("/", { replace: true });

  // Prevent going back to employee routes
  window.history.pushState(null, "", window.location.pathname);
};


  return (
    <EmployeeContext.Provider value={{ employee, login, logout, loading }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => useContext(EmployeeContext);
