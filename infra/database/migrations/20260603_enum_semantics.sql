-- Add enum semantics used by backend business rules. Values stay configurable; semantic tells services how to interpret them.
UPDATE kpm_enum_items SET semantic='DEFAULT' WHERE enum_type='stage_status' AND value='未开始';
UPDATE kpm_enum_items SET semantic='ACTIVE' WHERE enum_type='stage_status' AND value='进行中';
UPDATE kpm_enum_items SET semantic='COMPLETED' WHERE enum_type='stage_status' AND value='已完成';

UPDATE kpm_enum_items SET semantic='DEFAULT' WHERE enum_type='customer_master_status' AND value='潜在客户';
UPDATE kpm_enum_items SET semantic='DEFAULT' WHERE enum_type='customer_level' AND value='C / 普通客户';
UPDATE kpm_enum_items SET semantic='DEFAULT' WHERE enum_type='customer_project_status' AND value='商机发掘';

UPDATE kpm_enum_items SET semantic='样机测试' WHERE enum_type='order_type' AND value='样品订单';
UPDATE kpm_enum_items SET semantic='商机发掘' WHERE enum_type='order_type' AND value='预订单';
UPDATE kpm_enum_items SET semantic='订单冲刺' WHERE enum_type='order_type' AND value='正式订单';

UPDATE kpm_enum_items SET semantic='REQUIREMENT' WHERE enum_type='task_category' AND value='需求';
UPDATE kpm_enum_items SET semantic='DEFAULT' WHERE enum_type='task_status' AND value='待处理';
UPDATE kpm_enum_items SET semantic='DEFAULT' WHERE enum_type='priority' AND value='中';
UPDATE kpm_enum_items SET semantic='DEFAULT' WHERE enum_type='requirement_status' AND value='待评估';
UPDATE kpm_enum_items SET semantic='VOID' WHERE enum_type='requirement_status' AND value='已作废';
