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
  let dropdownReady = false;

  onMount(() => {
    if (browser) {
      const saved = localStorage.getItem('preferred-locale');
      currentLocale = saved || 'en';
      dropdownReady = true;
    }
  });

  $: if (browser && $locale) {
    currentLocale = $locale;
  }

  function handleLanguageChange(value: string) {
    if (browser) {
      locale.set(value);
      localStorage.setItem('preferred-locale', value);
    }
  }
</script>

{#if dropdownReady}
  <div class="language-selector">
    <Dropdown
      items={languages}
      value={currentLocale}
      onChange={handleLanguageChange}
    />
  </div>
{:else}
  <div class="language-placeholder" />
{/if}

<style>
  .language-selector {
    @apply inline-block;
  }
  .language-placeholder {
    @apply w-24 h-8 bg-gray-100 rounded animate-pulse;
  }
</style> 