<script lang="ts">
  import { locale } from 'svelte-i18n';
  import Dropdown from '$lib/components/functional/Dropdown.svelte';

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' }
  ];

  function handleLanguageChange(value: string) {
    locale.set(value);
    // 可选：将用户的语言选择保存到 localStorage
    localStorage.setItem('preferred-locale', value);
  }

  // 初始化时从 localStorage 读取语言设置
  const savedLocale = localStorage.getItem('preferred-locale');
  if (savedLocale) {
    locale.set(savedLocale);
  }
</script>

<div class="language-selector">
  <Dropdown
    items={languages}
    value={$locale}
    onChange={handleLanguageChange}
  />
</div>

<style>
  .language-selector {
    @apply inline-block;
  }
</style> 