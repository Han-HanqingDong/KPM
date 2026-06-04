import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

void i18next.use(initReactI18next).init({
  lng: window.localStorage.getItem('kpm.language') || 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: { escapeValue: false },
  resources,
});

export default i18next;
