<script setup lang="ts">
// Aguarda o carregamento da sessão do Supabase
await new Promise((resolve) => setTimeout(resolve, 500));

const user = useSupabaseUser();

// Redireciona no client-side para evitar problemas de SSR
if (import.meta.client) {
  if (user.value) {
    navigateTo("/dashboard", { replace: true });
  } else {
    navigateTo("/login", { replace: true });
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <p class="text-gray-500">Carregando...</p>
  </div>
</template>
