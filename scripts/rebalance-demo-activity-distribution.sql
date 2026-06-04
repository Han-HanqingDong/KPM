-- Rebalance demo customer x project activity distribution for analytics UI testing.
-- It keeps records by logical deletion and creates deterministic activity buckets:
-- active <=30 days, inactive 31-90 days, abnormal 91-365 days, abandoned >365 days, empty no activity.

BEGIN;

CREATE TEMP TABLE tmp_kpm_activity_bucket ON COMMIT DROP AS
WITH demo_pairs AS (
  SELECT
    pc.id AS project_customer_id,
    pc.customer_id,
    c.short_name,
    c.name AS customer_name,
    pc.project_id,
    p.external_name AS project_name,
    row_number() OVER (ORDER BY c.short_name, p.external_name) AS rn
  FROM kpm_project_customers pc
  JOIN kpm_customers c ON c.id = pc.customer_id AND c.del_flag = 0
  JOIN kpm_projects p ON p.id = pc.project_id AND p.del_flag = 0
  WHERE pc.del_flag = 0
    AND c.short_name IN ('DJV','PST','MSF','FSB','MPP','CPT','HRZ')
    AND p.external_name IN ('P8 dual','P8 Go','P8','P18','D8','D5','A8','A8k')
), bucketed AS (
  SELECT *,
    CASE (rn - 1) % 5
      WHEN 0 THEN 'active'
      WHEN 1 THEN 'inactive'
      WHEN 2 THEN 'abnormal'
      WHEN 3 THEN 'abandoned'
      ELSE 'empty'
    END AS activity_bucket,
    CASE (rn - 1) % 5
      WHEN 0 THEN 10
      WHEN 1 THEN 60
      WHEN 2 THEN 180
      WHEN 3 THEN 500
      ELSE NULL
    END AS days_ago,
    CASE (rn - 1) % 5
      WHEN 0 THEN '量产维护'
      WHEN 1 THEN '首单护航'
      WHEN 2 THEN 'EOL 声明'
      WHEN 3 THEN 'Support Ended'
      ELSE '商机发掘'
    END AS demo_project_status
  FROM demo_pairs
)
SELECT * FROM bucketed;

-- Remove previous activity rows for this demo matrix by logical deletion.
UPDATE kpm_task_assignees ta
SET del_flag = 1, update_time = current_timestamp
WHERE ta.task_id IN (
  SELECT t.id
  FROM kpm_tasks t
  JOIN tmp_kpm_activity_bucket b ON b.customer_id = t.customer_id AND b.project_id = t.project_id
  WHERE t.del_flag = 0
);

UPDATE kpm_task_participants tp
SET del_flag = 1, update_time = current_timestamp
WHERE tp.task_id IN (
  SELECT t.id
  FROM kpm_tasks t
  JOIN tmp_kpm_activity_bucket b ON b.customer_id = t.customer_id AND b.project_id = t.project_id
  WHERE t.del_flag = 0
);

UPDATE kpm_tasks t
SET del_flag = 1, update_time = current_timestamp
FROM tmp_kpm_activity_bucket b
WHERE t.customer_id = b.customer_id
  AND t.project_id = b.project_id
  AND t.del_flag = 0;

UPDATE kpm_order_histories oh
SET del_flag = 1, update_time = current_timestamp
WHERE oh.order_id IN (
  SELECT o.id
  FROM kpm_orders o
  JOIN tmp_kpm_activity_bucket b ON b.customer_id = o.customer_id AND b.project_id = o.project_id
  WHERE o.del_flag = 0
);

UPDATE kpm_orders o
SET del_flag = 1, update_time = current_timestamp
FROM tmp_kpm_activity_bucket b
WHERE o.customer_id = b.customer_id
  AND o.project_id = b.project_id
  AND o.del_flag = 0;

-- Make project-customer lifecycle status match the demo activity bucket.
UPDATE kpm_project_customers pc
SET project_status = b.demo_project_status,
    updator = 'demo-activity-rebalance',
    update_time = current_timestamp
FROM tmp_kpm_activity_bucket b
WHERE pc.id = b.project_customer_id;

-- Make customer master status also more varied for visual inspection.
UPDATE kpm_customers c
SET status = CASE c.short_name
    WHEN 'DJV' THEN '合作中'
    WHEN 'PST' THEN '潜在客户'
    WHEN 'MSF' THEN '合作中'
    WHEN 'FSB' THEN '潜在客户'
    WHEN 'MPP' THEN '合作中'
    WHEN 'CPT' THEN '潜在客户'
    WHEN 'HRZ' THEN '合作中'
    ELSE c.status
  END,
  update_time = current_timestamp,
  updator = 'demo-activity-rebalance'
WHERE c.del_flag = 0
  AND c.short_name IN ('DJV','PST','MSF','FSB','MPP','CPT','HRZ');

