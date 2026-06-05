import {
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  DownloadOutlined,
  LogoutOutlined,
  PlusOutlined,
  ReloadOutlined,
  SoundOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Spin,
  Popover,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import { useMemo, useState } from "react";
import type { UIEvent } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { DataState } from "../../components/common/DataState";
import { EChart } from "../../components/charts/EChart";
import { TaskCategoryTag, TaskPriorityTag, TaskProjectTag } from "../../components/common/TaskVisualTags";
import { KozenLogo } from "../../components/KozenLogo";
import { LanguageSwitch } from "../../components/LanguageSwitch";
import { StatusTag } from "../../components/StatusTag";
import {
  clearCustomerPortalSession,
  customerPortalApi,
  readCustomerPortalToken,
} from "../../services/customerPortalApi";
import type {
  CustomerPortalAnnouncement,
  CustomerPortalContact,
  CustomerPortalMaterial,
  CustomerPortalMessage,
  CustomerPortalTask,
} from "../../types/customerPortal";
import type { AnyRecord } from "../../types";
import { dateTimeText, isEnglishLanguage } from "../../utils/format";
import {
  MAX_ATTACHMENT_SIZE_MB,
  attachmentLimitMessage,
  isWithinAttachmentLimit,
  normalizeUploadFiles,
} from "../../utils/fileUpload";
import { validationRules } from "../../validation";

const portalDataKey = ["kpm", "customer-portal", "data"] as const;
const PORTAL_COMMENT_PAGE_SIZE = 10;

function taskCommentsKey(taskId?: string) {
  return ["kpm", "customer-portal", "task-comments", taskId || ""] as const;
}

function downloadFromSignedUrl(url: string, fileName?: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "download";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

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

function taskCommentCount(task: CustomerPortalTask) {
  return task.commentCount ?? task.comments?.length ?? 0;
}

function renderAttachmentTags(
  attachments: AnyRecord[] | undefined,
  fallbackText: string,
  onDownload: (file: AnyRecord) => void,
) {
  if (!attachments?.length) return null;
  return (
    <Space wrap size={[6, 6]} className="kpm-portal-comment-attachments">
      {attachments.map((file, index) => (
        <Tag
          key={file.objectKey || file.fileName || file.name || index}
          icon={<DownloadOutlined />}
          className="clickable-tag"
          onClick={() => onDownload(file)}
        >
          {file.fileName || file.name || fallbackText}
        </Tag>
      ))}
    </Space>
  );
}

function renderMaterialDescription(value?: string) {
  if (!value) return "-";
  return (
    <Tooltip title={value}>
      <Typography.Text className="kpm-portal-material-description" ellipsis>
        {value}
      </Typography.Text>
    </Tooltip>
  );
}

function formatHours(value?: number) {
  const hours = Number(value || 0);
  if (!hours) return "0h";
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

function portalTaskCategoryLabel(task: CustomerPortalTask, language?: string) {
  return isEnglishLanguage(language)
    ? task.categoryLabelEn || task.categoryLabelZh || task.category || ""
    : task.categoryLabelZh || task.categoryLabelEn || task.category || "";
}

function portalTaskCategoryShortLabel(task: CustomerPortalTask, language?: string) {
  return isEnglishLanguage(language)
    ? task.categoryShortLabelEn || task.categoryShortLabelZh
    : task.categoryShortLabelZh || task.categoryShortLabelEn;
}

function portalCategoryStatsName(
  item: { category?: string; labelZh?: string; labelEn?: string },
  language?: string,
) {
  return isEnglishLanguage(language)
    ? item.labelEn || item.labelZh || item.category || "-"
    : item.labelZh || item.labelEn || item.category || "-";
}

export function CustomerPortalPage() {
  const hasPortalToken = Boolean(readCustomerPortalToken());
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [taskForm] = Form.useForm();
  const [commentForm] = Form.useForm();
  const [taskModal, setTaskModal] = useState(false);
  const [commentTask, setCommentTask] = useState<CustomerPortalTask | null>(
    null,
  );
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<CustomerPortalAnnouncement | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [projectFilter, setProjectFilter] = useState<string>();
  const [creatorFilter, setCreatorFilter] = useState<string>();
  const [taskPagination, setTaskPagination] = useState({ current: 1, pageSize: 8 });
  const [materialProjectFilter, setMaterialProjectFilter] = useState<string>();
  const [materialKeyword, setMaterialKeyword] = useState("");
  const [materialPagination, setMaterialPagination] = useState({ current: 1, pageSize: 8 });
  const [statsModal, setStatsModal] = useState(false);
  const [statsProjectId, setStatsProjectId] = useState<string>();

  const query = useQuery({
    queryKey: portalDataKey,
    queryFn: () => customerPortalApi.data(),
    enabled: hasPortalToken,
    staleTime: 20_000,
    refetchOnWindowFocus: true,
  });

  const data = query.data;
  const taskStatusOptions = useMemo(
    () =>
      Array.from(new Set(data?.taskStatuses || [])).map((status) => ({
        label: status,
        value: status,
      })),
    [data?.taskStatuses],
  );
  const projectOptions = useMemo(
    () =>
      (data?.projects || []).map((project) => ({
        label: project.projectName,
        value: project.projectId,
      })),
	    [data?.projects],
	  );
  const contactsQuery = useQuery({
    queryKey: ["kpm", "customer-portal", "contacts"],
    queryFn: () => customerPortalApi.contacts(),
    enabled: hasPortalToken,
    staleTime: 60_000,
  });
  const contactOptions = useMemo(
    () =>
      (contactsQuery.data || []).map((contact: CustomerPortalContact) => ({
        label: `${contact.contactName || contact.email} · ${contact.email}`,
        value: contact.email,
      })),
    [contactsQuery.data],
  );
	  const taskPageQuery = useQuery({
	    queryKey: [
	      "kpm",
	      "customer-portal",
	      "tasks-page",
	      projectFilter || "",
	      statusFilter || "",
	      creatorFilter || "",
	      taskPagination.current,
	      taskPagination.pageSize,
	    ],
	    queryFn: () =>
	      customerPortalApi.tasksPage({
	        projectId: projectFilter,
	        status: statusFilter,
	        creatorEmail: creatorFilter,
	        page: taskPagination.current,
	        pageSize: taskPagination.pageSize,
	      }),
    enabled: hasPortalToken,
    placeholderData: (previous) => previous,
    staleTime: 15_000,
  });
  const materialPageQuery = useQuery({
    queryKey: [
      "kpm",
      "customer-portal",
      "materials-page",
      materialProjectFilter || "",
      materialKeyword,
      materialPagination.current,
      materialPagination.pageSize,
    ],
    queryFn: () =>
      customerPortalApi.materialsPage({
        projectId: materialProjectFilter,
        keyword: materialKeyword,
        page: materialPagination.current,
        pageSize: materialPagination.pageSize,
      }),
    enabled: hasPortalToken,
    placeholderData: (previous) => previous,
    staleTime: 15_000,
  });
  const statsQuery = useQuery({
    queryKey: ["kpm", "customer-portal", "task-stats", statsProjectId || ""],
    queryFn: () => customerPortalApi.taskStats(statsProjectId),
    enabled: Boolean(hasPortalToken && statsModal),
    staleTime: 20_000,
	  });
	  const commentTaskId = commentTask?.id;
	  const taskDetailQuery = useQuery({
	    queryKey: ["kpm", "customer-portal", "task-detail", commentTaskId || ""],
	    queryFn: () => customerPortalApi.task(commentTaskId!),
	    enabled: Boolean(hasPortalToken && commentTaskId),
	    staleTime: 10_000,
	  });
	  const commentQuery = useInfiniteQuery({
    queryKey: taskCommentsKey(commentTaskId),
    enabled: Boolean(hasPortalToken && commentTaskId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      customerPortalApi.taskComments(
        commentTaskId!,
        Number(pageParam),
        PORTAL_COMMENT_PAGE_SIZE,
      ),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
	  const visibleComments = useMemo(
	    () => commentQuery.data?.pages.flatMap((page) => page.records) || [],
	    [commentQuery.data],
	  );
	  const activePortalTask = taskDetailQuery.data || commentTask;

  const announcementTypeLabels = useMemo(
    () =>
      new Map<string, string>([
        ["普通公告", t("portal.announcementTypeGeneral")],
        ["产品EOL公告", t("portal.announcementTypeEol")],
      ]),
    [t],
  );

  const customerProjectStatusLabels = useMemo(
    () =>
      new Map<string, string>([
        ["商机发掘", t("portal.statusOpportunityDiscovery")],
        ["样机测试", t("portal.statusSampleTesting")],
        ["研发投入", t("portal.statusRnDInvestment")],
        ["订单冲刺", t("portal.statusOrderSprint")],
        ["首单护航", t("portal.statusFirstOrderSupport")],
        ["量产维护", t("portal.statusMassProductionSupport")],
        ["EOL 声明", t("portal.statusEolDeclaration")],
        ["Support Ended", t("portal.statusSupportEnded")],
      ]),
    [t],
  );
  const unreadCount = data?.unreadCount || 0;
  const statsChartOption = useMemo(() => {
    const stats = statsQuery.data;
    const projectRows = stats?.projects || [];
    return {
      tooltip: { trigger: "axis" },
      legend: { top: 0 },
      grid: { left: "42%", right: 18, top: 56, bottom: 36 },
      xAxis: { type: "category", data: projectRows.map((item) => item.projectName || "-"), axisLabel: { rotate: 24 } },
      yAxis: { type: "value" },
      series: [
        {
          name: t("portal.completedTasks"),
          type: "pie",
          radius: ["36%", "58%"],
          center: ["20%", "54%"],
          label: { formatter: "{b}: {c}" },
          data: [
            { name: t("portal.completedTasks"), value: stats?.completedTasks || 0 },
            { name: t("portal.openTasks"), value: stats?.openTasks || 0 },
          ],
        },
        {
          name: t("portal.totalTasks"),
          type: "bar",
          data: projectRows.map((item) => item.totalTasks),
          itemStyle: { color: "#1fd7c7" },
        },
        {
          name: t("portal.completedTasks"),
          type: "bar",
          data: projectRows.map((item) => item.completedTasks),
          itemStyle: { color: "#fff200" },
        },
        {
          name: t("portal.openTasks"),
          type: "bar",
          data: projectRows.map((item) => item.openTasks),
          itemStyle: { color: "#6072ff" },
        },
      ],
    };
  }, [statsQuery.data, t]);
  const statsCreatorOption = useMemo(() => {
    const rows = statsQuery.data?.creators || [];
    return {
      tooltip: { trigger: "axis" },
      grid: { left: 110, right: 24, top: 24, bottom: 42 },
      xAxis: { type: "value" },
      yAxis: {
        type: "category",
        data: rows.map((item) => item.contactName || item.contactEmail || "-"),
        axisLabel: { width: 96, overflow: "truncate" },
      },
      series: [
        {
          name: t("portal.submittedTasks"),
          type: "bar",
          data: rows.map((item) => item.submittedTasks),
          itemStyle: { color: "#1fd7c7" },
          label: { show: true, position: "right" },
        },
      ],
    };
  }, [statsQuery.data?.creators, t]);
  const statsCategoryOption = useMemo(() => {
    const rows = statsQuery.data?.categories || [];
    const names = rows.map((item) => portalCategoryStatsName(item, i18n.language));
    return {
      tooltip: { trigger: "axis" },
      legend: { top: 0 },
      grid: { left: "42%", right: 24, top: 56, bottom: 42 },
      xAxis: { type: "category", data: names },
      yAxis: { type: "value" },
      series: [
        {
          name: t("portal.categoryDistribution"),
          type: "pie",
          radius: ["35%", "58%"],
          center: ["20%", "54%"],
          data: rows.map((item, index) => ({
            name: names[index],
            value: item.totalTasks,
          })),
        },
        {
          name: t("portal.totalTasks"),
          type: "bar",
          data: rows.map((item) => item.totalTasks),
          itemStyle: { color: "#6072ff" },
          label: { show: true, position: "top" },
        },
      ],
    };
  }, [statsQuery.data?.categories, i18n.language, t]);

  if (!hasPortalToken) return <Navigate to="/customer-login" replace />;

  async function refresh(showToast = false) {
    await query.refetch();
    await queryClient.invalidateQueries({
      queryKey: ["kpm", "customer-portal", "tasks-page"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["kpm", "customer-portal", "materials-page"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["kpm", "customer-portal", "task-stats"],
    });
    if (commentTaskId) {
      await queryClient.invalidateQueries({
        queryKey: taskCommentsKey(commentTaskId),
      });
    }
    if (showToast) message.success(t("portal.refreshed"));
  }

  function logout() {
    clearCustomerPortalSession();
    queryClient.removeQueries({ queryKey: portalDataKey });
    message.success(t("portal.loggedOut"));
    navigate("/customer-login", { replace: true });
  }

  async function downloadMaterial(row: CustomerPortalMaterial) {
    if (!row.objectKey) {
      message.error(t("portal.missingObjectKey"));
      return;
    }
    const { url } = await customerPortalApi.downloadUrl(
      row.objectKey,
      row.fileName,
    );
    downloadFromSignedUrl(url, row.fileName);
  }

  async function downloadCommentAttachment(file: AnyRecord) {
    const objectKey = file.objectKey || file.object_key;
    const fileName = file.fileName || file.name || t("portal.attachmentFallback");
    if (!objectKey) {
      message.error(t("portal.missingObjectKey"));
      return;
    }
    const { url } = await customerPortalApi.downloadUrl(objectKey, fileName);
    downloadFromSignedUrl(url, fileName);
  }

  async function markMessageRead(row: CustomerPortalMessage) {
    if (!row.read) {
      await customerPortalApi.markMessageRead(row.id);
      refresh();
    }
  }

  async function markAllMessagesRead() {
    await customerPortalApi.markAllMessagesRead();
    message.success(t("portal.markAllRead"));
    refresh();
  }

  function messageBox() {
    const rows = data?.messages || [];
    return (
      <div className="kpm-portal-message-box">
        <div className="kpm-portal-message-actions">
          <Typography.Text type="secondary">
            {t("portal.recentMessages")}
          </Typography.Text>
          <Button
            size="small"
            type="link"
            disabled={!rows.some((item) => !item.read)}
            onClick={markAllMessagesRead}
          >
            {t("portal.markAllRead")}
          </Button>
        </div>
        <List
          size="small"
          dataSource={rows}
          locale={{ emptyText: t("portal.noMessages") }}
          renderItem={(item) => (
            <List.Item
              className={item.read ? "" : "unread"}
              onClick={() =>
                markMessageRead(item).catch((error) =>
                  message.error(error.message || t("portal.readFailed")),
                )
              }
            >
              <List.Item.Meta
                title={
                  <Space size={6}>
                    {item.read ? null : <Badge status="processing" />}
                    <span>{item.title}</span>
                    {item.projectName ? <Tag>{item.projectName}</Tag> : null}
                  </Space>
                }
                description={
                  <>
                    <Typography.Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ marginBottom: 4 }}
                    >
                      {item.content}
                    </Typography.Paragraph>
                    <small>{dateTimeText(item.createdAt)}</small>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>
    );
  }

  async function submitTask() {
    const values = await taskForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    const payload = {
      projectId: values.projectId,
      title: values.title,
      description: values.description,
      priority: values.priority,
    };
    Modal.confirm({
      title: t("portal.submitTaskConfirmTitle"),
      content: t("portal.submitTaskConfirmContent"),
      okText: t("portal.submit"),
      cancelText: t("portal.cancel"),
      onOk: async () => {
        const createdTask = await customerPortalApi.createTask(payload);
        const attachments = await uploadPortalTaskFiles(createdTask.id, files);
        if (attachments.length) {
          await customerPortalApi.addTaskAttachments(createdTask.id, attachments);
        }
        message.success(t("portal.taskSubmitted"));
        setTaskModal(false);
        taskForm.resetFields();
        await refresh();
      },
    });
  }

  async function uploadPortalTaskFiles(taskId: string, files: File[]) {
    if (!files.length) return [];
    const uploader = data?.user.contactName || data?.user.email || "customer";
    return Promise.all(
      files.map((file) =>
        customerPortalApi.uploadFile(
          file,
          "customer-portal-task-attachments",
          taskId,
          uploader,
        ),
      ),
    );
  }

  async function uploadPortalCommentFiles(taskId: string, files: File[]) {
    if (!files.length) return [];
    const uploader = data?.user.contactName || data?.user.email || "customer";
    return Promise.all(
      files.map((file) =>
        customerPortalApi.uploadFile(
          file,
          "customer-portal-task-comments",
          taskId,
          uploader,
        ),
      ),
    );
  }

  async function submitTaskComment() {
    if (!commentTask) return;
    const values = await commentForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    const attachments = await uploadPortalCommentFiles(commentTask.id, files);
    const updatedTask = await customerPortalApi.addTaskComment(commentTask.id, {
      content: values.content,
      attachments,
    });
    message.success(t("portal.commentSubmitted"));
	    setCommentTask((current) =>
	      current && current.id === updatedTask.id
	        ? { ...current, ...updatedTask, attachments: updatedTask.attachments || current.attachments }
	        : current,
	    );
    commentForm.resetFields();
    await queryClient.invalidateQueries({ queryKey: portalDataKey });
    await queryClient.invalidateQueries({
      queryKey: ["kpm", "customer-portal", "tasks-page"],
    });
	    await queryClient.invalidateQueries({
	      queryKey: ["kpm", "customer-portal", "task-stats"],
	    });
	    await queryClient.invalidateQueries({
	      queryKey: ["kpm", "customer-portal", "task-detail", commentTask.id],
	    });
	    await commentQuery.refetch();
	  }

	  function openTaskDetail(task: CustomerPortalTask) {
	    commentForm.resetFields();
	    queryClient.removeQueries({ queryKey: taskCommentsKey(task.id) });
	    queryClient.removeQueries({ queryKey: ["kpm", "customer-portal", "task-detail", task.id] });
	    setCommentTask(task);
	  }

  function handleCommentScroll(event: UIEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 24;
    if (
      nearBottom &&
      commentQuery.hasNextPage &&
      !commentQuery.isFetchingNextPage
    ) {
      void commentQuery.fetchNextPage();
    }
  }

  return (
    <main className="kpm-customer-portal">
      <header className="kpm-customer-portal-header">
        <Space size={14}>
          <KozenLogo compact />
          <div>
            <strong>{t("portal.brand")}</strong>
            <span>
              {data?.user.customerName || t("portal.fallbackCustomer")}
            </span>
          </div>
        </Space>
        <Space className="kpm-customer-portal-actions" wrap>
          <LanguageSwitch />
          <Popover
            trigger="click"
            placement="bottomRight"
            content={messageBox()}
            overlayClassName="kpm-portal-message-popover"
          >
            <Badge count={unreadCount} size="small">
              <Button shape="circle" icon={<BellOutlined />} />
            </Badge>
          </Popover>
          <Button
            icon={<ReloadOutlined />}
            loading={query.isFetching}
            onClick={() => void refresh(true)}
          >
            {t("portal.refresh")}
          </Button>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            {t("portal.exit")}
          </Button>
        </Space>
      </header>

      <section className="kpm-customer-portal-body">
        <DataState loading={query.isLoading} error={query.error}>
          {data ? (
            <Space direction="vertical" size={18} style={{ width: "100%" }}>
              {data.announcements?.length ? (
                <div
                  className="kpm-portal-announcements"
                  role="region"
                  aria-label={t("portal.announcementRegion")}
                >
                  <div className="kpm-portal-announcement-label">
                    <SoundOutlined />
                    <span>{t("portal.announcement")}</span>
                  </div>
                  <div className="kpm-portal-announcement-viewport">
                    <div className="kpm-portal-announcement-track">
                      {[...data.announcements, ...data.announcements].map(
                        (item, index) => (
                          <button
                            key={`${item.id}-${index}`}
                            type="button"
                            className="kpm-portal-announcement-title"
                            onClick={() => setSelectedAnnouncement(item)}
                            title={item.title}
                          >
                            <span>{item.title}</span>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
              <Card className="kpm-card kpm-portal-welcome">
                <div className="kpm-portal-welcome-grid">
                  <div>
                    <Typography.Title level={3}>
                      {t("portal.hello", { name: data.user.contactName })}
                    </Typography.Title>
                    <Typography.Paragraph type="secondary">
                      {t("portal.welcomeDescription", {
                        customerName: data.user.customerName,
                      })}
                    </Typography.Paragraph>
                    <Space wrap>
                      {data.projects.map((project) => (
                        <Tag color="processing" key={project.projectId}>
                          {project.projectName}
                          {project.projectStatus
                            ? ` · ${customerProjectStatusLabels.get(project.projectStatus) || project.projectStatus}`
                            : ""}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                  <Space className="kpm-portal-welcome-actions" direction="vertical">
                    <Button
                      block
                      size="large"
                      type="primary"
                      icon={<BookOutlined />}
                      onClick={() => navigate("/customer-portal/kb")}
                    >
                      {t("portal.openKnowledgeBase")}
                    </Button>
                    <Button
                      block
                      size="large"
                      icon={<BarChartOutlined />}
                      onClick={() => setStatsModal(true)}
                    >
                      {t("portal.viewServiceStats")}
                    </Button>
                  </Space>
                </div>
              </Card>

              <Card
                className="kpm-card"
                title={t("portal.publicMaterials")}
                extra={
                  <Space className="kpm-portal-card-extra" wrap>
                    <Input.Search
                      allowClear
                      placeholder={t("portal.materialSearchPlaceholder")}
                      style={{ width: 220 }}
                      onSearch={(value) => {
                        setMaterialKeyword(value.trim());
                        setMaterialPagination((current) => ({ ...current, current: 1 }));
                      }}
                    />
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      placeholder={t("portal.filterProject")}
                      style={{ width: 180 }}
                      options={projectOptions}
                      value={materialProjectFilter}
                      onChange={(value) => {
                        setMaterialProjectFilter(value);
                        setMaterialPagination((current) => ({ ...current, current: 1 }));
                      }}
                    />
                    <Tag>
                      {t("portal.materialCount", {
                        count: materialPageQuery.data?.total || 0,
                      })}
                    </Tag>
                  </Space>
                }
              >
                <Table<CustomerPortalMaterial>
                  size="small"
                  rowKey="id"
                  dataSource={materialPageQuery.data?.items || []}
                  loading={materialPageQuery.isFetching}
                  locale={{
                    emptyText: (
                      <Empty description={t("portal.noPublicMaterials")} />
                    ),
                  }}
                  pagination={{
                    current: materialPagination.current,
                    pageSize: materialPagination.pageSize,
                    total: materialPageQuery.data?.total || 0,
                    showSizeChanger: true,
                    onChange: (current, pageSize) =>
                      setMaterialPagination({ current, pageSize }),
                  }}
                  scroll={{ x: 1040 }}
                  columns={[
                    {
                      title: t("portal.project"),
                      dataIndex: "projectName",
                      width: 180,
                      ellipsis: true,
                    },
                    {
                      title: t("portal.fileName"),
                      dataIndex: "fileName",
                      ellipsis: true,
                    },
                    {
                      title: t("portal.description"),
                      dataIndex: "description",
                      ellipsis: true,
                      render: renderMaterialDescription,
                    },
                    {
                      title: t("portal.source"),
                      dataIndex: "sourceStage",
                      width: 120,
                      render: (value) =>
                        value === "直接上传"
                          ? t("portal.directUpload")
                          : value || t("portal.projectMaterial"),
                    },
                    {
                      title: t("portal.size"),
                      dataIndex: "fileSize",
                      width: 110,
                    },
                    {
                      title: t("portal.publicAt"),
                      dataIndex: "publicAt",
                      width: 170,
                      render: dateTimeText,
                    },
                    {
                      title: t("portal.actions"),
                      width: 88,
                      align: "center",
                      render: (_, row) => (
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          shape="circle"
                          icon={<DownloadOutlined />}
                          title={t("portal.download")}
                          aria-label={t("portal.download")}
                          onClick={() =>
                            downloadMaterial(row).catch((error) =>
                              message.error(
                                error.message || t("portal.downloadFailed"),
                              ),
                            )
                          }
                        />
                      ),
                    },
                  ]}
                />
              </Card>

              <Card
                className="kpm-card"
                title={t("portal.tasksProgress")}
                extra={
                  <Space className="kpm-portal-card-extra" wrap>
                    <Select
                      allowClear
                      placeholder={t("portal.filterProject")}
                      style={{ width: 180 }}
                      options={projectOptions}
                      value={projectFilter}
                      onChange={(value) => {
                        setProjectFilter(value);
                        setTaskPagination((current) => ({ ...current, current: 1 }));
                      }}
                    />
	                    <Select
	                      allowClear
	                      placeholder={t("portal.filterStatus")}
	                      style={{ width: 160 }}
                      options={taskStatusOptions}
                      value={statusFilter}
                      onChange={(value) => {
                        setStatusFilter(value);
	                        setTaskPagination((current) => ({ ...current, current: 1 }));
	                      }}
	                    />
	                    <Select
	                      allowClear
	                      showSearch
	                      optionFilterProp="label"
	                      placeholder={t("portal.filterCreator")}
	                      style={{ width: 220 }}
	                      options={contactOptions}
	                      loading={contactsQuery.isFetching}
	                      value={creatorFilter}
	                      onChange={(value) => {
	                        setCreatorFilter(value);
	                        setTaskPagination((current) => ({ ...current, current: 1 }));
	                      }}
	                    />
	                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        taskForm.resetFields();
                        setTaskModal(true);
                      }}
                    >
                      {t("portal.createTask")}
                    </Button>
                  </Space>
                }
              >
                <Table<CustomerPortalTask>
                  size="small"
                  rowKey="id"
                  dataSource={taskPageQuery.data?.items || []}
                  loading={taskPageQuery.isFetching}
                  pagination={{
                    current: taskPagination.current,
                    pageSize: taskPagination.pageSize,
                    total: taskPageQuery.data?.total || 0,
                    showSizeChanger: true,
                    onChange: (current, pageSize) =>
                      setTaskPagination({ current, pageSize }),
                  }}
                  scroll={{ x: 1180 }}
                  locale={{
                    emptyText: (
                      <Empty description={t("portal.noCustomerTasks")} />
                    ),
                  }}
                  columns={[
                    {
                      title: t("portal.taskNo"),
                      dataIndex: "taskNo",
                      width: 120,
                      render: (value) => value || "-",
                    },
                    {
                      title: t("portal.title"),
                      dataIndex: "title",
                      ellipsis: true,
                    },
                    {
                      title: t("portal.project"),
                      dataIndex: "projectName",
                      width: 160,
                      ellipsis: true,
                      render: (value) => <TaskProjectTag value={value} />,
                    },
                    {
                      title: t("portal.category"),
	                      dataIndex: "category",
	                      width: 78,
	                      align: "center",
	                      render: (_, task) => (
	                        <TaskCategoryTag
	                          value={task.category}
	                          label={portalTaskCategoryLabel(task, i18n.language)}
	                          shortLabel={portalTaskCategoryShortLabel(task, i18n.language)}
	                        />
	                      ),
	                    },
                    {
                      title: t("portal.status"),
                      dataIndex: "status",
                      width: 110,
                      render: (value) => <StatusTag value={value} />,
                    },
                    {
                      title: t("portal.priority"),
                      dataIndex: "priority",
                      width: 90,
                      render: (value) => <TaskPriorityTag value={value} />,
                    },
                    {
                      title: t("portal.updatedAt"),
                      dataIndex: "updatedAt",
                      width: 170,
                      sorter: (a, b) =>
                        String(a.updatedAt || "").localeCompare(
                          String(b.updatedAt || ""),
                        ),
                      defaultSortOrder: "descend",
                      render: dateTimeText,
                    },
                    {
                      title: t("portal.comments"),
                      width: 100,
                      align: "center",
                      render: (_, task) => (
                        <Badge
                          count={taskCommentCount(task)}
                          showZero
                          color="#1fd7c7"
                        />
                      ),
                    },
                    {
                      title: t("portal.actions"),
                      width: 108,
                      align: "center",
                      render: (_, task) => (
                        <Button
                          className="kpm-portal-comment-action"
                          size="small"
                          type="primary"
                          ghost
	                          onClick={() => openTaskDetail(task)}
	                        >
	                          {t("portal.viewDetail")}
                        </Button>
                      ),
                    },
                  ]}
                />
              </Card>
            </Space>
          ) : null}
        </DataState>
      </section>

      <Modal
        title={t("portal.serviceStatsTitle")}
        open={statsModal}
        maskClosable
        onCancel={() => setStatsModal(false)}
        footer={<Button type="primary" onClick={() => setStatsModal(false)}>{t("portal.gotIt")}</Button>}
        width="calc(100vw - 48px)"
        style={{ top: 20 }}
        className="kpm-portal-stats-modal kpm-portal-stats-modal-fullscreen"
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Space wrap className="kpm-portal-stats-filter">
            <Typography.Text type="secondary">{t("portal.statsProjectFilter")}</Typography.Text>
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder={t("portal.filterProject")}
              style={{ width: 260 }}
              value={statsProjectId}
              options={projectOptions}
              onChange={setStatsProjectId}
            />
          </Space>
          <DataState loading={statsQuery.isLoading} error={statsQuery.error}>
            {statsQuery.data ? (
              <>
                <div className="kpm-portal-stats-grid">
                  <article>
                    <span>{t("portal.totalTasks")}</span>
                    <strong>{statsQuery.data.totalTasks}</strong>
                  </article>
                  <article>
                    <span>{t("portal.completedTasks")}</span>
                    <strong>{statsQuery.data.completedTasks}</strong>
                  </article>
                  <article>
                    <span>{t("portal.openTasks")}</span>
                    <strong>{statsQuery.data.openTasks}</strong>
                  </article>
                  <article>
                    <span>{t("portal.completionRate")}</span>
                    <strong>{statsQuery.data.completionRate.toFixed(1)}%</strong>
                  </article>
                  <article>
                    <span>{t("portal.avgResponse")}</span>
                    <strong>{formatHours(statsQuery.data.avgResponseHours)}</strong>
                  </article>
                  <article>
                    <span>{t("portal.avgCompletion")}</span>
                    <strong>{formatHours(statsQuery.data.avgCompletionHours)}</strong>
                  </article>
	                </div>
	                <div className="kpm-portal-stats-chart-grid">
	                  <Card
	                    size="small"
	                    className="kpm-portal-stats-subcard kpm-portal-stats-main-card"
	                    title={t("portal.projectDeliveryStats")}
	                  >
	                    <EChart option={statsChartOption} height={500} />
	                  </Card>
	                  <Card
	                    size="small"
	                    className="kpm-portal-stats-subcard"
	                    title={t("portal.categoryDistribution")}
	                  >
	                    <EChart option={statsCategoryOption} height={320} />
	                  </Card>
	                  <Card
	                    size="small"
	                    className="kpm-portal-stats-subcard"
	                    title={t("portal.contactActivity")}
	                  >
	                    <EChart option={statsCreatorOption} height={320} />
	                  </Card>
	                </div>
	              </>
            ) : null}
          </DataState>
        </Space>
      </Modal>

      <Modal
        title={t("portal.taskModalTitle")}
        open={taskModal}
        maskClosable
        onCancel={() => setTaskModal(false)}
        onOk={submitTask}
        okText={t("portal.submitTask")}
        width={680}
      >
        <Form form={taskForm} layout="vertical" requiredMark={false}>
          <Form.Item
            name="projectId"
            label={t("portal.relatedProject")}
            rules={[
              validationRules.required(t("portal.validationSelectProject")),
            ]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder={t("portal.selectProject")}
              options={projectOptions}
            />
          </Form.Item>
          <Form.Item
            name="title"
            label={t("portal.taskTitle")}
            rules={[
              validationRules.required(t("portal.validationTaskTitle")),
              { max: 120, message: t("portal.validationMax", { max: 120 }) },
            ]}
          >
            <Input placeholder={t("portal.taskTitlePlaceholder")} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("portal.taskDescription")}
            rules={[
              validationRules.required(t("portal.validationTaskDescription")),
              { max: 3000, message: t("portal.validationMax", { max: 3000 }) },
            ]}
          >
            <Input.TextArea
              rows={5}
              placeholder={t("portal.taskDescriptionPlaceholder")}
            />
          </Form.Item>
          <Form.Item name="priority" label={t("portal.priority")}>
            <Select
              allowClear
              options={[
                { label: t("portal.high"), value: "高" },
                { label: t("portal.medium"), value: "中" },
                { label: t("portal.low"), value: "低" },
              ]}
              placeholder={t("portal.defaultPriority")}
            />
          </Form.Item>
          <Form.Item
            name="files"
            label={t("portal.ticketAttachments", {
              size: MAX_ATTACHMENT_SIZE_MB,
            })}
            valuePropName="fileList"
            getValueFromEvent={uploadFileList}
          >
            <Upload multiple beforeUpload={beforeUpload}>
              <Button icon={<UploadOutlined />}>
                {t("portal.selectAttachment")}
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
	      <Modal
	        title={
	          activePortalTask
	            ? t("portal.taskDetailTitle", {
	                name: activePortalTask.taskNo || activePortalTask.title,
	              })
	            : t("portal.taskDetailFallback")
	        }
	        open={Boolean(commentTask)}
	        maskClosable
	        onCancel={() => setCommentTask(null)}
        onOk={submitTaskComment}
        okText={t("portal.submitComment")}
        width={760}
        className="kpm-portal-task-modal"
      >
	        {activePortalTask ? (
	          <Space direction="vertical" size={16} style={{ width: "100%" }}>
	            <section className="kpm-portal-task-summary">
	              {taskDetailQuery.isFetching ? (
	                <Space size={8} className="kpm-portal-task-detail-loading">
	                  <Spin size="small" />
	                  <Typography.Text type="secondary">{t("portal.loadingTaskDetail")}</Typography.Text>
	                </Space>
	              ) : null}
	              <Space wrap size={[8, 8]}>
	                <Tag color="blue">
	                  {activePortalTask.projectName || t("portal.notLinkedProject")}
	                </Tag>
	                <TaskCategoryTag
	                  value={activePortalTask.category}
	                  label={portalTaskCategoryLabel(activePortalTask, i18n.language)}
	                  shortLabel={portalTaskCategoryShortLabel(activePortalTask, i18n.language)}
	                />
	                <StatusTag value={activePortalTask.status} />
	                {activePortalTask.priority ? (
	                  <Tag color="gold">{activePortalTask.priority}</Tag>
	                ) : null}
	              </Space>
	              <Typography.Title level={5}>{activePortalTask.title}</Typography.Title>
	              <Space wrap size={[12, 4]} className="kpm-portal-task-meta">
	                <Typography.Text type="secondary">{t("portal.taskNo")}: {activePortalTask.taskNo || activePortalTask.id}</Typography.Text>
	                <Typography.Text type="secondary">{t("portal.creator")}: {activePortalTask.creator || "-"}</Typography.Text>
	                <Typography.Text type="secondary">{t("portal.createdAt")}: {dateTimeText(activePortalTask.createdAt)}</Typography.Text>
	                <Typography.Text type="secondary">{t("portal.updatedAt")}: {dateTimeText(activePortalTask.updatedAt)}</Typography.Text>
	              </Space>
	              <Typography.Paragraph>
	                {activePortalTask.description || t("portal.noDescription")}
	              </Typography.Paragraph>
	            </section>

	            <section>
	              <Typography.Text strong>{t("portal.taskAttachments")}</Typography.Text>
	              <div className="kpm-portal-task-attachments">
	                {activePortalTask.attachments?.length ? (
	                  renderAttachmentTags(
	                    activePortalTask.attachments,
	                    t("portal.attachmentFallback"),
	                    (file) =>
	                      downloadCommentAttachment(file).catch((error) =>
	                        message.error(error.message || t("portal.downloadFailed")),
	                      ),
	                  )
	                ) : (
	                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("portal.noTaskAttachments")} />
	                )}
	              </div>
	            </section>

	            <section>
              <Typography.Text strong>{t("portal.comments")}</Typography.Text>
              <div
                className="kpm-portal-comment-list"
                onScroll={handleCommentScroll}
              >
                {commentQuery.isLoading ? (
                  <div className="kpm-portal-comment-loading">
                    <Spin size="small" />
                    <Typography.Text type="secondary">
                      {t("portal.loadingComments")}
                    </Typography.Text>
                  </div>
                ) : visibleComments.length ? (
                  <>
                    <List
                      size="small"
                      dataSource={visibleComments}
                      renderItem={(comment) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <Space wrap>
                                <span>
                                  {comment.author || t("portal.customerKozen")}
                                </span>
                                <small>{dateTimeText(comment.createdAt)}</small>
                              </Space>
                            }
                            description={
                              <>
                                <Typography.Paragraph
                                  style={{ marginBottom: 6 }}
                                >
                                  {comment.content || "-"}
                                </Typography.Paragraph>
                                {renderAttachmentTags(
                                  comment.attachments,
                                  t("portal.attachmentFallback"),
                                  (file) =>
                                    downloadCommentAttachment(file).catch(
                                      (error) =>
                                        message.error(
                                          error.message ||
                                            t("portal.downloadFailed"),
                                        ),
                                    ),
                                )}
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    {commentQuery.isFetchingNextPage ? (
                      <div className="kpm-portal-comment-loading">
                        <Spin size="small" />
                        <Typography.Text type="secondary">
                          {t("portal.loadingComments")}
                        </Typography.Text>
                      </div>
                    ) : null}
                    {!commentQuery.hasNextPage ? (
                      <Typography.Text
                        className="kpm-portal-comment-end"
                        type="secondary"
                      >
                        {t("portal.noMoreComments")}
                      </Typography.Text>
                    ) : null}
                  </>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t("portal.noComments")}
                  />
                )}
              </div>
            </section>

            <Form form={commentForm} layout="vertical" requiredMark={false}>
              <Form.Item
                name="content"
                label={t("portal.addComment")}
                rules={[
                  validationRules.required(t("portal.validationComment")),
                  {
                    max: 2000,
                    message: t("portal.validationMax", { max: 2000 }),
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={t("portal.addCommentPlaceholder")}
                />
              </Form.Item>
              <Form.Item
                name="files"
                label={t("portal.attachmentLabel", {
                  size: MAX_ATTACHMENT_SIZE_MB,
                })}
                valuePropName="fileList"
                getValueFromEvent={uploadFileList}
              >
                <Upload multiple beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>
                    {t("portal.selectAttachment")}
                  </Button>
                </Upload>
              </Form.Item>
            </Form>
          </Space>
        ) : null}
      </Modal>

      <Modal
        title={selectedAnnouncement?.title || t("portal.announcementDetail")}
        open={Boolean(selectedAnnouncement)}
        footer={
          <Button type="primary" onClick={() => setSelectedAnnouncement(null)}>
            {t("portal.gotIt")}
          </Button>
        }
        onCancel={() => setSelectedAnnouncement(null)}
        maskClosable
        width={640}
        className="kpm-portal-announcement-modal"
      >
        {selectedAnnouncement ? (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Space wrap>
              <Tag color="processing">
                {selectedAnnouncement.projectName ||
                  t("portal.announcementFallbackProject")}
              </Tag>
              {selectedAnnouncement.announcementType ? (
                <Tag
                  color={
                    selectedAnnouncement.announcementType.includes("EOL")
                      ? "warning"
                      : "default"
                  }
                >
                  {announcementTypeLabels.get(
                    selectedAnnouncement.announcementType,
                  ) || selectedAnnouncement.announcementType}
                </Tag>
              ) : null}
              <Typography.Text type="secondary">
                {dateTimeText(selectedAnnouncement.publishedAt)}
              </Typography.Text>
              {selectedAnnouncement.publisher ? (
                <Typography.Text type="secondary">
                  {t("portal.publisher", {
                    name: selectedAnnouncement.publisher,
                  })}
                </Typography.Text>
              ) : null}
            </Space>
            <Typography.Paragraph className="kpm-portal-announcement-content">
              {selectedAnnouncement.content || t("portal.emptyContent")}
            </Typography.Paragraph>
          </Space>
        ) : null}
      </Modal>
    </main>
  );
}
