<script setup lang="ts">
import Select from "primevue/select";

interface Props {
  id: string;
  label: string;
  modelValue: string | null;
  options: Array<{ label: string; value: string }>;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  disabled: false,
  placeholder: "Selecione uma opção",
  modelValue: null,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <Select
      :id="id"
      :model-value="modelValue"
      :options="options"
      :disabled="disabled"
      :invalid="!!error"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      option-label="label"
      option-value="value"
      class="w-full"
      @update:model-value="emit('update:modelValue', $event)"
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
