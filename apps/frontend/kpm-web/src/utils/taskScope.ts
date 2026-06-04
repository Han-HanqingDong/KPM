import type { Task, User } from '../types';

export type TaskUserIdentity = {
  id?: string;
  account?: string;
  email?: string;
  name?: string;
};

function normalize(value?: unknown): string {
  return String(value ?? '').trim();
}

function normalizeLower(value?: unknown): string {
  return normalize(value).toLowerCase();
}

function tokens(values: unknown): string[] {
  if (Array.isArray(values)) return values.map(normalize).filter(Boolean);
  return String(values || '')
    .split(/[,，、]/)
    .map(normalize)
    .filter(Boolean);
}

function hasExact(values: unknown, candidates: Array<string | undefined>): boolean {
  const source = new Set(tokens(values));
  return candidates.map(normalize).filter(Boolean).some((candidate) => source.has(candidate));
}

function hasExactLower(values: unknown, candidates: Array<string | undefined>): boolean {
  const source = new Set(tokens(values).map((value) => value.toLowerCase()));
  return candidates.map(normalizeLower).filter(Boolean).some((candidate) => source.has(candidate));
}

/**
 * Resolves the logged-in user to the canonical resource user, because an old
 * browser session may only have account/name in localStorage while task links
 * should filter by the stable database user id.
 */
export function resolveTaskUser(users: User[] = [], user?: User | null, explicitUserId?: string | null): TaskUserIdentity {
  const explicit = normalize(explicitUserId);
  const match = users.find((item) => {
    if (explicit && [item.id, item.account, item.email, item.name].map(normalize).includes(explicit)) return true;
    if (!user) return false;
    return [item.id, item.account, item.email, item.name].map(normalizeLower).some((value) =>
      value && [user.id, user.account, user.email, user.name].map(normalizeLower).includes(value),
    );
  });
  return {
    id: match?.id || user?.id || explicit || undefined,
    account: match?.account || user?.account,
    email: match?.email || user?.email,
    name: match?.name || user?.name,
  };
}

export function taskAssignedToUser(task: Task, identity: TaskUserIdentity): boolean {
  if (hasExact(task.assigneeIds, [identity.id])) return true;
  return hasExactLower(task.assignees, [identity.name, identity.account, identity.email]);
}

export function taskParticipatedByUser(task: Task, identity: TaskUserIdentity): boolean {
  if (hasExact(task.participantIds, [identity.id])) return true;
  return hasExactLower(task.participants, [identity.name, identity.account, identity.email]);
}

export function taskCreatedByUser(task: Task, identity: TaskUserIdentity): boolean {
  if (normalize(task.creatorUserId) && normalize(task.creatorUserId) === normalize(identity.id)) return true;
  return [identity.name, identity.account, identity.email].map(normalizeLower).filter(Boolean).includes(normalizeLower(task.creator));
}

export function taskRelatedToUser(task: Task, identity: TaskUserIdentity): boolean {
  return taskAssignedToUser(task, identity) || taskParticipatedByUser(task, identity) || taskCreatedByUser(task, identity);
}

