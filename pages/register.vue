<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Criar conta — Orça Fácil",
});
</script>

<template>
  <AuthPageTemplate>
    <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div class="w-full max-w-md space-y-6 p-6 text-center">
        <div class="space-y-2">
          <h1 class="text-2xl font-semibold text-gray-900">Criar conta</h1>
          <p class="text-gray-500">
            Esta funcionalidade estará disponível em breve.
          </p>
        </div>

        <div
          class="rounded-lg border border-blue-200 bg-blue-50 p-6 text-blue-700"
        >
          <p class="text-sm">
            Estamos trabalhando para oferecer a melhor experiência possível.
            Aguarde novidades!
          </p>
        </div>

        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          ← Voltar para o login
        </NuxtLink>
      </div>
    </div>
  </AuthPageTemplate>
</template>
