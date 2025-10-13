// import React, { useEffect, useState } from "react";
// import PivotTableUI from "react-pivottable/PivotTableUI";
// import "react-pivottable/pivottable.css";
// import axios from "axios";

// const WorkPivotTable = () => {
//   const [data, setData] = useState([]);
//   const [pivotState, setPivotState] = useState({});

//   useEffect(() => {
//     axios.get("http://localhost:8080/workdetails/all")
//       .then(res => {
//         // Transform your data into array of arrays
//         // Header row first
//         const tableData = [
//           ["Activity", "Status", "Work Hours"]
//         ];

//         res.data.forEach(item => {
//           tableData.push([item.projectActivity, item.status, item.workHours]);
//         });

//         setData(tableData);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//       <div style={{ padding: "20px", overflowX: "hidden"}}>
//       {data.length > 1 && (
//         <PivotTableUI
//           data={data}
//           onChange={s => setPivotState(s)}
//           {...pivotState}
//           rows={["Activity"]}
//           cols={["Status"]}
//           aggregatorName="Sum"
//           vals={["Work Hours"]}
//           rendererName="Table"
//         />
//       )}
//     </div>
//   );
// };
// export default WorkPivotTable;

import React, { useEffect, useState } from "react";
import PivotTable from "react-pivottable/PivotTable";
import "react-pivottable/pivottable.css";
import axios from "axios";

const WorkPivotTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/workdetails/all")
      .then(res => {
        const tableData = [["Activity", "Status", "Work Hours"]];
        res.data.forEach(item => {
          tableData.push([item.projectActivity, item.status, item.workHours]);
        });
        setData(tableData);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px", overflowX: "auto" }}>
      {data.length > 1 && (
        <PivotTable
          data={data}
          rows={["Activity"]}
          cols={["Status"]}
          aggregatorName="Sum"
          vals={["Work Hours"]}
          rendererName="Table"
          sorters={{
            // Custom sorter: sort Activity by total Work Hours descending
            Activity: (a, b) => {
              // Extract the aggregation table from the pivot state (fake it here)
              // This is a workaround: normally `PivotTable` doesn't expose totals in sorters
              // So you can pre-sort data or customize later with a custom renderer
              return 0; // placeholder — see better solution below
            }
          }}
        />
      )}
    </div>
  );
};

export default WorkPivotTable;