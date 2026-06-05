import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Tabs, Tag, message } from 'antd';
import { useMemo, useState } from 'react';
import { ActionButtons } from '../components/common/ActionButtons';
import { DataState } from '../components/common/DataState';
import { EnumSelect } from '../components/common/EnumSelect';
import { PageScaffold } from '../components/PageScaffold';
import { StatusTag } from '../components/StatusTag';
import { useKpmData, useRefreshKpmData } from '../hooks/useKpmData';
import { confirmSubmit } from '../hooks/useConfirmingForm';
import { kpmApi } from '../services/kpmApi';
import type { AnyRecord, Department, EnumItem, Permission, Role, TaskStatusTransition, User } from '../types';
import { includesKeyword } from '../utils/format';
import { validationRules } from '../validation';

const enumTypeOptions = [
  { label: '阶段状态 stage_status', value: 'stage_status' },
  { label: '客户状态 customer_master_status', value: 'customer_master_status' },
  { label: '客户等级 customer_level', value: 'customer_level' },
  { label: '客户项目状态 customer_project_status', value: 'customer_project_status' },
  { label: '任务分类 task_category', value: 'task_category' },
  { label: '任务状态 task_status', value: 'task_status' },
  { label: '任务优先级 task_priority', value: 'task_priority' },
  { label: '订单类型 order_type', value: 'order_type' },
  { label: '订单状态 order_status', value: 'order_status' },
];

