<script setup lang="ts">
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/vue-table';
import { useClipboard } from '@vueuse/core';
import { CandidateStatus } from '../../server/types/candidate';
import type { Candidate } from '../../server/types/candidate';
import EditStatusModal from './EditStatusModal.vue';
import DeleteConfirmationModal from './DeleteConfirmationModal.vue';
import getStatusColor from '~/utils/status-color';

interface Props {
  candidates: Candidate[];
  pending: boolean;
  onRefresh: () => void;
}

const props = defineProps<Props>();

const UButton = resolveComponent('UButton');
const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const { copy } = useClipboard();

// Modal state
const showEditStatusModal = ref(false);
const showDeleteModal = ref(false);
const selectedCandidate = ref<Candidate | null>(null);
const candidateToDelete = ref<Candidate | null>(null);


// Open edit status modal
const openEditStatusModal = (candidate: Candidate) => {
  selectedCandidate.value = candidate;
  showEditStatusModal.value = true;
};

// Open delete confirmation modal
const openDeleteModal = (candidate: Candidate) => {
  candidateToDelete.value = candidate;
  showDeleteModal.value = true;
};

// Handle modal success
const handleModalSuccess = () => {
  props.onRefresh();
};

// Row actions menu items
function getRowItems(row: Row<Candidate>) {
  const candidate = row.original;
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy candidate ID',
      onSelect() {
        copy(candidate.id);
        toast.add({
          title: 'Candidate ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        });
      }
    },
    {
      label: 'Copy email',
      onSelect() {
        copy(candidate.email);
        toast.add({
          title: 'Email copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        });
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Edit status',
      onSelect() {
        openEditStatusModal(candidate);
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete candidate',
      onSelect() {
        openDeleteModal(candidate);
      }
    }
  ];
}

// Table columns
const columns: TableColumn<Candidate>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as CandidateStatus;
      const color = getStatusColor(status);
      return h(UBadge, { 
        class: 'capitalize', 
        variant: 'subtle', 
        color 
      }, () => status);
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Applied At',
    cell: ({ row }) => formatDate(row.getValue('createdAt') as string)
  },
  {
    id: 'actions',
    meta: {
      class: {
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: 'end'
          },
          items: getRowItems(row),
          'aria-label': 'Actions dropdown'
        },
        () =>
          h(UButton, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            'aria-label': 'Actions dropdown'
          })
      );
    }
  }
];
</script>

<template>
  <div>
    <UTable
      :data="candidates"
      :columns="columns"
      class="w-full"
      :loading="pending"
    />

    <!-- Edit Status Modal -->
    <EditStatusModal
      v-model:open="showEditStatusModal"
      :candidate="selectedCandidate"
      @success="handleModalSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model:open="showDeleteModal"
      :candidate="candidateToDelete"
      @success="handleModalSuccess"
    />
  </div>
</template>