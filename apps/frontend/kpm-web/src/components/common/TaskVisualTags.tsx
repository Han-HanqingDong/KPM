import { Tag, Tooltip } from 'antd';

type TagProps = {
  value?: string | null;
  label?: string | null;
  shortLabel?: string | null;
};

function firstDisplayChar(value?: string | null, preferred?: string | null) {
  const configured = String(preferred || '').trim();
  if (configured) return configured;
  const text = String(value || '').trim();
  if (!text) return '-';
  const first = Array.from(text)[0] || '-';
  return /^[a-z]$/i.test(first) ? first.toUpperCase() : first;
}

function stableColor(value?: string | null) {
  const colors = ['blue', 'cyan', 'geekblue', 'purple', 'volcano', 'magenta', 'lime', 'gold'];
  const text = String(value || 'neutral');
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  return colors[hash % colors.length];
}

function priorityColor(value?: string | null) {
  const text = String(value || '').toLowerCase();
  if (text.includes('高') || text.includes('high') || text.includes('urgent')) return 'red';
  if (text.includes('中') || text.includes('medium')) return 'gold';
  if (text.includes('低') || text.includes('low')) return 'green';
  return 'default';
}

export function TaskCategoryTag({ value, label, shortLabel }: TagProps) {
  const text = String(value || '').trim();
  const display = String(label || text || '').trim();
  return (
    <Tooltip title={display || '-'}>
      <Tag className="kpm-compact-task-tag" color={stableColor(text || display)}>{firstDisplayChar(display, shortLabel)}</Tag>
    </Tooltip>
  );
}

export function TaskPriorityTag({ value }: TagProps) {
  const text = String(value || '').trim();
  if (!text) return <Tag className="kpm-priority-tag">-</Tag>;
  return <Tag className="kpm-priority-tag" color={priorityColor(text)}>{text}</Tag>;
}

export function TaskProjectTag({ value }: TagProps) {
  const text = String(value || '').trim();
  if (!text) return <Tag className="kpm-project-tag" color="default">中性任务</Tag>;
  return (
    <Tooltip title={text}>
      <Tag className="kpm-project-tag" color={stableColor(text)}>{text}</Tag>
    </Tooltip>
  );
}
