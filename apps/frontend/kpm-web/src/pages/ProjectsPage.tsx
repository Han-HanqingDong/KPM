import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ActionButtons } from '../components/common/ActionButtons';
import { DataState } from '../components/common/DataState';
import { UserSelect } from '../components/common/UserSelect';
import { PageScaffold } from '../components/PageScaffold';
import { useKpmData, useRefreshKpmData } from '../hooks/useKpmData';
import { confirmSubmit } from '../hooks/useConfirmingForm';
import { kpmApi } from '../services/kpmApi';
import type { Project } from '../types';
import { validationRules } from '../validation';

export function ProjectsPage() {
  const { data, isLoading, error } = useKpmData();
  const refresh = useRefreshKpmData();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({ keyword: '', archived: 'false' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12 });
  const projectPageQuery = useQuery({
    queryKey: ['kpm', 'projects-page', filters, pagination.current, pagination.pageSize],
    queryFn: () => kpmApi.projectsPage({
      keyword: filters.keyword,
      archived: filters.archived === 'all' ? undefined : filters.archived,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }),
    placeholderData: (previous) => previous,
    staleTime: 10_000,
  });
  const projects = projectPageQuery.data?.items || [];

  function refreshProjectPage() {
    refresh();
    queryClient.invalidateQueries({ queryKey: ['kpm', 'projects-page'] });
  }

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    form.setFieldsValue({
      externalName: project.externalName,
      internalName: project.internalName,
      modelName: project.modelName,
      managerAccount: project.managerAccount,
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
      refreshProjectPage();
    });
  }

  return (
    <PageScaffold title="项目管理" subtitle="管理 POS 产品项目、阶段、成员、SKU 与客户关联。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增项目</Button>}>
      <DataState loading={isLoading || projectPageQuery.isLoading} error={error || projectPageQuery.error}>
        <Card className="kpm-card kpm-filter-card">
          <Space wrap>
            <Input.Search allowClear placeholder="搜索项目名称 / 型号 / 负责人" onSearch={(keyword) => { setPagination((prev) => ({ ...prev, current: 1 })); setFilters((prev) => ({ ...prev, keyword })); }} onChange={(event) => { setPagination((prev) => ({ ...prev, current: 1 })); setFilters((prev) => ({ ...prev, keyword: event.target.value })); }} />
            <Select value={filters.archived} onChange={(archived) => { setPagination((prev) => ({ ...prev, current: 1 })); setFilters((prev) => ({ ...prev, archived })); }} style={{ width: 140 }} options={[{ label: '未归档', value: 'false' }, { label: '已归档', value: 'true' }, { label: '全部', value: 'all' }]} />
          </Space>
        </Card>
        <Card className="kpm-card">
          <Table<Project>
            size="small"
            rowKey="id"
            dataSource={projects}
            pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: projectPageQuery.data?.total || 0, showSizeChanger: true, onChange: (current, pageSize) => setPagination({ current, pageSize }) }}
            columns={[
              { title: '项目名称', dataIndex: 'externalName', ellipsis: true, render: (name, row) => <button className="link-button truncate" type="button" onClick={() => navigate(`/projects/${row.id}`, { state: { from: '/projects' } })}>{name}</button> },
              { title: '内部名称', dataIndex: 'internalName', ellipsis: true },
              { title: 'Model', dataIndex: 'modelName', width: 120, ellipsis: true },
              { title: '负责人', dataIndex: 'managerName', width: 120, render: (value, row) => value || row.managerAccount || '-' },
              { title: '成员', dataIndex: 'members', width: 90, render: (members = []) => <Tag>{members.length} 人</Tag> },
              { title: 'SKU', dataIndex: 'skus', width: 80, render: (skus = []) => <Tag>{skus.length}</Tag> },
              { title: '操作', width: 120, fixed: 'right', render: (_, row) => <ActionButtons onView={() => navigate(`/projects/${row.id}`, { state: { from: '/projects' } })} onEdit={() => openEdit(row)} onArchive={() => kpmApi.archiveProject(row.id, !row.archived).then(() => { message.success(row.archived ? '已取消归档' : '已归档'); refreshProjectPage(); })} onDelete={() => kpmApi.deleteProject(row.id).then(() => { message.success('项目已删除'); refreshProjectPage(); })} /> },
            ]}
          />
        </Card>
        <Modal title={editing ? '编辑项目' : '新增项目'} open={modalOpen} maskClosable onCancel={() => setModalOpen(false)} onOk={submitProject} okText="保存" width={720}>
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item name="externalName" label="对外名称" rules={[validationRules.required('请输入对外名称'), validationRules.max(120)]}><Input /></Form.Item>
            <Form.Item name="internalName" label="内部名称" rules={[validationRules.max(120)]}><Input /></Form.Item>
            <Form.Item name="modelName" label="Model 名称" rules={[validationRules.max(80)]}><Input /></Form.Item>
            <Form.Item name="managerAccount" label="项目负责人" rules={[validationRules.required('请选择项目负责人')]}><UserSelect bootstrap={data?.bootstrap} /></Form.Item>
            <Form.Item name="members" label="项目成员"><UserSelect bootstrap={data?.bootstrap} mode="multiple" placeholder="输入姓名或邮箱搜索成员" /></Form.Item>
            <Form.Item name="description" label="项目说明" rules={[validationRules.max(1000)]}><Input.TextArea rows={4} /></Form.Item>
          </Form>
        </Modal>
      </DataState>
    </PageScaffold>
  );
}
