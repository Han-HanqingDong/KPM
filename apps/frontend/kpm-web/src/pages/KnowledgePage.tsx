import {
  CheckCircleOutlined,
  DownloadOutlined,
  PlusOutlined,
  RollbackOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButtons } from "../components/common/ActionButtons";
import { CustomerSelect } from "../components/common/CustomerSelect";
import { DataState } from "../components/common/DataState";
import { ProjectSelect } from "../components/common/ProjectSelect";
import { PageScaffold } from "../components/PageScaffold";
import { StatusTag } from "../components/StatusTag";
import { useAuth } from "../context/AuthContext";
import { useKpmData } from "../hooks/useKpmData";
import { confirmSubmit } from "../hooks/useConfirmingForm";
import { kpmApi } from "../services/kpmApi";
import type { AnyRecord, KnowledgeArticle } from "../types";
import {
  attachmentLimitMessage,
  downloadBusinessFile,
  isWithinAttachmentLimit,
  normalizeUploadFiles,
  uploadBusinessFiles,
} from "../utils/fileUpload";
import { dateTimeText } from "../utils/format";
import { validationRules } from "../validation";

const KNOWLEDGE_PAGE_SIZE = 10;
const KNOWLEDGE_STATUS_PENDING = "待审核";
const KNOWLEDGE_STATUS_PUBLISHED = "已发布";

type KnowledgeFormValues = {
  title: string;
  symptom: string;
  rootCause: string;
  solution?: string;
  workaround?: string;
  projectScope?: "PROJECT" | "OTHER";
  projectIds?: string[];
  customerScope?: "CUSTOMER" | "ALL" | "INTERNAL";
  customerIds?: string[];
  taskIds?: string[];
};

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

function scopeText(article: KnowledgeArticle, t: (key: string) => string) {
  const project = article.projectScope === "OTHER"
    ? t("knowledge.projectOther")
    : article.projectNames?.length
      ? article.projectNames.join("、")
      : t("knowledge.noProjectScope");
  const customer = article.customerScope === "ALL"
    ? t("knowledge.allCustomers")
    : article.customerScope === "INTERNAL"
      ? t("knowledge.internalOnly")
      : article.customerNames?.length
        ? article.customerNames.join("、")
        : t("knowledge.noCustomerScope");
  return { project, customer };
}

function ArticleDetail({ article, onDownload }: { article: KnowledgeArticle; onDownload: (file: AnyRecord) => void }) {
  const { t } = useTranslation();
  const scopes = scopeText(article, t);
  return (
    <article className="kpm-knowledge-article">
      <header>
        <Space wrap size={[8, 8]}>
          <StatusTag value={article.status} />
          <Tag color="blue">{scopes.project}</Tag>
          <Tag color={article.customerScope === "INTERNAL" ? "default" : "green"}>{scopes.customer}</Tag>
        </Space>
        <Typography.Title level={3}>{article.title}</Typography.Title>
        <Typography.Text type="secondary">
          {t("knowledge.authorAndTime", {
            author: article.authorName || "-",
            time: dateTimeText(article.updatedAt || article.createdAt),
          })}
        </Typography.Text>
      </header>
      <section>
        <h3>{t("knowledge.symptom")}</h3>
        <Typography.Paragraph>{article.symptom}</Typography.Paragraph>
      </section>
      <section>
        <h3>{t("knowledge.rootCause")}</h3>
        <Typography.Paragraph>{article.rootCause}</Typography.Paragraph>
      </section>
      {article.solution ? (
        <section>
          <h3>{t("knowledge.solution")}</h3>
          <Typography.Paragraph>{article.solution}</Typography.Paragraph>
        </section>
      ) : null}
      {article.workaround ? (
        <section>
          <h3>{t("knowledge.workaround")}</h3>
          <Typography.Paragraph>{article.workaround}</Typography.Paragraph>
        </section>
      ) : null}
      {article.attachments?.length ? (
        <section>
          <h3>{t("knowledge.attachments")}</h3>
          <Space wrap>
            {article.attachments.map((file, index) => (
              <Tag
                key={file.objectKey || file.fileName || file.name || index}
                className="clickable-tag"
                icon={<DownloadOutlined />}
                onClick={() => onDownload(file)}
              >
                {file.fileName || file.name || t("knowledge.attachment")}
              </Tag>
            ))}
          </Space>
        </section>
      ) : null}
      {article.taskIds?.length ? (
        <section>
          <h3>{t("knowledge.linkedTasks")}</h3>
          <Space wrap>
            {article.taskIds.map((id) => <Tag key={id}>{id}</Tag>)}
          </Space>
        </section>
      ) : null}
    </article>
  );
}

