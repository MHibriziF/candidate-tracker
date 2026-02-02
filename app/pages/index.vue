<script setup lang="ts">
import StatusPieChart from '~/components/statistics/StatusPieChart.vue'
import MonthLineChart from '~/components/statistics/MonthLineChart.vue'

definePageMeta({
  title: 'Statistics'
})

const {
  data,
  pending,
  error,
  fetchStatistics,
  statusChartData,
  monthChartData
} = useStatistics()

// ===== RANGE STATE =====
const startMonth = ref('')
const endMonth = ref('')

// default: 3 bulan terakhir
onMounted(() => {
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 3)

  startMonth.value = start.toISOString().slice(0, 7)
  endMonth.value = end.toISOString().slice(0, 7)

  applyRange()
})

const applyRange = () => {
  // Validate data not empty and start <= end
  if (!startMonth.value || !endMonth.value) {
    error.value = 'Start month and end month must be selected'
    return
  }

  const start = new Date(`${startMonth.value}-01`)
  const end = new Date(`${endMonth.value}-01`)

  if (start > end) {
    error.value = 'Start month cannot be after end month'
    return
  }

  error.value = null

  // format untuk backend
  const startStr = `${startMonth.value}-01`

  const endDate = new Date(endMonth.value + '-01')
  endDate.setMonth(endDate.getMonth() + 1)
  endDate.setDate(0)

  const endStr = endDate.toISOString().slice(0, 10)

  fetchStatistics(startStr, endStr)
}
</script>

<template>
  <div class="p-4 space-y-6">

    <!-- ERROR -->
    <UAlert
      v-if="error"
      color="error"
      variant="outline"
      :title="error"
    />

    <!-- LOADING -->
    <div v-if="pending" class="text-center">
      Loading statistics...
    </div>

    <template v-else-if="data">

    <!-- RANGE PICKER -->
    <UCard>
        <template #header>
            <h3 class="font-semibold">Filter Range</h3>
        </template>

        <div class="flex gap-4 items-end flex-wrap">

            <div class="w-40">
            <label class="text-sm mb-1 block">Start Month</label>
            <UInput type="month" v-model="startMonth" />
            </div>

            <div class="w-40">
            <label class="text-sm mb-1 block">End Month</label>
            <UInput type="month" v-model="endMonth" />
            </div>

            <UButton
            color="primary"
            @click="applyRange"
            >
            Apply
            </UButton>

        </div>
    </UCard>

    <!-- TOTAL candidates -->
    <UCard>
    <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">

        <div class="text-center p-4">
        <h2 class="text-lg text-gray-500">All-time Total Candidates</h2>
        <p class="text-4xl font-bold mt-1">
            {{ data.totalCandidates }}
        </p>
        </div>

    
        <div class="text-center p-4">
        <h2 class="text-lg text-gray-500">Total Candidates in Range</h2>
        <p class="text-4xl font-bold mt-1 text-primary">
            {{ data.totalByRange }}
        </p>
        </div>

    </div>
    </UCard>


    <!-- BY STATUS -->
    <UCard>
        <template #header>
            <h3 class="font-semibold">Candidates by Status</h3>
        </template>

        <StatusPieChart :data="statusChartData" />
    </UCard>

    <!-- BY MONTH -->
    <UCard>
        <template #header>
            <h3 class="font-semibold">Candidates by Month</h3>
        </template>

        <MonthLineChart :data="monthChartData" />
    </UCard>

    </template>

  </div>
</template>
