import { Card, Col, Radio, Row, Select, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { EChart } from '../../components/charts/EChart';
import { CustomerSelect } from '../../components/common/CustomerSelect';
import { DataState } from '../../components/common/DataState';
import { FullscreenView } from '../../components/common/FullscreenView';
import { ProjectSelect } from '../../components/common/ProjectSelect';
import { kpmApi } from '../../services/kpmApi';
import { useKpmData } from '../../hooks/useKpmData';
import type { AnyRecord } from '../../types';
import { moneyText } from '../../utils/format';

type ChartType = 'bar' | 'line' | 'pie';
type Metric = 'convertedAmount' | 'productQuantity' | 'orderCount';

const metricLabels: Record<Metric, string> = {
  convertedAmount: '销售额',
  productQuantity: '产品数量',
  orderCount: '订单数量',
};

export function OrderAnalyticsPage() {
  const { data, isLoading, error } = useKpmData();
  const [currency, setCurrency] = useState('USD');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [metric, setMetric] = useState<Metric>('convertedAmount');
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [customerIds, setCustomerIds] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  const statsQuery = useQuery({
    queryKey: ['kpm', 'analytics', 'orders', currency],
    queryFn: () => kpmApi.orderStats(currency),
    staleTime: 30_000,
  });

  const projectNameById = useMemo(() => new Map((data?.projects || []).map((project) => [project.id, project.externalName])), [data?.projects]);
  const customerNameById = useMemo(() => new Map((data?.customers || []).map((customer) => [customer.id, customer.name])), [data?.customers]);
  const selectedProjectNames = useMemo(() => new Set(projectIds.map((id) => projectNameById.get(id)).filter(Boolean)), [projectIds, projectNameById]);
  const selectedCustomerNames = useMemo(() => new Set(customerIds.map((id) => customerNameById.get(id)).filter(Boolean)), [customerIds, customerNameById]);

  const regionOptions = useMemo(() => [...new Set((data?.customers || []).map((customer) => customer.region).filter(Boolean))].map((region) => ({ label: region!, value: region! })), [data?.customers]);

  const rows = useMemo(() => {
    return (statsQuery.data || []).filter((row: AnyRecord) => {
      const projectOk = !selectedProjectNames.size || selectedProjectNames.has(row.projectName);
      const customerOk = !selectedCustomerNames.size || selectedCustomerNames.has(row.customerName);
      const regionOk = !regions.length || regions.includes(row.region);
      return projectOk && customerOk && regionOk;
    });
  }, [regions, selectedCustomerNames, selectedProjectNames, statsQuery.data]);

  const totals = useMemo(() => rows.reduce((acc, row: AnyRecord) => {
    acc.amount += Number(row.convertedAmount || 0);
    acc.quantity += Number(row.productQuantity || 0);
    acc.count += Number(row.orderCount || 0);
    return acc;
  }, { amount: 0, quantity: 0, count: 0 }), [rows]);

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
    <DataState loading={isLoading || statsQuery.isLoading} error={error || statsQuery.error}>
      <Card className="kpm-card kpm-filter-card">
        <Space wrap>
          <ProjectSelect projects={data?.projects} mode="multiple" placeholder="选择项目，可多选" value={projectIds} onChange={setProjectIds} style={{ minWidth: 260 }} />
          <CustomerSelect customers={data?.customers} mode="multiple" placeholder="选择客户，可多选" value={customerIds} onChange={setCustomerIds} style={{ minWidth: 260 }} />
          <Select mode="multiple" allowClear maxTagCount="responsive" placeholder="选择地区，可多选" value={regions} onChange={setRegions} options={regionOptions} style={{ minWidth: 240 }} />
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
