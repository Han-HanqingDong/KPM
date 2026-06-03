-- KPM demo scenario seed data
-- Purpose: preserve a realistic manual-test dataset for Henry's review.
-- Safe to re-run: all generated ids use the test-* prefix and are upserted.

DO $$
#variable_conflict use_column
<<seed_scenario>>
DECLARE
  i int;
  j int;
  k int;
  idx int;
  dept_id text;
  current_role_id text;
  user_id text;
  user_account text;
  user_name text;
  project_id text;
  stage_id text;
  sku_id text;
  customer_id text;
  order_id text;
  requirement_id text;
  task_id text;
  sales_user_id text;
  support_user_id text;
  rd_user_id text;
  spm_user_id text;
  selected_project_no int;
  selected_sku_no int;
  order_count int;
  req_count int;
  task_count int;
  qty int;
  price numeric(14,2);
  order_type text;
  order_status text;
  project_customer_status text;
  actual_ship date;
  region text;
  address text;
  customer_status text;
  customer_level text;
  role_ids text[] := ARRAY['test-role-rd','test-role-spm','test-role-support','test-role-ops','test-role-sales','test-role-cto'];
  stage_names text[] := ARRAY['提出想法','可行性讨论','硬件设计','软件适配','测试生产','客户推广'];
  project_names text[] := ARRAY['P8 Dual','K-Tab Retail','Kozen Pay Mini','Ares POS','Nova Handheld','Atlas Printer Dock','K-Scan Plus','Mercury POS','Orion SmartPOS','Luna Countertop'];
  internal_names text[] := ARRAY['R2351','R2402','R2403','R2410','R2415','R2420','R2422','R2430','R2436','R2440'];
  model_names text[] := ARRAY['K1352','K1402','K1403','K1410','K1415','K1420','K1422','K1430','K1436','K1440'];
  regions text[] := ARRAY['中国 / 深圳','中国 / 上海','新加坡','日本 / 东京','韩国 / 首尔','印度 / 班加罗尔','阿联酋 / 迪拜','沙特 / 利雅得','德国 / 柏林','法国 / 巴黎','英国 / 伦敦','西班牙 / 马德里','荷兰 / 阿姆斯特丹','美国 / 纽约','美国 / 洛杉矶','加拿大 / 多伦多','墨西哥 / 墨西哥城','巴西 / 圣保罗','智利 / 圣地亚哥','澳大利亚 / 悉尼','南非 / 约翰内斯堡','肯尼亚 / 内罗毕','土耳其 / 伊斯坦布尔','印尼 / 雅加达','泰国 / 曼谷'];
  addresses text[] := ARRAY['Shenzhen, China','Shanghai, China','Singapore','Tokyo, Japan','Seoul, South Korea','Bengaluru, India','Dubai, United Arab Emirates','Riyadh, Saudi Arabia','Berlin, Germany','Paris, France','London, United Kingdom','Madrid, Spain','Amsterdam, Netherlands','New York, United States','Los Angeles, United States','Toronto, Canada','Mexico City, Mexico','Sao Paulo, Brazil','Santiago, Chile','Sydney, Australia','Johannesburg, South Africa','Nairobi, Kenya','Istanbul, Turkey','Jakarta, Indonesia','Bangkok, Thailand'];
  order_types text[] := ARRAY['样品订单','预订单','正式订单'];
  order_statuses text[] := ARRAY['已创建','生产中','已发货','已收货','已完成'];
  currencies text[] := ARRAY['USD','EUR','CNY'];
  priorities text[] := ARRAY['高','中','低'];
  task_categories text[] := ARRAY['需求','Bug','技术支持','其他'];
  task_statuses text[] := ARRAY['待处理','进行中','已完成','已拒绝'];
  requirement_statuses text[] := ARRAY['待评估','已采纳','实现中','已实现','已拒绝'];
  customer_project_statuses text[] := ARRAY['商机发掘','样机测试','研发投入','订单冲刺','首单护航','量产维护','EOL 声明','EOL','Support Ended'];
