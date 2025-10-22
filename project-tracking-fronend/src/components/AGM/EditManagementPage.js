import React, { useState } from "react";
import styles from "../../styles/Manager/ManagerDashboard.module.css"; // same dashboard style
import EditProject from "./EditProject";
import EditActivity from "./EditActivity";
import EditEmployee from "./EditEmployee";

const EditManagementPage = () => {
  const [activeTab, setActiveTab] = useState("Edit Project");

  // Dynamic component renderer
  const renderComponent = () => {
    switch (activeTab) {
      case "Edit Project":
        return <EditProject />;
      case "Edit Employee":
        return <EditEmployee />;
      case "Edit Activity":
        return <EditActivity />;
      default:
        return <EditProject />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Edit Management</h2>

      {/* Filter Tabs */}
      <div className={styles.filterButtons}>
        {["Edit Project", "Edit Employee", "Edit Activity"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.filterBtn} ${
              activeTab === tab ? styles.active : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Component Render */}
      <div>{renderComponent()}</div>
    </div>
  );
};

export default EditManagementPage;
