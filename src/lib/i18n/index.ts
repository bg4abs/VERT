import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { browser } from '$app/environment';

// 使用静态导入避免构建时的动态导入问题
import en from './locales/en.json';
import zh from './locales/zh.json';

let initialized = false;

export function initializeI18n() {
  // 防止重复初始化
  if (initialized) return;
  
  // 将 register 也移到函数内部，避免模块级副作用
  register('en', () => Promise.resolve(en));
  register('zh', () => Promise.resolve(zh));
  
  // 安全获取初始语言
  const getInitialLocale = (): string => {
    if (!browser) return 'en';
    
    try {
      const saved = localStorage.getItem('preferred-locale');
      if (saved) return saved;
      
      // 安全调用 getLocaleFromNavigator
      return getLocaleFromNavigator() || 'en';
    } catch (error) {
      console.warn('Failed to get initial locale:', error);
      return 'en';
    }
  };

  init({
    fallbackLocale: 'en',
    initialLocale: getInitialLocale()
  });
  
  initialized = true;
}