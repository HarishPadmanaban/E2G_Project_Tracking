import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Employee/LeavePermissionForm.module.css";

const EditActivity = () => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    activityName: "",
    category: "",
    mainType: "",
  });

  const categories = ["Productive", "Non-Productive"];
  const mainTypes = ["Modelling", "Detailing", "Checking", "Common"];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:8080/activity/getall");
      setActivities(res.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleEdit = (act) => {
    setEditingActivity(act.id);
    setFormData({
      activityName: act.activityName,
      category: act.category,
      mainType: act.mainType,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!formData.activityName.trim() || !formData.category || !formData.mainType) {
      alert("⚠️ Fill all fields.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/activity/update/${editingActivity}`, formData);
      alert("✅ Activity updated successfully!");
      setEditingActivity(null);
      fetchActivities();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update activity");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Activities</h2>

      {/* Activity Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Main Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((act) => (
            <tr key={act.id}>
              <td>{act.activityName}</td>
              <td>{act.category}</td>
              <td>{act.mainType}</td>
              <td>
                <button className={styles.submitBtn} onClick={() => handleEdit(act)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingActivity && (
        <div className={styles.formPopup}>
          <h3>Edit Activity</h3>

          <div className={styles.fld}>
            <label>Activity Name</label>
            <input
              type="text"
              name="activityName"
              value={formData.activityName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fld}>
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fld}>
            <label>Main Type</label>
            <select name="mainType" value={formData.mainType} onChange={handleChange}>
              <option value="">Select Main Type</option>
              {mainTypes.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button className={styles.submitBtn} onClick={handleUpdate}>Save Changes</button>
            <button className={styles.cancelBtn} onClick={() => setEditingActivity(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditActivity;