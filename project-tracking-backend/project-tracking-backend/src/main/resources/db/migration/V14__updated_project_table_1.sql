ALTER TABLE project
ADD COLUMN planned_ifa_date DATE,
ADD COLUMN actual_ifa_date DATE,
ADD COLUMN planned_ifc_date DATE,
ADD COLUMN actual_ifc_date DATE,
ADD COLUMN extra_hours_note VARCHAR(255);