<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Editar Cliente — Orça Fácil",
});

const route = useRoute();
const clienteId = route.params.id as string;

const { buscarPorId, atualizar, loading } = useClientes();
const cliente = ref<any>(null);
const notFound = ref(false);

// Busca os dados do cliente
cliente.value = await buscarPorId(clienteId);
if (!cliente.value) {
  notFound.value = true;
}

async function handleSubmit(data: { nome: string; email: string; telefone: string; empresa: string }) {
  const success = await atualizar(clienteId, {
    nome: data.nome,
    email: data.email,
    telefone: data.telefone || undefined,
    empresa: data.empresa || undefined,
  });

  if (success) {
    await navigateTo("/clientes");
  }
}
</script>

<template>
  <NuxtLayout name="dashboard">
    <CrudPageTemplate
      title="Editar Cliente"
      description="Atualize os dados do cliente."
    >
      <div v-if="notFound" class="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p class="text-gray-500">Cliente não encontrado.</p>
        <AppButton
          label="Voltar para lista"
          severity="secondary"
          class="mt-4"
          @click="navigateTo('/clientes')"
        />
      </div>
      <div v-else class="max-w-2xl">
        <ClienteForm
          :initial-data="{
            nome: cliente?.nome ?? '',
            email: cliente?.email ?? '',
            telefone: cliente?.telefone ?? '',
            empresa: cliente?.empresa ?? '',
          }"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="navigateTo('/clientes')"
        />
      </div>
    </CrudPageTemplate>
  </NuxtLayout>
</template>
