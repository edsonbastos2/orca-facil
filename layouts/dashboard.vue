<script setup lang="ts">
import DashboardSidebar from "~/components/organisms/DashboardSidebar.vue";

// Sidebar state para mobile
const sidebarOpen = ref(false);

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function closeSidebar() {
  sidebarOpen.value = false;
}

// Expor para componentes filhos
provide("sidebarToggle", { toggleSidebar, closeSidebar });
</script>

<template>
  <div class="flex min-h-screen w-full overflow-x-hidden bg-gray-50">
    <!-- Overlay para mobile quando sidebar está aberta -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="closeSidebar"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <DashboardSidebar @navigate="closeSidebar" />
    </aside>

    <!-- Conteúdo principal -->
    <div class="flex w-full flex-1 flex-col lg:ml-0">
      <!-- Topbar mobile -->
      <header
        class="sticky top-0 z-30 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden"
      >
        <button
          type="button"
          class="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="toggleSidebar"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span class="text-lg font-semibold text-gray-900">Orça Fácil</span>
        <div class="w-10" />
        <!-- Spacer para centralizar -->
      </header>

      <!-- Slot do conteúdo -->
      <main class="flex w-full flex-1 max-w-full overflow-x-hidden">
        <div class="w-full max-w-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
