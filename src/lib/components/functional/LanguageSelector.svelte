<script lang="ts">
  import { locale } from 'svelte-i18n';
  import Dropdown from '$lib/components/functional/Dropdown.svelte';
  import { browser } from '$app/environment';

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' }
  ];

  let initialLocale = 'en';
  if (browser) {
    initialLocale = localStorage.getItem('preferred-locale') || 'en';
  }

  function handleLanguageChange(value: string) {
    locale.set(value);
    if (browser) {
      localStorage.setItem('preferred-locale', value);
    }
  }

  $: currentLocale = $locale || initialLocale;
</script>

{#if browser}
<div class="language-selector">
  <Dropdown
    items={languages}
    value={currentLocale || 'en'}
    onChange={handleLanguageChange}
  />
</div>
{/if}

<style>
  .language-selector {
    @apply inline-block;
  }
</style> 