-- Create one representative order for active/inactive/abnormal/abandoned buckets.
WITH source_rows AS (
  SELECT
    b.*,
    (current_date - (b.days_ago || ' days')::interval)::date AS activity_date,
    s.id AS sku_id,
    s.whole_machine_part_number,
    s.configuration_name,
    s.memory_type,
    sales.owner_user_id AS creator_user_id,
    coalesce(sales.account, 'admin@kozenmobile.com') AS creator_account,
    row_number() OVER (ORDER BY b.short_name, b.project_name) AS seq
  FROM tmp_kpm_activity_bucket b
  JOIN LATERAL (
    SELECT ps.*
    FROM kpm_project_skus ps
    WHERE ps.project_id = b.project_id AND ps.del_flag = 0 AND ps.active = true
    ORDER BY ps.id
    LIMIT 1
  ) s ON true
  LEFT JOIN LATERAL (
    SELECT u.id AS owner_user_id, u.account
    FROM kpm_customer_owners co
    JOIN kpm_users u ON u.id = co.owner_user_id AND u.del_flag = 0
    WHERE co.customer_id = b.customer_id
      AND co.owner_type = 'sales'
      AND co.del_flag = 0
    ORDER BY u.id
    LIMIT 1
  ) sales ON true
  WHERE b.activity_bucket <> 'empty'
), inserted_orders AS (
  INSERT INTO kpm_orders (
    order_date, customer_id, project_id, sku_id, sku_snapshot,
    order_type, status, quantity, specification,
    expected_ship_date, planned_ship_date, actual_ship_date,
    software_version, currency, unit_price, amount,
    creator_user_id, creator, created_at, updated_at, create_time, update_time, del_flag
  )
  SELECT
    activity_date,
    customer_id,
    project_id,
    sku_id,
    jsonb_build_object(
      'skuId', sku_id,
      'wholeMachinePartNumber', whole_machine_part_number,
      'configurationName', configuration_name,
      'memoryType', memory_type
    ),
    CASE activity_bucket
      WHEN 'active' THEN '正式订单'
      WHEN 'inactive' THEN '预订单'
      WHEN 'abnormal' THEN '样品订单'
      ELSE '正式订单'
    END,
    CASE activity_bucket
      WHEN 'active' THEN '生产中'
      WHEN 'inactive' THEN '已创建'
      WHEN 'abnormal' THEN '已完成'
      ELSE '已完成'
    END,
    CASE activity_bucket
      WHEN 'active' THEN 120 + seq
      WHEN 'inactive' THEN 40 + seq
      WHEN 'abnormal' THEN 12 + seq
      ELSE 5 + seq
    END,
    'Demo activity ' || activity_bucket || ' - ' || short_name || ' / ' || project_name,
    activity_date + 5,
    activity_date + 3,
    CASE WHEN activity_bucket IN ('abnormal','abandoned') THEN activity_date + 4 ELSE NULL END,
    'demo-' || activity_bucket,
    CASE WHEN seq % 3 = 0 THEN 'CNY' ELSE 'USD' END,
    CASE WHEN seq % 3 = 0 THEN 688.00 ELSE 99.00 END,
    (CASE activity_bucket
      WHEN 'active' THEN 120 + seq
      WHEN 'inactive' THEN 40 + seq
      WHEN 'abnormal' THEN 12 + seq
      ELSE 5 + seq
    END) * (CASE WHEN seq % 3 = 0 THEN 688.00 ELSE 99.00 END),
    creator_user_id,
    creator_account,
    activity_date::timestamp,
    activity_date::timestamp,
    activity_date::timestamp,
    activity_date::timestamp,
    0
  FROM source_rows
  RETURNING id, order_date, creator
)
INSERT INTO kpm_order_histories (order_id, modifier, modified_at, changes, reason, creator, create_time, update_time, del_flag)
SELECT id,
       'demo-activity-rebalance',
       order_date::timestamp,
       'Created demo activity order for analytics status coverage',
       '覆盖客户×项目活跃度测试状态',
       creator,
       order_date::timestamp,
       order_date::timestamp,
       0
FROM inserted_orders;

