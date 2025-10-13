import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/Employee/EmployeeNavbar.module.css";
import { useEmployee } from "../../context/EmployeeContext";

const ManagerNavbar = () => {
  const navigate = useNavigate();
  const { employee, logout } = useEmployee();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBack = () => {
    if (window.location.pathname === "/manager/work") return;
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
  const handleOutsideClick = (e) => {
    if (
      !e.target.closest(`.${styles.sidebarMenu}`) &&
      !e.target.closest(`.${styles.sandwichMenu}`)
    ) {
      setMenuOpen(false);
    }
  };

  if (menuOpen) {
    document.addEventListener("click", handleOutsideClick);
  } else {
    document.removeEventListener("click", handleOutsideClick);
  }

  return () => document.removeEventListener("click", handleOutsideClick);
}, [menuOpen]);


  if (!employee) return null;

  return (
    <div className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          {/* 🔻 Sandwich Menu Icon */}
          <div
            className={styles.sandwichMenu}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className={styles.menuIcon}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* 🔻 Expanding Sidebar */}
          <div className={`${styles.sidebarMenu} ${menuOpen ? styles.open : ""}`}>
            <ul>

                <Link to="/manager/work" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                  <li>Home</li>
                </Link>

              
                <Link to="/manager/assign-tl" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                  <li>Project Distribution</li>
                </Link>
              
              
                <Link to="/manager/analysis" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                  <li>Analysis</li>
                </Link>
              
              
                <Link to="/manager/project-analysis" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                  <li>Project Analysis</li>
                </Link>
              
              
                <Link to="/manager/activity-analysis" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                  <li>Activity Analysis</li>
                </Link>
              
                <Link to="/manager/view-requests" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                  <li>View Requests</li>
                </Link>
              
            </ul>
          </div>
            {menuOpen && <div className={styles.overlay}></div>}
          <button className={styles.backBtn} onClick={handleBack}>
            Back
          </button>
        </div>

        <div className={styles.navCenter} style={{marginLeft:"6%"}}>
          <h1>E2G ENGINEERING SERVICES PRIVATE LIMITED</h1>
        </div>

        <div className={styles.navRight}>
          <Link to="/employee/leave" className={styles.navLink}>
            Leave
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ManagerNavbar;
