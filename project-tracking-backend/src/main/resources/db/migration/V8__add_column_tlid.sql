-- Add Team Lead ID column to project table
ALTER TABLE project
ADD COLUMN tl_id BIGINT AFTER manager_id;