-- Create one representative task for every non-empty bucket; this also drives support workload charts.
WITH source_rows AS (
  SELECT
    b.*,
    nextval(pg_get_serial_sequence('kpm_tasks', 'id')) AS task_id,
    (current_date - (b.days_ago || ' days')::interval)::date AS activity_date,
    stage.id AS stage_id,
    support.owner_user_id AS assignee_user_id,
    coalesce(support.name, '未分配') AS assignee_name,
    coalesce(support.account, 'unassigned@kozen.local') AS assignee_account,
    row_number() OVER (ORDER BY b.short_name, b.project_name) AS seq
  FROM tmp_kpm_activity_bucket b
  LEFT JOIN LATERAL (
    SELECT ps.id
    FROM kpm_project_stages ps
    WHERE ps.project_id = b.project_id AND ps.del_flag = 0
    ORDER BY ps.id
    LIMIT 1
  ) stage ON true
  LEFT JOIN LATERAL (
    SELECT u.id AS owner_user_id, u.name, u.account
    FROM kpm_customer_owners co
    JOIN kpm_users u ON u.id = co.owner_user_id AND u.del_flag = 0
    WHERE co.customer_id = b.customer_id
      AND co.owner_type = 'support'
      AND co.del_flag = 0
    ORDER BY u.id
    LIMIT 1
  ) support ON true
  WHERE b.activity_bucket <> 'empty'
), inserted_tasks AS (
  INSERT INTO kpm_tasks (
    id, task_no, title, description, project_id, stage_id, category,
    status, priority, creator_user_id, creator, expected_completion_at,
    due_date, source, customer_id, blocked,
    created_at, updated_at, create_time, update_time, del_flag
  )
  SELECT
    task_id,
    short_name || task_id::text,
    short_name || ' / ' || project_name || ' - ' || CASE activity_bucket
      WHEN 'active' THEN '近期支持任务'
      WHEN 'inactive' THEN '待重新跟进任务'
      WHEN 'abnormal' THEN '长期停滞排查任务'
      ELSE '历史收尾任务'
    END,
    'Demo task generated to cover activity bucket: ' || activity_bucket,
    project_id,
    stage_id,
    CASE activity_bucket
      WHEN 'active' THEN '技术支持'
      WHEN 'inactive' THEN '需求'
      WHEN 'abnormal' THEN 'Bug'
      ELSE '其他'
    END,
    CASE activity_bucket
      WHEN 'active' THEN '进行中'
      WHEN 'inactive' THEN '待处理'
      WHEN 'abnormal' THEN '进行中'
      ELSE '已完成'
    END,
    CASE activity_bucket
      WHEN 'abnormal' THEN '高'
      WHEN 'active' THEN '中'
      ELSE '低'
    END,
    assignee_user_id,
    assignee_account,
    activity_date,
    activity_date,
    'demo-activity-rebalance',
    customer_id,
    activity_bucket = 'abnormal',
    activity_date::timestamp,
    activity_date::timestamp,
    activity_date::timestamp,
    activity_date::timestamp,
    0
  FROM source_rows
  RETURNING id
)
INSERT INTO kpm_task_assignees (task_id, user_id, assignee_name, creator, create_time, update_time, del_flag)
SELECT sr.task_id, sr.assignee_user_id, sr.assignee_name, 'demo-activity-rebalance', sr.activity_date::timestamp, sr.activity_date::timestamp, 0
FROM source_rows sr
JOIN inserted_tasks it ON it.id = sr.task_id;

COMMIT;

-- Distribution check using the same frontend matrix idea: latest order/task date per customer x project cell.
WITH pairs AS (
  SELECT c.id customer_id, c.short_name, p.id project_id, p.external_name
  FROM kpm_customers c
  CROSS JOIN kpm_projects p
  WHERE c.del_flag = 0
    AND p.del_flag = 0
    AND c.short_name IN ('DJV','PST','MSF','FSB','MPP','CPT','HRZ')
    AND p.external_name IN ('P8 dual','P8 Go','P8','P18','D8','D5','A8','A8k')
), activity AS (
  SELECT pair.customer_id, pair.project_id,
         greatest(
           coalesce(max(o.order_date)::timestamp, timestamp '1900-01-01'),
           coalesce(max(o.actual_ship_date)::timestamp, timestamp '1900-01-01'),
           coalesce(max(o.planned_ship_date)::timestamp, timestamp '1900-01-01'),
           coalesce(max(o.expected_ship_date)::timestamp, timestamp '1900-01-01'),
           coalesce(max(t.updated_at), timestamp '1900-01-01'),
           coalesce(max(t.created_at), timestamp '1900-01-01'),
           coalesce(max(t.expected_completion_at)::timestamp, timestamp '1900-01-01'),
           coalesce(max(t.due_date)::timestamp, timestamp '1900-01-01')
         ) latest_at
  FROM pairs pair
  LEFT JOIN kpm_orders o ON o.customer_id = pair.customer_id AND o.project_id = pair.project_id AND o.del_flag = 0
  LEFT JOIN kpm_tasks t ON t.customer_id = pair.customer_id AND t.project_id = pair.project_id AND t.del_flag = 0
  GROUP BY pair.customer_id, pair.project_id
), classified AS (
  SELECT CASE
    WHEN latest_at = timestamp '1900-01-01' THEN '无记录'
    WHEN current_date - latest_at::date <= 30 THEN '活跃'
    WHEN current_date - latest_at::date <= 90 THEN '不活跃'
    WHEN current_date - latest_at::date <= 365 THEN '异常'
    ELSE '已放弃'
  END state
  FROM activity
)
SELECT state, count(*) AS cell_count
FROM classified
GROUP BY state
ORDER BY CASE state WHEN '活跃' THEN 1 WHEN '不活跃' THEN 2 WHEN '异常' THEN 3 WHEN '已放弃' THEN 4 ELSE 5 END;
