ALTER TABLE project
ADD COLUMN planned_start_date DATE,
ADD COLUMN ifa_given_hours DECIMAL(10,2),
ADD COLUMN ifc_given_hours DECIMAL(10,2),
ADD COLUMN ifa_extra_hours DECIMAL(10,2),
ADD COLUMN ifc_extra_hours DECIMAL(10,2),

ADD COLUMN ifa_prod_hours DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN ifc_prod_hours DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN ifa_extra_prod_hours DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN ifc_extra_prod_hours DECIMAL(10,2) DEFAULT 0.00;