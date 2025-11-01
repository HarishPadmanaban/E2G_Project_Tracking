ALTER TABLE project
ADD COLUMN start_date DATE AFTER detailing_time,
ADD COLUMN completed_date DATE AFTER start_date,
ADD COLUMN study_hours DECIMAL(10,2) AFTER completed_date,
ADD COLUMN study_hours_tracking DECIMAL(10,2) AFTER study_hours,
ADD COLUMN extra_hours DECIMAL(10,2) AFTER study_hours_tracking,
ADD COLUMN extra_hours_tracking DECIMAL(10,2) AFTER extra_hours;
