import React, { useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import axios from "axios";
import { useEmployee } from "../../context/EmployeeContext";
import "../../styles/Manager/PivotTableCustom.css"; // custom global CSS

const WorkPivotTable = () => {
  const [data, setData] = useState([]);
   const [pivotState, setPivotState] = useState({
    rows: ["Employee"],       // default row
    cols: ["Activity"],       // default column
    aggregatorName: "Sum",
    vals: ["Work Hours"],
    rendererName: "Table",
  });
  const { employee } = useEmployee();

  useEffect(() => {
    if (!employee) return;

    axios
      .get(`http://localhost:8080/workdetails/manager/${employee.id}`)
      .then((res) => {
        // Header row first
        console.log(res.data);
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

        // Fill data rows
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
            unusedOrientationCutoff={Infinity} // show all fields in menu
          />
        )}
      </div>
    </div>
  );
};

export default WorkPivotTable;


// import React, { useEffect, useState } from "react";
// import PivotTableUI from "react-pivottable/PivotTableUI";
// import "react-pivottable/pivottable.css";
// import axios from "axios";
// import { useEmployee } from "../../context/EmployeeContext";
// import styles from "../../styles/Manager/PivotTableCustom.css"; // custom styles

// const WorkPivotTable = () => {
//   const [data, setData] = useState([]);
//   const [pivotState, setPivotState] = useState({
//     rows: ["Activity"],
//     cols: ["Status"],
//     aggregatorName: "Sum",
//     vals: ["Work Hours"],
//     rendererName: "Table",
//   });
//   const { employee, loading } = useEmployee();
//   useEffect(() => {
    
//     axios.get(`http://localhost:8080/workdetails/manager/${employee.id}`)
//       .then(res => {
//         const tableData = [["Activity", "Status", "Work Hours"]];
//         res.data.forEach(item => {
//           tableData.push([
//             item.projectActivity,
//             item.status,
//             item.workHours
//           ]);
//         });
//         setData(tableData);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div
//       style={{
//         width: "100%",
//         padding: "px",
//         overflow: "auto",
//         background: "#f8fafc",
//         minHeight: "100vh",
//         boxSizing: "border-box",
//       }}
//     >
//       <h2 style={{ marginBottom: "px", fontWeight: 600 }}>Work Pivot Table</h2>

//       <div
//         style={{
//           maxWidth: "100%",
//           overflowX: "auto",
//           borderRadius: "10px",
//           background: "#fff",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//           padding: "5px",
//         }}
//       >
//         {data.length > 1 && (
//           <PivotTableUI
//             data={data}
//             onChange={(s) => setPivotState(s)}
//             {...pivotState}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default WorkPivotTable;
