<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Recuperar senha — Orça Fácil",
});
</script>

<template>
  <AuthPageTemplate>
    <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div class="w-full max-w-md space-y-6 p-6 text-center">
        <div class="space-y-2">
          <h1 class="text-2xl font-semibold text-gray-900">Recuperar senha</h1>
          <p class="text-gray-500">
            Esta funcionalidade estará disponível em breve.
          </p>
        </div>

        <div
          class="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-700"
        >
          <p class="text-sm">
            Em breve você poderá recuperar sua senha informando seu e-mail
            cadastrado.
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
