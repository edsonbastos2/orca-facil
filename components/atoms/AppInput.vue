<script setup lang="ts">
import InputText from "primevue/inputtext";
import Password from "primevue/password";

interface Props {
  id: string;
  label: string;
  modelValue: string;
  type?: "text" | "email" | "password";
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  error: null,
  placeholder: "",
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- Campo de texto normal ou email -->
    <template v-if="type !== 'password'">
      <label :for="id" class="text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <InputText
        :id="id"
        :model-value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="!!error"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100"
        @update:model-value="emit('update:modelValue', $event ?? '')"
      />
    </template>

    <!-- Campo de senha com toggle de visibilidade -->
    <template v-else>
      <label :for="id" class="text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <Password
        :id="id"
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :feedback="false"
        :toggle-mask="true"
        :invalid="!!error"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="w-full"
        input-class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100"
        @update:model-value="emit('update:modelValue', $event ?? '')"
      />
    </template>

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
