import { Card, Col, Input, Row, Space, Table, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { EChart } from '../../components/charts/EChart';
import { CustomerSelect } from '../../components/common/CustomerSelect';
import { DataState } from '../../components/common/DataState';
import { FullscreenView } from '../../components/common/FullscreenView';
import { kpmApi } from '../../services/kpmApi';
import { useKpmData } from '../../hooks/useKpmData';
import type { AnyRecord } from '../../types';
import { includesKeyword } from '../../utils/format';

export function SupportAnalyticsPage() {
  const { data, isLoading, error } = useKpmData();
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [detailKeyword, setDetailKeyword] = useState('');
  const supportQuery = useQuery({
    queryKey: ['kpm', 'analytics', 'support', customerId || 'all'],
    queryFn: () => kpmApi.supportStats(customerId),
    staleTime: 30_000,
  });

  const rows = supportQuery.data || [];
  const detailRows = useMemo(
    () => rows.filter((row: AnyRecord) => includesKeyword([row.customerName, row.supportOwner, row.region], detailKeyword)),
    [detailKeyword, rows],
  );
  const totals = useMemo(() => rows.reduce((acc, row: AnyRecord) => {
    acc.requirements += Number(row.openRequirementCount || 0);
    acc.bugs += Number(row.openBugCount || 0);
    acc.others += Number(row.openOtherCount || 0);
    acc.blocked += Number(row.blockedCount || 0);
    return acc;
  }, { requirements: 0, bugs: 0, others: 0, blocked: 0 }), [rows]);

  const chartOption = useMemo(() => {
    const owners = [...new Set(rows.map((row: AnyRecord) => row.supportOwner || '未分配'))];
    const sumByOwner = (owner: string, key: string) => rows
      .filter((row: AnyRecord) => (row.supportOwner || '未分配') === owner)
      .reduce((sum: number, row: AnyRecord) => sum + Number(row[key] || 0), 0);
    return {
      color: ['#1fd7c7', '#ff6f61', '#507fff', '#fff200'],
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { top: 0 },
      grid: { left: 42, right: 24, top: 56, bottom: 64 },
      xAxis: { type: 'category', data: owners, axisLabel: { rotate: owners.length > 8 ? 35 : 0 } },
      yAxis: { type: 'value', name: '任务数' },
      series: [
        { name: '需求', type: 'bar', stack: 'tasks', data: owners.map((owner) => sumByOwner(owner, 'openRequirementCount')) },
        { name: 'Bug', type: 'bar', stack: 'tasks', data: owners.map((owner) => sumByOwner(owner, 'openBugCount')) },
        { name: '其他', type: 'bar', stack: 'tasks', data: owners.map((owner) => sumByOwner(owner, 'openOtherCount')) },
        { name: '卡点', type: 'bar', data: owners.map((owner) => sumByOwner(owner, 'blockedCount')) },
      ],
    };
  }, [rows]);

  return (
    <DataState loading={isLoading || supportQuery.isLoading} error={error || supportQuery.error}>
      <Card className="kpm-card kpm-filter-card">
        <Space wrap>
          <CustomerSelect customers={data?.customers} placeholder="选择客户，支持搜索" value={customerId} onChange={setCustomerId} style={{ width: 320 }} />
        </Space>
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}><Card className="kpm-metric"><span>进行中需求</span><strong>{totals.requirements}</strong></Card></Col>
        <Col xs={12} md={6}><Card className="kpm-metric"><span>进行中 Bug</span><strong>{totals.bugs}</strong></Card></Col>
        <Col xs={12} md={6}><Card className="kpm-metric"><span>其他任务</span><strong>{totals.others}</strong></Card></Col>
        <Col xs={12} md={6}><Card className="kpm-metric"><span>卡点任务</span><strong>{totals.blocked}</strong></Card></Col>
      </Row>
      <Row gutter={[16, 16]} className="kpm-section-row">
        <Col xs={24} xl={14}>
          <Card
            className="kpm-card"
            title="技术支持负载图"
            extra={<FullscreenView title="技术支持负载图 - 全屏" fullscreenChildren={<EChart option={chartOption} height="calc(100vh - 170px)" />} />}
          >
            <EChart option={chartOption} height={420} />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card
            className="kpm-card"
            title="客户支持明细"
            extra={<Input.Search allowClear placeholder="搜索客户 / 技术支持" onSearch={setDetailKeyword} onChange={(event) => setDetailKeyword(event.target.value)} style={{ width: 240 }} />}
          >
            <Table size="small" rowKey={(row: AnyRecord, index) => `${row.customerId}-${row.supportOwner}-${index}`} pagination={{ pageSize: 8 }} dataSource={detailRows} columns={[
              { title: '客户', dataIndex: 'customerName', ellipsis: true },
              { title: '技术支持', dataIndex: 'supportOwner', ellipsis: true },
              { title: '需求', dataIndex: 'openRequirementCount', render: (value) => <Tag color="cyan">{value || 0}</Tag> },
              { title: 'Bug', dataIndex: 'openBugCount', render: (value) => <Tag color="red">{value || 0}</Tag> },
              { title: '其他', dataIndex: 'openOtherCount', render: (value) => <Tag color="blue">{value || 0}</Tag> },
              { title: '卡点', dataIndex: 'blockedCount', render: (value) => <Tag color="orange">{value || 0}</Tag> },
            ]} />
          </Card>
        </Col>
      </Row>
    </DataState>
  );
}
