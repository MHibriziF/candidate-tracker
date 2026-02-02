<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Candidates</h1>

    <!-- Search and Filters -->
    <div class="flex flex-wrap gap-4 mb-4">
      <UInput
        v-model="searchTerm"
        placeholder="Search by name, email, or phone..."
        class="flex-1 min-w-64"
        icon="i-heroicons-magnifying-glass"
      />

      <USelect
        v-model="selectedStatus"
        :items="statusOptions"
        placeholder="Filter by status"
        class="w-48"
      />

      <USelect
        v-model="perPage"
        :items="limitOptions"
        placeholder="Items per page"
        class="w-32"
      />
    </div>

    <!-- Table -->
    <div class="mb-6">
      <CandidatesTable
        :candidates="candidates"
        :pending="pending"
        :on-refresh="refresh"
      />
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6 mb-8">
      <UPagination
        v-model:page="page"
        :items-per-page="perPage"
        :total="total"
        :show-edges="true"
        :sibling-count="1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CandidateStatus } from '../../../server/types/candidate';

const {
  candidates,
  total,
  pending,
  setStatus,
  setSearch,
  perPage,
  page,
  refresh
} = useCandidates();

const searchTerm = ref('');
const selectedStatus = ref<CandidateStatus | null>(null);

// Watch for status changes and update the composable
watch(selectedStatus, (newStatus) => {
  setStatus(newStatus || undefined);
});

// Watch for search term changes and update the composable (with debounce)
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
watch(searchTerm, (newSearch) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    setSearch(newSearch);
  }, 300); // 300ms debounce
});

const statusOptions = ref([
  { label: 'All', value: null },
  { label: 'New', value: CandidateStatus.NEW },
  { label: 'Contacted', value: CandidateStatus.CONTACTED },
  { label: 'Interested', value: CandidateStatus.INTERESTED },
  { label: 'Rejected', value: CandidateStatus.REJECTED }
]);

const limitOptions = ref([
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]);
</script>
