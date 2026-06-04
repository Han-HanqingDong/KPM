import { Tag } from 'antd';

export function StatusTag({ value }: { value?: string | boolean | null }) {
  const text = typeof value === 'boolean' ? (value ? '启用' : '停用') : (value || '-');
  const color = ['已完成', '启用', '已发货', '已收货'].includes(text) ? 'green'
    : ['进行中', '生产中', '订单冲刺'].includes(text) ? 'blue'
      : ['已归档', '已作废', '停用'].includes(text) ? 'red'
        : 'gold';
  return <Tag color={color}>{text}</Tag>;
}
