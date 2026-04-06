<script setup lang="ts">
import Calendar from "primevue/calendar";

interface Props {
  id: string;
  label: string;
  modelValue: string | null;
  error?: string | null;
  disabled?: boolean;
  minDate?: Date;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  disabled: false,
  minDate: undefined,
  placeholder: "Selecione uma data",
  modelValue: null,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();

function onDateChange(date: Date | null) {
  if (date) {
    emit("update:modelValue", date.toISOString());
  } else {
    emit("update:modelValue", null);
  }
}

function parseModelValue(): Date | null {
  if (!props.modelValue) return null;
  const date = new Date(props.modelValue);
  return isNaN(date.getTime()) ? null : date;
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <Calendar
      :id="id"
      :model-value="parseModelValue()"
      :disabled="disabled"
      :invalid="!!error"
      :min-date="minDate"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      date-format="dd/mm/yy"
      :show-icon="true"
      class="w-full"
      input-class="w-full"
      @update:model-value="onDateChange"
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
