ALTER TABLE work_details
    ADD COLUMN submitted BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill: any existing row that already has an endTime and a "final" status
-- is treated as already submitted, so old data doesn't suddenly reappear as
-- "unfinished" the first time this runs.
UPDATE work_details
SET submitted = TRUE
WHERE end_time IS NOT NULL
  AND status IS NOT NULL;