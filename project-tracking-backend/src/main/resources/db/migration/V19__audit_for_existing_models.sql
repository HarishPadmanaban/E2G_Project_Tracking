ALTER TABLE project
    ADD COLUMN created_at DATETIME NULL,
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;

ALTER TABLE employee
    ADD COLUMN created_at DATETIME NULL,
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;

ALTER TABLE activity
    ADD COLUMN created_at DATETIME NULL,
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;

ALTER TABLE assigned_work
    ADD COLUMN created_at DATETIME NULL,
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;

ALTER TABLE leave_permission
    ADD COLUMN created_at DATETIME NULL,
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;

ALTER TABLE project_assignment
    ADD COLUMN created_at DATETIME NULL,
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;

ALTER TABLE work_details
    ADD COLUMN created_at DATETIME NULL,
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;

ALTER TABLE notification
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;

ALTER TABLE leave_balance
    ADD COLUMN created_at DATETIME NULL,
    ADD COLUMN created_by VARCHAR(100) NULL,
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN updated_by VARCHAR(100) NULL;