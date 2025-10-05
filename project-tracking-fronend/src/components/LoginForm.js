import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import axios from "axios";
import { useEmployee } from "../context/EmployeeContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useEmployee();

  const handleLogin = async (e) => {
  e.preventDefault();
    console.log(username);
    console.log(password);

  try {
    const response = await axios.post("http://localhost:8080/employee/login" ,{username,password});

    const employee = response.data;
    login(employee); 
    console.log(response);
    console.log(employee);
    if (employee.isManager) {
      navigate("/manager");
    } else if (employee.designation === "Admin" || employee.designation === "Assistant General Manager") {
      navigate("/admin");
    } else {
      navigate("/employee/work");
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      alert("Invalid Credentials");
    } else {
      console.error(err);
    }
  }
};


  return (
    <div>

        <div className={styles.companyHeader}>
          <h1 className={styles.companyName}>E2G ENGINEERING SERVICES PRIVATE LIMITED</h1>
        </div>


        <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>

        {/* Login Box */}
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>LOGIN</h2>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label className={styles.loginLabel}>USER NAME</label>
              <input
                type="text"
                className={styles.loginInput}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.loginLabel}>PASSWORD</label>
              <input
                type="password"
                className={styles.loginInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className={styles.loginBtn}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>

    </div>
    
  );
};

export default LoginForm;