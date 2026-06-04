import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButtons } from '../components/common/ActionButtons';
import { DataState } from '../components/common/DataState';
import { EnumSelect } from '../components/common/EnumSelect';
import { UserSelect } from '../components/common/UserSelect';
import { PageScaffold } from '../components/PageScaffold';
import { StatusTag } from '../components/StatusTag';
import { useKpmData, useRefreshKpmData } from '../hooks/useKpmData';
import { confirmSubmit } from '../hooks/useConfirmingForm';
import { kpmApi } from '../services/kpmApi';
import type { Project } from '../types';
import { compareDateDesc, includesKeyword } from '../utils/format';
import { validationRules } from '../validation';

export function ProjectsPage() {
  const { data, isLoading, error } = useKpmData();
  const refresh = useRefreshKpmData();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({ keyword: '', salesability: undefined as string | undefined, archived: 'false' });
  const salesability = Form.useWatch('salesability', form);

  const projects = useMemo(() => {
    return (data?.projects || [])
      .filter((project) => {
        const matchesKeyword = includesKeyword([project.externalName, project.internalName, project.modelName, project.managerName], filters.keyword);
        const matchesSalesability = !filters.salesability || project.salesability === filters.salesability;
        const archived = project.archived === true;
        const matchesArchived = filters.archived === 'all' || String(archived) === filters.archived;
        return matchesKeyword && matchesSalesability && matchesArchived;
      })
      .sort((left, right) => compareDateDesc(left.createdAt, right.createdAt) || String(right.id || '').localeCompare(String(left.id || '')));
  }, [data?.projects, filters]);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ salesability: '不可销售' });
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    form.setFieldsValue({
      externalName: project.externalName,
      internalName: project.internalName,
      modelName: project.modelName,
      managerAccount: project.managerAccount,
      salesability: project.salesability,
      unsellableReason: project.unsellableReason,
      description: project.description,
      members: (project.members || []).map((item) => item.account || item.userAccount).filter(Boolean),
    });
    setModalOpen(true);
  }

  async function submitProject() {
    const values = await form.validateFields();
    const members = (values.members || []).map((account: string) => ({ userAccount: account, role: '项目成员' }));
    const payload = { ...values, members };
    confirmSubmit(editing ? '确认修改项目？' : '确认新增项目？', async () => {
      if (editing) await kpmApi.updateProject(editing.id, payload);
      else await kpmApi.createProject(payload);
      message.success(editing ? '项目已更新' : '项目已创建');
      setModalOpen(false);
      form.resetFields();
      refresh();
    });
  }

  return (
    <PageScaffold title="项目管理" subtitle="管理 POS 产品项目、阶段、成员、SKU 与客户关联。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增项目</Button>}>
      <DataState loading={isLoading} error={error}>
        <Card className="kpm-card kpm-filter-card">
          <Space wrap>
            <Input.Search allowClear placeholder="搜索项目名称 / 型号 / 负责人" onSearch={(keyword) => setFilters((prev) => ({ ...prev, keyword }))} onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))} />
            <EnumSelect bootstrap={data?.bootstrap} enumType="salesability" placeholder="可销售状态" value={filters.salesability} onChange={(value) => setFilters((prev) => ({ ...prev, salesability: value }))} style={{ width: 180 }} />
            <Select value={filters.archived} onChange={(archived) => setFilters((prev) => ({ ...prev, archived }))} style={{ width: 140 }} options={[{ label: '未归档', value: 'false' }, { label: '已归档', value: 'true' }, { label: '全部', value: 'all' }]} />
          </Space>
        </Card>
        <Card className="kpm-card">
          <Table<Project>
            size="small"
            rowKey="id"
            dataSource={projects}
            pagination={{ pageSize: 12, showSizeChanger: true }}
            columns={[
              { title: '项目名称', dataIndex: 'externalName', ellipsis: true, render: (name, row) => <button className="link-button truncate" type="button" onClick={() => navigate(`/projects/${row.id}`, { state: { from: '/projects' } })}>{name}</button> },
              { title: '内部名称', dataIndex: 'internalName', ellipsis: true },
              { title: 'Model', dataIndex: 'modelName', width: 120, ellipsis: true },
              { title: '负责人', dataIndex: 'managerName', width: 120, render: (value, row) => value || row.managerAccount || '-' },
              { title: '状态', dataIndex: 'status', width: 110, render: (value) => <StatusTag value={value} /> },
              { title: '可销售', dataIndex: 'salesability', width: 110, render: (value) => <StatusTag value={value} /> },
              { title: '成员', dataIndex: 'members', width: 90, render: (members = []) => <Tag>{members.length} 人</Tag> },
              { title: 'SKU', dataIndex: 'skus', width: 80, render: (skus = []) => <Tag>{skus.length}</Tag> },
              { title: '操作', width: 120, fixed: 'right', render: (_, row) => <ActionButtons onView={() => navigate(`/projects/${row.id}`, { state: { from: '/projects' } })} onEdit={() => openEdit(row)} onArchive={() => kpmApi.archiveProject(row.id, !row.archived).then(() => { message.success(row.archived ? '已取消归档' : '已归档'); refresh(); })} onDelete={() => kpmApi.deleteProject(row.id).then(() => { message.success('项目已删除'); refresh(); })} /> },
            ]}
          />
        </Card>
        <Modal title={editing ? '编辑项目' : '新增项目'} open={modalOpen} maskClosable onCancel={() => setModalOpen(false)} onOk={submitProject} okText="保存" width={720}>
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item name="externalName" label="对外名称" rules={[validationRules.required('请输入对外名称'), validationRules.max(120)]}><Input /></Form.Item>
            <Form.Item name="internalName" label="内部名称" rules={[validationRules.max(120)]}><Input /></Form.Item>
            <Form.Item name="modelName" label="Model 名称" rules={[validationRules.max(80)]}><Input /></Form.Item>
            <Form.Item name="managerAccount" label="项目负责人" rules={[validationRules.required('请选择项目负责人')]}><UserSelect bootstrap={data?.bootstrap} /></Form.Item>
            <Form.Item name="salesability" label="可销售状态" rules={[validationRules.required('请选择可销售状态')]}><EnumSelect bootstrap={data?.bootstrap} enumType="salesability" /></Form.Item>
            {salesability === '可销售' ? null : <Form.Item name="unsellableReason" label="不可销售原因"><EnumSelect bootstrap={data?.bootstrap} enumType="unsellable_reason" /></Form.Item>}
            <Form.Item name="members" label="项目成员"><UserSelect bootstrap={data?.bootstrap} mode="multiple" placeholder="输入姓名或邮箱搜索成员" /></Form.Item>
            <Form.Item name="description" label="项目说明" rules={[validationRules.max(1000)]}><Input.TextArea rows={4} /></Form.Item>
          </Form>
        </Modal>
      </DataState>
    </PageScaffold>
  );
}
