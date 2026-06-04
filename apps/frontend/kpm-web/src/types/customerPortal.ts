import type { AnyRecord, Id } from "./domain";

export type CustomerPortalUser = {
  customerId: Id;
  customerName: string;
  customerShortName?: string;
  contactId: Id;
  contactName: string;
  email: string;
};

export type CustomerPortalLoginResponse = {
  token: string;
  tokenType?: string;
  expiresIn?: number;
  user: CustomerPortalUser;
};

export type CustomerPortalProject = {
  projectId: Id;
  projectName: string;
  internalName?: string;
  modelName?: string;
  projectStatus?: string;
};

export type CustomerPortalMaterial = {
  id: Id;
  projectId: Id;
  projectName: string;
  sourceStage?: string;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  description?: string;
  bucket?: string;
  objectKey?: string;
  storageUrl?: string;
  storageCategory?: string;
  publicAt?: string;
};

export type CustomerPortalAnnouncement = {
  id: Id;
  projectId?: Id;
  projectName?: string;
  announcementType?: string;
  title: string;
  content: string;
  publisher?: string;
  publishedAt?: string;
};

export type CustomerPortalMessage = {
  id: Id;
  title: string;
  content: string;
  messageType?: string;
  projectId?: Id;
  projectName?: string;
  taskId?: Id;
  announcementId?: Id;
  readFlag?: boolean;
  createdAt?: string;
  readAt?: string;
};

export type CustomerPortalTask = {
  id: Id;
  taskNo?: string;
  title: string;
  description?: string;
  projectId?: Id;
  projectName?: string;
  category?: string;
  status?: string;
  priority?: string;
  expectedCompletionAt?: string;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  commentCount?: number;
  comments?: CustomerPortalTaskComment[];
};

export type CustomerPortalTaskComment = {
  id: Id;
  taskId: Id;
  author?: string;
  content?: string;
  attachments?: AnyRecord[];
  createdAt?: string;
};

export type CustomerPortalTaskCommentPage = {
  records: CustomerPortalTaskComment[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type CustomerPortalData = {
  user: CustomerPortalUser;
  projects: CustomerPortalProject[];
  materials: CustomerPortalMaterial[];
  tasks: CustomerPortalTask[];
  announcements: CustomerPortalAnnouncement[];
  messages: CustomerPortalMessage[];
  unreadCount: number;
};

export type CustomerPortalTaskRequest = {
  projectId: Id;
  title: string;
  description: string;
  priority?: string;
};

export type CustomerPortalTaskCommentRequest = {
  content?: string;
  attachments?: AnyRecord[];
};

export type CustomerPortalCodeResponse = {
  sent: boolean;
  expiresInSeconds: number;
  message: string;
  debugCode?: string;
};

export type CustomerPortalDownloadResult = AnyRecord & { url: string };
