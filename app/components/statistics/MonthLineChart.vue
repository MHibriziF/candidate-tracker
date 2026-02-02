<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
)

interface Props {
  data: any
}

const props = defineProps<Props>()

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="h-64 w-full">
    <Line v-if="data && data.datasets && data.datasets[0] && data.datasets[0].data && data.datasets[0].data.some((value: number) => value > 0)" :data="data" :options="options" />
    <div v-else class="flex items-center justify-center h-full text-gray-500">
      <div class="text-center">
        <UIcon name="i-heroicons-chart-bar" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No Data</p>
      </div>
    </div>
  </div>
</template>
