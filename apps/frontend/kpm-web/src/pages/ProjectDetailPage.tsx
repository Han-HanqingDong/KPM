import {
  ArrowLeftOutlined,
  LockOutlined,
  NotificationOutlined,
  PlusOutlined,
  TeamOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ActionButtons } from "../components/common/ActionButtons";
import { CustomerSelect } from "../components/common/CustomerSelect";
import { DataState } from "../components/common/DataState";
import { EnumSelect } from "../components/common/EnumSelect";
import { UserSelect } from "../components/common/UserSelect";
import { PageScaffold } from "../components/PageScaffold";
import { StatusTag } from "../components/StatusTag";
import { useAuth } from "../context/AuthContext";
import { useKpmData, useRefreshKpmData } from "../hooks/useKpmData";
import { confirmSubmit } from "../hooks/useConfirmingForm";
import { kpmApi } from "../services/kpmApi";
import type { AnyRecord, ProjectSku, ProjectStage } from "../types";
import {
  MAX_ATTACHMENT_SIZE_MB,
  attachmentLimitMessage,
  downloadBusinessFile,
  isWithinAttachmentLimit,
  normalizeUploadFiles,
  uploadBusinessFiles,
} from "../utils/fileUpload";
import { dateTimeText, enumValues, includesKeyword } from "../utils/format";
import { validationRules } from "../validation";

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
  const { id = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const refresh = useRefreshKpmData();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useKpmData();
  const { user, can } = useAuth();
  const [skuForm] = Form.useForm();
  const [memberForm] = Form.useForm();
  const [linkForm] = Form.useForm();
  const [stageRecordForm] = Form.useForm();
  const [stageMaterialForm] = Form.useForm();
  const [projectMaterialForm] = Form.useForm();
  const [stageTaskForm] = Form.useForm();
  const [stageAssigneeForm] = Form.useForm();
  const [requirementForm] = Form.useForm();
  const [announcementForm] = Form.useForm();
  const [skuModal, setSkuModal] = useState<{ open: boolean; row?: ProjectSku }>(
    { open: false },
  );
  const [memberModal, setMemberModal] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [stageDetail, setStageDetail] = useState<ProjectStage | null>(null);
  const [stageRecordModal, setStageRecordModal] = useState(false);
  const [stageMaterialModal, setStageMaterialModal] = useState(false);
  const [projectMaterialModal, setProjectMaterialModal] = useState(false);
  const [stageTaskModal, setStageTaskModal] = useState(false);
  const [stageAssigneeStage, setStageAssigneeStage] =
    useState<ProjectStage | null>(null);
  const [requirementsCustomer, setRequirementsCustomer] =
    useState<AnyRecord | null>(null);
  const [requirementModal, setRequirementModal] = useState(false);
  const [projectCustomerKeyword, setProjectCustomerKeyword] = useState("");
  const [announcementModal, setAnnouncementModal] = useState(false);

  const projectDetailQuery = useQuery({
    queryKey: ["kpm", "project-detail", id],
    queryFn: () => kpmApi.project(id),
    enabled: Boolean(id),
    staleTime: 10_000,
  });
  const project =
    projectDetailQuery.data ||
    (data?.projects || []).find((item) => item.id === id);

  function refreshProjectDetail() {
    refresh();
    queryClient.invalidateQueries({ queryKey: ["kpm", "project-detail", id] });
    queryClient.invalidateQueries({ queryKey: ["kpm", "projects-page"] });
  }
  const activeStage = useMemo(
    () =>
      (project?.stages || []).find((stage) => stage.id === stageDetail?.id) ||
      stageDetail,
    [project?.stages, stageDetail],
  );
  const activeProjectCustomer = useMemo(
    () =>
      (project?.projectCustomers || []).find(
        (customer: AnyRecord) =>
          customer.customerId === requirementsCustomer?.customerId,
      ) || requirementsCustomer,
    [project?.projectCustomers, requirementsCustomer],
  );
  const filteredProjectCustomers = useMemo(
    () =>
      (project?.projectCustomers || []).filter((customer: AnyRecord) =>
        includesKeyword(
          [
            customer.customerName,
            customer.name,
            customer.shortName,
            customer.region,
            customer.projectStatus,
          ],
          projectCustomerKeyword,
        ),
      ),
    [project?.projectCustomers, projectCustomerKeyword],
  );
  const backTo =
    (location.state as { from?: string } | null)?.from || "/projects";
  const operatorName = user?.name || user?.account || "当前用户";
  const taskDefaults = useMemo(
    () => ({
      category: enumValues(data?.bootstrap?.enumItems || [], "task_category", [
        "其他",
      ])[0],
      status: enumValues(data?.bootstrap?.enumItems || [], "task_status", [
        "待处理",
      ])[0],
      priority: enumValues(data?.bootstrap?.enumItems || [], "task_priority", [
        "中",
      ])[0],
      requirementStatus: enumValues(
        data?.bootstrap?.enumItems || [],
        "requirement_status",
        ["待处理"],
      )[0],
    }),
    [data?.bootstrap?.enumItems],
  );

  function sameIdentity(left?: unknown, right?: unknown) {
    if (!left || !right) return false;
    return (
      String(left).trim().toLowerCase() === String(right).trim().toLowerCase()
    );
  }

  function canUpdateStageStatus(stage?: ProjectStage | null) {
    if (!stage || !user) return false;
    return (((stage as AnyRecord).assignees || []) as AnyRecord[]).some(
      (assignee) =>
        sameIdentity(assignee.userId, user.id) ||
        sameIdentity(assignee.account || assignee.userAccount, user.account) ||
        sameIdentity(assignee.account || assignee.userAccount, user.email),
    );
  }

  function openSku(row?: ProjectSku) {
    setSkuModal({ open: true, row });
    skuForm.setFieldsValue(row || { active: true });
  }

  async function submitSku() {
    const values = await skuForm.validateFields();
    confirmSubmit(
      skuModal.row ? "确认修改 SKU？" : "确认新增 SKU？",
      async () => {
        if (skuModal.row)
          await kpmApi.updateProjectSku(id, skuModal.row.id, values);
        else await kpmApi.createProjectSku(id, values);
        message.success("SKU 已保存");
        setSkuModal({ open: false });
        skuForm.resetFields();
        refreshProjectDetail();
      },
    );
  }

  function openMembers() {
    memberForm.setFieldsValue({
      members: (project?.members || []).map((member) => ({
        userAccount: member.account || member.userAccount,
        role: member.roleName || member.role,
      })),
    });
    setMemberModal(true);
  }

  async function submitMembers() {
    const values = await memberForm.validateFields();
    confirmSubmit("确认保存项目成员？", async () => {
      await kpmApi.replaceProjectMembers(
        id,
        (values.members || []).map(
          (member: { userAccount: string; role: string }) => ({
            userAccount: member.userAccount,
            role: member.role,
          }),
        ),
      );
      message.success("项目成员已更新");
      setMemberModal(false);
      refreshProjectDetail();
    });
  }

  async function submitCustomerLink() {
    const values = await linkForm.validateFields();
    confirmSubmit("确认关联客户？", async () => {
      await kpmApi.linkProjectCustomer(id, values);
      message.success("客户已关联到项目");
      setCustomerModal(false);
      linkForm.resetFields();
      refreshProjectDetail();
    });
  }

  async function updateStage(stage: ProjectStage, status: string) {
    if (!canUpdateStageStatus(stage)) {
      message.warning("只有阶段负责人可以修改阶段状态");
      return;
    }
    try {
      await kpmApi.updateStage(stage.id, { status });
      message.success("阶段状态已更新");
      refreshProjectDetail();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "阶段状态更新失败",
      );
    }
  }

  function stageAssigneeAccounts(stage?: ProjectStage | null) {
    return (((stage as AnyRecord)?.assignees || []) as AnyRecord[])
      .map((item) => item.account || item.userAccount)
      .filter(Boolean);
  }

  function renderStageAssignees(stage?: ProjectStage | null, max = 3) {
    const assignees = ((stage as AnyRecord)?.assignees || []) as AnyRecord[];
    if (!assignees.length)
      return <Typography.Text type="secondary">未设置</Typography.Text>;
    return (
      <Space size={4} wrap>
        {assignees.slice(0, max).map((item) => (
          <Tag key={item.account || item.assigneeName || item.name}>
            {item.assigneeName || item.name || item.account}
          </Tag>
        ))}
        {assignees.length > max ? <Tag>+{assignees.length - max}</Tag> : null}
      </Space>
    );
  }

  function openStageAssigneeModal(stage: ProjectStage) {
    const latest =
      (project?.stages || []).find((item) => item.id === stage.id) || stage;
    setStageAssigneeStage(latest);
    stageAssigneeForm.resetFields();
    stageAssigneeForm.setFieldsValue({
      assigneeAccounts: stageAssigneeAccounts(latest),
    });
  }

  async function submitStageAssignees() {
    if (!stageAssigneeStage) return;
    const values = await stageAssigneeForm.validateFields();
    const accounts = (values.assigneeAccounts || []) as string[];
    confirmSubmit("确认保存阶段负责人？", async () => {
      await kpmApi.replaceStageAssignees(stageAssigneeStage.id, {
        assignees: accounts.map((account) => ({ type: "user", account })),
      });
      message.success("阶段负责人已更新");
      setStageAssigneeStage(null);
      stageAssigneeForm.resetFields();
      refreshProjectDetail();
    });
  }

  async function submitStageMaterial() {
    if (!activeStage) return;
    const values = await stageMaterialForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    if (!files.length) {
      message.warning("请选择要上传的阶段资料");
      return;
    }
    const materials = await uploadBusinessFiles(
      files,
      "project-stage-materials",
      activeStage.id,
      operatorName,
    );
    await Promise.all(
      materials.map((material) =>
        kpmApi.addStageMaterial(activeStage.id, material),
      ),
    );
    message.success("阶段资料已上传");
    setStageMaterialModal(false);
    stageMaterialForm.resetFields();
    refreshProjectDetail();
  }

  async function submitProjectMaterial() {
    const values = await projectMaterialForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    if (!files.length) {
      message.warning("请选择要上传的项目资料");
      return;
    }
    const materials = await uploadBusinessFiles(
      files,
      "project-materials",
      id,
      operatorName,
    );
    await Promise.all(
      materials.map((material) =>
        kpmApi.addProjectMaterial(id, {
          ...material,
          description: values.description,
        }),
      ),
    );
    message.success("项目资料已上传");
    setProjectMaterialModal(false);
    projectMaterialForm.resetFields();
    refreshProjectDetail();
  }

  async function submitStageRecord() {
    if (!activeStage) return;
    const values = await stageRecordForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    const attachments = files.length
      ? await uploadBusinessFiles(
          files,
          "stage-record-attachments",
          activeStage.id,
          operatorName,
        )
      : [];
    await kpmApi.addStageRecord(activeStage.id, {
      author: operatorName,
      content: values.content,
      attachments,
    });
    message.success("阶段记录已发布");
    setStageRecordModal(false);
    stageRecordForm.resetFields();
    refreshProjectDetail();
  }

  async function publishStageMaterial(material: AnyRecord) {
    confirmSubmit("确认发布该阶段资料到项目资料区？", async () => {
      await kpmApi.publishStageMaterial(material.id);
      message.success("已发布到项目资料区");
      refreshProjectDetail();
    });
  }

  async function publishProjectMaterialToCustomer(material: AnyRecord) {
    confirmSubmit(
      "确认公开该项目资料给客户？公开后，关联客户联系人可在客户门户下载该资料。",
      async () => {
        await kpmApi.publishProjectMaterialToCustomer(id, material.id);
        message.success("资料已标记为客户可见");
        refreshProjectDetail();
      },
    );
  }

  async function retractProjectMaterialFromCustomer(material: AnyRecord) {
    confirmSubmit(
      "确认下架该客户可见资料？下架后客户门户将不再展示该文件，内部项目资料仍会保留。",
      async () => {
        await kpmApi.retractProjectMaterialFromCustomer(id, material.id);
        message.success("资料已从客户门户下架");
        refreshProjectDetail();
      },
    );
  }

  async function deleteProjectMaterial(material: AnyRecord) {
    confirmSubmit(
      "确认从项目资料中删除该文件记录？删除后客户门户也将不再展示该资料。",
      async () => {
        await kpmApi.deleteProjectMaterial(id, material.id);
        message.success("项目资料已删除");
        refreshProjectDetail();
      },
    );
  }

  async function updateProjectCustomerStatus(row: AnyRecord, next?: string) {
    if (!next || next === row.projectStatus) return;
    confirmSubmit(
      `确认将“${row.customerName || row.name || "该客户"}”在本项目下的状态改为“${next}”？`,
      async () => {
        await kpmApi.updateProjectCustomerStatus(id, row.customerId, {
          projectStatus: next,
        });
        message.success("客户项目状态已更新");
        refreshProjectDetail();
      },
    );
  }

  function openStageTask() {
    stageTaskForm.resetFields();
    stageTaskForm.setFieldsValue({
      category: taskDefaults.category,
      status: taskDefaults.status,
      priority: taskDefaults.priority,
      creator: operatorName,
      blocked: false,
    });
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
      source: "阶段详情",
    });
    if (files.length) {
      const materials = await uploadBusinessFiles(
        files,
        "task-attachments",
        task.id,
        operatorName,
      );
      for (const material of materials) {
        await kpmApi.addTaskAttachment(task.id, material);
      }
    }
    message.success("阶段任务已创建");
    setStageTaskModal(false);
    stageTaskForm.resetFields();
    refreshProjectDetail();
  }

  function openAnnouncementModal() {
    announcementForm.setFieldsValue({ announcementType: "普通公告" });
    setAnnouncementModal(true);
  }

  async function submitAnnouncement() {
    const values = await announcementForm.validateFields();
    confirmSubmit(
      "确认发布该项目公告？发布后，关联客户联系人将在客户门户看到公告，并收到门户消息。",
      async () => {
        await kpmApi.publishProjectAnnouncement(id, values);
        message.success("公告已发布给关联客户");
        setAnnouncementModal(false);
        announcementForm.resetFields();
        refreshProjectDetail();
      },
    );
  }

  async function retractAnnouncement(announcement: AnyRecord) {
    confirmSubmit(
      "确认撤回该公告？撤回后客户门户不再滚动展示该公告，但公告历史仍会保留。",
      async () => {
        await kpmApi.retractProjectAnnouncement(id, announcement.id);
        message.success("公告已撤回");
        refreshProjectDetail();
      },
    );
  }

  async function submitRequirement() {
    if (!activeProjectCustomer) return;
    const values = await requirementForm.validateFields();
    await kpmApi.createRequirement(id, activeProjectCustomer.customerId, {
      ...values,
      proposer:
        values.proposer ||
        activeProjectCustomer.customerName ||
        activeProjectCustomer.name,
      creator: operatorName,
    });
    message.success("客户需求已新增");
    setRequirementModal(false);
    requirementForm.resetFields();
    refreshProjectDetail();
  }

  if (!project && !isLoading) {
    return (
      <PageScaffold title="项目详情">
        <Empty description="项目不存在或已删除" />
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      title={project?.externalName || "项目详情"}
      subtitle="查看项目阶段、成员、SKU、客户关联、需求与资料。"
      extra={
        <Space>
          {can("button:project-detail:publish-announcement") ? (
            <Button
              type="primary"
              icon={<NotificationOutlined />}
              onClick={openAnnouncementModal}
            >
              发布公告
            </Button>
          ) : null}
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backTo)}>
            返回
          </Button>
        </Space>
      }
    >
      <DataState loading={isLoading || projectDetailQuery.isLoading} error={error || projectDetailQuery.error}>
        {project ? (
          <>
            <Card className="kpm-card">
              <Descriptions size="small" column={{ xs: 1, md: 3 }}>
                <Descriptions.Item label="内部名称">
                  {project.internalName || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Model">
                  {project.modelName || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="负责人">
                  {project.managerName || project.managerAccount || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="成员">
                  <Button type="link" onClick={openMembers}>
                    {project.members?.length || 0} 人
                  </Button>
                </Descriptions.Item>
                <Descriptions.Item label="客户">
                  {project.projectCustomers?.length || 0} 个
                </Descriptions.Item>
                <Descriptions.Item label="SKU">
                  {project.skus?.length || 0} 个
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Tabs
              className="kpm-tabs"
              items={[
                {
                  key: "stages",
                  label: "阶段",
                  children: (
                    <Table<ProjectStage>
                      size="small"
                      rowKey="id"
                      dataSource={project.stages || []}
                      pagination={false}
                      columns={[
                        {
                          title: "阶段",
                          render: (_, row: ProjectStage) => (
                            <button
                              className="link-button"
                              type="button"
                              onClick={() => setStageDetail(row)}
                            >
                              {row.name || (row as AnyRecord).stageName || "-"}
                            </button>
                          ),
                        },
                        {
                          title: "状态",
                          width: 240,
                          render: (_, row) => {
                            const editable = canUpdateStageStatus(row);
                            return (
                              <Space.Compact style={{ width: "100%" }}>
                                <EnumSelect
                                  bootstrap={data?.bootstrap}
                                  enumType="stage_status"
                                  value={row.status}
                                  disabled={!editable}
                                  onChange={(value) =>
                                    value && updateStage(row, value)
                                  }
                                />
                                {!editable ? (
                                  <Tooltip title="只有阶段负责人可以修改阶段状态">
                                    <Button icon={<LockOutlined />} disabled />
                                  </Tooltip>
                                ) : null}
                              </Space.Compact>
                            );
                          },
                        },
                        {
                          title: "负责人",
                          render: (_, row: ProjectStage) => (
                            <Space size={8} wrap>
                              {renderStageAssignees(row)}
                              <Button
                                size="small"
                                type="link"
                                icon={<TeamOutlined />}
                                onClick={() => openStageAssigneeModal(row)}
                              >
                                维护
                              </Button>
                            </Space>
                          ),
                        },
                        {
                          title: "资料",
                          width: 90,
                          render: (_, row: AnyRecord) => (
                            <Tag>{(row.materials || []).length}</Tag>
                          ),
                        },
                        {
                          title: "记录",
                          width: 90,
                          render: (_, row: AnyRecord) => (
                            <Tag>{(row.records || []).length}</Tag>
                          ),
                        },
                        {
                          title: "操作",
                          width: 120,
                          render: (_, row) => (
                            <Button
                              size="small"
                              type="primary"
                              ghost
                              onClick={() => setStageDetail(row)}
                            >
                              阶段详情
                            </Button>
                          ),
                        },
                      ]}
                    />
                  ),
                },
                {
                  key: "skus",
                  label: "SKU 管理",
                  children: (
                    <Card
                      className="kpm-card"
                      extra={
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => openSku()}
                        >
                          新增 SKU
                        </Button>
                      }
                    >
                      <Table<ProjectSku>
                        size="small"
                        rowKey="id"
                        dataSource={project.skus || []}
                        pagination={false}
                        columns={[
                          {
                            title: "整机料号",
                            dataIndex: "wholeMachinePartNumber",
                            ellipsis: true,
                          },
                          {
                            title: "配置名称",
                            dataIndex: "configurationName",
                            ellipsis: true,
                          },
                          {
                            title: "内存类型",
                            dataIndex: "memoryType",
                            width: 120,
                          },
                          {
                            title: "状态",
                            dataIndex: "active",
                            width: 90,
                            render: (value) => <StatusTag value={value} />,
                          },
                          {
                            title: "操作",
                            width: 100,
                            render: (_, row) => (
                              <ActionButtons
                                onEdit={() => openSku(row)}
                                onDelete={() =>
                                  kpmApi
                                    .deleteProjectSku(id, row.id)
                                    .then(() => {
                                      message.success("SKU 已删除");
                                      refreshProjectDetail();
                                    })
                                }
                              />
                            ),
                          },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: "customers",
                  label: "关联客户",
                  children: (
                    <Card
                      className="kpm-card"
                      extra={
                        <Space>
                          <Input.Search
                            allowClear
                            placeholder="搜索客户 / 地区 / 状态"
                            onSearch={setProjectCustomerKeyword}
                            onChange={(event) =>
                              setProjectCustomerKeyword(event.target.value)
                            }
                            style={{ width: 260 }}
                          />
                          <Button
                            icon={<PlusOutlined />}
                            onClick={() => setCustomerModal(true)}
                          >
                            关联客户
                          </Button>
                        </Space>
                      }
                    >
                      <Table
                        size="small"
                        rowKey={(row: AnyRecord) => row.customerId || row.id}
                        dataSource={filteredProjectCustomers}
                        pagination={{ pageSize: 8, showSizeChanger: true }}
                        columns={[
                          {
                            title: "客户",
                            render: (_, row: AnyRecord) =>
                              row.customerName || row.name,
                          },
                          { title: "地区", dataIndex: "region" },
                          {
                            title: "客户项目状态",
                            dataIndex: "projectStatus",
                            render: (value: string, row: AnyRecord) => (
                              <EnumSelect
                                bootstrap={data?.bootstrap}
                                enumType="customer_project_status"
                                value={value}
                                onChange={(next) =>
                                  updateProjectCustomerStatus(row, next)
                                }
                              />
                            ),
                          },
                          {
                            title: "客户需求",
                            width: 120,
                            render: (_, row: AnyRecord) => (
                              <Button
                                size="small"
                                onClick={() => setRequirementsCustomer(row)}
                              >
                                需求列表
                              </Button>
                            ),
                          },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: "requirements",
                  label: "需求纵览",
                  children: (
                    <Table
                      size="small"
                      rowKey={(row: AnyRecord) => row.id || row.title}
                      dataSource={project.requirements || []}
                      columns={[
                        { title: "需求", dataIndex: "title", ellipsis: true },
                        { title: "客户", dataIndex: "customerName" },
                        { title: "优先级", dataIndex: "priority" },
                        {
                          title: "状态",
                          dataIndex: "status",
                          render: (value) => <StatusTag value={value} />,
                        },
                        {
                          title: "任务",
                          dataIndex: "taskId",
                          render: (value) =>
                            value ? (
                              <Button
                                type="link"
                                onClick={() => navigate(`/tasks?id=${value}`)}
                              >
                                查看任务
                              </Button>
                            ) : (
                              "-"
                            ),
                        },
                      ]}
                    />
                  ),
                },
                {
                  key: "materials",
                  label: "项目资料",
                  children: (
                    <Card
                      className="kpm-card"
                      extra={
                        can("button:project-materials:upload") ? (
                          <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={() => setProjectMaterialModal(true)}
                          >
                            上传项目资料
                          </Button>
                        ) : null
                      }
                    >
                      <Table
                        size="small"
                        rowKey={(row: AnyRecord) => row.id}
                        dataSource={project.materials || []}
                        pagination={{ pageSize: 8, showSizeChanger: true }}
                        columns={[
                          {
                            title: "文件名",
                            dataIndex: "fileName",
                            ellipsis: true,
                          },
                          {
                            title: "描述",
                            dataIndex: "description",
                            ellipsis: true,
                            render: (value) => value || "-",
                          },
                          {
                            title: "来源",
                            dataIndex: "sourceStage",
                            width: 120,
                            render: (value) => value || "项目资料",
                          },
                          {
                            title: "上传人",
                            dataIndex: "uploader",
                            width: 120,
                          },
                          {
                            title: "发布时间",
                            dataIndex: "publishedAt",
                            width: 170,
                            render: dateTimeText,
                          },
                          {
                            title: "客户可见",
                            dataIndex: "publicVisible",
                            width: 110,
                            render: (value, row: AnyRecord) =>
                              value ? (
                                <Tooltip
                                  title={
                                    row.publicAt
                                      ? `公开时间：${dateTimeText(row.publicAt)}`
                                      : ""
                                  }
                                >
                                  <Tag color="success">已公开</Tag>
                                </Tooltip>
                              ) : (
                                <Tag>未公开</Tag>
                              ),
                          },
                          {
                            title: "操作",
                            width: 240,
                            render: (_, row: AnyRecord) => (
                              <Space>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    downloadBusinessFile(row).catch((err) =>
                                      message.error(err.message || "下载失败"),
                                    )
                                  }
                                >
                                  下载
                                </Button>
                                {can(
                                  "button:project-materials:publish-customer",
                                ) ? (
                                  row.publicVisible ? (
                                    <Button
                                      size="small"
                                      onClick={() =>
                                        retractProjectMaterialFromCustomer(row)
                                      }
                                    >
                                      下架
                                    </Button>
                                  ) : (
                                    <Button
                                      size="small"
                                      type="primary"
                                      ghost
                                      onClick={() =>
                                        publishProjectMaterialToCustomer(row)
                                      }
                                    >
                                      公开
                                    </Button>
                                  )
                                ) : null}
                                {can("button:project-materials:upload") ? (
                                  <Button
                                    size="small"
                                    danger
                                    onClick={() => deleteProjectMaterial(row)}
                                  >
                                    删除
                                  </Button>
                                ) : null}
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: "announcements",
                  label: "公告历史",
                  children: (
                    <Card className="kpm-card">
                      <Table
                        size="small"
                        rowKey={(row: AnyRecord) => row.id}
                        dataSource={project.announcements || []}
                        pagination={{ pageSize: 8, showSizeChanger: true }}
                        columns={[
                          {
                            title: "公告标题",
                            dataIndex: "title",
                            ellipsis: true,
                          },
                          {
                            title: "类型",
                            dataIndex: "announcementType",
                            width: 130,
                            render: (value) => <Tag>{value || "普通公告"}</Tag>,
                          },
                          {
                            title: "状态",
                            dataIndex: "announcementStatus",
                            width: 100,
                            render: (value) =>
                              value === "撤回" ? (
                                <Tag color="default">已撤回</Tag>
                              ) : (
                                <Tag color="success">已发布</Tag>
                              ),
                          },
                          {
                            title: "发布人",
                            dataIndex: "publisher",
                            width: 120,
                            render: (value) => value || "-",
                          },
                          {
                            title: "发布时间",
                            dataIndex: "publishedAt",
                            width: 170,
                            render: dateTimeText,
                          },
                          {
                            title: "撤回信息",
                            width: 220,
                            render: (_, row: AnyRecord) =>
                              row.announcementStatus === "撤回" ? (
                                <Typography.Text type="secondary">
                                  {row.retractedBy || "-"} · {dateTimeText(row.retractedAt)}
                                </Typography.Text>
                              ) : (
                                "-"
                              ),
                          },
                          {
                            title: "操作",
                            width: 100,
                            render: (_, row: AnyRecord) =>
                              row.announcementStatus === "撤回" ? null : (
                                <Button
                                  size="small"
                                  danger
                                  onClick={() => retractAnnouncement(row)}
                                >
                                  撤回
                                </Button>
                              ),
                          },
                        ]}
                      />
                    </Card>
                  ),
                },
              ]}
            />
            <Drawer
              title={
                activeStage
                  ? `阶段详情：${(activeStage as AnyRecord).name || (activeStage as AnyRecord).stageName || "-"}`
                  : "阶段详情"
              }
              open={Boolean(stageDetail)}
              onClose={() => setStageDetail(null)}
              width={860}
            >
              {activeStage ? (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Descriptions bordered size="small" column={2}>
                    <Descriptions.Item label="阶段名称">
                      {(activeStage as AnyRecord).name ||
                        (activeStage as AnyRecord).stageName ||
                        "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="状态">
                      <StatusTag value={activeStage.status} />
                    </Descriptions.Item>
                    <Descriptions.Item label="负责人" span={2}>
                      <Space wrap>
                        {renderStageAssignees(activeStage, 6)}
                        <Button
                          size="small"
                          icon={<TeamOutlined />}
                          onClick={() => openStageAssigneeModal(activeStage)}
                        >
                          维护负责人
                        </Button>
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>

                  <Card
                    size="small"
                    title="阶段资料库"
                    extra={
                      <Button
                        size="small"
                        icon={<UploadOutlined />}
                        onClick={() => setStageMaterialModal(true)}
                      >
                        上传资料
                      </Button>
                    }
                  >
                    <Table
                      size="small"
                      rowKey={(row: AnyRecord) => row.id}
                      pagination={{ pageSize: 5 }}
                      dataSource={(activeStage as AnyRecord).materials || []}
                      columns={[
                        {
                          title: "文件名",
                          dataIndex: "fileName",
                          ellipsis: true,
                        },
                        { title: "上传人", dataIndex: "uploader", width: 120 },
                        {
                          title: "上传时间",
                          dataIndex: "uploadedAt",
                          width: 170,
                          render: dateTimeText,
                        },
                        {
                          title: "操作",
                          width: 230,
                          render: (_, row: AnyRecord) => (
                            <Space>
                              <Button
                                size="small"
                                onClick={() =>
                                  downloadBusinessFile(row).catch((err) =>
                                    message.error(err.message || "下载失败"),
                                  )
                                }
                              >
                                下载
                              </Button>
                              <Button
                                size="small"
                                disabled={row.publishedToProject}
                                onClick={() => publishStageMaterial(row)}
                              >
                                {row.publishedToProject
                                  ? "已发布"
                                  : "发布到项目资料区"}
                              </Button>
                            </Space>
                          ),
                        },
                      ]}
                    />
                  </Card>

                  <Card
                    size="small"
                    title="阶段留言 / 记录"
                    extra={
                      <Space>
                        <Button size="small" onClick={openStageTask}>
                          新建阶段任务
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => setStageRecordModal(true)}
                        >
                          新增记录
                        </Button>
                      </Space>
                    }
                  >
                    {((activeStage as AnyRecord).records || []).length ? (
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {((activeStage as AnyRecord).records || []).map(
                          (record: AnyRecord) => (
                            <article className="kpm-comment" key={record.id}>
                              <strong>{record.author}</strong>
                              <Typography.Paragraph>
                                {record.content || "-"}
                              </Typography.Paragraph>
                              {(record.attachments || []).length ? (
                                <Space wrap>
                                  {record.attachments.map(
                                    (file: AnyRecord, index: number) => (
                                      <Tag
                                        key={
                                          file.objectKey ||
                                          file.fileName ||
                                          index
                                        }
                                      >
                                        {file.fileName || file.name || "附件"}
                                      </Tag>
                                    ),
                                  )}
                                </Space>
                              ) : null}
                              <small>{dateTimeText(record.createdAt)}</small>
                            </article>
                          ),
                        )}
                      </Space>
                    ) : (
                      <Typography.Text type="secondary">
                        暂无阶段记录
                      </Typography.Text>
                    )}
                  </Card>
                </Space>
              ) : null}
            </Drawer>

            <Drawer
              title={
                activeProjectCustomer
                  ? `${activeProjectCustomer.customerName || activeProjectCustomer.name} · 客户需求`
                  : "客户需求"
              }
              open={Boolean(requirementsCustomer)}
              onClose={() => setRequirementsCustomer(null)}
              width={920}
            >
              {activeProjectCustomer ? (
                <Space direction="vertical" style={{ width: "100%" }} size={16}>
                  <Card
                    size="small"
                    extra={
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          requirementForm.resetFields();
                          requirementForm.setFieldsValue({
                            priority: taskDefaults.priority,
                            status: taskDefaults.requirementStatus,
                            createTask: true,
                          });
                          setRequirementModal(true);
                        }}
                      >
                        新增需求
                      </Button>
                    }
                  >
                    <Descriptions size="small" bordered column={3}>
                      <Descriptions.Item label="客户">
                        {activeProjectCustomer.customerName ||
                          activeProjectCustomer.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="地区">
                        {activeProjectCustomer.region || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="客户项目状态">
                        <StatusTag
                          value={activeProjectCustomer.projectStatus}
                        />
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                  <Table
                    size="small"
                    rowKey={(row: AnyRecord) => row.id}
                    pagination={{ pageSize: 8 }}
                    dataSource={activeProjectCustomer.requirements || []}
                    columns={[
                      { title: "需求", dataIndex: "title", ellipsis: true },
                      { title: "优先级", dataIndex: "priority", width: 90 },
                      {
                        title: "状态",
                        dataIndex: "status",
                        width: 110,
                        render: (value) => <StatusTag value={value} />,
                      },
                      {
                        title: "任务",
                        dataIndex: "taskId",
                        width: 110,
                        render: (value) =>
                          value ? (
                            <Button
                              size="small"
                              type="link"
                              onClick={() =>
                                navigate(`/tasks?id=${value}`, {
                                  state: { from: `/projects/${id}` },
                                })
                              }
                            >
                              查看任务
                            </Button>
                          ) : (
                            "-"
                          ),
                      },
                      {
                        title: "操作",
                        width: 150,
                        render: (_, row: AnyRecord) => (
                          <Space>
                            <Button
                              size="small"
                              onClick={() =>
                                kpmApi.voidRequirement(row.id).then(() => {
                                  message.success("需求已作废");
                                  refreshProjectDetail();
                                })
                              }
                            >
                              作废
                            </Button>
                            <Button
                              size="small"
                              danger
                              onClick={() =>
                                kpmApi.deleteRequirement(row.id).then(() => {
                                  message.success("需求已删除");
                                  refreshProjectDetail();
                                })
                              }
                            >
                              删除
                            </Button>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </Space>
              ) : null}
            </Drawer>

            <Modal
              title="发布项目公告"
              open={announcementModal}
              maskClosable
              onCancel={() => setAnnouncementModal(false)}
              onOk={submitAnnouncement}
              okText="发布"
              width={680}
            >
              <Form
                form={announcementForm}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item
                  name="announcementType"
                  label="公告类型"
                  rules={[validationRules.required("请选择公告类型")]}
                >
                  <EnumSelect
                    bootstrap={data?.bootstrap}
                    enumType="project_announcement_type"
                    placeholder="请选择公告类型"
                  />
                </Form.Item>
                <Form.Item
                  name="title"
                  label="公告标题"
                  rules={[
                    validationRules.required("请输入公告标题"),
                    validationRules.max(120),
                  ]}
                >
                  <Input placeholder="例如：P8 dual 新版本资料已发布" />
                </Form.Item>
                <Form.Item
                  name="content"
                  label="公告内容"
                  rules={[
                    validationRules.required("请输入公告内容"),
                    validationRules.max(3000),
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="请输入要同步给客户的信息，后续接入邮箱后也会作为邮件内容来源。"
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="维护项目成员"
              open={memberModal}
              maskClosable
              onCancel={() => setMemberModal(false)}
              onOk={submitMembers}
              width={760}
            >
              <Form form={memberForm} layout="vertical">
                <Form.List name="members">
                  {(fields, { add, remove }) => (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {fields.map((field) => (
                        <Space
                          key={field.key}
                          align="baseline"
                          style={{ display: "flex" }}
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, "userAccount"]}
                            rules={[validationRules.required("请选择成员")]}
                          >
                            <UserSelect
                              bootstrap={data?.bootstrap}
                              style={{ width: 280 }}
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, "role"]}
                            rules={[validationRules.required("请输入项目角色")]}
                          >
                            <Input
                              placeholder="项目角色"
                              style={{ width: 180 }}
                            />
                          </Form.Item>
                          <Button onClick={() => remove(field.name)}>
                            移除
                          </Button>
                        </Space>
                      ))}
                      <Button onClick={() => add()} icon={<PlusOutlined />}>
                        增加成员
                      </Button>
                    </Space>
                  )}
                </Form.List>
              </Form>
            </Modal>
            <Modal
              title={skuModal.row ? "编辑 SKU" : "新增 SKU"}
              open={skuModal.open}
              maskClosable
              onCancel={() => setSkuModal({ open: false })}
              onOk={submitSku}
            >
              <Form form={skuForm} layout="vertical">
                <Form.Item
                  name="wholeMachinePartNumber"
                  label="整机料号"
                  rules={[validationRules.required("请输入整机料号")]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="configurationName"
                  label="配置名称"
                  rules={[validationRules.required("请输入配置名称")]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="memoryType"
                  label="内存类型"
                  rules={[validationRules.required("请输入内存类型")]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="active" label="是否启用">
                  <Select
                    options={[
                      { label: "启用", value: true },
                      { label: "停用", value: false },
                    ]}
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="关联客户"
              open={customerModal}
              maskClosable
              onCancel={() => setCustomerModal(false)}
              onOk={submitCustomerLink}
            >
              <Form form={linkForm} layout="vertical">
                <Form.Item
                  name="customerId"
                  label="客户"
                  rules={[validationRules.required("请选择客户")]}
                >
                  <CustomerSelect customers={data?.customers} />
                </Form.Item>
                <Form.Item
                  name="projectStatus"
                  label="客户项目状态"
                  rules={[validationRules.required("请选择客户项目状态")]}
                >
                  <EnumSelect
                    bootstrap={data?.bootstrap}
                    enumType="customer_project_status"
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="上传阶段资料"
              open={stageMaterialModal}
              maskClosable
              onCancel={() => setStageMaterialModal(false)}
              onOk={submitStageMaterial}
              okText="上传"
            >
              <Form form={stageMaterialForm} layout="vertical">
                <Form.Item
                  name="files"
                  label="选择文件"
                  valuePropName="fileList"
                  getValueFromEvent={uploadFileList}
                  rules={[validationRules.required("请选择文件")]}
                >
                  <Upload multiple beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="上传项目资料"
              open={projectMaterialModal}
              maskClosable
              onCancel={() => setProjectMaterialModal(false)}
              onOk={submitProjectMaterial}
              okText="上传"
            >
              <Form form={projectMaterialForm} layout="vertical">
                <Form.Item
                  name="files"
                  label={`选择文件（单个不超过 ${MAX_ATTACHMENT_SIZE_MB}MB）`}
                  valuePropName="fileList"
                  getValueFromEvent={uploadFileList}
                  rules={[validationRules.required("请选择文件")]}
                >
                  <Upload multiple beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  name="description"
                  label="资料描述"
                  rules={[validationRules.max(1000)]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="用于说明文件内容、适用版本或给客户查看时的备注"
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="新增阶段记录"
              open={stageRecordModal}
              maskClosable
              onCancel={() => setStageRecordModal(false)}
              onOk={submitStageRecord}
              okText="发布"
            >
              <Form form={stageRecordForm} layout="vertical">
                <Form.Item
                  name="content"
                  label="记录内容"
                  rules={[
                    validationRules.required("请输入记录内容"),
                    validationRules.max(2000),
                  ]}
                >
                  <Input.TextArea rows={5} />
                </Form.Item>
                <Form.Item
                  name="files"
                  label="附件"
                  valuePropName="fileList"
                  getValueFromEvent={uploadFileList}
                >
                  <Upload multiple beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>选择附件</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title={
                stageAssigneeStage
                  ? `维护阶段负责人：${(stageAssigneeStage as AnyRecord).name || (stageAssigneeStage as AnyRecord).stageName || "-"}`
                  : "维护阶段负责人"
              }
              open={Boolean(stageAssigneeStage)}
              maskClosable
              onCancel={() => setStageAssigneeStage(null)}
              onOk={submitStageAssignees}
              width={620}
              okText="保存"
            >
              <Form form={stageAssigneeForm} layout="vertical">
                <Form.Item
                  name="assigneeAccounts"
                  label="阶段负责人"
                  extra="支持多选，必须从已有用户中搜索选择。"
                >
                  <UserSelect
                    bootstrap={data?.bootstrap}
                    mode="multiple"
                    placeholder="输入姓名或邮箱搜索负责人"
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="新建阶段任务"
              open={stageTaskModal}
              maskClosable
              onCancel={() => setStageTaskModal(false)}
              onOk={submitStageTask}
              width={720}
            >
              <Form form={stageTaskForm} layout="vertical">
                <Form.Item
                  name="title"
                  label="任务标题"
                  rules={[
                    validationRules.required("请输入任务标题"),
                    validationRules.max(120),
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="任务描述"
                  rules={[validationRules.max(3000)]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Space.Compact block>
                  <Form.Item
                    name="customerId"
                    label="客户"
                    style={{ width: "50%" }}
                  >
                    <CustomerSelect
                      customers={data?.customers}
                      placeholder="不选择则为所有客户"
                    />
                  </Form.Item>
                  <Form.Item
                    name="priority"
                    label="优先级"
                    rules={[validationRules.required("请选择优先级")]}
                    style={{ width: "50%" }}
                  >
                    <EnumSelect
                      bootstrap={data?.bootstrap}
                      enumType="task_priority"
                    />
                  </Form.Item>
                </Space.Compact>
                <Space.Compact block>
                  <Form.Item
                    name="category"
                    label="分类"
                    rules={[validationRules.required("请选择分类")]}
                    style={{ width: "50%" }}
                  >
                    <EnumSelect
                      bootstrap={data?.bootstrap}
                      enumType="task_category"
                    />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="状态"
                    rules={[validationRules.required("请选择状态")]}
                    style={{ width: "50%" }}
                  >
                    <EnumSelect
                      bootstrap={data?.bootstrap}
                      enumType="task_status"
                    />
                  </Form.Item>
                </Space.Compact>
                <Form.Item name="assignees" label="执行者">
                  <UserSelect bootstrap={data?.bootstrap} mode="multiple" />
                </Form.Item>
                <Form.Item name="participants" label="参与者">
                  <UserSelect bootstrap={data?.bootstrap} mode="multiple" />
                </Form.Item>
                <Form.Item name="expectedCompletionAt" label="预期完成时间">
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name="files"
                  label={`附件（可选，单个不超过 ${MAX_ATTACHMENT_SIZE_MB}MB）`}
                  valuePropName="fileList"
                  getValueFromEvent={uploadFileList}
                >
                  <Upload multiple beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>选择附件</Button>
                  </Upload>
                </Form.Item>
                <Form.Item name="blocked" valuePropName="checked">
                  <Checkbox>标记为卡点任务</Checkbox>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="新增客户需求"
              open={requirementModal}
              maskClosable
              onCancel={() => setRequirementModal(false)}
              onOk={submitRequirement}
              width={760}
            >
              <Form form={requirementForm} layout="vertical">
                <Form.Item
                  name="title"
                  label="需求标题"
                  rules={[
                    validationRules.required("请输入需求标题"),
                    validationRules.max(120),
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="userStory"
                  label="用户故事"
                  rules={[
                    validationRules.required("请输入用户故事"),
                    validationRules.max(1500),
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="作为...我希望...以便..."
                  />
                </Form.Item>
                <Form.Item
                  name="businessValue"
                  label="业务价值"
                  rules={[
                    validationRules.required("请输入业务价值"),
                    validationRules.max(1000),
                  ]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item
                  name="acceptance"
                  label="验收标准"
                  rules={[
                    validationRules.required("请输入验收标准"),
                    validationRules.max(1500),
                  ]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Space.Compact block>
                  <Form.Item
                    name="priority"
                    label="优先级"
                    rules={[validationRules.required("请选择优先级")]}
                    style={{ width: "50%" }}
                  >
                    <EnumSelect
                      bootstrap={data?.bootstrap}
                      enumType="task_priority"
                    />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="需求状态"
                    style={{ width: "50%" }}
                  >
                    <EnumSelect
                      bootstrap={data?.bootstrap}
                      enumType="requirement_status"
                    />
                  </Form.Item>
                </Space.Compact>
                <Form.Item
                  name="proposer"
                  label="提出人"
                  rules={[validationRules.max(60)]}
                >
                  <Input placeholder="默认使用客户名称" />
                </Form.Item>
                <Form.Item name="createTask" valuePropName="checked">
                  <Checkbox>同时创建关联任务</Checkbox>
                </Form.Item>
              </Form>
            </Modal>
          </>
        ) : null}
      </DataState>
    </PageScaffold>
  );
}
