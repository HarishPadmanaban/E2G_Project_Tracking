// import React, { useEffect, useState } from "react";
// import PivotTableUI from "react-pivottable/PivotTableUI";
// import "react-pivottable/pivottable.css";
// import axiosInstance from "../axiosConfig";
// import * as XLSX from "xlsx";
// import { useEmployee } from "../../context/EmployeeContext";
// import "../../styles/Manager/PivotTableCustom.css";
// import PivotTable from "react-pivottable/PivotTable"; // extra import for safety
// import { useToast } from "../../context/ToastContext";
// // ✅ Safe custom patch for FilterBox (no undefined errors)




// const patchPivotFilterBox = () => {
//   const Pivot = require("react-pivottable/PivotTableUI"); // dynamic import ensures module is available
//   const originalFilterBox = Pivot.FilterBox || PivotTableUI.FilterBox;



//   if (!originalFilterBox) {
//     return;
//   }

//   if (originalFilterBox.__patched) return; // avoid re-patching

//   const PatchedFilterBox = function PatchedFilterBox(props) {
//     const { attribute, values, valueFilter, onChange } = props;

//     const allValues = Array.from(values);
//     const selectedValues = allValues.filter((v) => !valueFilter[v]);
//     const allSelected = selectedValues.length === allValues.length;
//     const noneSelected = selectedValues.length === 0;
//     const singleSelected = selectedValues.length === 1;
//     const showSelectAll = noneSelected || singleSelected;


//     const toggleAll = (selectAll) => {
//       const newFilter = {};
//       if (!selectAll) {
//         // deselect all
//         allValues.forEach((v) => (newFilter[v] = true));
//       }
//       onChange({ ...props, valueFilter: newFilter });
//     };

//     return (
//       <div style={{ padding: "8px" }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "6px",
//           }}
//         >
//           <b>{attribute}</b>
//           {showSelectAll && (
//             <button
//               style={{
//                 background: "#2563eb",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "4px",
//                 padding: "2px 6px",
//                 fontSize: "12px",
//                 cursor: "pointer",
//               }}
//               onClick={() => toggleAll(!allSelected)}
//             >
//               {allSelected ? "Deselect All" : "Select All"}
//             </button>
//           )}
//         </div>

//         <div
//           style={{
//             maxHeight: "180px",
//             overflowY: "auto",
//             borderTop: "1px solid #ddd",
//             paddingTop: "4px",
//           }}
//         >
//           {allValues.map((val, i) => (
//             <label
//               key={i}
//               style={{
//                 display: "block",
//                 margin: "2px 0",
//                 fontSize: "13px",
//                 cursor: "pointer",
//               }}
//             >
//               <input
//                 type="checkbox"
//                 checked={!valueFilter[val]}
//                 onChange={() => {
//                   const newFilter = { ...valueFilter };
//                   if (newFilter[val]) delete newFilter[val];
//                   else newFilter[val] = true;
//                   onChange({ ...props, valueFilter: newFilter });
//                 }}
//               />{" "}
//               {String(val)}
//             </label>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   PatchedFilterBox.__patched = true;
//   PivotTableUI.FilterBox = PatchedFilterBox;
// };


// const WorkPivotTable = () => {
//   const [data, setData] = useState([]);
//   const [pivotState, setPivotState] = useState({
//     rows: ["Employee"],
//     cols: ["Activity"],
//     aggregatorName: "Sum",
//     vals: ["Work Hours"],
//     rendererName: "Table",
//   });
//   const { employee } = useEmployee();

//   useEffect(() => {
//     patchPivotFilterBox(); // apply filter dropdown customization
//   }, []);

//   useEffect(() => {
//     if (!employee) return;

//     const isAGM =
//       employee.designation.trim() === "Assistant IT Manager" ||
//       employee.designation.trim() === "Assistant General Manager"

//     const endpoint = isAGM
//       ? `/workdetails/all`
//       : `/workdetails/manager/${employee.empId}`;

