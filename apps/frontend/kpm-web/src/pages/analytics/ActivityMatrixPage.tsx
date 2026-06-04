import { Button, Card, Descriptions, Modal, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerSelect } from '../../components/common/CustomerSelect';
import { DataState } from '../../components/common/DataState';
import { FullscreenView } from '../../components/common/FullscreenView';
import { ProjectSelect } from '../../components/common/ProjectSelect';
import { useKpmData } from '../../hooks/useKpmData';
import type { Customer, Order, Project, Task } from '../../types';
import { dateText, isClosedTaskStatus, moneyText } from '../../utils/format';

type ActivityState = 'active' | 'inactive' | 'abnormal' | 'abandoned' | 'empty';

type ActivityCell = {
  customer: Customer;
  project: Project;
  state: ActivityState;
  stateLabel: string;
  latestAt?: string;
  latestDays?: number;
  orders: Order[];
  tasks: Task[];
  orderCount: number;
  quantity: number;
  amountText: string;
  openTaskCount: number;
  blockedTaskCount: number;
};

const activityStateOptions = [
  { label: '活跃（30天内有订单或任务）', value: 'active' },
  { label: '不活跃（31-90天）', value: 'inactive' },
  { label: '异常（91-365天）', value: 'abnormal' },
  { label: '已放弃（超过365天）', value: 'abandoned' },
  { label: '无记录', value: 'empty' },
];

const stateMeta: Record<ActivityState, { label: string; color: string }> = {
  active: { label: '活跃', color: 'green' },
  inactive: { label: '不活跃', color: 'gold' },
  abnormal: { label: '异常', color: 'volcano' },
  abandoned: { label: '已放弃', color: 'red' },
  empty: { label: '无记录', color: 'default' },
};

function parseTime(value?: string | null): number | undefined {
  if (!value) return undefined;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? undefined : timestamp;
}

function latestTimestamp(values: Array<string | undefined | null>): number | undefined {
  const timestamps = values.map(parseTime).filter((item): item is number => typeof item === 'number');
  return timestamps.length ? Math.max(...timestamps) : undefined;
}

function daysFromNow(timestamp: number): number {
  return Math.floor((Date.now() - timestamp) / 86_400_000);
}

function resolveState(days?: number): ActivityState {
  if (days === undefined) return 'empty';
  if (days <= 30) return 'active';
  if (days <= 90) return 'inactive';
  if (days <= 365) return 'abnormal';
  return 'abandoned';
}

function summarizeAmount(orders: Order[]): string {
  const amountByCurrency = new Map<string, number>();
  orders.forEach((order) => {
    const currency = order.currency || 'USD';
    amountByCurrency.set(currency, (amountByCurrency.get(currency) || 0) + Number(order.amount || 0));
  });
  return [...amountByCurrency.entries()].map(([currency, amount]) => moneyText(amount, currency)).join(' / ') || '-';
}

function buildCell(customer: Customer, project: Project, orders: Order[], tasks: Task[]): ActivityCell {
  const pairOrders = orders.filter((order) => order.customerId === customer.id && order.projectId === project.id);
  const pairTasks = tasks.filter((task) => task.customerId === customer.id && task.projectId === project.id);
  const orderLatest = latestTimestamp(pairOrders.flatMap((order) => [order.orderDate, order.actualShipDate, order.plannedShipDate, order.expectedShipDate]));
  const taskLatest = latestTimestamp(pairTasks.flatMap((task) => [task.updatedAt, task.createdAt, task.expectedCompletionAt, task.dueDate]));
  const latest = [orderLatest, taskLatest].filter((item): item is number => typeof item === 'number').sort((a, b) => b - a)[0];
  const latestDays = latest === undefined ? undefined : daysFromNow(latest);
  const state = resolveState(latestDays);
  return {
    customer,
    project,
    state,
    stateLabel: stateMeta[state].label,
    latestAt: latest ? new Date(latest).toISOString() : undefined,
    latestDays,
    orders: pairOrders,
    tasks: pairTasks,
    orderCount: pairOrders.length,
    quantity: pairOrders.reduce((sum, order) => sum + Number(order.quantity || 0), 0),
    amountText: summarizeAmount(pairOrders),
    openTaskCount: pairTasks.filter((task) => !isClosedTaskStatus(task.status)).length,
    blockedTaskCount: pairTasks.filter((task) => Boolean(task.blocked)).length,
  };
}