export function ResourcesPage() {
  const { data, isLoading, error } = useKpmData();
  const refresh = useRefreshKpmData();
  const [keyword, setKeyword] = useState('');
  const [enumTypeFilter, setEnumTypeFilter] = useState<string | undefined>();
  const [enumKeyword, setEnumKeyword] = useState('');
  const [userForm] = Form.useForm();
  const [deptForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [enumForm] = Form.useForm();
  const [transitionForm] = Form.useForm();
  const [userModal, setUserModal] = useState<{ open: boolean; row?: User }>({ open: false });
  const [deptModal, setDeptModal] = useState<{ open: boolean; row?: Department }>({ open: false });
  const [roleModal, setRoleModal] = useState<{ open: boolean; row?: Role }>({ open: false });
  const [enumModal, setEnumModal] = useState<{ open: boolean; row?: EnumItem }>({ open: false });
  const [transitionModal, setTransitionModal] = useState(false);

  const permissionOptions = (data?.bootstrap.permissions || []).map((permission) => ({ label: `${permission.name}（${permission.code || permission.key}）`, value: permission.code || permission.key || permission.name }));
  const roleOptions = (data?.bootstrap.roles || []).map((role) => ({ label: role.name, value: role.name }));
  const departmentOptions = (data?.bootstrap.departments || []).map((dept) => ({ label: dept.name, value: dept.name }));

  const filteredUsers = useMemo(() => (data?.bootstrap.users || []).filter((user) => includesKeyword([user.name, user.email, user.account], keyword)), [data?.bootstrap.users, keyword]);
  const enumFilterOptions = useMemo(() => {
    const configured = enumTypeOptions.map((item) => item.value);
    const actual = (data?.bootstrap.enumItems || []).map((item) => item.enumType).filter(Boolean);
    return [...new Set([...configured, ...actual])].map((value) => ({ label: enumTypeOptions.find((item) => item.value === value)?.label || value, value }));
  }, [data?.bootstrap.enumItems]);
  const filteredEnumItems = useMemo(() => (data?.bootstrap.enumItems || []).filter((item) => {
    const matchesType = !enumTypeFilter || item.enumType === enumTypeFilter;
    const matchesKeyword = includesKeyword([item.enumType, item.name, item.value, item.labelZh, item.labelEn, item.shortLabelZh, item.shortLabelEn, item.semantic], enumKeyword);
    return matchesType && matchesKeyword;
  }), [data?.bootstrap.enumItems, enumKeyword, enumTypeFilter]);

  function openUser(row?: User) {
    setUserModal({ open: true, row });
    userForm.setFieldsValue(row || { status: '启用' });
  }

  async function submitUser() {
    const values = await userForm.validateFields();
    const payload = { ...values, account: values.account || values.email };
    confirmSubmit(userModal.row ? '确认修改用户？' : '确认新增用户？', async () => {
      const result = userModal.row ? await kpmApi.updateUser(userModal.row.id, payload) : await kpmApi.createUser(payload);
      message.success(result.defaultPassword ? `用户已创建，默认密码：${result.defaultPassword}` : '用户已保存');
      setUserModal({ open: false });
      userForm.resetFields();
      refresh();
    });
  }

  function openDept(row?: Department) {
    setDeptModal({ open: true, row });
    deptForm.setFieldsValue(row || { status: '启用' });
  }

  async function submitDept() {
    const values = await deptForm.validateFields();
    confirmSubmit(deptModal.row ? '确认修改部门？' : '确认新增部门？', async () => {
      if (deptModal.row) await kpmApi.updateDepartment(deptModal.row.id, values);
      else await kpmApi.createDepartment(values);
      message.success('部门已保存');
      setDeptModal({ open: false });
      deptForm.resetFields();
      refresh();
    });
  }

  function openRole(row?: Role) {
    setRoleModal({ open: true, row });
    roleForm.setFieldsValue(row || { status: '启用', roleType: '全局角色' });
  }

  async function submitRole() {
    const values = await roleForm.validateFields();
    confirmSubmit(roleModal.row ? '确认修改角色？' : '确认新增角色？', async () => {
      if (roleModal.row) await kpmApi.updateRole(roleModal.row.id, values);
      else await kpmApi.createRole(values);
      message.success('角色已保存');
      setRoleModal({ open: false });
      roleForm.resetFields();
      refresh();
    });
  }

  function openEnum(row?: EnumItem) {
    setEnumModal({ open: true, row });
    enumForm.setFieldsValue(row || { active: true, sortOrder: 100 });
  }

  async function submitEnum() {
    const values = await enumForm.validateFields();
    confirmSubmit(enumModal.row ? '确认修改枚举？' : '确认新增枚举？', async () => {
      if (enumModal.row) await kpmApi.updateEnum(enumModal.row.id, values);
      else await kpmApi.createEnum(values);
      message.success('枚举已保存');
      setEnumModal({ open: false });
      enumForm.resetFields();
      refresh();
    });
  }

  async function submitTransition() {
    const values = await transitionForm.validateFields();
    await kpmApi.createTaskStatusTransition(values);
    message.success('流转规则已保存');
    setTransitionModal(false);
    transitionForm.resetFields();
    refresh();
  }

  return (
    <PageScaffold title="资源管理" subtitle="维护组织、角色、权限视图、枚举与任务状态流转。" extra={<Button icon={<ReloadOutlined />} onClick={refresh}>刷新</Button>}>
      <DataState loading={isLoading} error={error}>
        <Tabs
          className="kpm-tabs"
          items={[
            {
              key: 'users', label: '用户管理', children: <Card className="kpm-card" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openUser()}>新增用户</Button>}>
                <Input.Search allowClear placeholder="搜索用户" onSearch={setKeyword} onChange={(e) => setKeyword(e.target.value)} className="kpm-table-search" />
                <Table<User> size="small" rowKey="id" dataSource={filteredUsers} pagination={{ pageSize: 10 }} columns={[
                  { title: '姓名', dataIndex: 'name', width: 120 },
                  { title: '邮箱账号', dataIndex: 'email', ellipsis: true },
                  { title: '部门', dataIndex: 'departments', render: (value?: string[]) => <Space wrap>{(value || []).slice(0, 2).map((item) => <Tag key={item}>{item}</Tag>)}</Space> },
                  { title: '角色', dataIndex: 'globalRoles', render: (value?: string[]) => <Space wrap>{(value || []).slice(0, 2).map((item) => <Tag key={item}>{item}</Tag>)}</Space> },
                  { title: '状态', dataIndex: 'status', width: 90, render: (value) => <StatusTag value={value} /> },
                  { title: '操作', width: 140, render: (_, row) => <ActionButtons onEdit={() => openUser(row)} onDelete={() => kpmApi.deleteUser(row.id).then(() => { message.success('用户已删除'); refresh(); })} extra={<Button size="small" type="text" onClick={() => kpmApi.resetUserPassword(row.id).then((result) => message.success(`默认密码：${result.defaultPassword || '123456'}`))}>重置</Button>} /> },
                ]} />
              </Card>,
            },
            {
              key: 'departments', label: '部门管理', children: <Card className="kpm-card" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openDept()}>新增部门</Button>}>
                <div className="kpm-dept-grid">{(data?.bootstrap.departments || []).map((dept) => <Card key={dept.id} size="small" title={dept.name} extra={<ActionButtons onEdit={() => openDept(dept)} onDelete={() => kpmApi.deleteDepartment(dept.id).then(() => { message.success('部门已删除'); refresh(); })} />}><p>人数：{dept.userCount || 0}</p><StatusTag value={(dept as AnyRecord).status || dept.active} /></Card>)}</div>
              </Card>,
            },
            {
              key: 'roles', label: '角色管理', children: <Card className="kpm-card" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openRole()}>新增角色</Button>}>
                <Table<Role> size="small" rowKey="id" dataSource={data?.bootstrap.roles || []} pagination={{ pageSize: 10 }} columns={[
                  { title: '角色名称', dataIndex: 'name' },
                  { title: '类型', dataIndex: 'roleType' },
                  { title: '权限数量', dataIndex: 'permissions', render: (value?: string[]) => <Tag color="blue">{(value || []).length}</Tag> },
                  { title: '状态', dataIndex: 'status', render: (value) => <StatusTag value={value} /> },
                  { title: '操作', width: 112, render: (_, row) => <ActionButtons onEdit={() => openRole(row)} onDelete={() => kpmApi.deleteRole(row.id).then(() => { message.success('角色已删除'); refresh(); })} /> },
                ]} />
              </Card>,
            },
            {
              key: 'permissions', label: '权限视图', children: <Card className="kpm-card">
                <Table<Permission> size="small" rowKey={(row) => row.code || row.key || row.name} dataSource={data?.bootstrap.permissions || []} pagination={{ pageSize: 12 }} columns={[
                  { title: '权限名称', dataIndex: 'name' },
                  { title: '权限编码', render: (_, row) => <Tag>{row.code || row.key}</Tag> },
                  { title: '类型', render: (_, row) => <Tag color={(row.permissionType || row.type) === 'menu' ? 'blue' : 'green'}>{row.permissionType || row.type}</Tag> },
                  { title: '对应菜单/按钮', render: (_, row) => row.target || row.location || '-' },
                ]} />
              </Card>,
            },
            {
              key: 'enums', label: '枚举管理', children: <Card className="kpm-card" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openEnum()}>新增枚举</Button>}>
                <Space wrap className="kpm-table-toolbar">
                  <Select allowClear showSearch optionFilterProp="label" placeholder="按枚举类型筛选" value={enumTypeFilter} onChange={setEnumTypeFilter} options={enumFilterOptions} style={{ width: 260 }} />
                  <Input.Search allowClear placeholder="搜索名称 / 值 / 中英文显示 / 语义" onSearch={setEnumKeyword} onChange={(event) => setEnumKeyword(event.target.value)} style={{ width: 300 }} />
                  <Tag color="blue">共 {filteredEnumItems.length} 项</Tag>
                </Space>
                <Table<EnumItem> size="small" rowKey="id" dataSource={filteredEnumItems} pagination={{ pageSize: 12, showSizeChanger: true }} scroll={{ x: 1280 }} columns={[
                  { title: '枚举类型', dataIndex: 'enumType', width: 180 },
                  { title: '展示名称', dataIndex: 'name', width: 140 },
                  { title: '值', dataIndex: 'value', width: 120 },
                  { title: '中文显示', dataIndex: 'labelZh', width: 140, render: (value, row) => value || row.name || row.value },
                  { title: '英文显示', dataIndex: 'labelEn', width: 150, render: (value, row) => value || row.name || row.value },
                  { title: '短标签', width: 120, render: (_, row) => <Space size={4}><Tag>{row.shortLabelZh || '-'}</Tag><Tag color="blue">{row.shortLabelEn || '-'}</Tag></Space> },
                  { title: '语义', dataIndex: 'semantic', width: 120 },
                  { title: '状态', dataIndex: 'active', width: 90, render: (value) => <StatusTag value={value} /> },
                  { title: '排序', dataIndex: 'sortOrder', width: 80 },
                  { title: '操作', width: 112, render: (_, row) => <ActionButtons onEdit={() => openEnum(row)} onDelete={() => kpmApi.deleteEnum(row.id).then(() => { message.success('枚举已删除'); refresh(); })} /> },
                ]} />
              </Card>,
            },
            {
              key: 'transitions', label: '任务状态流转', children: <Card className="kpm-card" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setTransitionModal(true)}>新增流转</Button>}>
                <Table<TaskStatusTransition> size="small" rowKey="id" dataSource={data?.bootstrap.taskStatusTransitions || []} pagination={false} columns={[
                  { title: '起始状态', dataIndex: 'fromStatus' },
                  { title: '目标状态', dataIndex: 'toStatus' },
                  { title: '操作', width: 80, render: (_, row) => <ActionButtons onDelete={() => kpmApi.deleteTaskStatusTransition(row.id).then(() => { message.success('流转规则已删除'); refresh(); })} /> },
                ]} />
              </Card>,
            },
          ]}
        />
        <Modal title={userModal.row ? '编辑用户' : '新增用户'} open={userModal.open} maskClosable onCancel={() => setUserModal({ open: false })} onOk={submitUser} width={760}>
          <Form form={userForm} layout="vertical">
            <Form.Item name="name" label="姓名" rules={[validationRules.required('请输入姓名'), validationRules.max(40)]}><Input /></Form.Item>
            <Form.Item name="email" label="邮箱/登录账号" rules={[validationRules.required('请输入邮箱'), validationRules.email()]}><Input /></Form.Item>
            <Form.Item name="departments" label="所属部门"><Select mode="multiple" showSearch optionFilterProp="label" options={departmentOptions} /></Form.Item>
            <Form.Item name="globalRoles" label="全局角色"><Select mode="multiple" showSearch optionFilterProp="label" options={roleOptions} /></Form.Item>
            <Form.Item name="directPermissions" label="直接权限"><Select mode="multiple" showSearch optionFilterProp="label" options={permissionOptions} /></Form.Item>
            <Form.Item name="status" label="状态"><EnumSelect bootstrap={data?.bootstrap} enumType="user_status" /></Form.Item>
          </Form>
        </Modal>
        <Modal title={deptModal.row ? '编辑部门' : '新增部门'} open={deptModal.open} maskClosable onCancel={() => setDeptModal({ open: false })} onOk={submitDept}>
          <Form form={deptForm} layout="vertical"><Form.Item name="name" label="部门名称" rules={[validationRules.required('请输入部门名称')]}><Input /></Form.Item><Form.Item name="status" label="状态"><Select options={[{ label: '启用', value: '启用' }, { label: '停用', value: '停用' }]} /></Form.Item></Form>
        </Modal>
        <Modal title={roleModal.row ? '编辑角色' : '新增角色'} open={roleModal.open} maskClosable onCancel={() => setRoleModal({ open: false })} onOk={submitRole} width={760}>
          <Form form={roleForm} layout="vertical"><Form.Item name="name" label="角色名称" rules={[validationRules.required('请输入角色名称')]}><Input /></Form.Item><Form.Item name="roleType" label="角色类型"><Input /></Form.Item><Form.Item name="status" label="状态"><Select options={[{ label: '启用', value: '启用' }, { label: '停用', value: '停用' }]} /></Form.Item><Form.Item name="permissions" label="角色权限"><Select mode="multiple" showSearch optionFilterProp="label" options={permissionOptions} /></Form.Item></Form>
        </Modal>
        <Modal title={enumModal.row ? '编辑枚举' : '新增枚举'} open={enumModal.open} maskClosable onCancel={() => setEnumModal({ open: false })} onOk={submitEnum} width={760}>
          <Form form={enumForm} layout="vertical">
            <Form.Item name="enumType" label="枚举类型" rules={[validationRules.required('请选择枚举类型')]}><Select showSearch options={enumTypeOptions} /></Form.Item>
            <Space.Compact block>
              <Form.Item name="name" label="展示名称" rules={[validationRules.required('请输入展示名称')]} style={{ width: '50%' }}><Input /></Form.Item>
              <Form.Item name="value" label="枚举值" style={{ width: '50%' }}><Input /></Form.Item>
            </Space.Compact>
            <Space.Compact block>
              <Form.Item name="labelZh" label="中文显示" style={{ width: '50%' }}><Input placeholder="例如：技术支持" /></Form.Item>
              <Form.Item name="labelEn" label="英文显示" style={{ width: '50%' }}><Input placeholder="例如：Support" /></Form.Item>
            </Space.Compact>
            <Space.Compact block>
              <Form.Item name="shortLabelZh" label="中文短标签" style={{ width: '50%' }}><Input maxLength={12} placeholder="例如：支" /></Form.Item>
              <Form.Item name="shortLabelEn" label="英文短标签" style={{ width: '50%' }}><Input maxLength={12} placeholder="例如：S" /></Form.Item>
            </Space.Compact>
            <Form.Item name="semantic" label="语义"><Input placeholder="DEFAULT / ACTIVE / COMPLETED 等" /></Form.Item>
            <Space.Compact block>
              <Form.Item name="active" label="启用" valuePropName="checked" style={{ width: '50%' }}><Switch /></Form.Item>
              <Form.Item name="sortOrder" label="排序" style={{ width: '50%' }}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            </Space.Compact>
          </Form>
        </Modal>
        <Modal title="新增任务状态流转" open={transitionModal} maskClosable onCancel={() => setTransitionModal(false)} onOk={submitTransition}>
          <Form form={transitionForm} layout="vertical"><Form.Item name="fromStatus" label="起始状态" rules={[validationRules.required('请选择起始状态')]}><EnumSelect bootstrap={data?.bootstrap} enumType="task_status" /></Form.Item><Form.Item name="toStatus" label="目标状态" rules={[validationRules.required('请选择目标状态')]}><EnumSelect bootstrap={data?.bootstrap} enumType="task_status" /></Form.Item></Form>
        </Modal>
      </DataState>
    </PageScaffold>
  );
}
