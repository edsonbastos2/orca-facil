<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Dashboard — Orça Fácil",
});

const user = useSupabaseUser();
</script>

<template>
  <NuxtLayout>
    <div class="flex min-h-screen flex-col items-center justify-center p-6">
      <div class="w-full max-w-2xl space-y-6 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500">
          Bem-vindo,
          <span class="font-medium text-gray-700">{{ user?.email }}</span>!
        </p>

        <div
          class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800">
              Em desenvolvimento
            </h2>
            <p class="text-gray-500">
              O dashboard do Orça Fácil estará disponível em breve com todas as
              funcionalidades para gerenciar seus orçamentos.
            </p>
          </div>
        </div>

        <p class="text-sm text-gray-400">
          Esta é uma versão inicial do sistema. Novas funcionalidades serão
          adicionadas gradualmente.
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