export function ActivityMatrixPage() {
  const { data, isLoading, error } = useKpmData();
  const navigate = useNavigate();
  const [customerIds, setCustomerIds] = useState<string[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [states, setStates] = useState<ActivityState[]>([]);
  const [selectedCell, setSelectedCell] = useState<ActivityCell | null>(null);

  const customers = useMemo(
    () => (data?.customers || []).filter((customer) => !customerIds.length || customerIds.includes(customer.id)),
    [customerIds, data?.customers],
  );
  const projects = useMemo(
    () => (data?.projects || []).filter((project) => !projectIds.length || projectIds.includes(project.id)),
    [data?.projects, projectIds],
  );

  const cellByKey = useMemo(() => {
    const map = new Map<string, ActivityCell>();
    customers.forEach((customer) => {
      projects.forEach((project) => {
        const cell = buildCell(customer, project, data?.orders || [], data?.tasks || []);
        map.set(`${customer.id}:${project.id}`, cell);
      });
    });
    return map;
  }, [customers, data?.orders, data?.tasks, projects]);

  const visibleCustomers = useMemo(() => customers.filter((customer) => {
    if (!states.length) return true;
    return projects.some((project) => states.includes(cellByKey.get(`${customer.id}:${project.id}`)?.state || 'empty'));
  }), [cellByKey, customers, projects, states]);

  function openOrders(cell: ActivityCell) {
    setSelectedCell(null);
    navigate(`/orders?customerId=${encodeURIComponent(cell.customer.id)}&projectId=${encodeURIComponent(cell.project.id)}`);
  }

  function openTasks(cell: ActivityCell) {
    setSelectedCell(null);
    navigate(`/tasks?customerId=${encodeURIComponent(cell.customer.id)}&projectId=${encodeURIComponent(cell.project.id)}`);
  }

  const columns = useMemo<ColumnsType<Customer>>(() => {
    const projectColumns: ColumnsType<Customer> = projects.map((project) => ({
      title: project.externalName,
      dataIndex: project.id,
      width: 190,
      ellipsis: true,
      render: (_, customer) => {
        const cell = cellByKey.get(`${customer.id}:${project.id}`);
        if (!cell || (states.length && !states.includes(cell.state))) {
          return <span className="activity-cell activity-cell-muted">-</span>;
        }
        return (
          <button type="button" className={`activity-cell activity-cell-${cell.state}`} onClick={() => setSelectedCell(cell)}>
            <strong>{cell.stateLabel}</strong>
            <span>{cell.latestDays === undefined ? '暂无订单/任务' : `${cell.latestDays} 天前`}</span>
            <small>{cell.orderCount}单 · {cell.openTaskCount}任务</small>
          </button>
        );
      },
    }));
    return [
      {
        title: '客户',
        dataIndex: 'name',
        width: 220,
        fixed: 'left',
        render: (name, customer) => (
          <Space direction="vertical" size={0}>
            <Typography.Text strong>{customer.shortName || name}</Typography.Text>
            <Typography.Text type="secondary" className="small-text">{name}</Typography.Text>
          </Space>
        ),
      },
      ...projectColumns,
    ];
  }, [cellByKey, projects, states]);

  const matrixScrollX = Math.max(760, 220 + projects.length * 190);
  const renderMatrixTable = (fullscreen = false) => (
    <>
      <Typography.Text type="secondary" className="activity-matrix-hint">提示：横向滚动可查看右侧更多项目列。</Typography.Text>
      <Table<Customer>
        className={`activity-matrix-table ${fullscreen ? 'activity-matrix-table-fullscreen' : ''}`}
        size="small"
        rowKey="id"
        sticky
        scroll={{ x: matrixScrollX, y: fullscreen ? 'calc(100vh - 245px)' : 620 }}
        pagination={{ pageSize: fullscreen ? 20 : 10, showSizeChanger: true }}
        dataSource={visibleCustomers}
        columns={columns}
      />
    </>
  );

  return (
    <DataState loading={isLoading} error={error}>
      <Card className="kpm-card kpm-filter-card">
        <Space wrap>
          <CustomerSelect customers={data?.customers} mode="multiple" placeholder="选择客户，可多选，支持搜索" value={customerIds} onChange={setCustomerIds} style={{ minWidth: 280 }} />
          <ProjectSelect projects={data?.projects} mode="multiple" placeholder="选择项目，可多选，支持搜索" value={projectIds} onChange={setProjectIds} style={{ minWidth: 280 }} />
          <Select mode="multiple" allowClear placeholder="筛选活跃度状态" value={states} onChange={setStates} options={activityStateOptions} style={{ minWidth: 280 }} />
        </Space>
      </Card>
      <Card
        className="kpm-card"
        title="客户 × 项目活跃度矩阵"
        extra={<Space wrap>
          <FullscreenView title="客户 × 项目活跃度矩阵 - 全屏" fullscreenChildren={renderMatrixTable(true)} />
          <Tag color="green">≤30天 活跃</Tag><Tag color="gold">31-90天 不活跃</Tag><Tag color="volcano">91-365天 异常</Tag><Tag color="red">&gt;365天 已放弃</Tag>
        </Space>}
      >
        {renderMatrixTable(false)}
      </Card>
      <Modal
        title="客户 × 项目活跃度明细"
        open={Boolean(selectedCell)}
        onCancel={() => setSelectedCell(null)}
        footer={null}
        width={760}
        zIndex={2600}
        rootClassName="kpm-activity-detail-modal"
      >
        {selectedCell ? <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="客户">{selectedCell.customer.name}</Descriptions.Item>
            <Descriptions.Item label="项目">{selectedCell.project.externalName}</Descriptions.Item>
            <Descriptions.Item label="活跃度"><Tag color={stateMeta[selectedCell.state].color}>{selectedCell.stateLabel}</Tag></Descriptions.Item>
            <Descriptions.Item label="最近动作">{selectedCell.latestAt ? `${dateText(selectedCell.latestAt)}（${selectedCell.latestDays} 天前）` : '暂无订单或任务'}</Descriptions.Item>
            <Descriptions.Item label="订单数量">
              <Button type="link" size="small" disabled={!selectedCell.orderCount} onClick={() => openOrders(selectedCell)}>
                {selectedCell.orderCount} 单，点击查看订单
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="产品数量">{selectedCell.quantity}</Descriptions.Item>
            <Descriptions.Item label="销售金额">{selectedCell.amountText}</Descriptions.Item>
            <Descriptions.Item label="任务情况">
              <Button type="link" size="small" disabled={!selectedCell.tasks.length} onClick={() => openTasks(selectedCell)}>
                进行中 {selectedCell.openTaskCount} / 卡点 {selectedCell.blockedTaskCount} / 总数 {selectedCell.tasks.length}，点击查看任务
              </Button>
            </Descriptions.Item>
          </Descriptions>
          <Typography.Paragraph type="secondary" className="small-text">
            为避免订单或任务过多导致弹窗内容过长，明细列表已移动到订单管理和任务管理页面；点击上方数量即可带着客户和项目筛选条件跳转。
          </Typography.Paragraph>
        </Space> : null}
      </Modal>
    </DataState>
  );
}
