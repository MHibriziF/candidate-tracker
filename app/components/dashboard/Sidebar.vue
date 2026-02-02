<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [[
  {
    label: 'Statistics',
    icon: 'i-lucide-chart-column',
    to: '/',
  },
  {
    label: 'Candidates',
    icon: 'i-lucide-users',
    to: '/candidate',
  }
]]
</script>

<template>
  <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">

    <!-- HEADER -->
    <template #header="{ collapsed }">
      <span v-if="!collapsed" class="font-bold text-lg">
        Bekerdja
      </span>

      <UIcon
        v-else
        name="i-lucide-briefcase"
        class="size-5 text-primary mx-auto"
      />
    </template>

    <!-- MENU -->
    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
      />
    </template>

    <!-- FOOTER -->
    <template #footer="{ collapsed }">
      <UButton
        :label="collapsed ? undefined : 'Recruiter'"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
      />
    </template>

  </UDashboardSidebar>
</template>
