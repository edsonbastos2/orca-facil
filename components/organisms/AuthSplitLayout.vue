<script setup lang="ts">
interface Props {
  loading?: boolean;
  error?: string | null;
}

defineProps<Props>();

const emit = defineEmits<{
  submit: [payload: { email: string; password: string }];
}>();
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
    <div class="w-full max-w-md space-y-6 p-6">
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-gray-900">
          Bem-vindo de volta
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          Entre com suas credenciais para acessar sua conta.
        </p>
      </div>

      <LoginForm
        :loading="loading"
        :error="error"
        @submit="emit('submit', $event)"
      />
    </div>
  </div>
</template>
