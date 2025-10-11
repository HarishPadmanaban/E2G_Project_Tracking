-- Change TIME columns to DECIMAL to track cumulative hours worked
ALTER TABLE project
MODIFY COLUMN modelling_time DECIMAL(10,2) DEFAULT 0.00,
MODIFY COLUMN checking_time DECIMAL(10,2) DEFAULT 0.00,
MODIFY COLUMN detailing_time DECIMAL(10,2) DEFAULT 0.00;

-- Update existing data if needed (convert TIME to hours)
UPDATE project SET
modelling_time = 0.00,
checking_time = 0.00,
detailing_time = 0.00;