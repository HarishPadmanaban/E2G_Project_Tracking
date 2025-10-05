CREATE TABLE employee (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emp_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    is_manager BOOLEAN DEFAULT FALSE,
    is_tl BOOLEAN DEFAULT FALSE,
    reporting_to BIGINT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT fk_reporting_to FOREIGN KEY (reporting_to) REFERENCES employee(id)
);
