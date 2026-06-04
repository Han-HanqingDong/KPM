import { Card, Col, Input, Radio, Row, Select, Space } from 'antd';
import { useMemo, useState } from 'react';
import { EChart } from '../../components/charts/EChart';
import { CustomerSelect } from '../../components/common/CustomerSelect';
import { DataState } from '../../components/common/DataState';
import { FullscreenView } from '../../components/common/FullscreenView';
import { ProjectSelect } from '../../components/common/ProjectSelect';
import { useKpmData } from '../../hooks/useKpmData';
import type { AnyRecord, Order } from '../../types';
import { moneyText } from '../../utils/format';

type ChartType = 'bar' | 'line' | 'pie';
type Metric = 'convertedAmount' | 'productQuantity' | 'orderCount';
type DateGranularity = 'year' | 'month' | 'day';

const metricLabels: Record<Metric, string> = {
  convertedAmount: '销售额',
  productQuantity: '产品数量',
  orderCount: '订单数量',
};

const dateGranularityOptions = [
  { label: '按年', value: 'year' },
  { label: '按月', value: 'month' },
  { label: '按日', value: 'day' },
];

const currencyToUsd: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  CNY: 0.14,
};

function normalizeDate(value?: string | null): string {
  return value ? String(value).slice(0, 10) : '';
}

function periodKey(date: string, granularity: DateGranularity): string {
  if (!date) return '未知日期';
  if (granularity === 'year') return date.slice(0, 4);
  if (granularity === 'month') return date.slice(0, 7);
  return date.slice(0, 10);
}

function periodMatches(date: string, granularity: DateGranularity, query: string): boolean {
  if (!query) return true;
  return periodKey(date, granularity) === query;
}

function convertAmount(amount: unknown, sourceCurrency: unknown, targetCurrency: string): number {
  const numeric = Number(amount || 0);
  const source = String(sourceCurrency || 'USD').toUpperCase();
  const usd = numeric * (currencyToUsd[source] ?? 1);
  return targetCurrency === 'CNY' ? usd * 7.2 : usd;
}

function aggregateOrders(orders: Order[], granularity: DateGranularity, targetCurrency: string): AnyRecord[] {
  const map = new Map<string, AnyRecord>();
  orders.forEach((order) => {
    const period = periodKey(normalizeDate(order.orderDate), granularity);
    const projectName = order.projectName || '未知项目';
    const key = `${period}::${projectName}`;
    const current = map.get(key) || { period, projectName, convertedAmount: 0, productQuantity: 0, orderCount: 0 };
    current.convertedAmount += convertAmount(order.amount, order.currency, targetCurrency);
    current.productQuantity += Number(order.quantity || 0);
    current.orderCount += 1;
    map.set(key, current);
  });
  return [...map.values()].sort((left, right) => String(left.period).localeCompare(String(right.period)) || String(left.projectName).localeCompare(String(right.projectName)));
}

