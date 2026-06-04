-- Project status is no longer a project-level field.
-- The project state is represented by its stage statuses.

ALTER TABLE kpm_projects DROP COLUMN IF EXISTS status;

UPDATE kpm_enum_items
SET active=false,
    del_flag=1,
    update_time=current_timestamp
WHERE enum_type='project_status';
