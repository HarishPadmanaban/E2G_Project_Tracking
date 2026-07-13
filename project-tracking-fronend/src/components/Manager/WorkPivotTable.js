/**
 * WorkPivotTable.js
 *
 * Changes in this version (Date Range filter):
 *
 *   1. Added `fromDate` and `toDate` state — both start as "".
 *      These are ISO date strings (YYYY-MM-DD) matching <input type="date"> value format.
 *
 *   2. The useEffect data fetch now includes fromDate and toDate in its
 *      dependency array. Whenever either changes, the backend is re-fetched
 *      with the new ?from=&to= query params. This is the same reactive
 *      pattern already used for employee context — no separate "Apply" button needed.
 *
 *   3. When both fromDate and toDate are set, they are appended to the
 *      endpoint URL as query params. When either is blank, no params are
 *      sent and the backend returns the full dataset (existing behaviour preserved).
 *
 *   4. Date filtering is done at the backend (DB query level), NOT on the
 *      frontend rows array. The rows returned are already date-scoped.
 *      This keeps the frontend filter logic (manager, mainType) unchanged —
 *      they still operate on row.Manager and row["Main Type"] exactly as before.
 *
 *   5. "Date" field is added to hiddenAttributes so it no longer appears as
 *      a draggable pivot dimension by default. Users can still drag it in manually.
 *
 *   6. A "Clear Dates" button appears when either date is set — clears both
 *      together since a partial range has no meaning.
 *
 *   7. Excel filename now includes the date range when selected.
 */

import React, { useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import axiosInstance from "../axiosConfig";
import XLSX from "xlsx-js-style";
import "../../styles/Manager/PivotTableCustom.css";
import { useToast } from "../../context/ToastContext";
import { useEmployee } from "../../context/EmployeeContext";

// ── Static filter options ────────────────────────────────────────────────────
const MAIN_TYPES = ["Modeling", "Checking", "Detailing"];

// ── Shared dropdown style ─────────────────────────────────────────────────────
const SELECT_STYLE = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  background: "#fff",
  cursor: "pointer",
};

// ── Shared clear-button style ─────────────────────────────────────────────────
const CLEAR_BTN_STYLE = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  fontSize: "13px",
  cursor: "pointer",
};

