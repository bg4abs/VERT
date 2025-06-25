import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { browser } from '$app/environment';

register('en', () => import('./locales/en.json'));
register('zh', () => import('./locales/zh.json'));

export function initializeI18n() {
  if (browser) {
    const savedLocale = localStorage.getItem('preferred-locale');
    const navigatorLocale = navigator.language?.split('-')[0];
    init({
      fallbackLocale: 'en',
      initialLocale: savedLocale || navigatorLocale || 'en'
    });
  } else {
    init({ fallbackLocale: 'en', initialLocale: 'en' });
  }
} 