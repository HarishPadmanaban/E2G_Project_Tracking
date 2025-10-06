import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css"; // your CSS file
import axios from "axios";
import { useEmployee } from "../context/EmployeeContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // error messages

  const navigate = useNavigate();
  const { login } = useEmployee();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/employee/login",
        { username, password }
      );

      const employeeData = response.data;

      if (!employeeData) {
        setError("Invalid username or password");
        return;
      }

      login(employeeData);

      // Redirect based on role
      if (employeeData.isManager) {
        navigate("/manager", { replace: true });
      } else if (
        employeeData.designation === "Admin" ||
        employeeData.designation === "Assistant General Manager"
      ) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/employee/work", { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Something went wrong. Please try again later.");
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className={styles.companyHeader}>
          <h1 className={styles.companyName}>
            E2G ENGINEERING SERVICES PRIVATE LIMITED
          </h1>
      </div>
      <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>Employee Login</h2>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label className={styles.loginLabel} htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className={styles.loginInput}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.loginLabel} htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={styles.loginInput}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.loginBtn}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginForm;
