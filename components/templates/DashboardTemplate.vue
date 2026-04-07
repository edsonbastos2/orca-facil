<script setup lang="ts">
interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
});

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="p-6">
    <div v-if="title" class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ title }}
      </h2>
    </div>
    <slot />
  </div>
</template>
