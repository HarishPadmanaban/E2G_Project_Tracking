ALTER TABLE project
    ADD COLUMN reifa_given_hours        DECIMAL(10, 2) NULL,
    ADD COLUMN reifa_extra_hours        DECIMAL(10, 2) NULL,
    ADD COLUMN reifa_prod_hours         DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN reifa_extra_prod_hours   DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    ADD COLUMN reifc_given_hours        DECIMAL(10, 2) NULL,
    ADD COLUMN reifc_extra_hours        DECIMAL(10, 2) NULL,
    ADD COLUMN reifc_prod_hours         DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN reifc_extra_prod_hours   DECIMAL(10, 2) NOT NULL DEFAULT 0.00;