export function KnowledgePage() {
  const { t } = useTranslation();
  const { data } = useKpmData();
  const { user, can } = useAuth();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<KnowledgeFormValues>();
  const projectScope = Form.useWatch("projectScope", form);
  const customerScope = Form.useWatch("customerScope", form);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string>();
  const [projectId, setProjectId] = useState<string>();
  const [customerId, setCustomerId] = useState<string>();
  const [taskId, setTaskId] = useState<string>();
  const [pagination, setPagination] = useState({ current: 1, pageSize: KNOWLEDGE_PAGE_SIZE });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KnowledgeArticle | null>(null);
  const [detail, setDetail] = useState<KnowledgeArticle | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<UploadFile[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<AnyRecord[]>([]);
  const [taskSearch, setTaskSearch] = useState("");

  const articleQuery = useQuery({
    queryKey: ["kpm", "knowledge", keyword, status, projectId, customerId, taskId, pagination.current, pagination.pageSize],
    queryFn: () => kpmApi.knowledgePage({ keyword, status, projectId, customerId, taskId, page: pagination.current, pageSize: pagination.pageSize }),
    placeholderData: (previous) => previous,
    staleTime: 10_000,
  });

  const taskQuery = useQuery({
    queryKey: ["kpm", "knowledge-task-search", taskSearch],
    queryFn: () => kpmApi.tasksPage({ keyword: taskSearch, page: 1, pageSize: 20 }),
    enabled: modalOpen,
    staleTime: 15_000,
  });

  const taskOptions = useMemo(() => (taskQuery.data?.items || []).map((task) => ({
    label: `${task.taskNo || task.id} · ${task.title}`,
    value: task.id,
  })), [taskQuery.data?.items]);

  const operatorName = user?.name || user?.account || "当前用户";

  function resetEditor() {
    form.resetFields();
    form.setFieldsValue({ projectScope: "OTHER", customerScope: "INTERNAL" });
    setAttachmentFiles([]);
    setExistingAttachments([]);
  }

  function openCreate() {
    setEditing(null);
    resetEditor();
    setModalOpen(true);
  }

  function openEdit(article: KnowledgeArticle) {
    setEditing(article);
    setExistingAttachments(article.attachments || []);
    setAttachmentFiles([]);
    form.setFieldsValue({
      title: article.title,
      symptom: article.symptom,
      rootCause: article.rootCause,
      solution: article.solution,
      workaround: article.workaround,
      projectScope: article.projectScope === "OTHER" ? "OTHER" : "PROJECT",
      projectIds: article.projectIds || [],
      customerScope: article.customerScope === "ALL" || article.customerScope === "INTERNAL" ? article.customerScope : "CUSTOMER",
      customerIds: article.customerIds || [],
      taskIds: article.taskIds || [],
    });
    setModalOpen(true);
  }

  async function refreshKnowledge() {
    await queryClient.invalidateQueries({ queryKey: ["kpm", "knowledge"] });
  }

  async function openDetail(article: KnowledgeArticle) {
    const row = await kpmApi.knowledgeArticle(article.id);
    setDetail(row);
  }

  function removeExistingAttachment(file: AnyRecord) {
    setExistingAttachments((rows) => rows.filter((item) => (item.objectKey || item.fileName || item.name) !== (file.objectKey || file.fileName || file.name)));
  }

  async function submit() {
    const values = await form.validateFields();
    confirmSubmit(editing ? t("knowledge.confirmUpdate") : t("knowledge.confirmCreate"), async () => {
      const files = normalizeUploadFiles(attachmentFiles);
      const uploaded = files.length
        ? await uploadBusinessFiles(files, "knowledge-attachments", editing?.id || `knowledge-${Date.now()}`, operatorName)
        : [];
      const body = {
        ...values,
        projectIds: values.projectScope === "PROJECT" ? values.projectIds || [] : [],
        customerIds: values.customerScope === "CUSTOMER" ? values.customerIds || [] : [],
        attachments: [...existingAttachments, ...uploaded],
      };
      if (editing) await kpmApi.updateKnowledgeArticle(editing.id, body);
      else await kpmApi.createKnowledgeArticle(body);
      message.success(t("knowledge.saved"));
      setModalOpen(false);
      resetEditor();
      await refreshKnowledge();
    });
  }

  async function changeStatus(article: KnowledgeArticle, nextStatus: string) {
    Modal.confirm({
      title: nextStatus === KNOWLEDGE_STATUS_PUBLISHED ? t("knowledge.confirmPublish") : t("knowledge.confirmRollback"),
      content: t("knowledge.confirmStatusContent"),
      okText: t("common.confirm"),
      cancelText: t("common.cancel"),
      onOk: async () => {
        await kpmApi.updateKnowledgeArticleStatus(article.id, nextStatus);
        message.success(t("knowledge.statusUpdated"));
        await refreshKnowledge();
      },
    });
  }

  async function deleteArticle(article: KnowledgeArticle) {
    await kpmApi.deleteKnowledgeArticle(article.id);
    message.success(t("knowledge.deleted"));
    await refreshKnowledge();
  }

  function handleDownload(file: AnyRecord) {
    downloadBusinessFile(file).catch((error) => message.error(error.message || t("knowledge.downloadFailed")));
  }

  return (
    <PageScaffold
      title={t("knowledge.title")}
      subtitle={t("knowledge.subtitle")}
      extra={can("button:knowledge:create") ? <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>{t("knowledge.create")}</Button> : null}
    >
      <Card className="kpm-card">
        <div className="kpm-table-toolbar">
          <Space wrap>
            <Input.Search
              allowClear
              prefix={<SearchOutlined />}
              placeholder={t("knowledge.searchPlaceholder")}
              style={{ width: 260 }}
              onSearch={(value) => { setKeyword(value); setPagination((page) => ({ ...page, current: 1 })); }}
            />
            <Select
              allowClear
              placeholder={t("knowledge.filterStatus")}
              style={{ width: 150 }}
              value={status}
              options={[KNOWLEDGE_STATUS_PENDING, KNOWLEDGE_STATUS_PUBLISHED].map((value) => ({ label: value, value }))}
              onChange={(value) => { setStatus(value); setPagination((page) => ({ ...page, current: 1 })); }}
            />
            <ProjectSelect
              projects={data?.projects || []}
              placeholder={t("knowledge.filterProject")}
              style={{ width: 220 }}
              value={projectId}
              onChange={(value) => { setProjectId(value as string | undefined); setPagination((page) => ({ ...page, current: 1 })); }}
            />
            <CustomerSelect
              customers={data?.customers || []}
              placeholder={t("knowledge.filterCustomer")}
              style={{ width: 220 }}
              value={customerId}
              onChange={(value) => { setCustomerId(value as string | undefined); setPagination((page) => ({ ...page, current: 1 })); }}
            />
            <Input.Search
              allowClear
              placeholder={t("knowledge.filterTask")}
              style={{ width: 180 }}
              onSearch={(value) => { setTaskId(value); setPagination((page) => ({ ...page, current: 1 })); }}
            />
          </Space>
        </div>
        <DataState loading={articleQuery.isLoading} error={articleQuery.error}>
          <Table<KnowledgeArticle>
            size="small"
            rowKey="id"
            dataSource={articleQuery.data?.items || []}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: articleQuery.data?.total || 0,
              showSizeChanger: true,
              onChange: (current, pageSize) => setPagination({ current, pageSize }),
            }}
            locale={{ emptyText: <Empty description={t("knowledge.empty")} /> }}
            columns={[
              {
                title: t("knowledge.articleTitle"),
                dataIndex: "title",
                ellipsis: true,
                render: (value, row) => (
                  <Tooltip title={row.symptom}>
                    <Button type="link" className="kpm-link-button" onClick={() => openDetail(row)}>{value}</Button>
                  </Tooltip>
                ),
              },
              { title: t("knowledge.status"), dataIndex: "status", width: 110, render: (value) => <StatusTag value={value} /> },
              {
                title: t("knowledge.projectScope"),
                width: 220,
                render: (_, row) => <Typography.Text ellipsis title={scopeText(row, t).project}>{scopeText(row, t).project}</Typography.Text>,
              },
              {
                title: t("knowledge.customerScope"),
                width: 220,
                render: (_, row) => <Typography.Text ellipsis title={scopeText(row, t).customer}>{scopeText(row, t).customer}</Typography.Text>,
              },
              { title: t("knowledge.author"), dataIndex: "authorName", width: 120, ellipsis: true },
              { title: t("knowledge.updatedAt"), dataIndex: "updatedAt", width: 170, render: dateTimeText },
              {
                title: t("knowledge.actions"),
                width: 164,
                fixed: "right",
                render: (_, row) => (
                  <ActionButtons
                    onView={() => openDetail(row)}
                    onEdit={can("button:knowledge:edit") ? () => openEdit(row) : undefined}
                    onDelete={can("button:knowledge:delete") ? () => deleteArticle(row) : undefined}
                    deleteTitle={t("knowledge.confirmDelete")}
                    extra={can("button:knowledge:review") ? (
                      row.status === KNOWLEDGE_STATUS_PUBLISHED ? (
                        <Tooltip title={t("knowledge.rollback")}><Button size="small" type="text" icon={<RollbackOutlined />} onClick={() => changeStatus(row, KNOWLEDGE_STATUS_PENDING)} /></Tooltip>
                      ) : (
                        <Tooltip title={t("knowledge.publish")}><Button size="small" type="text" icon={<CheckCircleOutlined />} onClick={() => changeStatus(row, KNOWLEDGE_STATUS_PUBLISHED)} /></Tooltip>
                      )
                    ) : null}
                  />
                ),
              },
            ]}
            scroll={{ x: 1180 }}
          />
        </DataState>
      </Card>

      <Modal
        title={editing ? t("knowledge.edit") : t("knowledge.create")}
        open={modalOpen}
        maskClosable
        onCancel={() => setModalOpen(false)}
        onOk={submit}
        okText={t("common.save")}
        width={900}
        className="kpm-knowledge-modal"
      >
        <Form form={form} layout="vertical" requiredMark={false} initialValues={{ projectScope: "OTHER", customerScope: "INTERNAL" }}>
          <Form.Item name="title" label={t("knowledge.articleTitle")} rules={[validationRules.required(t("knowledge.validationTitle")), { max: 180, message: t("knowledge.validationMax", { max: 180 }) }]}>
            <Input placeholder={t("knowledge.titlePlaceholder")} />
          </Form.Item>
          <Form.Item name="symptom" label={t("knowledge.symptom")} rules={[validationRules.required(t("knowledge.validationSymptom")), { max: 4000, message: t("knowledge.validationMax", { max: 4000 }) }]}>
            <Input.TextArea rows={4} placeholder={t("knowledge.symptomPlaceholder")} />
          </Form.Item>
          <Form.Item name="rootCause" label={t("knowledge.rootCause")} rules={[validationRules.required(t("knowledge.validationRootCause")), { max: 4000, message: t("knowledge.validationMax", { max: 4000 }) }]}>
            <Input.TextArea rows={4} placeholder={t("knowledge.rootCausePlaceholder")} />
          </Form.Item>
          <div className="kpm-knowledge-two-columns">
            <Form.Item
              name="solution"
              label={t("knowledge.solution")}
              dependencies={["workaround"]}
              rules={[{ max: 6000, message: t("knowledge.validationMax", { max: 6000 }) }, ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value || getFieldValue("workaround")) return Promise.resolve();
                  return Promise.reject(new Error(t("knowledge.validationSolutionOrWorkaround")));
                },
              })]}
            >
              <Input.TextArea rows={5} placeholder={t("knowledge.solutionPlaceholder")} />
            </Form.Item>
            <Form.Item
              name="workaround"
              label={t("knowledge.workaround")}
              dependencies={["solution"]}
              rules={[{ max: 6000, message: t("knowledge.validationMax", { max: 6000 }) }, ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value || getFieldValue("solution")) return Promise.resolve();
                  return Promise.reject(new Error(t("knowledge.validationSolutionOrWorkaround")));
                },
              })]}
            >
              <Input.TextArea rows={5} placeholder={t("knowledge.workaroundPlaceholder")} />
            </Form.Item>
          </div>
          <div className="kpm-knowledge-two-columns">
            <Form.Item name="projectScope" label={t("knowledge.projectScope")} rules={[validationRules.required(t("knowledge.validationProjectScope"))]}>
              <Radio.Group optionType="button" buttonStyle="solid" options={[{ label: t("knowledge.projectSpecific"), value: "PROJECT" }, { label: t("knowledge.projectOther"), value: "OTHER" }]} />
            </Form.Item>
            <Form.Item name="projectIds" label={t("knowledge.relatedProjects")} rules={projectScope === "PROJECT" ? [validationRules.required(t("knowledge.validationProjects"))] : []}>
              <ProjectSelect mode="multiple" projects={data?.projects || []} disabled={projectScope !== "PROJECT"} placeholder={t("knowledge.selectProjects")} />
            </Form.Item>
          </div>
          <div className="kpm-knowledge-two-columns">
            <Form.Item name="customerScope" label={t("knowledge.customerScope")} rules={[validationRules.required(t("knowledge.validationCustomerScope"))]}>
              <Radio.Group optionType="button" buttonStyle="solid" options={[{ label: t("knowledge.customerSpecific"), value: "CUSTOMER" }, { label: t("knowledge.allCustomers"), value: "ALL" }, { label: t("knowledge.internalOnly"), value: "INTERNAL" }]} />
            </Form.Item>
            <Form.Item name="customerIds" label={t("knowledge.relatedCustomers")} rules={customerScope === "CUSTOMER" ? [validationRules.required(t("knowledge.validationCustomers"))] : []}>
              <CustomerSelect mode="multiple" customers={data?.customers || []} disabled={customerScope !== "CUSTOMER"} placeholder={t("knowledge.selectCustomers")} />
            </Form.Item>
          </div>
          <Form.Item name="taskIds" label={t("knowledge.linkedTasks")}>
            <Select
              mode="multiple"
              showSearch
              allowClear
              filterOption={false}
              placeholder={t("knowledge.taskSearchPlaceholder")}
              options={taskOptions}
              loading={taskQuery.isFetching}
              onSearch={setTaskSearch}
            />
          </Form.Item>
          <Form.Item label={t("knowledge.attachments")} valuePropName="fileList" getValueFromEvent={uploadFileList}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              {existingAttachments.length ? (
                <Space wrap>
                  {existingAttachments.map((file, index) => (
                    <Tag key={file.objectKey || file.fileName || file.name || index} closable onClose={(event) => { event.preventDefault(); removeExistingAttachment(file); }}>
                      {file.fileName || file.name || t("knowledge.attachment")}
                    </Tag>
                  ))}
                </Space>
              ) : null}
              <Upload multiple beforeUpload={beforeUpload} fileList={attachmentFiles} onChange={({ fileList }) => setAttachmentFiles(fileList)}>
                <Button icon={<UploadOutlined />}>{t("knowledge.selectAttachment")}</Button>
              </Upload>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={detail?.title || t("knowledge.detail")}
        open={Boolean(detail)}
        maskClosable
        onCancel={() => setDetail(null)}
        footer={<Button type="primary" onClick={() => setDetail(null)}>{t("common.close")}</Button>}
        width={860}
        className="kpm-knowledge-detail-modal"
      >
        {detail ? <ArticleDetail article={detail} onDownload={handleDownload} /> : null}
      </Modal>
    </PageScaffold>
  );
}
