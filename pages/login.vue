<script setup lang="ts">
import { useAuthState } from "~/composables/useAuth";
import { nextTick } from "vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Login — Orça Fácil",
});

const { isLoading, error, login } = useAuthState();

async function handleLogin(payload: { email: string; password: string }) {
  const success = await login(payload.email, payload.password);
  if (success) {
    // Aguarda um tick para garantir que a sessão foi atualizada
    await nextTick();
    (navigateTo as any)("/dashboard", { replace: true, external: false });
  }
}
</script>

<template>
  <AuthPageTemplate>
    <AuthSplitLayout
      :loading="isLoading"
      :error="error"
      @submit="handleLogin"
    />
  </AuthPageTemplate>
</template>
