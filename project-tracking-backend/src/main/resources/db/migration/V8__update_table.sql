ALTER TABLE project
ADD COLUMN special_hours DECIMAL(10,2),
ADD COLUMN special_hours_tracking DECIMAL(10,2) DEFAULT 0.00;