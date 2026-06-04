import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { KozenLogo } from '../components/KozenLogo';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { useAuth } from '../context/AuthContext';
import { validationRules } from '../validation';

export function LoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const eyeStyle = useMemo(() => ({
    transform: `translate(${Math.max(-3, Math.min(3, pointer.x / 80))}px, ${Math.max(-2, Math.min(2, pointer.y / 120))}px)`,
  }), [pointer.x, pointer.y]);

  async function handleFinish(values: { account: string; password: string }) {
    setSubmitting(true);
    try {
      await login(values.account, values.password);
      const from = (location.state as { from?: string } | null)?.from || '/dashboard';
      navigate(from, { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className="kpm-login-page"
      onMouseMove={(event) => setPointer({ x: event.clientX - window.innerWidth / 2, y: event.clientY - window.innerHeight / 2 })}
    >
      <section className="kpm-login-hero">
        <div className="kpm-login-brandline">
          <KozenLogo compact />
          <strong>KOZEN</strong>
        </div>
        <Typography.Title level={1}>{t('login.projectManagement')}</Typography.Title>
        <p>TO COLLABORATE WITH GLOBAL LEADERS</p>
        <div className="kpm-login-orbit" aria-hidden="true">
          <span /><span /><span />
        </div>
      </section>
      <div className="kpm-login-language"><LanguageSwitch /></div>
      <Card className="kpm-login-card">
        <div className={`kpm-watchers ${passwordFocused ? 'covering' : ''}`} aria-hidden="true">
          {['cyan', 'yellow', 'green', 'blue'].map((tone) => <span key={tone} className={`watcher ${tone}`}><i style={eyeStyle} /></span>)}
        </div>
        <Typography.Title level={3}>{t('login.title')}</Typography.Title>
        <Typography.Paragraph type="secondary">{t('login.description')}</Typography.Paragraph>
        <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
          <Form.Item name="account" label={t('login.email')} rules={[validationRules.required('请输入邮箱账号'), validationRules.email()]}>
            <Input prefix={<MailOutlined />} placeholder="admin@kozenmobile.com" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label={t('login.password')} rules={[validationRules.required('请输入密码')]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </Form.Item>
          <Button block type="primary" htmlType="submit" loading={submitting}>{t('login.submit')}</Button>
        </Form>
      </Card>
    </main>
  );
}
