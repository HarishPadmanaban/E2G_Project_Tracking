import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null); 

  const login = (employeeData) => {
    setEmployee(employeeData); 
  };

  const logout = () => {
    setEmployee(null); 
  };

  return (
    <EmployeeContext.Provider value={{ employee, login, logout }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => useContext(EmployeeContext);
