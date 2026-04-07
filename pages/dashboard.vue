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
  <NuxtLayout name="dashboard">
    <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h1>
        <p class="mt-1 text-sm text-gray-500">
          Gerencie seus orçamentos de forma rápida e profissional.
        </p>
      </div>

      <!-- Resumo Rápido (Placeholder) -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Card: Total de Orçamentos -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100"
            >
              <i class="pi pi-file-edit text-xl text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Orçamentos</p>
              <p class="text-2xl font-bold text-gray-900">—</p>
            </div>
          </div>
        </div>

        <!-- Card: Total de Clientes -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100"
            >
              <i class="pi pi-users text-xl text-green-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Clientes</p>
              <p class="text-2xl font-bold text-gray-900">—</p>
            </div>
          </div>
        </div>

        <!-- Card: Orçamentos Aprovados -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100"
            >
              <i class="pi pi-check-circle text-xl text-yellow-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Aprovados</p>
              <p class="text-2xl font-bold text-gray-900">—</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Placeholder Info -->
      <div
        class="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div class="space-y-4 text-center">
          <i class="pi pi-construction text-4xl text-gray-400" />
          <div>
            <h2 class="text-xl font-semibold text-gray-800">
              Módulo em construção
            </h2>
            <p class="mt-2 text-gray-500">
              Em breve: crie, gerencie e acompanhe todos os seus orçamentos em
              um só lugar.
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
