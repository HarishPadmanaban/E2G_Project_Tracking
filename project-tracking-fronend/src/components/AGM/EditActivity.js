import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import styles from "../../styles/AGM/EditProject.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import AddActivityForm from './AddActivityForm';
import { useToast } from "../../context/ToastContext";

const EditActivity = () => {
  const { employee, loading } = useEmployee();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const categories = ["Productive", "Non-Productive"];
  const mainTypes = ["Modeling", "Detailing", "Checking", "Common"];
  const {showToast} = useToast();

  const [formData, setFormData] = useState({
    id: "",
    activityName: "",
    category: "",
    mainType: "",
    softDelete: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !employee) navigate("/");
  }, [employee, loading, navigate]);

  // Fetch activities

const fetchActivities = async () => {
  try {
    const res = await axiosInstance.get("/activity/all", {
      params: {
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        type: selectedType !== "All" ? selectedType : undefined,
        query: searchTerm || undefined,
      },
    });
    setActivities(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const timer = setTimeout(() => {
    fetchActivities();
  }, 300);
  return () => clearTimeout(timer);
}, [selectedCategory, searchTerm, selectedType]);


  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedType("All");
  };

  // Handle edit click
  const handleEdit = (act) => {
    setSelectedActivity(act);
    setFormData({
      id: act.id,
      activityName: act.activityName,
      category: act.category,
      mainType: act.mainType,
      softDelete: act.softDelete,
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      const payload = {
        activityName: formData.activityName,
        category: formData.category,
        mainType: formData.mainType,
        softDelete: formData.softDelete,
      };

      await axiosInstance.put(
        `/activity/edit/${formData.id}`,
        payload
      );

      showToast("✅ Activity updated successfully!","success");
      setSelectedActivity(null);
      await fetchActivities();
    } catch (err) {
      showToast("Error updating activity!","error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Activity?")) {
      try {
        await axiosInstance.delete(`/activity/${id}`);
        showToast("🗑️ Activity deleted successfully!", "success");

        // Remove deleted activity from the table
        const updated = activities.filter((e) => e.id !== id);
        await fetchActivities();
      } catch (error) {
        showToast("Error deleting activity!", "error");
      }
    }
  };


  return (
     <div className={styles.tableContainer}>
      { <h2 className={styles.title}>Activity Management</h2>}

      {!selectedActivity &&(
        <>
          {/* Filters */}
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search activity name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="All">All Types</option>
              {mainTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button className={styles.clearBtn} onClick={clearFilters}>
              Clear Filters
            </button>
            <button
              className={styles.addBtn}
              onClick={() => navigate("/manager/add-activity")}
            >
              + Add Activity
            </button>
          </div>

          {/* Activity Table */}
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Activity Name</th>
                <th>Category</th>
                <th>Main Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No activities found.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id}>
                    <td>{act.id}</td>
                    <td>{act.activityName}</td>
                    <td>{act.category}</td>
                    <td>{act.mainType}</td>                  
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(act)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDelete(act.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {selectedActivity && (
        <div className={styles.formContainer}>
          <button
            className={styles.backbtn}
            onClick={() => setSelectedActivity(null)}
          >
            Back
          </button>
          <h3 className={styles.formTitle}>Edit Activity</h3>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Activity ID</label>
              <input type="text" value={formData.id} readOnly />
            </div>

            <div className={styles.formField}>
              <label>Activity Name</label>
              <input
                type="text"
                name="activityName"
                value={formData.activityName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formField}>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label>Main Type</label>
              <select
                name="mainType"
                value={formData.mainType}
                onChange={handleChange}
              >
                <option value="">Select Main Type</option>
                {mainTypes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className={styles.formActions}>
            <button className={styles.actionBtn} onClick={handleSave}>
              Save
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setSelectedActivity(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditActivity;
