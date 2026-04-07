<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Clientes — Orça Fácil",
});

const { buscarTodos, excluir, loading } = useClientes();
const clientes = ref<any[]>([]);
const toast = ref<{ add: (msg: any) => void } | null>(null);

async function loadClientes() {
  clientes.value = await buscarTodos();
}

await loadClientes();

function handleEditar(id: string) {
  navigateTo(`/clientes/${id}`);
}

async function handleExcluir(id: string) {
  const success = await excluir(id);
  if (success) {
    await loadClientes();
  }
}
</script>

<template>
  <NuxtLayout name="dashboard">
    <CrudPageTemplate
      title="Clientes"
      description="Gerencie seus clientes e seus dados de contato."
    >
      <!-- Header com botão Novo -->
      <div class="mb-6 flex justify-end">
        <AppButton
          label="Novo Cliente"
          icon="pi pi-plus"
          @click="navigateTo('/clientes/novo')"
        />
      </div>

      <!-- Lista de Clientes -->
      <ClienteList
        :clientes="clientes"
        :loading="loading"
        @editar="handleEditar"
        @excluir="handleExcluir"
      />
    </CrudPageTemplate>
  </NuxtLayout>
</template>
