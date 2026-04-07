<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
}

interface Props {
  clientes: Cliente[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  editar: [id: string];
  excluir: [id: string];
}>();

const confirmacao = ref<{
  visible: boolean;
  clienteId: string;
  clienteNome: string;
}>({
  visible: false,
  clienteId: "",
  clienteNome: "",
});

function confirmarExclusao(cliente: Cliente) {
  confirmacao.value = {
    visible: true,
    clienteId: cliente.id,
    clienteNome: cliente.nome,
  };
}

function handleConfirmarExclusao() {
  emit("excluir", confirmacao.value.clienteId);
  confirmacao.value.visible = false;
}
</script>

<template>
  <div
    class="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white"
  >
    <!-- Tabela de Clientes -->
    <div class="min-w-[600px]">
      <DataTable
        :value="clientes"
        :loading="loading"
        paginator
        :rows="10"
        :rows-per-page-options="[5, 10, 20]"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        sort-field="nome"
        :sort-order="1"
        striped-rows
        show-gridlines
        class="w-full"
        header-class="bg-gray-50 text-gray-700 font-semibold"
      >
        <Column field="nome" header="Nome" sortable class="min-w-[120px]">
          <template #body="{ data }">
            <span class="font-medium text-gray-900">{{ data.nome }}</span>
          </template>
        </Column>
        <Column field="email" header="E-mail" sortable class="min-w-[140px]" />
        <Column field="telefone" header="Telefone" class="min-w-[100px]">
          <template #body="{ data }">
            {{ data.telefone ?? "—" }}
          </template>
        </Column>
        <Column
          field="empresa"
          header="Empresa"
          class="min-w-[100px] hidden sm:table-cell"
        >
          <template #body="{ data }">
            {{ data.empresa ?? "—" }}
          </template>
        </Column>
        <Column
          field="acoes"
          header="Ações"
          class="min-w-[120px]"
          :exportable="false"
        >
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                @click="emit('editar', slotProps.data.id)"
              >
                <i
                  class="pi pi-pencil mr-1"
                  style="color: #1d4ed8; font-size: 0.75rem"
                />
                Editar
              </button>
              <button
                type="button"
                class="rounded border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                @click="confirmarExclusao(slotProps.data)"
              >
                <i
                  class="pi pi-trash mr-1"
                  style="color: #b91c1c; font-size: 0.75rem"
                />
                Excluir
              </button>
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Diálogo de Confirmação -->
      <Dialog
        v-model:visible="confirmacao.visible"
        header="Confirmar Exclusão"
        :modal="true"
        :closable="true"
        class="w-[90vw] max-w-md"
      >
        <div class="space-y-4">
          <p class="text-gray-700">
            Tem certeza que deseja excluir o cliente
            <span class="font-semibold">{{ confirmacao.clienteNome }}</span
            >?
          </p>
          <p class="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <AppButton
              label="Cancelar"
              severity="secondary"
              @click="confirmacao.visible = false"
            />
            <AppButton
              label="Excluir"
              severity="danger"
              @click="handleConfirmarExclusao"
            />
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
/* Container da tabela com scroll horizontal */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* Garante que os headers da DataTable tenham contraste adequado */
:deep(.p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
}

:deep(.p-datatable-tbody > tr > td) {
  color: #111827;
  font-size: 0.875rem;
  white-space: nowrap;
}

/* Gridlines visíveis */
:deep(.p-datatable-thead > tr > th),
:deep(.p-datatable-tbody > tr > td) {
  border-color: #e5e7eb;
}

/* Paginator visível */
:deep(.p-paginator) {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  color: #374151;
  border-radius: 0.375rem;
  min-width: 2rem;
  height: 2rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: #2563eb;
  color: #ffffff;
}

:deep(
  .p-paginator .p-paginator-pages .p-paginator-page:not(.p-highlight):hover
) {
  background-color: #f3f4f6;
}

:deep(.p-paginator .p-paginator-current) {
  color: #6b7280;
  font-size: 0.875rem;
}

:deep(.p-paginator .p-paginator-first),
:deep(.p-paginator .p-paginator-prev),
:deep(.p-paginator .p-paginator-next),
:deep(.p-paginator .p-paginator-last) {
  color: #374151;
  border-radius: 0.375rem;
}

:deep(.p-paginator .p-paginator-dropdown) {
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
}
</style>
