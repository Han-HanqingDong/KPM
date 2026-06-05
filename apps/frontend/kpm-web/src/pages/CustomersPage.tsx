import {
  NotificationOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ActionButtons } from "../components/common/ActionButtons";
import { DataState } from "../components/common/DataState";
import { EnumSelect } from "../components/common/EnumSelect";
import { UserSelect } from "../components/common/UserSelect";
import { PageScaffold } from "../components/PageScaffold";
import { StatusTag } from "../components/StatusTag";
import { useAuth } from "../context/AuthContext";
import { useKpmData, useRefreshKpmData } from "../hooks/useKpmData";
import { confirmSubmit } from "../hooks/useConfirmingForm";
import { kpmApi } from "../services/kpmApi";
import type { AnyRecord, Customer } from "../types";
import {
  attachmentLimitMessage,
  downloadBusinessFile,
  isWithinAttachmentLimit,
  normalizeUploadFiles,
  uploadBusinessFiles,
} from "../utils/fileUpload";
import { dateTimeText } from "../utils/format";
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

export function CustomersPage() {
  const { data, isLoading, error } = useKpmData();
  const refresh = useRefreshKpmData();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [followupForm] = Form.useForm();
  const [materialForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [keyword, setKeyword] = useState("");
  const [editing, setEditing] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<Customer | null>(null);
  const [contactDetail, setContactDetail] = useState<AnyRecord | null>(null);
  const [contactModal, setContactModal] = useState(false);
  const [followupModal, setFollowupModal] = useState(false);
  const [materialModal, setMaterialModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12 });
  const customerPageQuery = useQuery({
    queryKey: ["kpm", "customers-page", keyword, pagination.current, pagination.pageSize],
    queryFn: () =>
      kpmApi.customersPage({
        keyword,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
    placeholderData: (previous) => previous,
    staleTime: 10_000,
  });
  const customers = customerPageQuery.data?.items || [];
  const activeCustomer = useMemo(() => detail, [detail]);

  function refreshCustomerPage() {
    refresh();
    queryClient.invalidateQueries({ queryKey: ["kpm", "customers-page"] });
  }
  const operatorName = user?.name || user?.account || "当前用户";

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function openEdit(customer: Customer) {
    setEditing(customer);
    form.setFieldsValue(customer);
    setModalOpen(true);
  }

  async function openDetail(customer: Customer) {
    const full = await kpmApi.customer(customer.id);
    setDetail(full);
  }

  async function submitCustomer() {
    const values = await form.validateFields();
    confirmSubmit(editing ? "确认修改客户？" : "确认新增客户？", async () => {
      if (editing) await kpmApi.updateCustomer(editing.id, values);
      else await kpmApi.createCustomer(values);
      message.success(editing ? "客户已更新" : "客户已创建");
      setModalOpen(false);
      form.resetFields();
      refreshCustomerPage();
    });
  }

  async function addContact() {
    if (!detail) return;
    const values = await contactForm.validateFields();
    const updated = await kpmApi.addCustomerContact(detail.id, values);
    setDetail(updated as Customer);
    message.success("联系人已添加");
    setContactModal(false);
    contactForm.resetFields();
    refresh();
  }

  async function addFollowup() {
    if (!activeCustomer) return;
    const values = await followupForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    const attachments = files.length
      ? await uploadBusinessFiles(
          files,
          "customer-followup-attachments",
          activeCustomer.id,
          operatorName,
        )
      : [];
    const updated = await kpmApi.addCustomerFollowup(activeCustomer.id, {
      author: operatorName,
      content: values.content,
      attachments,
    });
    setDetail(updated as Customer);
    message.success("跟进记录已添加");
    setFollowupModal(false);
    followupForm.resetFields();
    refresh();
  }

  function openNotificationModal() {
    notificationForm.resetFields();
    setNotificationModal(true);
  }

  async function sendNotification() {
    if (!activeCustomer) return;
    const values = await notificationForm.validateFields();
    confirmSubmit(
      "确认发送该客户通知？发布后将同步到该客户所有联系人的客户门户消息盒子，并在邮箱配置启用时发送邮件。",
      async () => {
        const result = await kpmApi.sendCustomerNotification(
          activeCustomer.id,
          values,
        );
        message.success(
          `通知已发送：系统消息 ${result.portalMessageCount || 0} 条，邮件尝试 ${result.emailAttemptCount || 0} 封`,
        );
        setNotificationModal(false);
        notificationForm.resetFields();
      },
    );
  }

  async function addMaterial() {
    if (!activeCustomer) return;
    const values = await materialForm.validateFields();
    const files = normalizeUploadFiles(values.files);
    if (!files.length) {
      message.warning("请选择要上传的客户资料");
      return;
    }
    const materials = await uploadBusinessFiles(
      files,
      "customer-materials",
      activeCustomer.id,
      operatorName,
    );
    const updatedRows = await Promise.all(
      materials.map((material) =>
        kpmApi.addCustomerMaterial(activeCustomer.id, material),
      ),
    );
    const latest = updatedRows.at(-1);
    if (latest) setDetail(latest as Customer);
    message.success("客户资料已上传");
    setMaterialModal(false);
    materialForm.resetFields();
    refresh();
  }

  return (
    <PageScaffold
      title="客户管理"
      subtitle="维护客户信息、联系人、资料、跟进记录与项目关系。"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新增客户
        </Button>
      }
    >
      <DataState loading={isLoading || customerPageQuery.isLoading} error={error || customerPageQuery.error}>
        <Card className="kpm-card kpm-filter-card">
          <Input.Search
            allowClear
            placeholder="搜索客户 / 地区 / 地址"
            onSearch={(nextKeyword) => { setPagination((prev) => ({ ...prev, current: 1 })); setKeyword(nextKeyword); }}
            onChange={(e) => { setPagination((prev) => ({ ...prev, current: 1 })); setKeyword(e.target.value); }}
            style={{ maxWidth: 360 }}
          />
        </Card>
        <Card className="kpm-card">
          <Table<Customer>
            size="small"
            rowKey="id"
            dataSource={customers}
            pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: customerPageQuery.data?.total || 0, showSizeChanger: true, onChange: (current, pageSize) => setPagination({ current, pageSize }) }}
            columns={[
              {
                title: "客户名称",
                dataIndex: "name",
                ellipsis: true,
                render: (name, row) => (
                  <button
                    className="link-button truncate"
                    type="button"
                    onClick={() => openDetail(row)}
                  >
                    {name}
                  </button>
                ),
              },
              {
                title: "简称",
                dataIndex: "shortName",
                width: 120,
                ellipsis: true,
              },
              {
                title: "地区",
                dataIndex: "region",
                width: 160,
                ellipsis: true,
              },
              {
                title: "等级",
                dataIndex: "level",
                width: 110,
                render: (value) => <StatusTag value={value} />,
              },
              {
                title: "状态",
                dataIndex: "status",
                width: 110,
                render: (value) => <StatusTag value={value} />,
              },
              {
                title: "销售",
                dataIndex: "salesOwners",
                width: 160,
                render: (names?: string[]) => (
                  <Space wrap>
                    {(names || []).slice(0, 2).map((name) => (
                      <Tag key={name}>{name}</Tag>
                    ))}
                  </Space>
                ),
              },
              {
                title: "技术支持",
                dataIndex: "supportOwners",
                width: 180,
                render: (names?: string[]) => (
                  <Space wrap>
                    {(names || []).slice(0, 2).map((name) => (
                      <Tag key={name}>{name}</Tag>
                    ))}
                  </Space>
                ),
              },
              {
                title: "操作",
                width: 112,
                fixed: "right",
                render: (_, row) => (
                  <ActionButtons
                    onView={() => setDetail(row)}
                    onEdit={() => openEdit(row)}
                    onDelete={() =>
                      kpmApi.deleteCustomer(row.id).then(() => {
                        message.success("客户已删除");
                        refreshCustomerPage();
                      })
                    }
                  />
                ),
              },
            ]}
          />
        </Card>
        <Modal
          title={editing ? "编辑客户" : "新增客户"}
          open={modalOpen}
          maskClosable
          onCancel={() => setModalOpen(false)}
          onOk={submitCustomer}
          width={720}
        >
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item
              name="name"
              label="客户名称"
              rules={[
                validationRules.required("请输入客户名称"),
                validationRules.max(160),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="shortName"
              label="客户简称"
              normalize={(value) =>
                String(value || "")
                  .replace(/[^a-zA-Z]/g, "")
                  .toUpperCase()
                  .slice(0, 5)
              }
              rules={[
                validationRules.required("请输入客户简称"),
                validationRules.customerShortName(),
              ]}
              extra="用于任务编号前缀，最多5个英文字母，系统自动转大写。"
            >
              <Input maxLength={5} placeholder="例如 NOVA" />
            </Form.Item>
            <Form.Item
              name="region"
              label="所在地区"
              rules={[
                validationRules.required("请输入所在地区"),
                validationRules.max(120),
              ]}
            >
              <Input placeholder="国家 / 省市 / 区域" />
            </Form.Item>
            <Form.Item
              name="address"
              label="详细地址"
              rules={[validationRules.max(240)]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="level" label="客户等级">
              <EnumSelect
                bootstrap={data?.bootstrap}
                enumType="customer_level"
              />
            </Form.Item>
            <Form.Item name="status" label="客户状态">
              <EnumSelect
                bootstrap={data?.bootstrap}
                enumType="customer_master_status"
              />
            </Form.Item>
            <Form.Item name="salesOwners" label="负责销售">
              <UserSelect bootstrap={data?.bootstrap} mode="multiple" />
            </Form.Item>
            <Form.Item name="supportOwners" label="负责技术支持">
              <UserSelect bootstrap={data?.bootstrap} mode="multiple" />
            </Form.Item>
          </Form>
        </Modal>
        <Drawer
          title={activeCustomer?.name || "客户详情"}
          open={Boolean(detail)}
          onClose={() => setDetail(null)}
          width={760}
          extra={
            activeCustomer ? (
              <Button
                type="primary"
                icon={<NotificationOutlined />}
                onClick={openNotificationModal}
              >
                发送通知
              </Button>
            ) : null
          }
        >
          {activeCustomer ? (
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="地区">
                  {activeCustomer.region || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="等级">
                  <StatusTag value={activeCustomer.level} />
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <StatusTag value={activeCustomer.status} />
                </Descriptions.Item>
                <Descriptions.Item label="地址">
                  {activeCustomer.address || "-"}
                </Descriptions.Item>
              </Descriptions>
              <Card
                title="联系人"
                size="small"
                extra={
                  <Button size="small" onClick={() => setContactModal(true)}>
                    新增联系人
                  </Button>
                }
              >
                {(activeCustomer.contacts || []).length ? (
                  <Space wrap>
                    {(activeCustomer.contacts || [])
                      .slice(0, 3)
                      .map((contact: AnyRecord) => (
                        <Tag
                          key={contact.id || contact.name}
                          onClick={() => setContactDetail(contact)}
                          className="clickable-tag"
                        >
                          {contact.name} ·{" "}
                          {contact.title || contact.phone || "-"}
                        </Tag>
                      ))}
                    {(activeCustomer.contacts || []).length > 3 ? (
                      <Tag>+{(activeCustomer.contacts || []).length - 3}</Tag>
                    ) : null}
                  </Space>
                ) : (
                  <Typography.Text type="secondary">暂无联系人</Typography.Text>
                )}
              </Card>
              <Card title="关联项目" size="small">
                <Table
                  size="small"
                  rowKey={(row: AnyRecord) => row.projectId || row.id}
                  pagination={false}
                  dataSource={activeCustomer.projects || []}
                  columns={[
                    {
                      title: "项目",
                      render: (_, row: AnyRecord) => (
                        <Button
                          type="link"
                          onClick={() =>
                            navigate(`/projects/${row.projectId || row.id}`, {
                              state: { from: "/customers" },
                            })
                          }
                        >
                          {row.externalName || row.projectName || "-"}
                        </Button>
                      ),
                    },
                    {
                      title: "状态",
                      dataIndex: "projectStatus",
                      render: (value) => <StatusTag value={value} />,
                    },
                  ]}
                />
              </Card>
              <Card
                title="客户资料"
                size="small"
                extra={
                  <Button
                    size="small"
                    icon={<UploadOutlined />}
                    onClick={() => setMaterialModal(true)}
                  >
                    上传资料
                  </Button>
                }
              >
                <Table
                  size="small"
                  rowKey={(row: AnyRecord) => row.id}
                  pagination={{ pageSize: 5 }}
                  dataSource={activeCustomer.materials || []}
                  columns={[
                    { title: "文件名", dataIndex: "fileName", ellipsis: true },
                    { title: "上传人", dataIndex: "uploader", width: 120 },
                    {
                      title: "时间",
                      dataIndex: "uploadedAt",
                      width: 160,
                      render: dateTimeText,
                    },
                    {
                      title: "操作",
                      width: 90,
                      render: (_, row: AnyRecord) => (
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
                      ),
                    },
                  ]}
                />
              </Card>
              <Card
                title="跟进记录"
                size="small"
                extra={
                  <Button size="small" onClick={() => setFollowupModal(true)}>
                    新增跟进
                  </Button>
                }
              >
                <Table
                  size="small"
                  rowKey={(row: AnyRecord) => row.id}
                  pagination={{ pageSize: 5 }}
                  dataSource={activeCustomer.followups || []}
                  columns={[
                    { title: "内容", dataIndex: "content", ellipsis: true },
                    { title: "记录人", dataIndex: "author", width: 120 },
                    {
                      title: "附件",
                      dataIndex: "attachments",
                      width: 90,
                      render: (files: AnyRecord[] = []) =>
                        files.length ? (
                          <Tag color="blue">{files.length}</Tag>
                        ) : (
                          "-"
                        ),
                    },
                    {
                      title: "时间",
                      dataIndex: "createdAt",
                      width: 160,
                      render: dateTimeText,
                    },
                  ]}
                />
              </Card>
              <Button
                type="primary"
                onClick={() =>
                  navigate(`/orders?customerId=${activeCustomer.id}`)
                }
              >
                为该客户下单
              </Button>
            </Space>
          ) : null}
        </Drawer>

        <Modal
          title="发送客户通知"
          open={notificationModal}
          maskClosable
          onCancel={() => setNotificationModal(false)}
          onOk={sendNotification}
          okText="发送"
          width={680}
        >
          <Form form={notificationForm} layout="vertical" requiredMark={false}>
            <Form.Item
              name="title"
              label="通知标题"
              rules={[
                validationRules.required("请输入通知标题"),
                validationRules.max(120),
              ]}
            >
              <Input placeholder="例如：重要资料更新通知" />
            </Form.Item>
            <Form.Item
              name="content"
              label="通知内容"
              rules={[
                validationRules.required("请输入通知内容"),
                validationRules.max(3000),
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="请输入要发送给该客户所有联系人的通知内容。"
              />
            </Form.Item>
            <Typography.Text type="secondary">
              系统会写入客户门户消息；如果邮件配置已启用，也会向客户联系人邮箱发送同样内容。
            </Typography.Text>
          </Form>
        </Modal>
        <Modal
          title="联系人详情"
          open={Boolean(contactDetail)}
          onCancel={() => setContactDetail(null)}
          footer={null}
        >
          {contactDetail ? (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="姓名">
                {contactDetail.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="职位">
                {contactDetail.title || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {contactDetail.email || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="电话">
                {contactDetail.phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="备注">
                {contactDetail.remark || "-"}
              </Descriptions.Item>
            </Descriptions>
          ) : null}
        </Modal>
        <Modal
          title="新增联系人"
          open={contactModal}
          maskClosable
          onCancel={() => setContactModal(false)}
          onOk={addContact}
        >
          <Form form={contactForm} layout="vertical">
            <Form.Item
              name="name"
              label="姓名"
              rules={[
                validationRules.required("请输入姓名"),
                validationRules.max(80),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="职位"
              rules={[validationRules.max(80)]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[validationRules.email()]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="电话"
              rules={[validationRules.max(32)]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="remark"
              label="备注"
              rules={[validationRules.max(500)]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="新增跟进记录"
          open={followupModal}
          maskClosable
          onCancel={() => setFollowupModal(false)}
          onOk={addFollowup}
        >
          <Form form={followupForm} layout="vertical">
            <Form.Item
              name="content"
              label="跟进内容"
              rules={[
                validationRules.required("请输入跟进内容"),
                validationRules.max(1000),
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
          title="上传客户资料"
          open={materialModal}
          maskClosable
          onCancel={() => setMaterialModal(false)}
          onOk={addMaterial}
          okText="上传"
        >
          <Form form={materialForm} layout="vertical">
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
      </DataState>
    </PageScaffold>
  );
}
