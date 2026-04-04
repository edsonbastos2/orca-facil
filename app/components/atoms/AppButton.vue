<script setup lang="ts">
import Button from "primevue/button";

interface Props {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  severity?: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "help";
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
    class="w-full"
  >
    <slot />
  </Button>
</template>
