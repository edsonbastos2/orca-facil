<script setup lang="ts">
import Breadcrumb from "primevue/breadcrumb";

interface Props {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; route?: string }>;
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  breadcrumbs: () => [{ label: "Home", route: "/dashboard" }],
});

const home = ref({ label: "Home", route: "/dashboard" });

const breadcrumbItems = computed(() =>
  props.breadcrumbs.map((bc) => ({
    label: bc.label,
    route: bc.route ?? "#",
  })),
);
</script>

<template>
  <div class="w-full p-4 sm:p-6">
    <!-- Breadcrumb -->
    <Breadcrumb :home="home" :model="breadcrumbItems" class="mb-4" />

    <!-- Title and Description -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-1 text-sm text-gray-500">
        {{ description }}
      </p>
    </div>

    <!-- Content Slot -->
    <div class="max-w-full">
      <slot />
    </div>
  </div>
</template>
