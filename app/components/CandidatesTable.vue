<script setup lang="ts">
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/vue-table';
import { useClipboard } from '@vueuse/core';
import { CandidateStatus } from '../../server/types/candidate';
import type { Candidate } from '../../server/types/candidate';
import EditStatusModal from './modals/EditStatusModal.vue';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal.vue';
import getStatusColor from '~/utils/status-color';
import formatDate from '~/utils/format-date';

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
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return h('span', { class: 'font-mono text-xs text-gray-500' }, id);
    },
    meta: {
      class: {
        th: 'hidden sm:table-cell',
        td: 'hidden sm:table-cell'
      }
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      class: {
        th: 'min-w-32',
        td: 'font-medium'
      }
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return h('span', { class: 'text-sm' }, email);
    },
    meta: {
      class: {
        th: 'hidden md:table-cell min-w-48',
        td: 'hidden md:table-cell'
      }
    }
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string;
      return h('span', { class: 'text-sm font-mono' }, phone);
    },
    meta: {
      class: {
        th: 'hidden lg:table-cell min-w-32',
        td: 'hidden lg:table-cell'
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as CandidateStatus;
      const color = getStatusColor(status);
      return h(UBadge, { 
        class: 'capitalize text-xs justify-center w-full', 
        variant: 'subtle', 
        color 
      }, () => status);
    },
    meta: {
      class: {
        th: 'min-w-24',
      }
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Applied',
    cell: ({ row }) => formatDate(row.getValue('createdAt') as string),
    meta: {
      class: {
        th: 'hidden sm:table-cell min-w-24',
        td: 'hidden sm:table-cell text-sm text-gray-600'
      }
    }
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
            size: 'sm',
            'aria-label': 'Actions dropdown'
          })
      );
    }
  }
];
</script>

<template>
  <div class="w-full">
    <UTable
      :data="candidates"
      :columns="columns"
      class="w-full min-w-full"
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