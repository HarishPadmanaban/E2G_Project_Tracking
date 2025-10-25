import React, { useState } from "react";
import axios from "axios";
import styles from "../../styles/AGM/AddActivity.module.css"; // reuse same CSS

const AddActivityForm = () => {
  const [formData, setFormData] = useState({
    activityName: "",
    category: "",
    mainType: "",
    softDelete: false
  });

  const categories = ["Productive", "Non-Productive"];
  const mainTypes = ["Modelling", "Detailing", "Checking", "Common"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.activityName.trim())
      return alert("⚠️ Enter Activity Name");
    if (!formData.category) return alert("⚠️ Select Category");
    if (!formData.mainType) return alert("⚠️ Select Main Type");

    try {
      await axios.post("http://localhost:8080/activity/save", formData); 
      alert("✅ Activity added successfully!");
      console.log(formData);
      setFormData({ activityName: "", category: "", mainType: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add activity");
      setFormData({ activityName: "", category: "", mainType: "" });
    }
  };

  return (
    <div className={styles.container} >
      <h2>Add New Activity</h2>

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

      <button className={styles.submitBtn} onClick={handleSubmit}>
        Add Activity
      </button>
    </div>
  );
};

export default AddActivityForm;
