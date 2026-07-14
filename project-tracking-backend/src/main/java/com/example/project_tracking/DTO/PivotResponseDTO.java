package com.example.project_tracking.DTO;

import java.util.List;

/**
 * Top-level response for GET /workdetails/pivot.
 * Contains the flat pivot rows AND the sorted manager list so the AGM
 * filter dropdown can be populated without an extra API call.
 */
public class PivotResponseDTO {

    /** All display-ready rows for the pivot table. */
    private List<PivotRowDTO> rows;

    /**
     * Distinct, sorted manager names extracted from rows.
     * Only populated when the caller is AGM; empty list otherwise.
     */
    private List<String> managerList;

    public PivotResponseDTO() {}

    public PivotResponseDTO(List<PivotRowDTO> rows, List<String> managerList) {
        this.rows        = rows;
        this.managerList = managerList;
    }

    public List<PivotRowDTO> getRows()                     { return rows; }
    public void setRows(List<PivotRowDTO> rows)            { this.rows = rows; }

    public List<String> getManagerList()                   { return managerList; }
    public void setManagerList(List<String> managerList)   { this.managerList = managerList; }
}
