import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { message } from 'antd';
import { kpmApi, storageKeys } from '../services/kpmApi';
import type { User } from '../types';

type AuthContextValue = {
  token: string;
  user: User | null;
  isAuthenticated: boolean;
  login: (account: string, password: string) => Promise<void>;
  logout: () => void;
  can: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readUserFromStorage(): User | null {
  const id = localStorage.getItem(storageKeys.userId);
  const account = localStorage.getItem(storageKeys.account);
  const name = localStorage.getItem(storageKeys.userName);
  if (!account || !name) return null;
  return {
    id: id || account,
    account,
    name,
    roles: JSON.parse(localStorage.getItem(storageKeys.roles) || '[]'),
    permissions: JSON.parse(localStorage.getItem(storageKeys.permissions) || '[]'),
  };
}

function persistSession(token: string, user: User) {
  localStorage.setItem(storageKeys.token, token);
  localStorage.setItem(storageKeys.userId, user.id || user.account);
  localStorage.setItem(storageKeys.account, user.account);
  localStorage.setItem(storageKeys.userName, user.name);
  localStorage.setItem(storageKeys.permissions, JSON.stringify(user.permissions || []));
  localStorage.setItem(storageKeys.roles, JSON.stringify(user.roles || user.globalRoles || []));
}

function clearSession() {
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(storageKeys.token) || '');
  const [user, setUser] = useState<User | null>(() => readUserFromStorage());

  const login = useCallback(async (account: string, password: string) => {
    const result = await kpmApi.login(account, password);
    persistSession(result.token, result.user);
    setToken(result.token);
    setUser(result.user);
    message.success(`登录成功，欢迎 ${result.user.name}`);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken('');
    setUser(null);
    message.success('已退出登录');
  }, []);

  const can = useCallback((permission: string) => {
    if (!permission) return true;
    const permissions = user?.permissions || [];
    return permissions.includes(permission);
  }, [user?.permissions]);

  const value = useMemo<AuthContextValue>(() => ({ token, user, isAuthenticated: Boolean(token), login, logout, can }), [token, user, login, logout, can]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
