import { ArrowLeftOutlined, PlusOutlined, TeamOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Descriptions, Drawer, Empty, Form, Input, Modal, Select, Space, Table, Tabs, Tag, Typography, Upload, message } from 'antd';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ActionButtons } from '../components/common/ActionButtons';
import { CustomerSelect } from '../components/common/CustomerSelect';
import { DataState } from '../components/common/DataState';
import { EnumSelect } from '../components/common/EnumSelect';
import { UserSelect } from '../components/common/UserSelect';
import { PageScaffold } from '../components/PageScaffold';
import { StatusTag } from '../components/StatusTag';
import { useAuth } from '../context/AuthContext';
import { useKpmData, useRefreshKpmData } from '../hooks/useKpmData';
import { confirmSubmit } from '../hooks/useConfirmingForm';
import { kpmApi } from '../services/kpmApi';
import type { AnyRecord, ProjectSku, ProjectStage } from '../types';
import { MAX_ATTACHMENT_SIZE_MB, attachmentLimitMessage, downloadBusinessFile, isWithinAttachmentLimit, normalizeUploadFiles, uploadBusinessFiles } from '../utils/fileUpload';
import { dateTimeText, enumValues, includesKeyword } from '../utils/format';
import { validationRules } from '../validation';

function uploadFileList(event: AnyRecord) {
  return Array.isArray(event) ? event : event?.fileList;
}