// ── Shared label style ────────────────────────────────────────────────────────
const LABEL_STYLE = { fontWeight: 500, fontSize: "14px" };

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
  const [selectedMainType, setSelectedMainType] = useState("");
  const [fromDate,         setFromDate]         = useState(""); // ← NEW YYYY-MM-DD
  const [toDate,           setToDate]           = useState(""); // ← NEW YYYY-MM-DD
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

  // ── data fetch — re-runs when employee, fromDate or toDate changes ─────────
  useEffect(() => {
    if (!employee) return;

    const agm =
      employee.designation.trim() === "Assistant IT Manager" ||
      employee.designation.trim() === "Assistant General Manager";

    setIsAGM(agm);

    // Build base endpoint
    const base = agm
      ? "/workdetails/pivot/agm"
      : `/workdetails/pivot/manager/${employee.empId}`;

    // Append date params only when BOTH are filled —
    // a partial range is meaningless and not sent.
    const url = (fromDate && toDate)
      ? `${base}?from=${fromDate}&to=${toDate}`
      : base;

    axiosInstance.get(url).then((res) => {
      const { rows: pivotRows, managerList: mgrs } = res.data;

      const formattedRows = (pivotRows || []).map((row) => ({
        Id:              row.id,
        Employee:        `${row.employee} (${row.designation})`,
        Manager:         row.manager,
        Project:         row.project,
        Activity:        row.activity,
        "Main Type":     row.mainType,
        Status:          row.status,
        "Work Hours":    row.workHours,
        Date:            row.date,
        "Assigned Work": row.assignedWork,
      }));
 
      setRows(formattedRows);
      setManagerList(mgrs || []);

      // Reset pivot value filters when data changes
      setPivotState((prev) => ({ ...prev, valueFilter: {} }));
    });

  }, [employee, fromDate, toDate]); // ← fromDate and toDate added to deps

  // ── Client-side filters (manager + mainType — unchanged logic) ────────────
  // Date filtering is done upstream by the backend.
  // These two filters operate on the already date-scoped rows array.
  const filteredData = rows.filter((row) => {
    const managerMatch  = !selectedManager  || row.Manager      === selectedManager;
    const mainTypeMatch = !selectedMainType || row["Main Type"] === selectedMainType;
    return managerMatch && mainTypeMatch;
  });

  // ── shared clear helper for pivot value filters ───────────────────────────
  const resetPivotFilters = () =>
    setPivotState((prev) => ({ ...prev, valueFilter: {} }));

  // ── Excel export ──────────────────────────────────────────────────────────
  const exportPivotToExcel = () => {
    const table = document.querySelector(".pvtTable");
    if (!table) { showToast("No table to export!", "info"); return; }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);
    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;
        ws[cellRef].s = R <= 1
          ? { font: { bold: true, sz: 12 }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } }
          : { alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } } };
      }
    }

    const cols = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 15;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[cellRef]?.v != null) maxWidth = Math.max(maxWidth, String(ws[cellRef].v).length + 5);
      }
      cols.push({ wch: maxWidth });
    }
    ws["!cols"] = cols;
    ws["!freeze"] = { xSplit: 0, ySplit: 2 };

    XLSX.utils.book_append_sheet(wb, ws, "Work Analysis");

    const managerPart  = selectedManager  ? selectedManager.replace(/\s+/g, "_")  : "All_Managers";
    const mainTypePart = selectedMainType ? selectedMainType.replace(/\s+/g, "_") : "All_Types";
    const datePart     = (fromDate && toDate) ? `${fromDate}_to_${toDate}` : "All_Dates";

    XLSX.writeFile(wb, `Work_Details_${managerPart}_${mainTypePart}_${datePart}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const hasValidData    = filteredData.length > 0;
  const dateRangeActive = fromDate || toDate; // either filled = show clear button

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", minHeight: "100vh", padding: "20px", boxSizing: "border-box", background: "#f8fafc" }}>
      <h2 style={{ fontWeight: 600, marginBottom: "20px" }}>Work Analysis Pivot Table</h2>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>

        {/* ── Manager filter — AGM only ──────────────────────────────────── */}
        {isAGM && managerList.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={LABEL_STYLE}>Filter by Manager:</label>
            <select
              value={selectedManager}
              onChange={(e) => { setSelectedManager(e.target.value); resetPivotFilters(); }}
              style={SELECT_STYLE}
            >
              <option value="">All Managers</option>
              {managerList.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {selectedManager && (
              <button onClick={() => { setSelectedManager(""); resetPivotFilters(); }} style={CLEAR_BTN_STYLE}>
                ✕ Clear
              </button>
            )}
          </div>
        )}

        {/* ── Main Type filter — all roles ──────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={LABEL_STYLE}>Filter by Main Type:</label>
          <select
            value={selectedMainType}
            onChange={(e) => { setSelectedMainType(e.target.value); resetPivotFilters(); }}
            style={SELECT_STYLE}
          >
            <option value="">All Types</option>
            {MAIN_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {selectedMainType && (
            <button onClick={() => { setSelectedMainType(""); resetPivotFilters(); }} style={CLEAR_BTN_STYLE}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Date range filter — all roles ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={LABEL_STYLE}>From:</label>
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}          // prevent from > to in the picker
            onChange={(e) => setFromDate(e.target.value)}
            style={{ ...SELECT_STYLE, cursor: "text" }}
          />
          <label style={LABEL_STYLE}>To:</label>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}         // prevent to < from in the picker
            onChange={(e) => setToDate(e.target.value)}
            style={{ ...SELECT_STYLE, cursor: "text" }}
          />
          {dateRangeActive && (
            <button
              onClick={() => { setFromDate(""); setToDate(""); }}
              style={CLEAR_BTN_STYLE}
            >
              ✕ Clear Dates
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

      {/* ── Pivot table ───────────────────────────────────────────────────── */}
      <div style={{ width: "100%", overflowX: "auto", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "10px" }}>
        {hasValidData ? (
          <PivotTableUI
            data={filteredData}
            onChange={setPivotState}
            {...pivotState}
            unusedOrientationCutoff={Infinity}
            hiddenAttributes={["Work Hours", "Manager", "Main Type", "Date"]}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            {employee ? "No data for the selected filters." : "Please select an employee"}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPivotTable;
