
<script setup lang="ts">
import { CandidateStatus, type CreateCandidateDto } from '../../../server/types/candidate';
import AddCandidateModal from '../../components/modals/AddCandidateModal.vue';

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

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

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

<template>
  <div class="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
    <h1 class="text-xl sm:text-2xl font-bold mb-4">Candidates</h1>

    <!-- Search and Filters -->
    <div class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-end">
      <div class="flex-1 min-w-0">
        <UInput
          v-model="searchTerm"
          placeholder="Search by name, email, or phone..."
          class="w-full"
          icon="i-heroicons-magnifying-glass"
        />
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <USelect
          v-model="selectedStatus"
          :items="statusOptions"
          placeholder="Filter by status"
          class="w-full sm:w-48"
        />

        <USelect
          v-model="perPage"
          :items="limitOptions"
          placeholder="Items per page"
          class="w-full sm:w-32"
        />

        <UButton
          color="primary"
          icon="i-heroicons-plus"
          class="w-full sm:w-auto"
          @click="openModal"
        >
          <span class="sm:hidden">Add Candidate</span>
          <span class="hidden sm:inline">Add Candidate</span>
        </UButton>
      </div>
    </div>

    <!-- Table -->
    <div class="mb-6 overflow-x-auto">
      <CandidatesTable
        :candidates="candidates"
        :pending="pending"
        :on-refresh="refresh"
      />
    </div>

    <div class="flex justify-center">
      <p class="text-sm text-gray-500">Showing {{ candidates.length }} of {{ total }} candidates</p>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6 mb-8">
      <UPagination
        v-model:page="page"
        :items-per-page="perPage"
        :total="total"
        :show-edges="true"
        :sibling-count="1"
        class="sm:w-auto"
      />
    </div>
    
    <!-- Add Candidate Modal -->
    <AddCandidateModal
      v-model:open="isModalOpen"
      @success="refresh"
    />

  </div>
</template>
