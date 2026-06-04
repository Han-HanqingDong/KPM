import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Drawer, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ActionButtons } from '../components/common/ActionButtons';
import { CustomerSelect } from '../components/common/CustomerSelect';
import { DataState } from '../components/common/DataState';
import { EnumSelect } from '../components/common/EnumSelect';
import { ProjectSelect } from '../components/common/ProjectSelect';
import { PageScaffold } from '../components/PageScaffold';
import { StatusTag } from '../components/StatusTag';
import { useAuth } from '../context/AuthContext';
import { useKpmData, useRefreshKpmData } from '../hooks/useKpmData';
import { confirmSubmit } from '../hooks/useConfirmingForm';
import { kpmApi } from '../services/kpmApi';
import type { AnyRecord, Order } from '../types';
import { compareDateDesc, dateText, dateValue, includesKeyword, moneyText } from '../utils/format';
import { validationRules } from '../validation';

const currencyOptions = ['USD', 'CNY', 'EUR', 'GBP', 'JPY'].map((value) => ({ label: value, value }));

export function OrdersPage() {
  const { data, isLoading, error } = useKpmData();
  const refresh = useRefreshKpmData();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ keyword: '', status: undefined as string | undefined, orderType: undefined as string | undefined, customerId: searchParams.get('customerId') || undefined, projectId: undefined as string | undefined });
  const [editing, setEditing] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<Order | null>(null);
  const projectId = Form.useWatch('projectId', form);
  const selectedProject = (data?.projects || []).find((project) => project.id === projectId);
  const skuOptions = (selectedProject?.skus || []).map((sku) => ({ label: `${sku.wholeMachinePartNumber} · ${sku.configurationName} · ${sku.memoryType}`, value: sku.id }));

  const orders = useMemo(() => (data?.orders || [])
    .filter((order) => {
      const matchesKeyword = includesKeyword([order.id, order.customerName, order.projectName, order.specification, order.softwareVersion, order.configurationName], filters.keyword);
      return matchesKeyword
        && (!filters.status || order.status === filters.status)
        && (!filters.orderType || (order.orderType || order.type) === filters.orderType)
        && (!filters.customerId || order.customerId === filters.customerId)
        && (!filters.projectId || order.projectId === filters.projectId);
    })
    .sort((left, right) => compareDateDesc(left.orderDate, right.orderDate) || String(right.id || '').localeCompare(String(left.id || ''))), [data?.orders, filters]);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ orderDate: new Date().toISOString().slice(0, 10), customerId: filters.customerId, creator: user?.name || user?.account, currency: 'USD', quantity: 1 });
    setModalOpen(true);
  }

  function openEdit(order: Order) {
    setEditing(order);
    form.setFieldsValue({ ...order, orderType: order.orderType || order.type, modifier: user?.name || user?.account });
    setModalOpen(true);
  }

  async function submitOrder() {
    const values = await form.validateFields();
    const payload = { ...values, creator: values.creator || user?.name || user?.account, modifier: values.modifier || user?.name || user?.account };
    confirmSubmit(editing ? '确认修改订单？' : '确认新增订单？', async () => {
      if (editing) await kpmApi.updateOrder(editing.id, payload);
      else await kpmApi.createOrder(payload);
      message.success(editing ? '订单已更新' : '订单已创建');
      setModalOpen(false);
      form.resetFields();
      refresh();
    });
  }

  return (
    <PageScaffold title="订单管理" subtitle="管理客户订单、SKU 快照、发货状态与修改记录。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增订单</Button>}>
      <DataState loading={isLoading} error={error}>
        <Card className="kpm-card kpm-filter-card">
          <Space wrap>
            <Input.Search allowClear placeholder="搜索订单 / 客户 / 项目 / 规格" onSearch={(keyword) => setFilters((prev) => ({ ...prev, keyword }))} onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))} />
            <EnumSelect bootstrap={data?.bootstrap} enumType="order_type" placeholder="订单类型" value={filters.orderType} onChange={(orderType) => setFilters((prev) => ({ ...prev, orderType }))} style={{ width: 160 }} />
            <EnumSelect bootstrap={data?.bootstrap} enumType="order_status" placeholder="订单状态" value={filters.status} onChange={(status) => setFilters((prev) => ({ ...prev, status }))} style={{ width: 160 }} />
            <CustomerSelect customers={data?.customers} placeholder="客户" value={filters.customerId} onChange={(customerId) => setFilters((prev) => ({ ...prev, customerId }))} style={{ width: 220 }} />
            <ProjectSelect projects={data?.projects} placeholder="项目" value={filters.projectId} onChange={(nextProjectId) => setFilters((prev) => ({ ...prev, projectId: nextProjectId }))} style={{ width: 220 }} />
          </Space>
        </Card>
        <Card className="kpm-card">
          <Table<Order>
            size="small"
            rowKey="id"
            dataSource={orders}
            pagination={{ pageSize: 12, showSizeChanger: true }}
            columns={[
              { title: '下单日期', dataIndex: 'orderDate', width: 118, defaultSortOrder: 'descend', sorter: (left, right) => dateValue(left.orderDate) - dateValue(right.orderDate), render: dateText },
              { title: '客户', dataIndex: 'customerName', width: 150, ellipsis: true },
              { title: '项目', dataIndex: 'projectName', width: 150, ellipsis: true },
              { title: '类型', render: (_, row) => <Tag>{row.orderType || row.type || '-'}</Tag>, width: 110 },
              { title: '状态', dataIndex: 'status', width: 110, render: (value) => <StatusTag value={value} /> },
              { title: 'SKU', width: 180, ellipsis: true, render: (_, row) => row.configurationName || row.wholeMachinePartNumber || '-' },
              { title: '数量', dataIndex: 'quantity', width: 80 },
              { title: '金额', width: 130, render: (_, row) => moneyText(row.amount, row.currency) },
              { title: '期望发货', dataIndex: 'expectedShipDate', width: 120, sorter: (left, right) => dateValue(left.expectedShipDate) - dateValue(right.expectedShipDate), render: dateText },
              { title: '操作', width: 112, fixed: 'right', render: (_, row) => <ActionButtons onView={() => setDetail(row)} onEdit={() => openEdit(row)} onDelete={() => kpmApi.deleteOrder(row.id).then(() => { message.success('订单已删除'); refresh(); })} /> },
            ]}
          />
        </Card>
        <Modal title={editing ? '编辑订单' : '新增订单'} open={modalOpen} maskClosable onCancel={() => setModalOpen(false)} onOk={submitOrder} width={820}>
          <Form form={form} layout="vertical" requiredMark={false}>
            <Space.Compact block>
              <Form.Item name="orderDate" label="下单日期" rules={[validationRules.required('请选择下单日期')]} style={{ width: '50%' }}><Input type="date" /></Form.Item>
              <Form.Item name="expectedShipDate" label="期望发货日期" rules={[validationRules.required('请选择期望发货日期')]} style={{ width: '50%' }}><Input type="date" /></Form.Item>
            </Space.Compact>
            <Space.Compact block>
              <Form.Item name="customerId" label="客户" rules={[validationRules.required('请选择客户')]} style={{ width: '50%' }}><CustomerSelect customers={data?.customers} /></Form.Item>
              <Form.Item name="projectId" label="项目" rules={[validationRules.required('请选择项目')]} style={{ width: '50%' }}><ProjectSelect projects={data?.projects} onChange={() => form.setFieldValue('skuId', undefined)} /></Form.Item>
            </Space.Compact>
            <Form.Item name="skuId" label="SKU" rules={[validationRules.required('请选择 SKU')]}><Select showSearch optionFilterProp="label" options={skuOptions} placeholder="请先选择项目" /></Form.Item>
            <Space.Compact block>
              <Form.Item name="orderType" label="订单类型" rules={[validationRules.required('请选择订单类型')]} style={{ width: '34%' }}><EnumSelect bootstrap={data?.bootstrap} enumType="order_type" /></Form.Item>
              <Form.Item name="status" label="订单状态" style={{ width: '33%' }}><EnumSelect bootstrap={data?.bootstrap} enumType="order_status" /></Form.Item>
              <Form.Item name="softwareVersion" label="软件版本号" style={{ width: '33%' }}><Input /></Form.Item>
            </Space.Compact>
            <Space.Compact block>
              <Form.Item name="quantity" label="数量" rules={[validationRules.required('请输入数量')]} style={{ width: '33%' }}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
              <Form.Item name="currency" label="币种" rules={[validationRules.required('请选择币种')]} style={{ width: '33%' }}><Select options={currencyOptions} /></Form.Item>
              <Form.Item name="unitPrice" label="单价" rules={[validationRules.required('请输入单价')]} style={{ width: '34%' }}><InputNumber min={0} precision={2} style={{ width: '100%' }} /></Form.Item>
            </Space.Compact>
            <Form.Item name="specification" label="具体规格" rules={[validationRules.required('请输入具体规格'), validationRules.max(1000)]}><Input.TextArea rows={3} /></Form.Item>
            <Form.Item name="creator" label="创建人" rules={[validationRules.required('请输入创建人')]}><Input disabled /></Form.Item>
            {editing ? <><Form.Item name="modifier" label="修改人"><Input disabled /></Form.Item><Form.Item name="changeReason" label="修改原因" rules={[validationRules.required('请输入修改原因')]}><Input.TextArea rows={2} /></Form.Item></> : null}
          </Form>
        </Modal>
        <Drawer title="订单详情" open={Boolean(detail)} onClose={() => setDetail(null)} width={760}>
          {detail ? <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="客户">{detail.customerName}</Descriptions.Item>
              <Descriptions.Item label="项目">{detail.projectName}</Descriptions.Item>
              <Descriptions.Item label="类型">{detail.orderType || detail.type}</Descriptions.Item>
              <Descriptions.Item label="状态"><StatusTag value={detail.status} /></Descriptions.Item>
              <Descriptions.Item label="整机料号">{detail.wholeMachinePartNumber || '-'}</Descriptions.Item>
              <Descriptions.Item label="配置名称">{detail.configurationName || '-'}</Descriptions.Item>
              <Descriptions.Item label="内存类型">{detail.memoryType || '-'}</Descriptions.Item>
              <Descriptions.Item label="数量">{detail.quantity}</Descriptions.Item>
              <Descriptions.Item label="金额">{moneyText(detail.amount, detail.currency)}</Descriptions.Item>
              <Descriptions.Item label="软件版本">{detail.softwareVersion || '-'}</Descriptions.Item>
              <Descriptions.Item label="期望发货">{dateText(detail.expectedShipDate)}</Descriptions.Item>
              <Descriptions.Item label="实际发货">{dateText(detail.actualShipDate)}</Descriptions.Item>
            </Descriptions>
            <Card size="small" title="规格说明"><Typography.Paragraph>{detail.specification || '-'}</Typography.Paragraph></Card>
            <Card size="small" title="修改记录">
              <Table size="small" rowKey={(row: AnyRecord) => row.id} pagination={false} dataSource={detail.histories || []} columns={[
                { title: '修改人', dataIndex: 'modifier' },
                { title: '修改时间', dataIndex: 'modifiedAt' },
                { title: '修改内容', dataIndex: 'changeSummary', ellipsis: true },
                { title: '原因', dataIndex: 'changeReason', ellipsis: true },
              ]} />
            </Card>
          </Space> : null}
        </Drawer>
      </DataState>
    </PageScaffold>
  );
}
