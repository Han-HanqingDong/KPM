import { kpmApi } from '../services/kpmApi';
import type { AnyRecord } from '../types';

export const MAX_ATTACHMENT_SIZE_MB = 500;
export const MAX_ATTACHMENT_SIZE_BYTES = MAX_ATTACHMENT_SIZE_MB * 1024 * 1024;

export type UploadLike = {
  originFileObj?: File;
  name?: string;
  size?: number;
};

export function normalizeUploadFiles(value: unknown): File[] {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item) => (item instanceof File ? item : (item as UploadLike).originFileObj))
    .filter(Boolean) as File[];
}

export function isWithinAttachmentLimit(file: File | UploadLike): boolean {
  const size = Number(file.size || 0);
  return size <= MAX_ATTACHMENT_SIZE_BYTES;
}

export function attachmentLimitMessage(fileName?: string): string {
  return `${fileName ? `${fileName} ` : ''}单个附件不能超过 ${MAX_ATTACHMENT_SIZE_MB}MB`;
}

export function assertAttachmentSize(files: File[]): void {
  const oversized = files.find((file) => !isWithinAttachmentLimit(file));
  if (oversized) {
    throw new Error(attachmentLimitMessage(oversized.name));
  }
}

export async function uploadBusinessFiles(files: File[], category: string, businessId: string, uploader: string): Promise<AnyRecord[]> {
  assertAttachmentSize(files);
  return Promise.all(files.map((file) => kpmApi.uploadFile(file, category, businessId, uploader)));
}

export async function downloadBusinessFile(file: AnyRecord) {
  const objectKey = file.objectKey || file.object_key;
  if (!objectKey) throw new Error('文件缺少 objectKey，无法下载');
  const { url } = await kpmApi.downloadUrl(objectKey, file.fileName || file.name);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.fileName || file.name || 'download';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
}
