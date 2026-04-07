<script setup lang="ts">
import Menubar from "primevue/menubar";

interface Props {
  activeRoute?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeRoute: "/orcamentos",
});

const emit = defineEmits<{
  navigate: [];
}>();

const { logout } = useAuthState();
const user = useSupabaseUser();

const menuItems = ref([
  {
    label: "Orçamentos",
    icon: "pi pi-file-edit",
    route: "/orcamentos",
  },
  {
    label: "Clientes",
    icon: "pi pi-users",
    route: "/clientes",
  },
]);

function isActive(route: string): boolean {
  return props.activeRoute === route;
}

async function handleLogout() {
  await logout();
  emit("navigate");
  await navigateTo("/login");
}

function handleNavigation(route: string) {
  emit("navigate");
  navigateTo(route);
}
</script>

<template>
  <div class="flex h-full flex-col bg-white">
    <!-- Logo / Branding -->
    <div class="border-b border-gray-200 px-6 py-5">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
          <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">Orça Fácil</h1>
          <p class="text-xs text-gray-500">Gestão de Orçamentos</p>
        </div>
      </div>
    </div>

    <!-- User info -->
    <div class="border-b border-gray-200 px-6 py-3">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
          <span class="text-sm font-medium text-gray-700">
            {{ user?.email?.charAt(0).toUpperCase() ?? "U" }}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-gray-900">
            {{ user?.email ?? "Usuário" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 space-y-1 px-3 py-4">
      <button
        v-for="item in menuItems"
        :key="item.route"
        type="button"
        :class="[
          'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
          isActive(item.route)
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        ]"
        @click="handleNavigation(item.route)"
      >
        <i :class="['pi', item.icon, 'text-base']" />
        {{ item.label }}
      </button>
    </nav>

    <!-- Logout Button -->
    <div class="border-t border-gray-200 p-4">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        @click="handleLogout"
      >
        <i class="pi pi-sign-out text-base" />
        Sair
      </button>
    </div>
  </div>
</template>
