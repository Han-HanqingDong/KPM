ALTER TABLE kpm_enum_items
  ADD COLUMN IF NOT EXISTS label_zh TEXT,
  ADD COLUMN IF NOT EXISTS label_en TEXT,
  ADD COLUMN IF NOT EXISTS short_label_zh TEXT,
  ADD COLUMN IF NOT EXISTS short_label_en TEXT;

UPDATE kpm_enum_items
SET label_zh = COALESCE(label_zh, name),
    label_en = COALESCE(label_en, name),
    short_label_zh = COALESCE(short_label_zh, LEFT(name, 1)),
    short_label_en = COALESCE(short_label_en, LEFT(value, 1)),
    update_time = CURRENT_TIMESTAMP
WHERE del_flag = 0;

UPDATE kpm_enum_items
SET label_zh='需求', label_en='Requirement', short_label_zh='需', short_label_en='R', update_time=CURRENT_TIMESTAMP
WHERE enum_type='task_category' AND value='需求' AND del_flag=0;

UPDATE kpm_enum_items
SET label_zh='Bug', label_en='Bug', short_label_zh='B', short_label_en='B', update_time=CURRENT_TIMESTAMP
WHERE enum_type='task_category' AND value='Bug' AND del_flag=0;

UPDATE kpm_enum_items
SET label_zh='技术支持', label_en='Support', short_label_zh='支', short_label_en='S', update_time=CURRENT_TIMESTAMP
WHERE enum_type='task_category' AND value='技术支持' AND del_flag=0;

UPDATE kpm_enum_items
SET label_zh='其他', label_en='Other', short_label_zh='其', short_label_en='O', update_time=CURRENT_TIMESTAMP
WHERE enum_type='task_category' AND value='其他' AND del_flag=0;

UPDATE kpm_enum_items
SET label_zh='高', label_en='High', short_label_zh='高', short_label_en='H', update_time=CURRENT_TIMESTAMP
WHERE enum_type='task_priority' AND value='高' AND del_flag=0;

UPDATE kpm_enum_items
SET label_zh='中', label_en='Medium', short_label_zh='中', short_label_en='M', update_time=CURRENT_TIMESTAMP
WHERE enum_type='task_priority' AND value='中' AND del_flag=0;

UPDATE kpm_enum_items
SET label_zh='低', label_en='Low', short_label_zh='低', short_label_en='L', update_time=CURRENT_TIMESTAMP
WHERE enum_type='task_priority' AND value='低' AND del_flag=0;
