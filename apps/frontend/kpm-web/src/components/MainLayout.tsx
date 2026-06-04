import { BellOutlined, DashboardOutlined, DatabaseOutlined, FileTextOutlined, LineChartOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ProjectOutlined, ShopOutlined, TeamOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, Space, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { KozenLogo } from './KozenLogo';
import { LanguageSwitch } from './LanguageSwitch';
import { useAuth } from '../context/AuthContext';
import { kpmApi } from '../services/kpmApi';
import type { AnyRecord } from '../types';
import { dateTimeText } from '../utils/format';

const { Sider, Content } = Layout;

const navItems = [
  { key: '/dashboard', label: '工作台', icon: <DashboardOutlined />, permission: 'menu:dashboard' },
  { key: '/projects', label: '项目管理', icon: <ProjectOutlined />, permission: 'menu:projects' },
  { key: '/customers', label: '客户管理', icon: <TeamOutlined />, permission: 'menu:customer-master' },
  { key: '/tasks', label: '任务管理', icon: <UnorderedListOutlined />, permission: 'menu:tasks' },
  { key: '/orders', label: '订单管理', icon: <ShopOutlined />, permission: 'menu:orders' },
  { key: '/analytics', label: '统计看板', icon: <LineChartOutlined />, permission: 'menu:analytics', children: [
    { key: '/analytics/orders', label: '订单情况', permission: 'menu:analytics' },
    { key: '/analytics/support', label: '技术支持情况', permission: 'menu:analytics' },
    { key: '/analytics/resources', label: '资源分布', permission: 'menu:analytics' },
    { key: '/analytics/activity', label: '客户×项目活跃度', permission: 'menu:analytics' },
  ] },
  { key: '/templates', label: '流程模板', icon: <FileTextOutlined />, permission: 'menu:templates' },
  { key: '/resources', label: '资源管理', icon: <DatabaseOutlined />, permission: 'menu:resources' },
];

export function MainLayout() {
  const { user, logout, can } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('kpm.react.sidebarCollapsed') === 'true');
  const [messages, setMessages] = useState<AnyRecord[]>([]);

  const visibleItems = useMemo(() => navItems
    .filter((item) => can(item.permission))
    .map((item) => ({ ...item, children: item.children?.filter((child) => can(child.permission)) })), [can]);
  const selectedKey = useMemo(() => {
    const children = visibleItems.flatMap((item) => item.children || []);
    const child = children.find((item) => location.pathname.startsWith(item.key));
    if (child) return child.key;
    const found = visibleItems.find((item) => location.pathname.startsWith(item.key));
    return found?.key || '/dashboard';
  }, [location.pathname, visibleItems]);
  const openKeys = useMemo(() => location.pathname.startsWith('/analytics') ? ['/analytics'] : [], [location.pathname]);
  const unread = messages.filter((item) => !item.readFlag && item.readFlag !== true).length;

  useEffect(() => {
    localStorage.setItem('kpm.react.sidebarCollapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const rows = await kpmApi.notifications();
        if (active) setMessages(rows.slice(0, 10));
      } catch {
        // notification service should not block primary app shell
      }
    };
    void load();
    const timer = window.setInterval(load, 120_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  async function markAllRead() {
    await kpmApi.markAllRead();
    setMessages((rows) => rows.map((row) => ({ ...row, readFlag: true })));
    message.success('消息已全部标记为已读');
  }

  return (
    <Layout className="kpm-react-shell">
      <Sider className="kpm-sider" width={260} collapsedWidth={82} collapsed={collapsed} trigger={null}>
        <Button className="kpm-collapse" type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed((value) => !value)} />
        <div className="kpm-brand" onClick={() => navigate('/dashboard')} role="button" tabIndex={0}>
          <KozenLogo compact={collapsed} />
          {!collapsed && <Typography.Text>Kozen Project Management</Typography.Text>}
        </div>
        <Menu
          className="kpm-menu"
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={visibleItems.map(({ key, label, icon, children }) => ({ key, label, icon, children: children?.map((child) => ({ key: child.key, label: child.label })) }))}
          onClick={({ key }) => navigate(key)}
        />
        <div className="kpm-user-foot">
          <Dropdown
            trigger={['click']}
            placement={collapsed ? 'top' : 'topLeft'}
            overlayClassName="kpm-user-dropdown"
            getPopupContainer={() => document.body}
            menu={{
              items: [
                { key: 'change', label: t('nav.changePassword') },
                { key: 'logout', label: t('nav.logout') },
              ],
              onClick: ({ key }) => {
                if (key === 'logout') logout();
                if (key === 'change') message.info('修改密码入口已保留，后续在个人中心中完善。');
              },
            }}
          >
            <button className="kpm-user-trigger" type="button" title={user?.name || '未登录'}>
              <Avatar
                className="kpm-user-avatar"
                size={collapsed ? 44 : 38}
                src={`https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(user?.account || 'kozen')}&backgroundColor=fff35a,b7ff38,1fd7c7`}
              />
              {!collapsed && <span className="kpm-user-name">{user?.name || '未登录'}</span>}
            </button>
          </Dropdown>
        </div>
      </Sider>
      <Layout>
        <header className="kpm-topbar">
          <div>
            <strong>KOZEN</strong>
            <span>TO COLLABORATE WITH GLOBAL LEADERS</span>
          </div>
          <LanguageSwitch />
          <Dropdown
            trigger={['click']}
            popupRender={() => (
              <div className="kpm-message-panel">
                <div className="kpm-message-head">
                  <strong>{t('nav.messageBox')}</strong>
                  <Button size="small" onClick={markAllRead}>{t('nav.markAllRead')}</Button>
                </div>
                {messages.length ? messages.map((item) => (
                  <article key={item.id} className={item.readFlag ? 'read' : ''}>
                    <strong>{item.title || '系统消息'}</strong>
                    <p>{item.content || '-'}</p>
                    <small>{dateTimeText(item.createdAt)}</small>
                  </article>
                )) : <p className="kpm-empty-text">{t('nav.noMessages')}</p>}
              </div>
            )}
          >
            <Button icon={<BellOutlined />}>
              <Space>{t('nav.messages')}<Badge count={unread} /></Space>
            </Button>
          </Dropdown>
        </header>
        <Content className="kpm-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