//     // ✅ Fetch WorkDetails + All Projects in Parallel
//     Promise.all([
//       axiosInstance.get(endpoint),
//       axiosInstance.get("/project/"),
//     ])
//       .then(([workRes, projectRes]) => {
//         const workDetails = workRes.data || [];
//         const allProjects = projectRes.data || [];

//         // ✅ Create ProjectId → AssignedHours lookup
//         const projectMap = new Map(
//           allProjects.map((p) => [
//             p.id,
//             {
//               name: p.projectName,
//               assignedHours: p.assignedHours || 0,
//             },
//           ])
//         );

//         // ✅ Merge Assigned Hours into Pivot Data
//         const pivotData = workDetails.map((item, index) => {
//           const projectInfo = projectMap.get(item.projectId) || {};
//           const assigned = projectInfo.assignedHours || 0;

          

//           return {
//             id: index,
//             Employee: item.employeeName || "Unknown",
//             // ✅ Show Assigned Hours next to Project
//             Project: `${item.projectName || "Unassigned"} (${assigned} hrs)`,
//             Activity: item.activityName || "No Activity",
//             Status: item.status || "Unknown",
//             "Work Hours": Number(item.workHours) || 0,
//             Date: item.date || "",
//             "Assigned Work": item.assignedWork || "",
//           };
//         });

//         setData(pivotData);
//   console.log(pivotData);

//       })
//   }, [employee]);

//   const exportPivotToExcel = () => {
//     const table = document.querySelector(".pvtTable");
//     if (!table) {
//       showToast("No table to export!", "info");
//       return;
//     }
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.table_to_sheet(table);
//     XLSX.utils.book_append_sheet(wb, ws, "Work Analysis");
//     const fileName = `Work_Details_${new Date().toISOString().slice(0,10)}.xlsx`;
//     XLSX.writeFile(wb, fileName);
//   };

//   const { showToast } = useToast();


//   const hasValidData = data.length > 0;

//   return (
//     <div
//       style={{
//         width: "100%",
//         minHeight: "100vh",
//         padding: "20px",
//         boxSizing: "border-box",
//         background: "#f8fafc",
//       }}
//     >
//       <h2 style={{ fontWeight: 600, marginBottom: "20px" }}>
//         Work Analysis Pivot Table
//       </h2>

//       {hasValidData && (
//         <button
//           onClick={exportPivotToExcel}
//           style={{
//             marginBottom: "10px",
//             background: "#2563eb",
//             color: "#fff",
//             border: "none",
//             padding: "8px 16px",
//             borderRadius: "6px",
//             cursor: "pointer",
//             fontWeight: 500,
//           }}
//         >
//           Export to Excel
//         </button>
//       )}

//       <div
//         style={{
//           width: "100%",
//           overflowX: "auto",
//           background: "#fff",
//           borderRadius: "10px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//           padding: "10px",
//         }}
//       >
//         {hasValidData ? (
//           <PivotTableUI
//             data={data}
//             onChange={setPivotState}
//             {...pivotState}
//             unusedOrientationCutoff={Infinity}
//             hiddenAttributes={["Work Hours"]}
//           />
//         ) : (
//           <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
//             {employee ? "Loading data..." : "Please select an employee"}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WorkPivotTable;

/**
 * WorkPivotTable.js  — REFACTORED (Task 1)
 *
 * All data processing has been moved to the backend (PivotService).
 * This component is now display-only:
 *   • Call ONE endpoint  →  receive display-ready rows
 *   • Apply manager filter client-side (UI state only, no data transformation)
 *   • Render PivotTableUI
 */
