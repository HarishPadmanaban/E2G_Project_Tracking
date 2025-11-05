ALTER TABLE work_details
ADD COLUMN assigned_work_id BIGINT,
ADD CONSTRAINT fk_work_details_assigned_work
FOREIGN KEY (assigned_work_id) REFERENCES assigned_work(id);
