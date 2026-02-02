<script setup lang="ts">
import { useHead } from '#imports';

useHead({
  titleTemplate: '%s | Bekerdja',
  title: 'Bekerdja Recruiter',
  meta: [
    { name: 'description', content: 'Your AI recruitment assistant' }
  ]
});
</script>

<template>
    <UApp>
      <NuxtLayout >
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </NuxtLayout>
    </UApp>
</template>
