<script setup lang="ts">
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

// Delete candidate
const deleteCandidate = async () => {
  if (!props.candidate) return;

  try {
    await $fetch(`/api/candidate/${props.candidate.id}`, {
      method: 'DELETE'
    });

    toast.add({
      title: 'Candidate deleted successfully!',
      color: 'success',
      icon: 'i-lucide-circle-check'
    });

    emit('update:open', false);
    emit('success');
  } catch (err: any) {
    toast.add({
      title: 'Failed to delete candidate',
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
          <h3 class="text-lg font-semibold text-red-600">Delete Candidate</h3>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            Are you sure you want to delete <strong>{{ candidate?.name }}</strong>?
            This action cannot be undone.
          </p>
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
              color="error"
              class="w-full sm:w-auto"
              @click="deleteCandidate"
            >
              Delete
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>