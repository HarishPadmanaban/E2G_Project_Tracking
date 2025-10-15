// import React, { useEffect, useState } from "react";
// import PivotTableUI from "react-pivottable/PivotTableUI";
// import "react-pivottable/pivottable.css";
// import axios from "axios";
// import { useEmployee } from "../../context/EmployeeContext";
// import "../../styles/Manager/PivotTableCustom.css"; // custom global CSS

// const WorkPivotTable = () => {
//   const [data, setData] = useState([]);
//    const [pivotState, setPivotState] = useState({
//     rows: ["Employee"],       // default row
//     cols: ["Activity"],       // default column
//     aggregatorName: "Sum",
//     vals: ["Work Hours"],
//     rendererName: "Table",
//   });
//   const { employee } = useEmployee();

//   useEffect(() => {
//     if (!employee) return;

//     axios
//       .get(`http://localhost:8080/workdetails/manager/${employee.id}`)
//       .then((res) => {
//         // Header row first
//         console.log(res.data);
//         const tableData = [
//           [
//             "Employee",
//             "Project",
//             "Activity",
//             "Status",
//             "Work Hours",
//             "Date",
//             "Assigned Work",
//           ],
//         ];

//         // Fill data rows
//         res.data.forEach((item) => {
//           tableData.push([
//             item.employeeName || "",
//             item.projectName || "",
//             item.activityName || "",
//             item.status || "",
//             item.workHours || 0,
//             item.date || "",
//             item.assignedWork || "",
//           ]);
//         });

//         setData(tableData);
//       })
//       .catch((err) => console.error(err));
//   }, [employee]);

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
//         {data.length > 1 && (
//           <PivotTableUI
//             data={data}
//             onChange={(s) => setPivotState(s)}
//             {...pivotState}
//             unusedOrientationCutoff={Infinity} // show all fields in menu
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default WorkPivotTable;


import React, { useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import axios from "axios";
import * as XLSX from "xlsx";
import { useEmployee } from "../../context/EmployeeContext";
import "../../styles/Manager/PivotTableCustom.css";

const WorkPivotTable = () => {
  const [data, setData] = useState([]);
  const [pivotState, setPivotState] = useState({
    rows: ["Employee"], // default row
    cols: ["Activity"], // default column
    aggregatorName: "Sum",
    vals: ["Work Hours"],
    rendererName: "Table",
  });
  const { employee } = useEmployee();

  // Fetch work data
  useEffect(() => {
    if (!employee) return;

    axios
      .get(`http://localhost:8080/workdetails/manager/${employee.id}`)
      .then((res) => {
        const tableData = [
          [
            "Employee",
            "Project",
            "Activity",
            "Status",
            "Work Hours",
            "Date",
            "Assigned Work",
          ],
        ];

        res.data.forEach((item) => {
          tableData.push([
            item.employeeName || "",
            item.projectName || "",
            item.activityName || "",
            item.status || "",
            item.workHours || 0,
            item.date || "",
            item.assignedWork || "",
          ]);
        });

        setData(tableData);
      })
      .catch((err) => console.error(err));
  }, [employee]);

  useEffect(() => {
  if (data.length > 1) {
    // Reset pivotState to prevent "select all / none" crash
    setPivotState({
      rows: ["Employee"],
      cols: ["Activity"],
      aggregatorName: "Sum",
      vals: ["Work Hours"],
      rendererName: "Table",
    });
  }
}, [data]);

   const exportPivotToExcel = () => {
    const table = document.querySelector(".pvtTable");
    if (!table) {
      alert("No table to export!");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);

    // Bold the header row (first row)
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      ws[cellAddress].s = {
        font: { bold: true },
      };
    }

    XLSX.utils.book_append_sheet(wb, ws, "Work Analysis");
    XLSX.writeFile(wb, "WorkPivot_Excel2016.xlsx", { bookType: "xlsx" });
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        background: "#f8fafc",
      }}
    >
      <h2 style={{ fontWeight: 600, marginBottom: "20px" }}>
        Work Analysis Pivot Table
      </h2>

      {data.length > 1 && (
        <button
          onClick={exportPivotToExcel}
          style={{
            marginBottom: "10px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Export to Excel (2016)
        </button>
      )}

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "10px",
        }}
      >
        {data.length > 1 && (
          <PivotTableUI
            data={data}
            onChange={(s) => setPivotState(s)}
            {...pivotState}
            unusedOrientationCutoff={Infinity}
          />
        )}
      </div>
    </div>
  );
};

export default WorkPivotTable;

