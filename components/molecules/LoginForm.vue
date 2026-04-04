<script setup lang="ts">
import Message from "primevue/message";

interface Props {
  loading?: boolean;
  error?: string | null;
}

defineProps<Props>();

const emit = defineEmits<{
  submit: [payload: { email: string; password: string }];
}>();

const email = ref("");
const password = ref("");
const emailError = ref<string | null>(null);

function validateEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    emailError.value = "O e-mail é obrigatório";
    return false;
  }
  if (!emailRegex.test(value)) {
    emailError.value = "Formato de e-mail inválido";
    return false;
  }
  emailError.value = null;
  return true;
}

function handleSubmit() {
  const isEmailValid = validateEmail(email.value);
  if (!isEmailValid || !password.value) {
    if (!password.value) {
      // Não mostra erro inline para senha, apenas previne submit
    }
    return;
  }

  emit("submit", { email: email.value, password: password.value });
}

function handleEmailBlur() {
  if (email.value) {
    validateEmail(email.value);
  }
}
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <!-- Mensagem de erro global -->
    <Message
      v-if="error"
      severity="error"
      :closable="false"
      role="alert"
      aria-live="assertive"
    >
      {{ error }}
    </Message>

    <!-- Campo de e-mail -->
    <AppInput
      id="email"
      label="E-mail"
      type="email"
      :model-value="email"
      :error="emailError"
      placeholder="seu@email.com"
      :disabled="loading"
      @update:model-value="email = $event"
      @blur="handleEmailBlur"
    />

    <!-- Campo de senha -->
    <AppInput
      id="password"
      label="Senha"
      type="password"
      :model-value="password"
      placeholder="Sua senha"
      :disabled="loading"
      @update:model-value="password = $event"
    />

    <!-- Botão de entrar -->
    <AppButton
      type="submit"
      label="Entrar"
      :loading="loading"
      severity="primary"
    />

    <!-- Footer com links -->
    <AuthFooter />
  </form>
</template>
