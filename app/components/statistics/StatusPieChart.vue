<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Pie } from 'vue-chartjs'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
)

const props = defineProps<{
  data: any
}>()

const hasValidData = computed(() => {
  const { data } = props
  return data &&
    data.datasets &&
    data.datasets[0] &&
    data.datasets[0].data &&
    data.datasets[0].data.some((value: number) => value > 0)
})

const options = {
  responsive: true,
  maintainAspectRatio: false,

  layout: {
    padding: 10
  },

  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 16,
        usePointStyle: true
      }
    },

    tooltip: {
      callbacks: {
        label(context: any) {
          const label = context.label || ''
          const value = context.raw || 0

          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          )

          const percent = total
            ? ((value / total) * 100).toFixed(1)
            : 0

          return `${label}: ${value} (${percent}%)`
        }
      }
    },

    // datalabels
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold' as const
      },

      formatter(value: number, ctx: any) {
        const total = ctx.chart.data.datasets[0].data.reduce(
          (a: number, b: number) => a + b,
          0
        )

        const percent = total
          ? ((value / total) * 100).toFixed(0)
          : 0

        return value > 0 ? `${value}\n(${percent}%)` : ''
      }
    }
  }
}
</script>

<template>
  <div class="w-full min-h-65 h-[30vh] max-h-100">

    <Pie
      v-if="hasValidData"
      :data="data"
      :options="options"
    />

    <div
      v-else
      class="flex items-center justify-center h-full text-gray-500"
    >
      <div class="text-center">
        <UIcon
          name="i-heroicons-chart-pie"
          class="w-12 h-12 mx-auto mb-2 text-gray-400"
        />
        <p>No Data</p>
      </div>
    </div>

  </div>
</template>
