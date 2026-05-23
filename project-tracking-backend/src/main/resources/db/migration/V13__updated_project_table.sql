ALTER TABLE project
ADD COLUMN planned_start_date DATE,
    ifa_given_hours DECIMAL(10,2),
    ifc_given_hours DECIMAL(10,2),
    ifa_extra_hours DECIMAL(10,2),
    ifc_extra_hours DECIMAL(10,2),

    ifa_prod_hours DECIMAL(10,2) DEFAULT 0.00,
    ifc_prod_hours DECIMAL(10,2) DEFAULT 0.00,
    ifa_extra_prod_hours DECIMAL(10,2) DEFAULT 0.00,
    ifc_extra_prod_hours DECIMAL(10,2) DEFAULT 0.00;