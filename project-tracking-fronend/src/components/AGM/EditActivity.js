import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/AGM/EditProject.module.css";
import { useEmployee } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import AddActivityForm from './AddActivityForm';

const EditActivity = () => {
  const { employee, loading } = useEmployee();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);

  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const categories = ["Productive", "Non-Productive"];
  const mainTypes = ["Modelling", "Detailing", "Checking", "Common"];

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/activity/");
        setActivities(res.data);
        setFilteredActivities(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch activities:", err);
      }
    };
    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let data = [...activities];

    if (selectedCategory !== "All") {
      data = data.filter((a) => a.category === selectedCategory);
    }

    if (selectedType !== "All") {
      data = data.filter((a) => a.mainType === selectedType);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      data = data.filter((a) =>
        a.activityName?.toLowerCase().includes(term)
      );
    }

    data.sort((a, b) => a.id - b.id);
    setFilteredActivities(data);
  }, [searchTerm, selectedCategory, selectedType, activities]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedType("All");
    setFilteredActivities(activities);
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

      await axios.put(
        `http://localhost:8080/activity/edit/${formData.id}`,
        payload
      );

      alert("✅ Activity updated successfully!");
      setSelectedActivity(null);

      // Refresh list
      const refreshed = await axios.get("http://localhost:8080/activity/");
      setActivities(refreshed.data);
    } catch (err) {
      console.error("❌ Error updating activity:", err);
      alert("Error updating activity!");
    }
  };


  return (
     <div className={styles.tableContainer}>
      {!showAddForm && <h2 className={styles.title}>Activity Management</h2>}
{showAddForm && (
  <div className={styles.formContainer}>
    <button
      className={styles.backbtn}
      onClick={() => setShowAddForm(false)}
    >
      Back
    </button>
    <h3 className={styles.formTitle}></h3>
    <AddActivityForm
      onAdded={() => setShowAddForm(false)} // optional: close after success
    />
  </div>
)}

      {!selectedActivity && !showAddForm &&(
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
              onClick={() => setShowAddForm(true)}
            >
              + Add Activity
            </button>


            {showAddForm && (
              <div className={styles.addFormSection}>
                <AddActivityForm onAdded={() => setShowAddForm(false)} />
              </div>
            )}
          </div>

          {/* Activity Table */}
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Activity Name</th>
                <th>Category</th>
                <th>Main Type</th>
                <th>Soft Deleted?</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No activities found.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id}>
                    <td>{act.id}</td>
                    <td>{act.activityName}</td>
                    <td>{act.category}</td>
                    <td>{act.mainType}</td>
                    <td>{act.softDelete ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(act)}
                      >
                        ✏️ Edit
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
