<script setup lang="ts">
import { useRoute } from '#imports'
import DashboardSidebar from '~/components/dashboard/Sidebar.vue'

const route = useRoute()

const pageTitle = computed(() => {
  const metaTitle = route.meta.title as string | undefined
  return metaTitle ? `Bekerdja ${metaTitle}` : 'Bekerdja'
})
</script>

<template>
  <UDashboardGroup>

    <DashboardSidebar />

    <UDashboardPanel>

      <template #header>
        <UDashboardNavbar :title="pageTitle">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>

    </UDashboardPanel>

  </UDashboardGroup>
</template>
