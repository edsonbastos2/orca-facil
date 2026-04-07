<script setup lang="ts">
interface ClienteFormData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
}

interface Props {
  initialData?: ClienteFormData | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  loading: false,
});

const emit = defineEmits<{
  submit: [data: ClienteFormData];
  cancel: [];
}>();

const form = ref<ClienteFormData>(
  props.initialData ?? {
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
  },
);

const errors = ref<Record<string, string>>({});

function validate(): boolean {
  errors.value = {};

  if (!form.value.nome.trim()) {
    errors.value.nome = "Nome é obrigatório";
  }
  if (!form.value.email.trim()) {
    errors.value.email = "E-mail é obrigatório";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "E-mail inválido";
  }

  return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
  if (validate()) {
    emit("submit", { ...form.value });
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full max-w-full space-y-6">
    <div class="grid w-full grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
      <!-- Nome -->
      <AppInput
        id="cliente-nome"
        label="Nome *"
        :model-value="form.nome"
        :error="errors.nome"
        placeholder="Nome do cliente"
        @update:model-value="form.nome = $event"
      />

      <!-- Email -->
      <AppInput
        id="cliente-email"
        label="E-mail *"
        type="email"
        :model-value="form.email"
        :error="errors.email"
        placeholder="cliente@email.com"
        @update:model-value="form.email = $event"
      />

      <!-- Telefone -->
      <AppInput
        id="cliente-telefone"
        label="Telefone"
        :model-value="form.telefone"
        placeholder="(00) 00000-0000"
        @update:model-value="form.telefone = $event"
      />

      <!-- Empresa -->
      <AppInput
        id="cliente-empresa"
        label="Empresa"
        :model-value="form.empresa"
        placeholder="Nome da empresa (opcional)"
        @update:model-value="form.empresa = $event"
      />
    </div>

    <!-- Actions -->
    <div
      class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end"
    >
      <AppButton
        label="Cancelar"
        severity="secondary"
        type="button"
        :full-width="false"
        @click="emit('cancel')"
      />
      <AppButton
        :label="loading ? 'Salvando...' : 'Salvar'"
        severity="primary"
        type="submit"
        :loading="loading"
        :disabled="loading"
        :full-width="false"
      />
    </div>
  </form>
</template>
