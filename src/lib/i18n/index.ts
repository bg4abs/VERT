import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

export function initializeI18n() {
  if (typeof window !== 'undefined') {
    register('en', () => import('./locales/en.json'));
    register('zh', () => import('./locales/zh.json'));
    init({
      fallbackLocale: 'en',
      initialLocale: localStorage.getItem('preferred-locale') || getLocaleFromNavigator() || 'en'
    });
  }
}