/**
 * WorkPivotTable.js
 *
 * Changes from previous version (Main Type filter addition):
 *
 *   1. Added `selectedMainType` state — mirrors `selectedManager` in shape,
 *      initial value, reset behaviour, and clear-button pattern.
 *
 *   2. Added `MAIN_TYPES` constant — static list ["Modeling","Checking","Detailing"].
 *      No API call needed; these values never change at runtime.
 *
 *   3. `filteredData` rewritten from a single ternary into a `.filter()` chain
 *      that checks both active filters independently. Each condition is only
 *      evaluated when its state is non-empty, so all four combinations work:
 *        ""  + ""   → all rows
 *        mgr + ""   → manager only
 *        ""  + type → mainType only
 *        mgr + type → both applied together
 *
 *   4. Main Type `<select>` added to the filter bar using identical markup and
 *      inline styles as the Manager filter so visual consistency is preserved.
 *      It is shown for ALL roles (not AGM-only) because any manager may want
 *      to scope to a single work category.
 *
 *   5. "Main Type" added to `hiddenAttributes` so the field doesn't appear as
 *      a draggable pivot dimension by default (same treatment as "Manager").
 *      Users can still drag it into rows/cols manually if they want.
 */

import React, { useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import axiosInstance from "../axiosConfig";
import * as XLSX from "xlsx";
import "../../styles/Manager/PivotTableCustom.css";
import { useToast } from "../../context/ToastContext";
import { useEmployee } from "../../context/EmployeeContext";

// ── Static filter options ────────────────────────────────────────────────────
const MAIN_TYPES = ["Modeling", "Checking", "Detailing"];

// ── FilterBox patch (UI only — unchanged) ────────────────────────────────────
const patchPivotFilterBox = () => {
  const Pivot = require("react-pivottable/PivotTableUI");
  const originalFilterBox = Pivot.FilterBox || PivotTableUI.FilterBox;
  if (!originalFilterBox || originalFilterBox.__patched) return;

  const PatchedFilterBox = function PatchedFilterBox(props) {
    const { attribute, values, valueFilter, onChange } = props;
    const allValues      = Array.from(values);
    const selectedValues = allValues.filter((v) => !valueFilter[v]);
    const allSelected    = selectedValues.length === allValues.length;
    const noneSelected   = selectedValues.length === 0;
    const singleSelected = selectedValues.length === 1;
    const showSelectAll  = noneSelected || singleSelected;

    const toggleAll = (selectAll) => {
      const newFilter = {};
      if (!selectAll) allValues.forEach((v) => (newFilter[v] = true));
      onChange({ ...props, valueFilter: newFilter });
    };

    return (
      <div style={{ padding: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <b>{attribute}</b>
          {showSelectAll && (
            <button
              style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", padding: "2px 6px", fontSize: "12px", cursor: "pointer" }}
              onClick={() => toggleAll(!allSelected)}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          )}
        </div>
        <div style={{ maxHeight: "180px", overflowY: "auto", borderTop: "1px solid #ddd", paddingTop: "4px" }}>
          {allValues.map((val, i) => (
            <label key={i} style={{ display: "block", margin: "2px 0", fontSize: "13px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={!valueFilter[val]}
                onChange={() => {
                  const newFilter = { ...valueFilter };
                  if (newFilter[val]) delete newFilter[val];
                  else newFilter[val] = true;
                  onChange({ ...props, valueFilter: newFilter });
                }}
              />{" "}
              {String(val)}
            </label>
          ))}
        </div>
      </div>
    );
  };

  PatchedFilterBox.__patched = true;
  PivotTableUI.FilterBox = PatchedFilterBox;
};

// ── Component ─────────────────────────────────────────────────────────────────
const WorkPivotTable = () => {
  const [rows,             setRows]             = useState([]);
  const [managerList,      setManagerList]      = useState([]);
  const [selectedManager,  setSelectedManager]  = useState("");
  const [selectedMainType, setSelectedMainType] = useState(""); // ← NEW
  const [isAGM,            setIsAGM]            = useState(false);
  const [pivotState,       setPivotState]       = useState({
    rows:           ["Employee"],
    cols:           ["Activity"],
    aggregatorName: "Sum",
    vals:           ["Work Hours"],
    rendererName:   "Table",
  });

  const { showToast } = useToast();
  const { employee }  = useEmployee();

  useEffect(() => { patchPivotFilterBox(); }, []);

  // ── data fetch (single API call, no transformation) ───────────────────────
  useEffect(() => {
    if (!employee) return;

    const agm =
      employee.designation.trim() === "Assistant IT Manager" ||
      employee.designation.trim() === "Assistant General Manager";

    setIsAGM(agm);

const endpoint = agm
  ? "/workdetails/pivot/agm"
  : `/workdetails/pivot/manager/${employee.empId}`;

    axiosInstance.get(endpoint).then((res) => {
      const { rows: pivotRows, managerList: mgrs } = res.data;

      const formattedRows = (pivotRows || []).map((row) => ({
  Id: row.id,
  Employee: row.employee,
  Manager: row.manager,
  Project: row.project,
  Activity: row.activity,
  "Main Type": row.mainType,
  Status: row.status,
  "Work Hours": row.workHours,
  Date: row.date,
  "Assigned Work": row.assignedWork,
}));

setRows(formattedRows);
      setManagerList(mgrs  || []);
    });
  }, [employee]);

  // ── Combined filter — both conditions composed, each optional ─────────────
  // Previous: const filteredData = selectedManager ? rows.filter(...) : rows;
  // Now: chain both filters; a filter is skipped when its state value is "".
  const filteredData = rows.filter((row) => {
    const managerMatch  = !selectedManager  || row.Manager  === selectedManager;
    const mainTypeMatch = !selectedMainType || row["Main Type"] === selectedMainType;
    return managerMatch && mainTypeMatch;
  });

  // ── Excel export (unchanged) ──────────────────────────────────────────────
  const exportPivotToExcel = () => {
    const table = document.querySelector(".pvtTable");
    if (!table) { showToast("No table to export!", "info"); return; }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(wb, ws, "Work Analysis");
    XLSX.writeFile(wb, `Work_Details_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ── shared clear helper — resets pivot value filters on any filter change ─
  const resetPivotFilters = () =>
    setPivotState((prev) => ({ ...prev, valueFilter: {} }));

  const hasValidData = filteredData.length > 0;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", minHeight: "100vh", padding: "20px", boxSizing: "border-box", background: "#f8fafc" }}>
      <h2 style={{ fontWeight: 600, marginBottom: "20px" }}>Work Analysis Pivot Table</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>

        {/* ── Manager filter — AGM only (unchanged behaviour) ─────────────── */}
        {isAGM && managerList.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontWeight: 500, fontSize: "14px" }}>Filter by Manager:</label>
            <select
              value={selectedManager}
              onChange={(e) => { setSelectedManager(e.target.value); resetPivotFilters(); }}
              style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", background: "#fff", cursor: "pointer" }}
            >
              <option value="">All Managers</option>
              {managerList.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {selectedManager && (
              <button
                onClick={() => { setSelectedManager(""); resetPivotFilters(); }}
                style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", cursor: "pointer" }}
              >
                ✕ Clear
              </button>
            )}
          </div>
        )}

        {/* ── Main Type filter — all roles ─────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontWeight: 500, fontSize: "14px" }}>Filter by Main Type:</label>
          <select
            value={selectedMainType}
            onChange={(e) => { setSelectedMainType(e.target.value); resetPivotFilters(); }}
            style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", background: "#fff", cursor: "pointer" }}
          >
            <option value="">All Types</option>
            {MAIN_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {selectedMainType && (
            <button
              onClick={() => { setSelectedMainType(""); resetPivotFilters(); }}
              style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", cursor: "pointer" }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {hasValidData && (
          <button
            onClick={exportPivotToExcel}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
          >
            Export to Excel
          </button>
        )}
      </div>

      <div style={{ width: "100%", overflowX: "auto", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "10px" }}>
        {hasValidData ? (
          <PivotTableUI
            data={filteredData}
            onChange={setPivotState}
            {...pivotState}
            unusedOrientationCutoff={Infinity}
            hiddenAttributes={["Work Hours", "Manager", "Main Type"]}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            {employee ? "Loading data..." : "Please select an employee"}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPivotTable;
