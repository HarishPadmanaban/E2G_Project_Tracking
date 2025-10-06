CREATE TABLE project (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    manager_id BIGINT NOT NULL,
    assigned_hours DECIMAL(10,2),
    working_hours DECIMAL(10,2),
    assigned_date DATE,
    project_status BOOLEAN DEFAULT TRUE,
    soft_delete BOOLEAN DEFAULT FALSE,

    -- Split-up hours (nullable initially)
    modelling_hours DECIMAL(10,2),
    checking_hours DECIMAL(10,2),
    detailing_hours DECIMAL(10,2),

    -- Time tracking for split-ups
    modelling_time TIME,
    checking_time TIME,
    detailing_time TIME
);
