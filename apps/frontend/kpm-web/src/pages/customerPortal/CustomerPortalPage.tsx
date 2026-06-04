import {
  BellOutlined,
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
  Typography,
  Upload,
  message,
} from "antd";
import { useMemo, useState } from "react";
import type { UIEvent } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { DataState } from "../../components/common/DataState";
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
  CustomerPortalMaterial,
  CustomerPortalMessage,
  CustomerPortalTask,
} from "../../types/customerPortal";
import type { AnyRecord } from "../../types";
import { dateTimeText } from "../../utils/format";
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
) {
  if (!attachments?.length) return null;
  return (
    <Space wrap size={[6, 6]} className="kpm-portal-comment-attachments">
      {attachments.map((file, index) => (
        <Tag key={file.objectKey || file.fileName || file.name || index}>
          {file.fileName || file.name || fallbackText}
        </Tag>
      ))}
    </Space>
  );
}

export function CustomerPortalPage() {
  const hasPortalToken = Boolean(readCustomerPortalToken());
  const { t } = useTranslation();
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
      Array.from(
        new Set((data?.tasks || []).map((task) => task.status).filter(Boolean)),
      ).map((status) => ({ label: status!, value: status! })),
    [data?.tasks],
  );
  const projectOptions = useMemo(
    () =>
      (data?.projects || []).map((project) => ({
        label: project.projectName,
        value: project.projectId,
      })),
    [data?.projects],
  );
  const filteredTasks = useMemo(
    () =>
      (data?.tasks || []).filter(
        (task) =>
          (!statusFilter || task.status === statusFilter) &&
          (!projectFilter || task.projectId === projectFilter),
      ),
    [data?.tasks, projectFilter, statusFilter],
  );
  const commentTaskId = commentTask?.id;
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

  if (!hasPortalToken) return <Navigate to="/customer-login" replace />;

  async function refresh(showToast = false) {
    await query.refetch();
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

  async function markMessageRead(row: CustomerPortalMessage) {
    if (!row.readFlag) {
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
            disabled={!rows.some((item) => !item.readFlag)}
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
              className={item.readFlag ? "" : "unread"}
              onClick={() =>
                markMessageRead(item).catch((error) =>
                  message.error(error.message || t("portal.readFailed")),
                )
              }
            >
              <List.Item.Meta
                title={
                  <Space size={6}>
                    {item.readFlag ? null : <Badge status="processing" />}
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
    Modal.confirm({
      title: t("portal.submitTaskConfirmTitle"),
      content: t("portal.submitTaskConfirmContent"),
      okText: t("portal.submit"),
      cancelText: t("portal.cancel"),
      onOk: async () => {
        await customerPortalApi.createTask(values);
        message.success(t("portal.taskSubmitted"));
        setTaskModal(false);
        taskForm.resetFields();
        refresh();
      },
    });
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
        ? { ...current, commentCount: updatedTask.commentCount }
        : current,
    );
    commentForm.resetFields();
    await queryClient.invalidateQueries({ queryKey: portalDataKey });
    await commentQuery.refetch();
  }

  function openTaskComments(task: CustomerPortalTask) {
    commentForm.resetFields();
    queryClient.removeQueries({ queryKey: taskCommentsKey(task.id) });
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
              </Card>

              <Card
                className="kpm-card"
                title={t("portal.publicMaterials")}
                extra={
                  <Tag>
                    {t("portal.materialCount", {
                      count: data.materials.length,
                    })}
                  </Tag>
                }
              >
                <Table<CustomerPortalMaterial>
                  size="small"
                  rowKey="id"
                  dataSource={data.materials}
                  locale={{
                    emptyText: (
                      <Empty description={t("portal.noPublicMaterials")} />
                    ),
                  }}
                  pagination={{ pageSize: 8, showSizeChanger: true }}
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
                      render: (value) => value || "-",
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
                      onChange={setProjectFilter}
                    />
                    <Select
                      allowClear
                      placeholder={t("portal.filterStatus")}
                      style={{ width: 160 }}
                      options={taskStatusOptions}
                      value={statusFilter}
                      onChange={setStatusFilter}
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
                  dataSource={filteredTasks}
                  pagination={{ pageSize: 8, showSizeChanger: true }}
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
                    },
                    {
                      title: t("portal.category"),
                      dataIndex: "category",
                      width: 100,
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
                          onClick={() => openTaskComments(task)}
                        >
                          {t("portal.viewComment")}
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
        </Form>
      </Modal>
      <Modal
        title={
          commentTask
            ? t("portal.taskCommentTitle", {
                name: commentTask.taskNo || commentTask.title,
              })
            : t("portal.taskCommentFallback")
        }
        open={Boolean(commentTask)}
        maskClosable
        onCancel={() => setCommentTask(null)}
        onOk={submitTaskComment}
        okText={t("portal.submitComment")}
        width={760}
        className="kpm-portal-task-modal"
      >
        {commentTask ? (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <section className="kpm-portal-task-summary">
              <Space wrap size={[8, 8]}>
                <Tag color="blue">
                  {commentTask.projectName || t("portal.notLinkedProject")}
                </Tag>
                <StatusTag value={commentTask.status} />
                {commentTask.priority ? (
                  <Tag color="gold">{commentTask.priority}</Tag>
                ) : null}
              </Space>
              <Typography.Title level={5}>{commentTask.title}</Typography.Title>
              <Typography.Paragraph>
                {commentTask.description || t("portal.noDescription")}
              </Typography.Paragraph>
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
