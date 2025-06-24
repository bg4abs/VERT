<script lang="ts">
  import { locale } from 'svelte-i18n';
  import Dropdown from '$lib/components/functional/Dropdown.svelte';

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' }
  ];

  function handleLanguageChange(value: string) {
    locale.set(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', value);
    }
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