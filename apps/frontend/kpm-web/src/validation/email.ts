const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function validateLoginEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return '请输入登录邮箱';
  if (email.length > 128) return '登录邮箱不能超过 128 个字符';
  if (!isEmail(email)) return '登录账号必须是邮箱格式，例如 admin@kozenmobile.com';
  return null;
}