export function OrderAnalyticsPage() {
  const { data, isLoading, error } = useKpmData();
  const [currency, setCurrency] = useState('USD');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [metric, setMetric] = useState<Metric>('convertedAmount');
  const [dateGranularity, setDateGranularity] = useState<DateGranularity>('month');
  const [dateQuery, setDateQuery] = useState('');
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [customerIds, setCustomerIds] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  const customerRegionById = useMemo(() => new Map((data?.customers || []).map((customer) => [customer.id, customer.region || ''])), [data?.customers]);
  const regionOptions = useMemo(() => [...new Set((data?.customers || []).map((customer) => customer.region).filter(Boolean))].map((region) => ({ label: region!, value: region! })), [data?.customers]);

  const filteredOrders = useMemo(() => {
    return (data?.orders || []).filter((order) => {
      const orderDate = normalizeDate(order.orderDate);
      const region = customerRegionById.get(order.customerId || '') || '';
      return (!projectIds.length || projectIds.includes(order.projectId || ''))
        && (!customerIds.length || customerIds.includes(order.customerId || ''))
        && (!regions.length || regions.includes(region))
        && periodMatches(orderDate, dateGranularity, dateQuery);
    });
  }, [customerIds, customerRegionById, data?.orders, dateGranularity, dateQuery, projectIds, regions]);

  const rows = useMemo(() => aggregateOrders(filteredOrders, dateGranularity, currency), [currency, dateGranularity, filteredOrders]);

  const totals = useMemo(() => filteredOrders.reduce((acc, order) => {
    acc.amount += convertAmount(order.amount, order.currency, currency);
    acc.quantity += Number(order.quantity || 0);
    acc.count += 1;
    return acc;
  }, { amount: 0, quantity: 0, count: 0 }), [currency, filteredOrders]);

  const chartOption = useMemo(() => {
    const months = [...new Set(rows.map((row: AnyRecord) => row.period))].sort();
    if (chartType === 'pie') {
      const projectTotals = new Map<string, number>();
      rows.forEach((row: AnyRecord) => {
        const key = row.projectName || '未知项目';
        projectTotals.set(key, (projectTotals.get(key) || 0) + Number(row[metric] || 0));
      });
      return {
        tooltip: { trigger: 'item' },
        legend: { type: 'scroll', bottom: 0 },
        series: [{ type: 'pie', radius: ['42%', '68%'], center: ['50%', '45%'], data: [...projectTotals.entries()].map(([name, value]) => ({ name, value })) }],
      };
    }

    const projects = [...new Set(rows.map((row: AnyRecord) => row.projectName || '未知项目'))].sort();
    const series = projects.map((project) => ({
      name: project,
      type: chartType,
      smooth: chartType === 'line',
      emphasis: { focus: 'series' },
      data: months.map((month) => rows
        .filter((row: AnyRecord) => row.period === month && (row.projectName || '未知项目') === project)
        .reduce((sum: number, row: AnyRecord) => sum + Number(row[metric] || 0), 0)),
    }));
    return {
      color: ['#fff200', '#1fd7c7', '#507fff', '#b7ff38', '#ff8f5a', '#9d7cff'],
      tooltip: { trigger: 'axis' },
      legend: { type: 'scroll', top: 0 },
      grid: { left: 44, right: 24, top: 56, bottom: 44 },
      xAxis: { type: 'category', data: months },
      yAxis: { type: 'value', name: metricLabels[metric] },
      series,
    };
  }, [chartType, metric, rows]);

  return (
    <DataState loading={isLoading} error={error}>
      <Card className="kpm-card kpm-filter-card">
        <Space wrap>
          <Radio.Group value={dateGranularity} onChange={(event) => { setDateGranularity(event.target.value); setDateQuery(''); }} optionType="button" options={dateGranularityOptions} />
          <Input
            allowClear
            type={dateGranularity === 'day' ? 'date' : dateGranularity === 'month' ? 'month' : 'number'}
            min={dateGranularity === 'year' ? 2000 : undefined}
            max={dateGranularity === 'year' ? 2100 : undefined}
            placeholder={dateGranularity === 'year' ? '输入年份，如 2026' : dateGranularity === 'month' ? '选择月份' : '选择日期'}
            value={dateQuery}
            onChange={(event) => setDateQuery(event.target.value)}
            style={{ width: 190 }}
          />
          <ProjectSelect projects={data?.projects} mode="multiple" placeholder="选择项目，可多选" value={projectIds} onChange={setProjectIds} style={{ minWidth: 240 }} />
          <CustomerSelect customers={data?.customers} mode="multiple" placeholder="选择客户，可多选" value={customerIds} onChange={setCustomerIds} style={{ minWidth: 240 }} />
          <Select mode="multiple" allowClear maxTagCount="responsive" placeholder="选择地区，可多选" value={regions} onChange={setRegions} options={regionOptions} style={{ minWidth: 220 }} />
          <Select value={currency} onChange={setCurrency} options={[{ label: '美元 USD', value: 'USD' }, { label: '人民币 CNY', value: 'CNY' }]} style={{ width: 150 }} />
          <Radio.Group value={metric} onChange={(event) => setMetric(event.target.value)} optionType="button" options={[{ label: '销售额', value: 'convertedAmount' }, { label: '订单数', value: 'orderCount' }, { label: '产品数', value: 'productQuantity' }]} />
          <Radio.Group value={chartType} onChange={(event) => setChartType(event.target.value)} optionType="button" buttonStyle="solid" options={[{ label: '柱状图', value: 'bar' }, { label: '折线图', value: 'line' }, { label: '饼图', value: 'pie' }]} />
        </Space>
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}><Card className="kpm-metric"><span>订单数量</span><strong>{totals.count}</strong></Card></Col>
        <Col xs={24} md={8}><Card className="kpm-metric"><span>产品数量</span><strong>{totals.quantity}</strong></Card></Col>
        <Col xs={24} md={8}><Card className="kpm-metric"><span>销售额（已换算）</span><strong>{moneyText(totals.amount, currency)}</strong></Card></Col>
      </Row>
      <Card
        className="kpm-card kpm-section-row"
        title="订单趋势与对比"
        extra={<FullscreenView title="订单趋势与对比 - 全屏" fullscreenChildren={<EChart option={chartOption} height="calc(100vh - 170px)" />} />}
      >
        <EChart option={chartOption} height={430} />
      </Card>
    </DataState>
  );
}
