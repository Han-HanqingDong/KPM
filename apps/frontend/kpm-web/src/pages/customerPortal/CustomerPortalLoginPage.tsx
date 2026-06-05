import { MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { KozenLogo } from '../../components/KozenLogo';
import { LanguageSwitch } from '../../components/LanguageSwitch';
import { customerPortalApi, persistCustomerPortalSession } from '../../services/customerPortalApi';
import { validationRules } from '../../validation';

export function CustomerPortalLoginPage() {
  const [form] = Form.useForm<{ email: string; code: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [debugCode, setDebugCode] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const eyeStyle = useMemo(() => ({
    transform: `translate(${Math.max(-3, Math.min(3, pointer.x / 80))}px, ${Math.max(-2, Math.min(2, pointer.y / 120))}px)`,
  }), [pointer.x, pointer.y]);

  async function sendCode() {
    const email = form.getFieldValue('email');
    await form.validateFields(['email']);
    setSending(true);
    try {
      const result = await customerPortalApi.requestCode(email);
      setDebugCode(result.debugCode || '');
      message.success(result.message || '验证码已发送');
    } catch {
      message.error(t('login.invalidCredentials'));
    } finally {
      setSending(false);
    }
  }

  async function handleFinish(values: { email: string; code: string }) {
    setSubmitting(true);
    try {
      const result = await customerPortalApi.login(values.email, values.code);
      persistCustomerPortalSession(result);
      message.success(`欢迎 ${result.user.contactName || result.user.customerName}`);
      navigate('/customer-portal', { replace: true });
    } catch {
      message.error(t('login.invalidCredentials'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className="kpm-login-page kpm-customer-login-page"
      onMouseMove={(event) => setPointer({ x: event.clientX - window.innerWidth / 2, y: event.clientY - window.innerHeight / 2 })}
    >
      <section className="kpm-login-hero">
        <div className="kpm-login-brandline">
          <KozenLogo compact />
          <strong>{t('portalLogin.brand')}</strong>
        </div>
        <Typography.Title level={1}>{t('portalLogin.heroTitle')}</Typography.Title>
        <p>{t('portalLogin.heroSubtitle')}</p>
        <div className="kpm-login-orbit" aria-hidden="true">
          <span /><span /><span />
        </div>
      </section>
      <div className="kpm-login-language"><LanguageSwitch /></div>
      <Card className="kpm-login-card kpm-customer-login-card">
        <div className={`kpm-watchers ${passwordFocused ? 'covering' : ''}`} aria-hidden="true">
          {['cyan', 'yellow', 'green', 'blue'].map((tone) => <span key={tone} className={`watcher ${tone}`}><i style={eyeStyle} /></span>)}
        </div>
        <Typography.Title level={3}>{t('portalLogin.title')}</Typography.Title>
        <Typography.Paragraph type="secondary" className="kpm-login-compact-hint">{t('portalLogin.description')}</Typography.Paragraph>
        <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
          <Form.Item name="email" label={t('portalLogin.email')} rules={[validationRules.required('请输入联系人邮箱'), validationRules.email()]}>
            <Input prefix={<MailOutlined />} placeholder="contact@example.com" autoComplete="email" />
          </Form.Item>
          <Form.Item name="code" label={t('portalLogin.code')} rules={[validationRules.required('请输入验证码'), { pattern: /^[A-Za-z0-9]{6}$/, message: '验证码必须为6位字母或数字' }]}>
            <Space.Compact block>
              <Input
                prefix={<SafetyCertificateOutlined />}
                maxLength={6}
                placeholder="6位验证码"
                autoComplete="one-time-code"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <Button loading={sending} onClick={sendCode}>{t('portalLogin.sendCode')}</Button>
            </Space.Compact>
          </Form.Item>
          {debugCode ? <Typography.Paragraph className="kpm-portal-debug-code">{t('portalLogin.debugCode')}<strong>{debugCode}</strong></Typography.Paragraph> : null}
          <Button block type="primary" htmlType="submit" loading={submitting}>{t('portalLogin.submit')}</Button>
        </Form>
      </Card>
    </main>
  );
}
