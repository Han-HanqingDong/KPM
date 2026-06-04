import type { AnyRecord, EnumItem, Order } from '../types';

export function asArray<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

export function text(value: unknown, fallback = '-'): string {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

export function dateText(value?: string | null): string {
  if (!value) return '-';
  return String(value).slice(0, 10);
}

export function dateTimeText(value?: string | null): string {
  if (!value) return '-';
  return String(value).replace('T', ' ').slice(0, 16);
}


export function dateValue(value?: string | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function compareDateDesc(a?: string | null, b?: string | null): number {
  return dateValue(b) - dateValue(a);
}

export function moneyText(amount?: number | string | null, currency = 'USD'): string {
  const numeric = Number(amount ?? 0);
  return `${currency || 'USD'} ${numeric.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function compactId(id = '', type = ''): string {
  const value = String(id || '-');
  const test = value.match(/^test-(order|task)-(.+)$/i);
  if (test) return `${test[1].toLowerCase() === 'order' ? 'ORD' : 'TSK'}-${test[2].toUpperCase()}`;
  if (value.length <= 16) return value;
  const prefix = type === 'order' ? 'ORD' : type === 'task' ? 'TSK' : value.slice(0, 3).toUpperCase();
  return `${prefix}-${value.slice(-8)}`;
}

export function enumValues(items: EnumItem[], enumType: string, fallback: string[] = []): string[] {
  const values = items
    .filter((item) => item.enumType === enumType && item.active !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => item.value || item.name || '')
    .filter(Boolean);
  return values.length ? values : fallback;
}

export function parseJsonObject(value: unknown): AnyRecord {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value as AnyRecord;
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function orderType(order: Order): string {
  return order.orderType || order.type || '正式订单';
}

export function unique<T>(items: T[]): T[] {
  return [...new Set(items.filter(Boolean))];
}

export function includesKeyword(source: AnyRecord | unknown[], keyword: string, keys: string[] = []): boolean {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return true;
  if (Array.isArray(source)) {
    return source.some((value) => String(value ?? '').toLowerCase().includes(normalized));
  }
  return keys.some((key) => String(source[key] ?? '').toLowerCase().includes(normalized));
}

const closedTaskStatuses = new Set([
  '已完成',
  '完成',
  '已关闭',
  '关闭',
  '已拒绝',
  '拒绝',
  '作废',
  '取消',
  'DONE',
  'CLOSED',
  'REJECTED',
  'VOID',
  'CANCELLED',
  'CANCELED',
]);

export function isClosedTaskStatus(status?: unknown): boolean {
  const raw = String(status ?? '').trim();
  if (!raw) return false;
  return closedTaskStatuses.has(raw) || closedTaskStatuses.has(raw.toUpperCase());
}


const completedTaskStatuses = new Set([
  '已完成',
  '完成',
  'DONE',
  'CLOSED',
]);

export function isCompletedTaskStatus(status?: unknown): boolean {
  const raw = String(status ?? '').trim();
  if (!raw) return false;
  return completedTaskStatuses.has(raw) || completedTaskStatuses.has(raw.toUpperCase());
}

export function isAssignedToUser(assignees: unknown, currentUserName: string): boolean {
  const current = currentUserName.trim();
  if (!current) return false;
  const names = Array.isArray(assignees) ? assignees : String(assignees || '').split(/[,，、]/);
  return names.some((name) => String(name || '').trim() === current);
}