function beforeUpload(file: File) {
  if (!isWithinAttachmentLimit(file)) {
    message.error(attachmentLimitMessage(file.name));
    return Upload.LIST_IGNORE;
  }
  return false;
}

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const refresh = useRefreshKpmData();
  const { data, isLoading, error } = useKpmData();
  const { user } = useAuth();
  const [skuForm] = Form.useForm();
  const [memberForm] = Form.useForm();
  const [linkForm] = Form.useForm();
  const [stageRecordForm] = Form.useForm();
  const [stageMaterialForm] = Form.useForm();
  const [stageTaskForm] = Form.useForm();
  const [stageAssigneeForm] = Form.useForm();
  const [requirementForm] = Form.useForm();
  const [skuModal, setSkuModal] = useState<{ open: boolean; row?: ProjectSku }>({ open: false });
  const [memberModal, setMemberModal] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [stageDetail, setStageDetail] = useState<ProjectStage | null>(null);
  const [stageRecordModal, setStageRecordModal] = useState(false);
  const [stageMaterialModal, setStageMaterialModal] = useState(false);
  const [stageTaskModal, setStageTaskModal] = useState(false);
  const [stageAssigneeStage, setStageAssigneeStage] = useState<ProjectStage | null>(null);
  const [requirementsCustomer, setRequirementsCustomer] = useState<AnyRecord | null>(null);
  const [requirementModal, setRequirementModal] = useState(false);
  const [projectCustomerKeyword, setProjectCustomerKeyword] = useState('');

  const project = useMemo(() => (data?.projects || []).find((item) => item.id === id), [data?.projects, id]);
  const activeStage = useMemo(() => (project?.stages || []).find((stage) => stage.id === stageDetail?.id) || stageDetail, [project?.stages, stageDetail]);
  const activeProjectCustomer = useMemo(() => (project?.projectCustomers || []).find((customer: AnyRecord) => customer.customerId === requirementsCustomer?.customerId) || requirementsCustomer, [project?.projectCustomers, requirementsCustomer]);
  const filteredProjectCustomers = useMemo(() => (project?.projectCustomers || []).filter((customer: AnyRecord) => includesKeyword([customer.customerName, customer.name, customer.shortName, customer.region, customer.projectStatus], projectCustomerKeyword)), [project?.projectCustomers, projectCustomerKeyword]);
  const backTo = (location.state as { from?: string } | null)?.from || '/projects';
  const operatorName = user?.name || user?.account || '当前用户';
  const taskDefaults = useMemo(() => ({
    category: enumValues(data?.bootstrap?.enumItems || [], 'task_category', ['其他'])[0],
    status: enumValues(data?.bootstrap?.enumItems || [], 'task_status', ['待处理'])[0],
    priority: enumValues(data?.bootstrap?.enumItems || [], 'task_priority', ['中'])[0],
    requirementStatus: enumValues(data?.bootstrap?.enumItems || [], 'requirement_status', ['待处理'])[0],
  }), [data?.bootstrap?.enumItems]);

  function openSku(row?: ProjectSku) {
    setSkuModal({ open: true, row });
    skuForm.setFieldsValue(row || { active: true });
  }

  async function submitSku() {
    const values = await skuForm.validateFields();
    confirmSubmit(skuModal.row ? '确认修改 SKU？' : '确认新增 SKU？', async () => {
      if (skuModal.row) await kpmApi.updateProjectSku(id, skuModal.row.id, values);
      else await kpmApi.createProjectSku(id, values);
      message.success('SKU 已保存');
      setSkuModal({ open: false });
      skuForm.resetFields();
      refresh();
    });
  }

  function openMembers() {
    memberForm.setFieldsValue({ members: (project?.members || []).map((member) => ({ userAccount: member.account || member.userAccount, role: member.roleName || member.role })) });
    setMemberModal(true);
  }

  async function submitMembers() {
    const values = await memberForm.validateFields();
    confirmSubmit('确认保存项目成员？', async () => {
      await kpmApi.replaceProjectMembers(id, (values.members || []).map((member: { userAccount: string; role: string }) => ({ userAccount: member.userAccount, role: member.role })));
      message.success('项目成员已更新');
      setMemberModal(false);
      refresh();
    });
  }

  async function submitCustomerLink() {
    const values = await linkForm.validateFields();
    confirmSubmit('确认关联客户？', async () => {
      await kpmApi.linkProjectCustomer(id, values);
      message.success('客户已关联到项目');
      setCustomerModal(false);
      linkForm.resetFields();
      refresh();
    });
  }

  async function updateStage(stage: ProjectStage, status: string) {
    await kpmApi.updateStage(stage.id, { status });
    message.success('阶段状态已更新');
    refresh();
  }

  function stageAssigneeAccounts(stage?: ProjectStage | null) {
    return (((stage as AnyRecord)?.assignees || []) as AnyRecord[])
      .map((item) => item.account || item.userAccount)
      .filter(Boolean);
  }

  function renderStageAssignees(stage?: ProjectStage | null, max = 3) {
    const assignees = (((stage as AnyRecord)?.assignees || []) as AnyRecord[]);
    if (!assignees.length) return <Typography.Text type="secondary">未设置</Typography.Text>;
    return <Space size={4} wrap>{assignees.slice(0, max).map((item) => <Tag key={item.account || item.assigneeName || item.name}>{item.assigneeName || item.name || item.account}</Tag>)}{assignees.length > max ? <Tag>+{assignees.length - max}</Tag> : null}</Space>;
  }

  function openStageAssigneeModal(stage: ProjectStage) {
    const latest = (project?.stages || []).find((item) => item.id === stage.id) || stage;
    setStageAssigneeStage(latest);
    stageAssigneeForm.resetFields();
    stageAssigneeForm.setFieldsValue({ assigneeAccounts: stageAssigneeAccounts(latest) });
  }

  async function submitStageAssignees() {
    if (!stageAssigneeStage) return;
    const values = await stageAssigneeForm.validateFields();
    const accounts = (values.assigneeAccounts || []) as string[];
    confirmSubmit('确认保存阶段负责人？', async () => {
      await kpmApi.replaceStageAssignees(stageAssigneeStage.id, { assignees: accounts.map((account) => ({ type: 'user', account })) });
      message.success('阶段负责人已更新');
      setStageAssigneeStage(null);
      stageAssigneeForm.resetFields();
      refresh();
    });
  }

  async function submitStageMaterial() {
    if (!activeStage) return;
    const values = await stageMaterialForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    if (!files.length) {
      message.warning('请选择要上传的阶段资料');
      return;
    }
    const materials = await uploadBusinessFiles(files, 'project-stage-materials', activeStage.id, operatorName);
    await Promise.all(materials.map((material) => kpmApi.addStageMaterial(activeStage.id, material)));
    message.success('阶段资料已上传');
    setStageMaterialModal(false);
    stageMaterialForm.resetFields();
    refresh();
  }

  async function submitStageRecord() {
    if (!activeStage) return;
    const values = await stageRecordForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    const attachments = files.length ? await uploadBusinessFiles(files, 'stage-record-attachments', activeStage.id, operatorName) : [];
    await kpmApi.addStageRecord(activeStage.id, { author: operatorName, content: values.content, attachments });
    message.success('阶段记录已发布');
    setStageRecordModal(false);
    stageRecordForm.resetFields();
    refresh();
  }

  async function publishStageMaterial(material: AnyRecord) {
    confirmSubmit('确认发布该阶段资料到项目资料区？', async () => {
      await kpmApi.publishStageMaterial(material.id);
      message.success('已发布到项目资料区');
      refresh();
    });
  }

  function openStageTask() {
    stageTaskForm.resetFields();
    stageTaskForm.setFieldsValue({ category: taskDefaults.category, status: taskDefaults.status, priority: taskDefaults.priority, creator: operatorName, blocked: false });
    setStageTaskModal(true);
  }

  async function submitStageTask() {
    if (!activeStage) return;
    const values = await stageTaskForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    const { files: _files, ...payload } = values;
    const task = await kpmApi.createTask({
      ...payload,
      projectId: id,
      stageId: activeStage.id,
      creator: operatorName,
      source: '阶段详情',
    });
    if (files.length) {
      const materials = await uploadBusinessFiles(files, 'task-attachments', task.id, operatorName);
      for (const material of materials) {
        await kpmApi.addTaskAttachment(task.id, material);
      }
    }
    message.success('阶段任务已创建');
    setStageTaskModal(false);
    stageTaskForm.resetFields();
    refresh();
  }

  async function submitRequirement() {
    if (!activeProjectCustomer) return;
    const values = await requirementForm.validateFields();
    await kpmApi.createRequirement(id, activeProjectCustomer.customerId, {
      ...values,
      proposer: values.proposer || activeProjectCustomer.customerName || activeProjectCustomer.name,
      creator: operatorName,
    });
    message.success('客户需求已新增');
    setRequirementModal(false);
    requirementForm.resetFields();
    refresh();
  }

  if (!project && !isLoading) {
    return <PageScaffold title="项目详情"><Empty description="项目不存在或已删除" /></PageScaffold>;
  }

  return (
    <PageScaffold
      title={project?.externalName || '项目详情'}
      subtitle="查看项目阶段、成员、SKU、客户关联、需求与资料。"
      extra={<Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backTo)}>返回</Button>}
    >
      <DataState loading={isLoading} error={error}>
        {project ? (
          <>
            <Card className="kpm-card">
              <Descriptions size="small" column={{ xs: 1, md: 3 }}>
                <Descriptions.Item label="内部名称">{project.internalName || '-'}</Descriptions.Item>
                <Descriptions.Item label="Model">{project.modelName || '-'}</Descriptions.Item>
                <Descriptions.Item label="负责人">{project.managerName || project.managerAccount || '-'}</Descriptions.Item>
                <Descriptions.Item label="项目状态"><StatusTag value={project.status} /></Descriptions.Item>
                <Descriptions.Item label="可销售"><StatusTag value={project.salesability} /></Descriptions.Item>
                <Descriptions.Item label="成员"><Button type="link" onClick={openMembers}>{project.members?.length || 0} 人</Button></Descriptions.Item>
                <Descriptions.Item label="客户">{project.projectCustomers?.length || 0} 个</Descriptions.Item>
                <Descriptions.Item label="SKU">{project.skus?.length || 0} 个</Descriptions.Item>
              </Descriptions>
            </Card>
            <Tabs
              className="kpm-tabs"
              items={[
                {
                  key: 'stages',
                  label: '阶段',
                  children: <Table<ProjectStage> size="small" rowKey="id" dataSource={project.stages || []} pagination={false} columns={[
                    { title: '阶段', render: (_, row: ProjectStage) => <button className="link-button" type="button" onClick={() => setStageDetail(row)}>{row.name || (row as AnyRecord).stageName || '-'}</button> },
                    { title: '状态', width: 220, render: (_, row) => <EnumSelect bootstrap={data?.bootstrap} enumType="stage_status" value={row.status} onChange={(value) => value && updateStage(row, value)} /> },
                    { title: '负责人', render: (_, row: ProjectStage) => <Space size={8} wrap>{renderStageAssignees(row)}<Button size="small" type="link" icon={<TeamOutlined />} onClick={() => openStageAssigneeModal(row)}>维护</Button></Space> },
                    { title: '资料', width: 90, render: (_, row: AnyRecord) => <Tag>{(row.materials || []).length}</Tag> },
                    { title: '记录', width: 90, render: (_, row: AnyRecord) => <Tag>{(row.records || []).length}</Tag> },
                    { title: '操作', width: 120, render: (_, row) => <Button size="small" type="primary" ghost onClick={() => setStageDetail(row)}>阶段详情</Button> },
                  ]} />,
                },
                {
                  key: 'skus', label: 'SKU 管理', children: <Card className="kpm-card" extra={<Button icon={<PlusOutlined />} onClick={() => openSku()}>新增 SKU</Button>}><Table<ProjectSku> size="small" rowKey="id" dataSource={project.skus || []} pagination={false} columns={[
                    { title: '整机料号', dataIndex: 'wholeMachinePartNumber', ellipsis: true },
                    { title: '配置名称', dataIndex: 'configurationName', ellipsis: true },
                    { title: '内存类型', dataIndex: 'memoryType', width: 120 },
                    { title: '状态', dataIndex: 'active', width: 90, render: (value) => <StatusTag value={value} /> },
                    { title: '操作', width: 100, render: (_, row) => <ActionButtons onEdit={() => openSku(row)} onDelete={() => kpmApi.deleteProjectSku(id, row.id).then(() => { message.success('SKU 已删除'); refresh(); })} /> },
                  ]} /></Card>,
                },
                {
                  key: 'customers', label: '关联客户', children: <Card className="kpm-card" extra={<Space><Input.Search allowClear placeholder="搜索客户 / 地区 / 状态" onSearch={setProjectCustomerKeyword} onChange={(event) => setProjectCustomerKeyword(event.target.value)} style={{ width: 260 }} /><Button icon={<PlusOutlined />} onClick={() => setCustomerModal(true)}>关联客户</Button></Space>}><Table size="small" rowKey={(row: AnyRecord) => row.customerId || row.id} dataSource={filteredProjectCustomers} pagination={{ pageSize: 8, showSizeChanger: true }} columns={[
                    { title: '客户', render: (_, row: AnyRecord) => row.customerName || row.name },
                    { title: '地区', dataIndex: 'region' },
                    { title: '项目状态', dataIndex: 'projectStatus', render: (value: string, row: AnyRecord) => <EnumSelect bootstrap={data?.bootstrap} enumType="customer_project_status" value={value} onChange={(next) => kpmApi.updateProjectCustomerStatus(id, row.customerId, { projectStatus: next }).then(() => { message.success('客户项目状态已更新'); refresh(); })} /> },
                    { title: '客户需求', width: 120, render: (_, row: AnyRecord) => <Button size="small" onClick={() => setRequirementsCustomer(row)}>需求列表</Button> },
                  ]} /></Card>,
                },
                {
                  key: 'requirements', label: '需求纵览', children: <Table size="small" rowKey={(row: AnyRecord) => row.id || row.title} dataSource={project.requirements || []} columns={[
                    { title: '需求', dataIndex: 'title', ellipsis: true },
                    { title: '客户', dataIndex: 'customerName' },
                    { title: '优先级', dataIndex: 'priority' },
                    { title: '状态', dataIndex: 'status', render: (value) => <StatusTag value={value} /> },
                    { title: '任务', dataIndex: 'taskId', render: (value) => value ? <Button type="link" onClick={() => navigate(`/tasks?id=${value}`)}>查看任务</Button> : '-' },
                  ]} />,
                },
                {
                  key: 'materials', label: '项目资料', children: <Table size="small" rowKey={(row: AnyRecord) => row.id} dataSource={project.materials || []} columns={[
                    { title: '文件名', dataIndex: 'fileName', ellipsis: true },
                    { title: '来源阶段', dataIndex: 'sourceStage' },
                    { title: '上传人', dataIndex: 'uploader' },
                    { title: '发布时间', dataIndex: 'publishedAt', render: dateTimeText },
                    { title: '操作', width: 90, render: (_, row: AnyRecord) => <Button size="small" onClick={() => downloadBusinessFile(row).catch((err) => message.error(err.message || '下载失败'))}>下载</Button> },
                  ]} />,
                },
              ]}
            />
            <Drawer title={activeStage ? `阶段详情：${(activeStage as AnyRecord).name || (activeStage as AnyRecord).stageName || '-'}` : '阶段详情'} open={Boolean(stageDetail)} onClose={() => setStageDetail(null)} width={860}>
              {activeStage ? <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Descriptions bordered size="small" column={2}>
                  <Descriptions.Item label="阶段名称">{(activeStage as AnyRecord).name || (activeStage as AnyRecord).stageName || '-'}</Descriptions.Item>
                  <Descriptions.Item label="状态"><StatusTag value={activeStage.status} /></Descriptions.Item>
                  <Descriptions.Item label="负责人" span={2}>
                    <Space wrap>{renderStageAssignees(activeStage, 6)}<Button size="small" icon={<TeamOutlined />} onClick={() => openStageAssigneeModal(activeStage)}>维护负责人</Button></Space>
                  </Descriptions.Item>
                </Descriptions>

                <Card size="small" title="阶段资料库" extra={<Button size="small" icon={<UploadOutlined />} onClick={() => setStageMaterialModal(true)}>上传资料</Button>}>
                  <Table size="small" rowKey={(row: AnyRecord) => row.id} pagination={{ pageSize: 5 }} dataSource={(activeStage as AnyRecord).materials || []} columns={[
                    { title: '文件名', dataIndex: 'fileName', ellipsis: true },
                    { title: '上传人', dataIndex: 'uploader', width: 120 },
                    { title: '上传时间', dataIndex: 'uploadedAt', width: 170, render: dateTimeText },
                    { title: '操作', width: 230, render: (_, row: AnyRecord) => <Space><Button size="small" onClick={() => downloadBusinessFile(row).catch((err) => message.error(err.message || '下载失败'))}>下载</Button><Button size="small" disabled={row.publishedToProject} onClick={() => publishStageMaterial(row)}>{row.publishedToProject ? '已发布' : '发布到项目资料区'}</Button></Space> },
                  ]} />
                </Card>

                <Card size="small" title="阶段留言 / 记录" extra={<Space><Button size="small" onClick={openStageTask}>新建阶段任务</Button><Button size="small" type="primary" onClick={() => setStageRecordModal(true)}>新增记录</Button></Space>}>
                  {((activeStage as AnyRecord).records || []).length ? <Space direction="vertical" style={{ width: '100%' }}>
                    {((activeStage as AnyRecord).records || []).map((record: AnyRecord) => <article className="kpm-comment" key={record.id}>
                      <strong>{record.author}</strong>
                      <Typography.Paragraph>{record.content || '-'}</Typography.Paragraph>
                      {(record.attachments || []).length ? <Space wrap>{record.attachments.map((file: AnyRecord, index: number) => <Tag key={file.objectKey || file.fileName || index}>{file.fileName || file.name || '附件'}</Tag>)}</Space> : null}
                      <small>{dateTimeText(record.createdAt)}</small>
                    </article>)}
                  </Space> : <Typography.Text type="secondary">暂无阶段记录</Typography.Text>}
                </Card>
              </Space> : null}
            </Drawer>

            <Drawer title={activeProjectCustomer ? `${activeProjectCustomer.customerName || activeProjectCustomer.name} · 客户需求` : '客户需求'} open={Boolean(requirementsCustomer)} onClose={() => setRequirementsCustomer(null)} width={920}>
              {activeProjectCustomer ? <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <Card size="small" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { requirementForm.resetFields(); requirementForm.setFieldsValue({ priority: taskDefaults.priority, status: taskDefaults.requirementStatus, createTask: true }); setRequirementModal(true); }}>新增需求</Button>}>
                  <Descriptions size="small" bordered column={3}>
                    <Descriptions.Item label="客户">{activeProjectCustomer.customerName || activeProjectCustomer.name}</Descriptions.Item>
                    <Descriptions.Item label="地区">{activeProjectCustomer.region || '-'}</Descriptions.Item>
                    <Descriptions.Item label="项目状态"><StatusTag value={activeProjectCustomer.projectStatus} /></Descriptions.Item>
                  </Descriptions>
                </Card>
                <Table size="small" rowKey={(row: AnyRecord) => row.id} pagination={{ pageSize: 8 }} dataSource={activeProjectCustomer.requirements || []} columns={[
                  { title: '需求', dataIndex: 'title', ellipsis: true },
                  { title: '优先级', dataIndex: 'priority', width: 90 },
                  { title: '状态', dataIndex: 'status', width: 110, render: (value) => <StatusTag value={value} /> },
                  { title: '任务', dataIndex: 'taskId', width: 110, render: (value) => value ? <Button size="small" type="link" onClick={() => navigate(`/tasks?id=${value}`, { state: { from: `/projects/${id}` } })}>查看任务</Button> : '-' },
                  { title: '操作', width: 150, render: (_, row: AnyRecord) => <Space><Button size="small" onClick={() => kpmApi.voidRequirement(row.id).then(() => { message.success('需求已作废'); refresh(); })}>作废</Button><Button size="small" danger onClick={() => kpmApi.deleteRequirement(row.id).then(() => { message.success('需求已删除'); refresh(); })}>删除</Button></Space> },
                ]} />
              </Space> : null}
            </Drawer>

            <Modal title="维护项目成员" open={memberModal} maskClosable onCancel={() => setMemberModal(false)} onOk={submitMembers} width={760}>
              <Form form={memberForm} layout="vertical">
                <Form.List name="members">
                  {(fields, { add, remove }) => (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {fields.map((field) => <Space key={field.key} align="baseline" style={{ display: 'flex' }}>
                        <Form.Item {...field} name={[field.name, 'userAccount']} rules={[validationRules.required('请选择成员')]}><UserSelect bootstrap={data?.bootstrap} style={{ width: 280 }} /></Form.Item>
                        <Form.Item {...field} name={[field.name, 'role']} rules={[validationRules.required('请输入项目角色')]}><Input placeholder="项目角色" style={{ width: 180 }} /></Form.Item>
                        <Button onClick={() => remove(field.name)}>移除</Button>
                      </Space>)}
                      <Button onClick={() => add()} icon={<PlusOutlined />}>增加成员</Button>
                    </Space>
                  )}
                </Form.List>
              </Form>
            </Modal>
            <Modal title={skuModal.row ? '编辑 SKU' : '新增 SKU'} open={skuModal.open} maskClosable onCancel={() => setSkuModal({ open: false })} onOk={submitSku}>
              <Form form={skuForm} layout="vertical">
                <Form.Item name="wholeMachinePartNumber" label="整机料号" rules={[validationRules.required('请输入整机料号')]}><Input /></Form.Item>
                <Form.Item name="configurationName" label="配置名称" rules={[validationRules.required('请输入配置名称')]}><Input /></Form.Item>
                <Form.Item name="memoryType" label="内存类型" rules={[validationRules.required('请输入内存类型')]}><Input /></Form.Item>
                <Form.Item name="active" label="是否启用"><Select options={[{ label: '启用', value: true }, { label: '停用', value: false }]} /></Form.Item>
              </Form>
            </Modal>
            <Modal title="关联客户" open={customerModal} maskClosable onCancel={() => setCustomerModal(false)} onOk={submitCustomerLink}>
              <Form form={linkForm} layout="vertical">
                <Form.Item name="customerId" label="客户" rules={[validationRules.required('请选择客户')]}><CustomerSelect customers={data?.customers} /></Form.Item>
                <Form.Item name="projectStatus" label="客户项目状态" rules={[validationRules.required('请选择客户项目状态')]}><EnumSelect bootstrap={data?.bootstrap} enumType="customer_project_status" /></Form.Item>
              </Form>
            </Modal>
            <Modal title="上传阶段资料" open={stageMaterialModal} maskClosable onCancel={() => setStageMaterialModal(false)} onOk={submitStageMaterial} okText="上传">
              <Form form={stageMaterialForm} layout="vertical">
                <Form.Item name="files" label="选择文件" valuePropName="fileList" getValueFromEvent={uploadFileList} rules={[validationRules.required('请选择文件')]}>
                  <Upload multiple beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
            <Modal title="新增阶段记录" open={stageRecordModal} maskClosable onCancel={() => setStageRecordModal(false)} onOk={submitStageRecord} okText="发布">
              <Form form={stageRecordForm} layout="vertical">
                <Form.Item name="content" label="记录内容" rules={[validationRules.required('请输入记录内容'), validationRules.max(2000)]}><Input.TextArea rows={5} /></Form.Item>
                <Form.Item name="files" label="附件" valuePropName="fileList" getValueFromEvent={uploadFileList}>
                  <Upload multiple beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>选择附件</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
            <Modal title={stageAssigneeStage ? `维护阶段负责人：${(stageAssigneeStage as AnyRecord).name || (stageAssigneeStage as AnyRecord).stageName || '-'}` : '维护阶段负责人'} open={Boolean(stageAssigneeStage)} maskClosable onCancel={() => setStageAssigneeStage(null)} onOk={submitStageAssignees} width={620} okText="保存">
              <Form form={stageAssigneeForm} layout="vertical">
                <Form.Item name="assigneeAccounts" label="阶段负责人" extra="支持多选，必须从已有用户中搜索选择。">
                  <UserSelect bootstrap={data?.bootstrap} mode="multiple" placeholder="输入姓名或邮箱搜索负责人" />
                </Form.Item>
              </Form>
            </Modal>
            <Modal title="新建阶段任务" open={stageTaskModal} maskClosable onCancel={() => setStageTaskModal(false)} onOk={submitStageTask} width={720}>
              <Form form={stageTaskForm} layout="vertical">
                <Form.Item name="title" label="任务标题" rules={[validationRules.required('请输入任务标题'), validationRules.max(120)]}><Input /></Form.Item>
                <Form.Item name="description" label="任务描述" rules={[validationRules.max(3000)]}><Input.TextArea rows={4} /></Form.Item>
                <Space.Compact block>
                  <Form.Item name="customerId" label="客户" style={{ width: '50%' }}><CustomerSelect customers={data?.customers} placeholder="不选择则为所有客户" /></Form.Item>
                  <Form.Item name="priority" label="优先级" rules={[validationRules.required('请选择优先级')]} style={{ width: '50%' }}><EnumSelect bootstrap={data?.bootstrap} enumType="task_priority" /></Form.Item>
                </Space.Compact>
                <Space.Compact block>
                  <Form.Item name="category" label="分类" rules={[validationRules.required('请选择分类')]} style={{ width: '50%' }}><EnumSelect bootstrap={data?.bootstrap} enumType="task_category" /></Form.Item>
                  <Form.Item name="status" label="状态" rules={[validationRules.required('请选择状态')]} style={{ width: '50%' }}><EnumSelect bootstrap={data?.bootstrap} enumType="task_status" /></Form.Item>
                </Space.Compact>
                <Form.Item name="assignees" label="执行者"><UserSelect bootstrap={data?.bootstrap} mode="multiple" /></Form.Item>
                <Form.Item name="participants" label="参与者"><UserSelect bootstrap={data?.bootstrap} mode="multiple" /></Form.Item>
                <Form.Item name="expectedCompletionAt" label="预期完成时间"><Input type="date" /></Form.Item>
                <Form.Item name="files" label={`附件（可选，单个不超过 ${MAX_ATTACHMENT_SIZE_MB}MB）`} valuePropName="fileList" getValueFromEvent={uploadFileList}>
                  <Upload multiple beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>选择附件</Button>
                  </Upload>
                </Form.Item>
                <Form.Item name="blocked" valuePropName="checked"><Checkbox>标记为卡点任务</Checkbox></Form.Item>
              </Form>
            </Modal>
            <Modal title="新增客户需求" open={requirementModal} maskClosable onCancel={() => setRequirementModal(false)} onOk={submitRequirement} width={760}>
              <Form form={requirementForm} layout="vertical">
                <Form.Item name="title" label="需求标题" rules={[validationRules.required('请输入需求标题'), validationRules.max(120)]}><Input /></Form.Item>
                <Form.Item name="userStory" label="用户故事" rules={[validationRules.required('请输入用户故事'), validationRules.max(1500)]}><Input.TextArea rows={3} placeholder="作为...我希望...以便..." /></Form.Item>
                <Form.Item name="businessValue" label="业务价值" rules={[validationRules.required('请输入业务价值'), validationRules.max(1000)]}><Input.TextArea rows={2} /></Form.Item>
                <Form.Item name="acceptance" label="验收标准" rules={[validationRules.required('请输入验收标准'), validationRules.max(1500)]}><Input.TextArea rows={3} /></Form.Item>
                <Space.Compact block>
                  <Form.Item name="priority" label="优先级" rules={[validationRules.required('请选择优先级')]} style={{ width: '50%' }}><EnumSelect bootstrap={data?.bootstrap} enumType="task_priority" /></Form.Item>
                  <Form.Item name="status" label="需求状态" style={{ width: '50%' }}><EnumSelect bootstrap={data?.bootstrap} enumType="requirement_status" /></Form.Item>
                </Space.Compact>
                <Form.Item name="proposer" label="提出人" rules={[validationRules.max(60)]}><Input placeholder="默认使用客户名称" /></Form.Item>
                <Form.Item name="createTask" valuePropName="checked"><Checkbox>同时创建关联任务</Checkbox></Form.Item>
              </Form>
            </Modal>
          </>
        ) : null}
      </DataState>
    </PageScaffold>
  );
}
