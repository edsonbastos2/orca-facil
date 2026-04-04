<script setup lang="ts">
import Button from "primevue/button";

interface Props {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  severity?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "help";
}

defineProps<Props>();
</script>

<template>
  <Button
    :label="label"
    :loading="loading"
    :disabled="disabled || loading"
    :type="type ?? 'button'"
    :severity="severity ?? 'primary'"
    class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
  >
    <slot />
  </Button>
</template>