BEGIN
  -- Departments
  INSERT INTO kpm_departments (id, name, status, creator, updator, del_flag)
  VALUES
    ('test-dept-support', '技术支持部', '启用', 'seed', 'seed', 0),
    ('test-dept-sales', '销售部', '启用', 'seed', 'seed', 0),
    ('test-dept-ops', '运营部', '启用', 'seed', 'seed', 0),
    ('test-dept-rd', '研发部', '启用', 'seed', 'seed', 0)
  ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, status='启用', updator='seed', update_time=now(), del_flag=0;

  -- Roles
  INSERT INTO kpm_roles (id, name, role_type, status, creator, updator, del_flag)
  VALUES
    ('test-role-rd', '研发', '全局角色', '启用', 'seed', 'seed', 0),
    ('test-role-spm', 'SPM', '全局角色', '启用', 'seed', 'seed', 0),
    ('test-role-support', '技术支持', '全局角色', '启用', 'seed', 'seed', 0),
    ('test-role-ops', '运营', '全局角色', '启用', 'seed', 'seed', 0),
    ('test-role-sales', '销售', '全局角色', '启用', 'seed', 'seed', 0),
    ('test-role-cto', 'CTO', '全局角色', '启用', 'seed', 'seed', 0)
  ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, role_type=EXCLUDED.role_type, status='启用', updator='seed', update_time=now(), del_flag=0;

  DELETE FROM kpm_role_permissions WHERE kpm_role_permissions.role_id = ANY(seed_scenario.role_ids);

  -- R&D / SPM: all project + task related permissions.
  FOREACH current_role_id IN ARRAY ARRAY['test-role-rd','test-role-spm'] LOOP
    INSERT INTO kpm_role_permissions (role_id, permission_id, creator, updator, del_flag)
    SELECT current_role_id, id, 'seed', 'seed', 0
    FROM kpm_permissions
    WHERE del_flag=0 AND (
      code IN ('menu:projects','menu:tasks')
      OR code LIKE 'button:projects:%'
      OR code LIKE 'button:project-%:%'
      OR code LIKE 'button:stage-detail:%'
      OR code LIKE 'button:requirements:%'
      OR code LIKE 'button:tasks:%'
      OR code LIKE 'button:task-detail:%'
      OR code LIKE 'button:task-statuses:%'
    )
    ON CONFLICT (role_id, permission_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
  END LOOP;

  -- Technical support: R&D + customers + orders.
  INSERT INTO kpm_role_permissions (role_id, permission_id, creator, updator, del_flag)
  SELECT 'test-role-support', id, 'seed', 'seed', 0
  FROM kpm_permissions
  WHERE del_flag=0 AND (
    code IN ('menu:projects','menu:tasks','menu:customer-master','menu:orders')
    OR code LIKE 'button:projects:%'
    OR code LIKE 'button:project-%:%'
    OR code LIKE 'button:stage-detail:%'
    OR code LIKE 'button:requirements:%'
    OR code LIKE 'button:tasks:%'
    OR code LIKE 'button:task-detail:%'
    OR code LIKE 'button:task-statuses:%'
    OR code LIKE 'button:customers:%'
    OR code LIKE 'button:customer-%:%'
    OR code LIKE 'button:orders:%'
    OR code LIKE 'button:order-%:%'
  )
  ON CONFLICT (role_id, permission_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();

  -- Operations: order + project related permissions.
  INSERT INTO kpm_role_permissions (role_id, permission_id, creator, updator, del_flag)
  SELECT 'test-role-ops', id, 'seed', 'seed', 0
  FROM kpm_permissions
  WHERE del_flag=0 AND (
    code IN ('menu:orders','menu:projects')
    OR code LIKE 'button:orders:%'
    OR code LIKE 'button:order-%:%'
    OR code LIKE 'button:projects:%'
    OR code LIKE 'button:project-%:%'
    OR code LIKE 'button:stage-detail:%'
    OR code LIKE 'button:requirements:%'
  )
  ON CONFLICT (role_id, permission_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();

  -- Sales: order + project + customer related permissions.
  INSERT INTO kpm_role_permissions (role_id, permission_id, creator, updator, del_flag)
  SELECT 'test-role-sales', id, 'seed', 'seed', 0
  FROM kpm_permissions
  WHERE del_flag=0 AND (
    code IN ('menu:orders','menu:projects','menu:customer-master')
    OR code LIKE 'button:orders:%'
    OR code LIKE 'button:order-%:%'
    OR code LIKE 'button:projects:%'
    OR code LIKE 'button:project-%:%'
    OR code LIKE 'button:stage-detail:%'
    OR code LIKE 'button:requirements:%'
    OR code LIKE 'button:customers:%'
    OR code LIKE 'button:customer-%:%'
  )
  ON CONFLICT (role_id, permission_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();

  -- CTO: every current permission.
  INSERT INTO kpm_role_permissions (role_id, permission_id, creator, updator, del_flag)
  SELECT 'test-role-cto', id, 'seed', 'seed', 0
  FROM kpm_permissions
  WHERE del_flag=0
  ON CONFLICT (role_id, permission_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();

  -- Users A1-A100: R&D
  FOR i IN 1..100 LOOP
    user_id := 'test-user-a' || lpad(i::text, 3, '0');
    user_account := 'a' || i || '@kozen.test';
    user_name := '测试用户A' || i;
    INSERT INTO kpm_users (id, account, name, email, password_hash, status, creator, updator, del_flag)
    VALUES (user_id, user_account, user_name, user_account, '{noop}123456', '启用', 'seed', 'seed', 0)
    ON CONFLICT (id) DO UPDATE SET account=EXCLUDED.account, name=EXCLUDED.name, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, status='启用', updator='seed', update_time=now(), del_flag=0;
    INSERT INTO kpm_user_roles (user_id, role_id, creator, updator, del_flag) VALUES (user_id, 'test-role-rd', 'seed', 'seed', 0)
    ON CONFLICT (user_id, role_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
    INSERT INTO kpm_user_departments (user_id, department_id, creator, updator, del_flag) VALUES (user_id, 'test-dept-rd', 'seed', 'seed', 0)
    ON CONFLICT (user_id, department_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
  END LOOP;

  -- Users B1-B10: Sales
  FOR i IN 1..10 LOOP
    user_id := 'test-user-b' || lpad(i::text, 3, '0');
    user_account := 'b' || i || '@kozen.test';
    user_name := '测试用户B' || i;
    INSERT INTO kpm_users (id, account, name, email, password_hash, status, creator, updator, del_flag)
    VALUES (user_id, user_account, user_name, user_account, '{noop}123456', '启用', 'seed', 'seed', 0)
    ON CONFLICT (id) DO UPDATE SET account=EXCLUDED.account, name=EXCLUDED.name, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, status='启用', updator='seed', update_time=now(), del_flag=0;
    INSERT INTO kpm_user_roles (user_id, role_id, creator, updator, del_flag) VALUES (user_id, 'test-role-sales', 'seed', 'seed', 0)
    ON CONFLICT (user_id, role_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
    INSERT INTO kpm_user_departments (user_id, department_id, creator, updator, del_flag) VALUES (user_id, 'test-dept-sales', 'seed', 'seed', 0)
    ON CONFLICT (user_id, department_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
  END LOOP;

  -- Users C1-C10: Operations
  FOR i IN 1..10 LOOP
    user_id := 'test-user-c' || lpad(i::text, 3, '0');
    user_account := 'c' || i || '@kozen.test';
    user_name := '测试用户C' || i;
    INSERT INTO kpm_users (id, account, name, email, password_hash, status, creator, updator, del_flag)
    VALUES (user_id, user_account, user_name, user_account, '{noop}123456', '启用', 'seed', 'seed', 0)
    ON CONFLICT (id) DO UPDATE SET account=EXCLUDED.account, name=EXCLUDED.name, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, status='启用', updator='seed', update_time=now(), del_flag=0;
    INSERT INTO kpm_user_roles (user_id, role_id, creator, updator, del_flag) VALUES (user_id, 'test-role-ops', 'seed', 'seed', 0)
    ON CONFLICT (user_id, role_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
    INSERT INTO kpm_user_departments (user_id, department_id, creator, updator, del_flag) VALUES (user_id, 'test-dept-ops', 'seed', 'seed', 0)
    ON CONFLICT (user_id, department_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
  END LOOP;

  -- Users D1-D10: Technical support
  FOR i IN 1..10 LOOP
    user_id := 'test-user-d' || lpad(i::text, 3, '0');
    user_account := 'd' || i || '@kozen.test';
    user_name := '测试用户D' || i;
    INSERT INTO kpm_users (id, account, name, email, password_hash, status, creator, updator, del_flag)
    VALUES (user_id, user_account, user_name, user_account, '{noop}123456', '启用', 'seed', 'seed', 0)
    ON CONFLICT (id) DO UPDATE SET account=EXCLUDED.account, name=EXCLUDED.name, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, status='启用', updator='seed', update_time=now(), del_flag=0;
    INSERT INTO kpm_user_roles (user_id, role_id, creator, updator, del_flag) VALUES (user_id, 'test-role-support', 'seed', 'seed', 0)
    ON CONFLICT (user_id, role_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
    INSERT INTO kpm_user_departments (user_id, department_id, creator, updator, del_flag) VALUES (user_id, 'test-dept-support', 'seed', 'seed', 0)
    ON CONFLICT (user_id, department_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
  END LOOP;

  -- User E1: CTO
  INSERT INTO kpm_users (id, account, name, email, password_hash, status, creator, updator, del_flag)
  VALUES ('test-user-e001', 'e1@kozen.test', '测试用户E1', 'e1@kozen.test', '{noop}123456', '启用', 'seed', 'seed', 0)
  ON CONFLICT (id) DO UPDATE SET account=EXCLUDED.account, name=EXCLUDED.name, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, status='启用', updator='seed', update_time=now(), del_flag=0;
  INSERT INTO kpm_user_roles (user_id, role_id, creator, updator, del_flag) VALUES ('test-user-e001', 'test-role-cto', 'seed', 'seed', 0)
  ON CONFLICT (user_id, role_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
  INSERT INTO kpm_user_departments (user_id, department_id, creator, updator, del_flag) VALUES ('test-user-e001', 'test-dept-support', 'seed', 'seed', 0)
  ON CONFLICT (user_id, department_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();

  -- Users F1-F10: SPM
  FOR i IN 1..10 LOOP
    user_id := 'test-user-f' || lpad(i::text, 3, '0');
    user_account := 'f' || i || '@kozen.test';
    user_name := '测试用户F' || i;
    INSERT INTO kpm_users (id, account, name, email, password_hash, status, creator, updator, del_flag)
    VALUES (user_id, user_account, user_name, user_account, '{noop}123456', '启用', 'seed', 'seed', 0)
    ON CONFLICT (id) DO UPDATE SET account=EXCLUDED.account, name=EXCLUDED.name, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, status='启用', updator='seed', update_time=now(), del_flag=0;
    INSERT INTO kpm_user_roles (user_id, role_id, creator, updator, del_flag) VALUES (user_id, 'test-role-spm', 'seed', 'seed', 0)
    ON CONFLICT (user_id, role_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
    INSERT INTO kpm_user_departments (user_id, department_id, creator, updator, del_flag) VALUES (user_id, 'test-dept-rd', 'seed', 'seed', 0)
    ON CONFLICT (user_id, department_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
  END LOOP;

  -- Projects, members, stages, and SKU catalog.
  FOR i IN 1..10 LOOP
    project_id := 'test-project-' || lpad(i::text, 2, '0');
    INSERT INTO kpm_projects (id, external_name, internal_name, model_name, manager_account, manager_user_id, status, archived, salesability, unsellable_reason, description, creator, updator, del_flag)
    VALUES (
      project_id,
      project_names[i],
      internal_names[i],
      model_names[i],
      'e1@kozen.test',
      'test-user-e001',
      CASE WHEN i <= 3 THEN '已完成' WHEN i <= 8 THEN '进行中' ELSE '未开始' END,
      false,
      CASE WHEN i <= 4 THEN '可销售' ELSE '不可销售' END,
      CASE WHEN i <= 4 THEN NULL WHEN i <= 8 THEN '仍处于设计或测试阶段' ELSE '产品过老，不再继续推广' END,
      '由 CTO 创建的全球试点测试项目 #' || i,
      'seed',
      'seed',
      0
    )
    ON CONFLICT (id) DO UPDATE SET external_name=EXCLUDED.external_name, internal_name=EXCLUDED.internal_name, model_name=EXCLUDED.model_name, manager_account=EXCLUDED.manager_account, manager_user_id=EXCLUDED.manager_user_id, status=EXCLUDED.status, archived=false, salesability=EXCLUDED.salesability, unsellable_reason=EXCLUDED.unsellable_reason, description=EXCLUDED.description, updator='seed', update_time=now(), updated_at=now(), del_flag=0;

    -- CTO, SPM, R&D and Support members.
    INSERT INTO kpm_project_members (id, project_id, user_account, user_id, role_name, creator, updator, del_flag)
    VALUES
      ('test-member-' || lpad(i::text,2,'0') || '-cto', project_id, 'e1@kozen.test', 'test-user-e001', 'CTO', 'seed', 'seed', 0),
      ('test-member-' || lpad(i::text,2,'0') || '-spm', project_id, 'f' || (((i - 1) % 10) + 1) || '@kozen.test', 'test-user-f' || lpad((((i - 1) % 10) + 1)::text,3,'0'), 'SPM', 'seed', 'seed', 0),
      ('test-member-' || lpad(i::text,2,'0') || '-rd', project_id, 'a' || (((i * 9) % 100) + 1) || '@kozen.test', 'test-user-a' || lpad((((i * 9) % 100) + 1)::text,3,'0'), '研发', 'seed', 'seed', 0),
      ('test-member-' || lpad(i::text,2,'0') || '-support', project_id, 'd' || (((i * 3) % 10) + 1) || '@kozen.test', 'test-user-d' || lpad((((i * 3) % 10) + 1)::text,3,'0'), '技术支持', 'seed', 'seed', 0)
    ON CONFLICT (id) DO UPDATE SET user_account=EXCLUDED.user_account, user_id=EXCLUDED.user_id, role_name=EXCLUDED.role_name, updator='seed', update_time=now(), del_flag=0;

    FOR j IN 1..array_length(stage_names, 1) LOOP
      stage_id := 'test-stage-' || lpad(i::text,2,'0') || '-' || lpad(j::text,2,'0');
      INSERT INTO kpm_project_stages (id, project_id, stage_name, stage_order, status, creator, updator, del_flag)
      VALUES (
        stage_id,
        project_id,
        stage_names[j],
        j,
        CASE WHEN i <= 3 THEN '已完成' WHEN i <= 8 AND j <= 2 THEN '已完成' WHEN i <= 8 AND j <= 5 THEN '进行中' ELSE '未开始' END,
        'seed',
        'seed',
        0
      )
      ON CONFLICT (id) DO UPDATE SET stage_name=EXCLUDED.stage_name, stage_order=EXCLUDED.stage_order, status=EXCLUDED.status, updator='seed', update_time=now(), del_flag=0;

      support_user_id := 'test-user-d' || lpad(((((i + j) * 3) % 10) + 1)::text, 3, '0');
      INSERT INTO kpm_stage_assignees (id, stage_id, assignee_type, assignee_name, account, user_id, creator, updator, del_flag)
      SELECT 'test-stage-assignee-' || lpad(i::text,2,'0') || '-' || lpad(j::text,2,'0'), stage_id, 'user', u.name, u.account, u.id, 'seed', 'seed', 0
      FROM kpm_users u WHERE u.id = support_user_id
      ON CONFLICT (id) DO UPDATE SET assignee_name=EXCLUDED.assignee_name, account=EXCLUDED.account, user_id=EXCLUDED.user_id, updator='seed', update_time=now(), del_flag=0;
    END LOOP;

    FOR j IN 1..2 LOOP
      sku_id := 'test-sku-p' || lpad(i::text,2,'0') || '-' || j;
      INSERT INTO kpm_project_skus (id, project_id, whole_machine_part_number, configuration_name, memory_type, active, creator, updator, del_flag)
      VALUES (
        sku_id,
        project_id,
        'WM-' || internal_names[i] || '-' || lpad(j::text,2,'0'),
        CASE WHEN j = 1 THEN '标准配置' ELSE '旗舰配置' END,
        CASE WHEN j = 1 THEN '2GB+16GB' ELSE '4GB+64GB' END,
        true,
        'seed',
        'seed',
        0
      )
      ON CONFLICT (id) DO UPDATE SET whole_machine_part_number=EXCLUDED.whole_machine_part_number, configuration_name=EXCLUDED.configuration_name, memory_type=EXCLUDED.memory_type, active=true, updator='seed', update_time=now(), updated_at=now(), del_flag=0;
    END LOOP;
  END LOOP;

  -- Customers, owner assignments, project links, orders, requirements, tasks.
  FOR i IN 1..100 LOOP
    customer_id := 'test-customer-' || lpad(i::text, 3, '0');
    idx := ((i - 1) % array_length(regions, 1)) + 1;
    region := regions[idx];
    address := addresses[idx];
    customer_level := (ARRAY['A / 战略客户','B / 重点客户','C / 普通客户','D / 观察客户'])[((i - 1) % 4) + 1];
    customer_status := CASE WHEN i % 17 = 0 THEN '已停用' WHEN i % 5 = 0 THEN '潜在客户' ELSE '合作中' END;

    INSERT INTO kpm_customers (id, name, short_name, region, level, status, address, creator, updator, del_flag)
    VALUES (
      customer_id,
      '全球测试客户 ' || lpad(i::text, 3, '0'),
      'TC' || lpad(i::text, 3, '0'),
      region,
      customer_level,
      customer_status,
      address,
      'seed',
      'seed',
      0
    )
    ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, short_name=EXCLUDED.short_name, region=EXCLUDED.region, level=EXCLUDED.level, status=EXCLUDED.status, address=EXCLUDED.address, updator='seed', update_time=now(), del_flag=0;

    -- basic contact
    INSERT INTO kpm_customer_contacts (id, customer_id, name, title, phone, email, remark, creator, updator, del_flag)
    VALUES (
      'test-contact-' || lpad(i::text, 3, '0'),
      customer_id,
      '联系人' || i,
      CASE WHEN i % 3 = 0 THEN '采购负责人' WHEN i % 3 = 1 THEN '技术负责人' ELSE '项目负责人' END,
      '+86' || (13000000000 + i)::text,
      'contact' || i || '@customer.test',
      '测试联系人，用于客户详情省略展示与弹窗查看。',
      'seed',
      'seed',
      0
    )
    ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, title=EXCLUDED.title, phone=EXCLUDED.phone, email=EXCLUDED.email, remark=EXCLUDED.remark, updator='seed', update_time=now(), del_flag=0;

    -- CTO assigns sales and support owners.
    sales_user_id := 'test-user-b' || lpad((((i * 7) % 10) + 1)::text, 3, '0');
    support_user_id := 'test-user-d' || lpad((((i * 5) % 10) + 1)::text, 3, '0');
    INSERT INTO kpm_customer_owners (id, customer_id, owner_type, owner_user_id, owner_name, creator, updator, del_flag)
    SELECT 'test-owner-sales-' || lpad(i::text,3,'0'), customer_id, 'sales', u.id, u.name, 'seed', 'seed', 0 FROM kpm_users u WHERE u.id = sales_user_id
    ON CONFLICT (id) DO UPDATE SET owner_user_id=EXCLUDED.owner_user_id, owner_name=EXCLUDED.owner_name, updator='seed', update_time=now(), del_flag=0;
    INSERT INTO kpm_customer_owners (id, customer_id, owner_type, owner_user_id, owner_name, creator, updator, del_flag)
    SELECT 'test-owner-support-' || lpad(i::text,3,'0'), customer_id, 'support', u.id, u.name, 'seed', 'seed', 0 FROM kpm_users u WHERE u.id = support_user_id
    ON CONFLICT (id) DO UPDATE SET owner_user_id=EXCLUDED.owner_user_id, owner_name=EXCLUDED.owner_name, updator='seed', update_time=now(), del_flag=0;
    IF i % 4 = 0 THEN
      support_user_id := 'test-user-d' || lpad(((((i * 5) + 3) % 10) + 1)::text, 3, '0');
      INSERT INTO kpm_customer_owners (id, customer_id, owner_type, owner_user_id, owner_name, creator, updator, del_flag)
      SELECT 'test-owner-support-extra-' || lpad(i::text,3,'0'), customer_id, 'support', u.id, u.name, 'seed', 'seed', 0 FROM kpm_users u WHERE u.id = support_user_id
      ON CONFLICT (id) DO UPDATE SET owner_user_id=EXCLUDED.owner_user_id, owner_name=EXCLUDED.owner_name, updator='seed', update_time=now(), del_flag=0;
    END IF;

    -- Link each customer to 1-3 projects.
    FOR j IN 1..(1 + (i % 3)) LOOP
      selected_project_no := (((i + j * 2) - 1) % 10) + 1;
      project_id := 'test-project-' || lpad(selected_project_no::text, 2, '0');
      project_customer_status := customer_project_statuses[(((i + j) - 1) % array_length(customer_project_statuses, 1)) + 1];
      INSERT INTO kpm_project_customers (id, project_id, customer_id, project_status, creator, updator, del_flag)
      VALUES ('test-pc-' || lpad(i::text,3,'0') || '-' || lpad(selected_project_no::text,2,'0'), project_id, customer_id, project_customer_status, 'seed', 'seed', 0)
      ON CONFLICT (project_id, customer_id) DO UPDATE SET project_status=EXCLUDED.project_status, updator='seed', update_time=now(), del_flag=0;
    END LOOP;

    -- Orders: 1-5 random-looking orders per customer, assigned to random sales and random project/SKU.
    order_count := 1 + (i % 5);
    FOR j IN 1..order_count LOOP
      selected_project_no := (((i + j * 3) - 1) % 10) + 1;
      selected_sku_no := 1 + ((i + j) % 2);
      project_id := 'test-project-' || lpad(selected_project_no::text, 2, '0');
      sku_id := 'test-sku-p' || lpad(selected_project_no::text, 2, '0') || '-' || selected_sku_no;
      order_id := 'test-order-' || lpad(i::text,3,'0') || '-' || lpad(j::text,2,'0');
      order_type := order_types[((i + j - 1) % array_length(order_types, 1)) + 1];
      order_status := order_statuses[((i + j - 1) % array_length(order_statuses, 1)) + 1];
      project_customer_status := CASE order_type WHEN '样品订单' THEN '样机测试' WHEN '预订单' THEN '商机发掘' ELSE '订单冲刺' END;
      qty := 20 + ((i * j * 13) % 980);
      price := CASE currencies[((i + j - 1) % 3) + 1] WHEN 'CNY' THEN 760 + ((i * 11 + j * 17) % 900) ELSE 95 + ((i * 7 + j * 13) % 420) END;
      actual_ship := CASE WHEN order_status IN ('已发货','已收货','已完成') THEN (DATE '2026-01-01' + ((i + j) % 150)) ELSE NULL END;

      INSERT INTO kpm_project_customers (id, project_id, customer_id, project_status, creator, updator, del_flag)
      VALUES ('test-pc-order-' || lpad(i::text,3,'0') || '-' || lpad(selected_project_no::text,2,'0'), project_id, customer_id, project_customer_status, 'seed', 'seed', 0)
      ON CONFLICT (project_id, customer_id) DO UPDATE SET project_status=EXCLUDED.project_status, updator='seed', update_time=now(), del_flag=0;

      sales_user_id := 'test-user-b' || lpad((((i * 7) % 10) + 1)::text, 3, '0');
      INSERT INTO kpm_orders (id, order_date, customer_id, project_id, order_type, quantity, specification, expected_ship_date, planned_ship_date, software_version, currency, unit_price, amount, creator, creator_user_id, sku_id, sku_snapshot, status, actual_ship_date, updator, del_flag)
      SELECT
        order_id,
        DATE '2026-01-01' + ((i * 3 + j * 11) % 150),
        customer_id,
        project_id,
        order_type,
        qty,
        ps.whole_machine_part_number || ' / ' || ps.configuration_name || ' / ' || ps.memory_type,
        DATE '2026-07-01' + ((i + j) % 90),
        NULL,
        'V' || (1 + (i % 4)) || '.' || (j % 10) || '.0',
        currencies[((i + j - 1) % 3) + 1],
        price,
        qty * price,
        u.name,
        u.id,
        ps.id,
        jsonb_build_object(
          'wholeMachinePartNumber', ps.whole_machine_part_number,
          'configurationName', ps.configuration_name,
          'memoryType', ps.memory_type
        ),
        order_status,
        actual_ship,
        'seed',
        0
      FROM kpm_project_skus ps, kpm_users u
      WHERE ps.id = sku_id AND u.id = sales_user_id
      ON CONFLICT (id) DO UPDATE SET order_date=EXCLUDED.order_date, customer_id=EXCLUDED.customer_id, project_id=EXCLUDED.project_id, order_type=EXCLUDED.order_type, quantity=EXCLUDED.quantity, specification=EXCLUDED.specification, expected_ship_date=EXCLUDED.expected_ship_date, planned_ship_date=EXCLUDED.planned_ship_date, software_version=EXCLUDED.software_version, currency=EXCLUDED.currency, unit_price=EXCLUDED.unit_price, amount=EXCLUDED.amount, creator=EXCLUDED.creator, creator_user_id=EXCLUDED.creator_user_id, sku_id=EXCLUDED.sku_id, sku_snapshot=EXCLUDED.sku_snapshot, status=EXCLUDED.status, actual_ship_date=EXCLUDED.actual_ship_date, updator='seed', update_time=now(), updated_at=now(), del_flag=0;

      INSERT INTO kpm_order_histories (id, order_id, modifier, changes, reason, creator, updator, del_flag)
      VALUES ('test-order-history-' || lpad(i::text,3,'0') || '-' || lpad(j::text,2,'0'), order_id, 'seed', '测试场景初始化：订单类型=' || order_type || '，状态=' || order_status || '，数量=' || qty || '，金额=' || (qty * price), '初始化测试订单', 'seed', 'seed', 0)
      ON CONFLICT (id) DO UPDATE SET changes=EXCLUDED.changes, reason=EXCLUDED.reason, updator='seed', update_time=now(), del_flag=0;
    END LOOP;

    -- Requirements: 1-10 per customer.
    req_count := 1 + (i % 10);
    FOR j IN 1..req_count LOOP
      selected_project_no := (((i + j) - 1) % 10) + 1;
      project_id := 'test-project-' || lpad(selected_project_no::text, 2, '0');
      requirement_id := 'test-req-' || lpad(i::text,3,'0') || '-' || lpad(j::text,2,'0');
      INSERT INTO kpm_project_customers (id, project_id, customer_id, project_status, creator, updator, del_flag)
      VALUES ('test-pc-req-' || lpad(i::text,3,'0') || '-' || lpad(selected_project_no::text,2,'0'), project_id, customer_id, '研发投入', 'seed', 'seed', 0)
      ON CONFLICT (project_id, customer_id) DO UPDATE SET del_flag=0, updator='seed', update_time=now();
      INSERT INTO kpm_requirements (id, project_id, customer_id, title, user_story, business_value, acceptance, priority, status, proposer, creator, created_date, task_id, updator, del_flag)
      VALUES (
        requirement_id,
        project_id,
        customer_id,
        '客户 ' || lpad(i::text,3,'0') || ' 需求 ' || j,
        '作为全球客户，希望在项目 ' || selected_project_no || ' 上获得更稳定的 POS 体验。',
        CASE WHEN j % 3 = 0 THEN '提升客户复购与规模化出货机会' ELSE '提高项目适配效率' END,
        '完成方案确认、任务关闭，并获得客户测试反馈。',
        priorities[((i + j - 1) % array_length(priorities, 1)) + 1],
        requirement_statuses[((i + j - 1) % array_length(requirement_statuses, 1)) + 1],
        '测试用户B' || (((i * 7) % 10) + 1),
        'seed',
        DATE '2026-01-01' + ((i + j) % 150),
        NULL,
        'seed',
        0
      )
      ON CONFLICT (id) DO UPDATE SET project_id=EXCLUDED.project_id, customer_id=EXCLUDED.customer_id, title=EXCLUDED.title, user_story=EXCLUDED.user_story, business_value=EXCLUDED.business_value, acceptance=EXCLUDED.acceptance, priority=EXCLUDED.priority, status=EXCLUDED.status, proposer=EXCLUDED.proposer, created_date=EXCLUDED.created_date, updator='seed', update_time=now(), del_flag=0;
    END LOOP;

    -- Tasks: some customers intentionally have no tasks; others have 1-10 tasks.
    task_count := CASE WHEN i % 4 = 0 THEN 0 ELSE 1 + (i % 10) END;
    FOR j IN 1..task_count LOOP
      selected_project_no := (((i + j * 2) - 1) % 10) + 1;
      project_id := 'test-project-' || lpad(selected_project_no::text, 2, '0');
      stage_id := 'test-stage-' || lpad(selected_project_no::text,2,'0') || '-' || lpad((((j - 1) % array_length(stage_names, 1)) + 1)::text,2,'0');
      task_id := 'test-task-' || lpad(i::text,3,'0') || '-' || lpad(j::text,2,'0');
      sales_user_id := 'test-user-b' || lpad((((i * 7) % 10) + 1)::text, 3, '0');
      support_user_id := 'test-user-d' || lpad((((i * 5 + j) % 10) + 1)::text, 3, '0');
      rd_user_id := 'test-user-a' || lpad((((i * 11 + j * 7) % 100) + 1)::text, 3, '0');
      INSERT INTO kpm_tasks (id, title, description, project_id, stage_id, category, status, priority, creator, creator_user_id, expected_completion_at, due_date, source, customer_id, blocked, updator, del_flag)
      SELECT
        task_id,
        CASE task_categories[((i + j - 1) % array_length(task_categories, 1)) + 1]
          WHEN 'Bug' THEN '修复客户 ' || lpad(i::text,3,'0') || ' 反馈的稳定性问题 #' || j
          WHEN '技术支持' THEN '协助客户 ' || lpad(i::text,3,'0') || ' 完成现场调试 #' || j
          WHEN '需求' THEN '评估客户 ' || lpad(i::text,3,'0') || ' 的定制需求 #' || j
          ELSE '跟进客户 ' || lpad(i::text,3,'0') || ' 日常事项 #' || j
        END,
        '测试任务：用于模拟不同客户、不同项目、不同状态下的日常协作。',
        project_id,
        stage_id,
        task_categories[((i + j - 1) % array_length(task_categories, 1)) + 1],
        task_statuses[((i + j - 1) % array_length(task_statuses, 1)) + 1],
        priorities[((i + j - 1) % array_length(priorities, 1)) + 1],
        creator.name,
        creator.id,
        DATE '2026-07-01' + ((i + j * 2) % 90),
        DATE '2026-07-01' + ((i + j * 2) % 90),
        CASE WHEN ((i + j) % 6 = 0) THEN '卡点求助' WHEN ((i + j) % 3 = 0) THEN '阶段详情' ELSE '任务管理' END,
        customer_id,
        ((i + j) % 7 = 0),
        'seed',
        0
      FROM kpm_users creator WHERE creator.id = sales_user_id
      ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, project_id=EXCLUDED.project_id, stage_id=EXCLUDED.stage_id, category=EXCLUDED.category, status=EXCLUDED.status, priority=EXCLUDED.priority, creator=EXCLUDED.creator, creator_user_id=EXCLUDED.creator_user_id, expected_completion_at=EXCLUDED.expected_completion_at, due_date=EXCLUDED.due_date, source=EXCLUDED.source, customer_id=EXCLUDED.customer_id, blocked=EXCLUDED.blocked, updator='seed', update_time=now(), updated_at=now(), del_flag=0;

      -- Assignee: support for support/bug, R&D otherwise; participant includes both plus sales.
      IF task_categories[((i + j - 1) % array_length(task_categories, 1)) + 1] IN ('Bug','技术支持') THEN
        INSERT INTO kpm_task_assignees (task_id, assignee_name, user_id, creator, updator, del_flag)
        SELECT task_id, u.name, u.id, 'seed', 'seed', 0 FROM kpm_users u WHERE u.id = support_user_id
        ON CONFLICT (task_id, assignee_name) DO UPDATE SET user_id=EXCLUDED.user_id, updator='seed', update_time=now(), del_flag=0;
      ELSE
        INSERT INTO kpm_task_assignees (task_id, assignee_name, user_id, creator, updator, del_flag)
        SELECT task_id, u.name, u.id, 'seed', 'seed', 0 FROM kpm_users u WHERE u.id = rd_user_id
        ON CONFLICT (task_id, assignee_name) DO UPDATE SET user_id=EXCLUDED.user_id, updator='seed', update_time=now(), del_flag=0;
      END IF;

      INSERT INTO kpm_task_participants (task_id, participant_name, user_id, creator, updator, del_flag)
      SELECT task_id, u.name, u.id, 'seed', 'seed', 0 FROM kpm_users u WHERE u.id IN (support_user_id, rd_user_id, sales_user_id)
      ON CONFLICT (task_id, participant_name) DO UPDATE SET user_id=EXCLUDED.user_id, updator='seed', update_time=now(), del_flag=0;

      -- Link first requirement to the first demand task when available.
      IF j = 1 THEN
        UPDATE kpm_requirements SET task_id = seed_scenario.task_id, updator='seed', update_time=now() WHERE id = 'test-req-' || lpad(i::text,3,'0') || '-01';
      END IF;
    END LOOP;

    -- Follow-up records provide activity signal for customer activity dashboard.
    FOR j IN 1..CASE WHEN i % 6 = 0 THEN 0 ELSE 1 + (i % 3) END LOOP
      INSERT INTO kpm_customer_followups (id, customer_id, author, content, attachments, creator, updator, del_flag)
      VALUES (
        'test-followup-' || lpad(i::text,3,'0') || '-' || j,
        customer_id,
        '测试用户D' || ((((i * 5 + j) % 10) + 1)),
        '测试跟进记录：客户在 ' || region || '，当前关注项目进展、订单交付和技术支持响应。',
        '[]'::jsonb,
        'seed',
        'seed',
        0
      )
      ON CONFLICT (id) DO UPDATE SET content=EXCLUDED.content, author=EXCLUDED.author, updator='seed', update_time=now(), del_flag=0;
    END LOOP;
  END LOOP;
END $$;

-- Quick verification counts.
SELECT 'departments' AS item, count(*) AS count FROM kpm_departments WHERE id LIKE 'test-dept-%' AND del_flag=0
UNION ALL SELECT 'roles', count(*) FROM kpm_roles WHERE id LIKE 'test-role-%' AND del_flag=0
UNION ALL SELECT 'users', count(*) FROM kpm_users WHERE id LIKE 'test-user-%' AND del_flag=0
UNION ALL SELECT 'projects', count(*) FROM kpm_projects WHERE id LIKE 'test-project-%' AND del_flag=0
UNION ALL SELECT 'customers', count(*) FROM kpm_customers WHERE id LIKE 'test-customer-%' AND del_flag=0
UNION ALL SELECT 'orders', count(*) FROM kpm_orders WHERE id LIKE 'test-order-%' AND del_flag=0
UNION ALL SELECT 'requirements', count(*) FROM kpm_requirements WHERE id LIKE 'test-req-%' AND del_flag=0
UNION ALL SELECT 'tasks', count(*) FROM kpm_tasks WHERE id LIKE 'test-task-%' AND del_flag=0;
