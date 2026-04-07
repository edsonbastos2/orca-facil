<script setup lang="ts">
interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <div v-if="title" class="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <h1 class="text-xl font-semibold text-gray-900">
        {{ title }}
      </h1>
    </div>
    <slot />
  </div>
</template>
