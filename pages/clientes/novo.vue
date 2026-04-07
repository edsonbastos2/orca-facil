<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Novo Cliente — Orça Fácil",
});

const { criar, loading } = useClientes();

async function handleSubmit(data: {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
}) {
  const id = await criar({
    nome: data.nome,
    email: data.email,
    telefone: data.telefone || undefined,
    empresa: data.empresa || undefined,
  });

  if (id) {
    await navigateTo("/clientes");
  }
}
</script>

<template>
  <NuxtLayout name="dashboard">
    <CrudPageTemplate
      title="Novo Cliente"
      description="Cadastre um novo cliente no sistema."
    >
      <div class="w-full max-w-2xl">
        <ClienteForm
          :loading="loading"
          @submit="handleSubmit"
          @cancel="navigateTo('/clientes')"
        />
      </div>
    </CrudPageTemplate>
  </NuxtLayout>
</template>
