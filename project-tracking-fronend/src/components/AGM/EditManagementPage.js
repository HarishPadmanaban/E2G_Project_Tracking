import React, { useState, useEffect } from "react";
import styles from "../../styles/Manager/ManagerDashboard.module.css";
import EditProject from "./EditProject";
import EditActivity from "./EditActivity";
import EditEmployee from "./EditEmployee";

const tabs = ["Edit Project", "Edit Employee", "Edit Activity"];

const EditManagementPage = () => {
  const [activeTab, setActiveTab] = useState("Edit Project"); // tab user clicked
  const [displayedTab, setDisplayedTab] = useState("Edit Project"); // currently rendered
  const [isFading, setIsFading] = useState(false);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setIsFading(true); // start fade-out
    setActiveTab(tab);
  };

  // When activeTab changes, fade-out first, then switch content
  useEffect(() => {
    if (!isFading) return;

    const timeout = setTimeout(() => {
      setDisplayedTab(activeTab); // switch content after fade-out
      setIsFading(false); // start fade-in
    }, 300); // match CSS transition duration

    return () => clearTimeout(timeout);
  }, [activeTab, isFading]);

  const renderComponent = () => {
    switch (displayedTab) {
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

      <div className={styles.filterButtons}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`${styles.filterBtn} ${
              activeTab === tab ? styles.active : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        className={`${styles.tabContent} ${
          isFading ? styles.fadeOut : styles.fadeIn
        }`}
      >
        {renderComponent()}
      </div>
    </div>
  );
};

export default EditManagementPage;
