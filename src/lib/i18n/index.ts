import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { browser } from '$app/environment';

register('en', () => import('./locales/en.json'));
register('zh', () => import('./locales/zh.json'));

let initialLocale = 'en';
if (browser) {
  initialLocale = localStorage.getItem('preferred-locale') || getLocaleFromNavigator() || 'en';
}

init({
  fallbackLocale: 'en',
  initialLocale
}); 