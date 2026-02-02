import { CandidateStatus } from '../../server/types/candidate';
import type { Candidate } from '../../server/types/candidate';

interface CandidatesResponse {
  data: Candidate[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const useCandidates = () => {
  // State
  const status = ref<CandidateStatus | undefined>();
  const page = ref(1);
  const perPage = ref(10);
  const search = ref<string>('');
  const pending = ref(false);
  
  // Response data
  const response = ref<CandidatesResponse>({ 
    data: [], 
    total: 0, 
    page: 1, 
    perPage: 10, 
    totalPages: 0 
  });

  // Prevent watch loop when server adjusts page number
  const isSyncingPage = ref(false);

  // Fetch candidates from API
  const fetchCandidates = async () => {
    pending.value = true;

    try {
      const params = new URLSearchParams();
      if (status.value) params.append('status', status.value);
      if (search.value.trim()) params.append('search', search.value.trim());
      params.append('page', page.value.toString());
      params.append('perPage', perPage.value.toString());

      const res = await $fetch<CandidatesResponse>(`/api/candidate?${params.toString()}`);
      response.value = res;

      // Sync page if server adjusted it (e.g., requested page 5 but only 3 pages exist)
      if (res.page !== page.value) {
        isSyncingPage.value = true;
        page.value = res.page;
        nextTick(() => {
          isSyncingPage.value = false;
        });
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      pending.value = false;
    }
  };

  // Auto-refetch when filters change
  watch([status, page, perPage, search], () => {
    if (!isSyncingPage.value) {
      fetchCandidates();
    }
  }, { immediate: true });

  // Actions
  const setStatus = (newStatus?: CandidateStatus) => {
    status.value = newStatus;
    page.value = 1;
  };

  const setSearch = (searchTerm: string) => {
    search.value = searchTerm;
    page.value = 1;
  };

  // Computed
  const candidates = computed(() => response.value.data);
  const total = computed(() => response.value.total);
  const totalPages = computed(() => response.value.totalPages);

  return {
    // Data
    candidates,
    total,
    totalPages,
    pending,
    
    // Pagination controls (reactive refs for v-model)
    page,
    perPage,
    
    // Actions
    setStatus,
    setSearch,
    refresh: fetchCandidates,
  };
};
