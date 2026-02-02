<script setup lang="ts">
import { CandidateStatus } from '~~/server/types/candidate';
import type { Candidate } from '~~/server/types/candidate';

interface Props {
  open: boolean;
  candidate: Candidate | null;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const toast = useToast();
const newStatus = ref<CandidateStatus>();

// Watch for candidate changes to update status
watch(() => props.candidate, (candidate) => {
  if (candidate) {
    newStatus.value = candidate.status;
  }
}, { immediate: true });

// Status options for select
const statusOptions = [
  { label: 'New', value: CandidateStatus.NEW },
  { label: 'Contacted', value: CandidateStatus.CONTACTED },
  { label: 'Interested', value: CandidateStatus.INTERESTED },
  { label: 'Rejected', value: CandidateStatus.REJECTED }
];

// Update candidate status
const updateStatus = async () => {
  if (!props.candidate || !newStatus.value) return;

  try {
    await $fetch(`/api/candidate/${props.candidate.id}`, {
      method: 'PATCH',
      body: { status: newStatus.value }
    });

    toast.add({
      title: 'Status updated successfully!',
      color: 'success',
      icon: 'i-lucide-circle-check'
    });

    emit('update:open', false);
    emit('success');
  } catch (err: any) {
    toast.add({
      title: 'Failed to update status',
      description: err.message || 'An error occurred',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    });
  }
};

// Close modal
const closeModal = () => {
  emit('update:open', false);
};
</script>

<template>
  <UModal :open="open" @update:open="emit('update:open', $event)">
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Edit Status</h3>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Candidate</label>
            <p class="text-sm text-gray-600">
              {{ candidate?.name }} ({{ candidate?.email }})
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Status</label>
            <USelect
              class="w-full"
              v-model="newStatus"
              :items="statusOptions"
              placeholder="Select status"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              class="w-full sm:w-auto"
              @click="closeModal"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              class="w-full sm:w-auto"
              @click="updateStatus"
              :disabled="!newStatus"
            >
              Update Status
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>