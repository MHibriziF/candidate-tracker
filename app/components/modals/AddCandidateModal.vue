<script setup lang="ts">
import { CandidateStatus, type CreateCandidateDto } from '~~/server/types/candidate';

interface Props {
  open: boolean;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const saving = ref(false);
const errorMessage = ref<string | null>(null);

const emptyForm = (): CreateCandidateDto => ({
  name: '',
  email: '',
  phone: '',
  status: CandidateStatus.NEW
});

const form = ref<CreateCandidateDto>(emptyForm());

watch(
  () => props.open,
  (val) => {
    if (val) {
      form.value = emptyForm();
      errorMessage.value = null;
    }
  }
);

const submit = async () => {
  try {
    saving.value = true;
    errorMessage.value = null;

    await $fetch('/api/candidate', {
      method: 'POST',
      body: form.value
    });

    emit('update:open', false);
    emit('success');
  } catch (err: any) {
    errorMessage.value =
      err?.data?.message ||
      err?.message ||
      'Failed to create candidate';
  } finally {
    saving.value = false;
  }
};

const statusOptions = [
  { label: 'New', value: CandidateStatus.NEW },
  { label: 'Contacted', value: CandidateStatus.CONTACTED },
  { label: 'Interested', value: CandidateStatus.INTERESTED },
  { label: 'Rejected', value: CandidateStatus.REJECTED }
];

const closeModal = () => {
  emit('update:open', false);
};
</script>

<template>
  <UModal :open="open" @update:open="emit('update:open', $event)">
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">New Candidate</h3>
        </template>

        <!-- ALERT ERROR -->
        <UAlert
          v-if="errorMessage"
          title="Failed to create candidate"
          :description="errorMessage"
          color="error"
          variant="outline"
          class="mb-4"
          @close="errorMessage = null"
        />

        <div class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium">Name *</label>
            <UInput v-model="form.name" placeholder="Enter candidate name" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium">Email *</label>
            <UInput v-model="form.email" type="email" placeholder="Enter email address" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium">Phone</label>
            <UInput v-model="form.phone" type="tel" placeholder="Enter phone number" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium">Status</label>
            <USelect
              v-model="form.status"
              :items="statusOptions"
              placeholder="Select initial status"
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
              :loading="saving"
              @click="submit"
            >
              Save Candidate
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
