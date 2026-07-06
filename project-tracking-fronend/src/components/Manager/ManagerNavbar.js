import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/Employee/EmployeeNavbar.module.css";
import Notifications from "../Notifications/Notifications"; // adjust path as needed
import axiosInstance from "../axiosConfig";

const ManagerNavbar = () => {
  const navigate = useNavigate();
  const employee = JSON.parse(sessionStorage.getItem("employee"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);


const authority = employee?.authority?.trim();

const isAdmin = authority === "ROLE_ADMIN";
const isManager = authority === "ROLE_MANAGER";
const isPC = authority === "ROLE_PROJECT_COORDINATOR";
const isEmployee = authority === "ROLE_EMPLOYEE";
const isNotAgm = employee?.designation.trim() !== "Assistant General Manager";
const homePath = isPC ? "/employee/work" : "/manager/work";

  const handleBack = () => {
    if (window.location.pathname === "/manager/work") return;
    navigate(-1);
  };

const handleLogout = () => {
  sessionStorage.removeItem("employee");
  navigate("/", { replace: true });
};

  useEffect(() => {
    if (!employee?.empId) return;

    const fetchPending = () => {
      axiosInstance
        .get(`/leave/manager/${employee.empId}`)
        .then((res) => {
          const pending = res.data.filter((r) => r.status === "Pending");
          setPendingCount(pending.length);
        })

    };

    // Fetch initially
    fetchPending();

    // Listen for custom refresh event dispatched from ViewRequests
    const handleRefresh = () => fetchPending();
    window.addEventListener("refreshPendingCount", handleRefresh);

    // Cleanup
    return () => {
      window.removeEventListener("refreshPendingCount", handleRefresh);
    };
  }, [employee]);


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
          <div
            className={`${styles.sidebarMenu} ${menuOpen ? styles.open : ""}`}
          >
            <ul>
              <Link
  to={homePath}
  className={styles.menuLink}
  onClick={() => setMenuOpen(false)}
>
  <li>Home</li>
</Link>



              {!isPC && <Link
                to="/manager/analysis"
                className={styles.menuLink}
                onClick={() => setMenuOpen(false)}
              >
                <li>Analysis</li>
              </Link>}

              {isManager && (
                <Link
                  to="/manager/assign-tl"
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <li>Project Distribution</li>
                </Link>
              )}

              {(isPC || isManager) && <Link
                to="/pc/assign"
                className={styles.menuLink}
                onClick={() => setMenuOpen(false)}
              >
                <li>Assign Activity</li>
              </Link>}

              {/* {isAdmin && (
                <Link
                  to="/manager/assign-project"
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <li>Project Assignment</li>
                </Link>
              )} */}

              {!isAdmin && !isPC && (<Link
                to="/manager/view-employee"
                className={styles.menuLink}
                onClick={() => setMenuOpen(false)}
              >
                <li>
                  View Employees
                </li>
              </Link>)}

              {!isAdmin && !isPC && (<Link
                to="/manager/view-requests"
                className={styles.menuLink}
                onClick={() => setMenuOpen(false)}
              >
                <li>
                  View Leave Requests
                  {pendingCount > 0 && (
                    <span className={styles.badge}>{pendingCount}</span>
                  )}
                </li>
              </Link>)}


              {!isAdmin && !isPC && (
                <Link
                  to="/manager/update-project"
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <li>Update Project</li>
                </Link>
              )}

              {isAdmin && !isPC && (
                <Link
                  to="/manager/view-approved-request"
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <li>View Approved Requests</li>
                </Link>
              )}

              {isAdmin && !isPC && (<Link
                to="/manager/edit-all"
                className={styles.menuLink}
                onClick={() => setMenuOpen(false)}
              >
                <li>
                  Overall Management
                </li>
              </Link>)}

              {isAdmin && !isPC && (
                <Link
                  to="/manager/edit-workdetails"
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <li>Edit Work Details</li>
                </Link>
              )}

            </ul>
          </div>
          {menuOpen && <div className={styles.overlay}></div>}
          <button className={styles.backBtn} onClick={handleBack}>
            Back
          </button>
        </div>

        <div className={styles.navCenter} style={{ marginLeft: "4%" }}>
          <img src="/logo.png" alt="E2G Logo" className={styles.logo} />
          <h1>E2G ENGINEERING SERVICES PRIVATE LIMITED</h1>
        </div>

        <Notifications userId={employee.empId} userRole={employee.designation} />

        <div className={styles.navRight}>

              { (isPC || isEmployee)  && (
            <Link to="/employee/work" className={styles.navLink}>
              Work
            </Link>
          )}

          {isNotAgm && (
            <Link to="/employee/leave" className={styles.navLink}>
              Leave
            </Link>
          )}





          {!isPC && <Link
            to="/manager/view-requests"
            className={styles.menuLink}
            onClick={() => setMenuOpen(false)}
          >
            <div>
               Leave Requests
              {pendingCount > 0 && (
                <span className={styles.badge}>{pendingCount}</span>
              )}
            </div>
          </Link>}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ManagerNavbar;
