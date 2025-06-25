<script lang="ts">
    import { locale } from 'svelte-i18n';
    import Dropdown from '$lib/components/functional/Dropdown.svelte';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
  
    const languages = [
      { value: 'en', label: 'English' },
      { value: 'zh', label: '中文' }
    ];
  
    let currentLocale = 'en';
  
    // 延迟初始化 - 移到 onMount 中
    onMount(() => {
      if (browser) {
        try {
          const saved = localStorage.getItem('preferred-locale');
          if (saved) {
            currentLocale = saved;
          }
        } catch (error) {
          console.warn('Failed to load saved locale:', error);
        }
      }
    });
  
    function handleLanguageChange(value: string) {
      locale.set(value);
      currentLocale = value;
      
      if (browser) {
        try {
          localStorage.setItem('preferred-locale', value);
        } catch (error) {
          console.warn('Failed to save locale preference:', error);
        }
      }
    }
  
    // 响应式更新
    $: if ($locale && $locale !== currentLocale) {
      currentLocale = $locale;
    }
  </script>
  
  <div class="language-selector">
    <Dropdown
      items={languages}
      value={currentLocale}
      onChange={handleLanguageChange}
    />
  </div>
  
  <style>
    .language-selector {
      @apply inline-block;
    }
  </style>