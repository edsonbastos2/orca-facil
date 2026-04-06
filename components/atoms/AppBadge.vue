<script setup lang="ts">
import Tag from "primevue/tag";

type Severity = "info" | "success" | "warning" | "danger";

interface Props {
  label: string;
  severity?: Severity;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  severity: "info",
  icon: undefined,
});

const severityMap: Record<Severity, string> = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
};
</script>

<template>
  <Tag
    :value="label"
    :severity="severity"
    :icon="icon"
    :class="severityMap[severity]"
    class="rounded-full px-2.5 py-1 text-xs font-semibold"
  >
    <slot />
  </Tag>
</template>
