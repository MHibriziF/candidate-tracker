import type { Statistics } from '../../server/types/statistics';

export const useStatistics = () => {
  // State
  const data = ref<Statistics | null>(null);
  const pending = ref(false);
  const error = ref<string | null>(null);

  // Chart data
  const statusChartData = computed(() => {
    if (!data.value) return null;

    const { candidatesByStatus } = data.value;
    return {
      labels: Object.keys(candidatesByStatus),
      datasets: [
        {
          label: 'Candidates by Status',
          data: Object.values(candidatesByStatus),
          backgroundColor: [
            '#3B82F6', // blue
            '#8B5CF6', // purple
            '#10B981', // green
            '#EF4444', // red
          ],
          borderWidth: 1,
        },
      ],
    };
  });

  const monthChartData = computed(() => {
    if (!data.value) return null;

    const { candidatesByMonth } = data.value;
    return {
      labels: Object.keys(candidatesByMonth).map((month) => {
        const date = new Date(month + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      datasets: [
        {
          label: 'Candidates by Month',
          data: Object.values(candidatesByMonth),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  });

  // Fetch statistics
  const fetchStatistics = async (start?: string, end?: string) => {
    pending.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      if (start) params.append('start', start);
      if (end) params.append('end', end);

      const result = await $fetch<Statistics>(`/api/statistics?${params.toString()}`);
      data.value = result;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch statistics';
      console.error('Statistics fetch error:', err);
    } finally {
      pending.value = false;
    }
  };

  // Refresh data
  const refresh = () => {
    fetchStatistics();
  };

  return {
    // Data
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),

    // Chart data
    statusChartData,
    monthChartData,

    // Actions
    fetchStatistics,
    refresh,
  };
};
