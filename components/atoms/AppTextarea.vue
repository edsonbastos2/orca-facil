<script setup lang="ts">
import Textarea from "primevue/textarea";

interface Props {
  id: string;
  label: string;
  modelValue: string;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  disabled: false,
  placeholder: "",
  rows: 3,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <Textarea
      :id="id"
      :model-value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :invalid="!!error"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100"
      @update:model-value="emit('update:modelValue', $event ?? '')"
    />

    <!-- Mensagem de erro -->
    <p
      v-if="error"
      :id="`${id}-error`"
      role="alert"
      class="text-sm text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>
