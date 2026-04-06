<script setup lang="ts">
import InputNumber from "primevue/inputnumber";

interface Props {
  id: string;
  label: string;
  modelValue: number | null;
  error?: string | null;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  disabled: false,
  modelValue: null,
});

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <InputNumber
      :id="id"
      :model-value="modelValue"
      :disabled="disabled"
      :invalid="!!error"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      mode="currency"
      currency="BRL"
      locale="pt-BR"
      :min="0"
      :min-fraction-digits="2"
      :max-fraction-digits="2"
      class="w-full"
      input-class="w-full"
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
