# Tarefa 5.0: CRUD de Clientes

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar o CRUD completo de clientes: criar, listar, editar e excluir com persistência no Supabase. Cada cliente é vinculado ao usuário autenticado via RLS. Esta funcionalidade é pré-requisito para a criação de orçamentos (RF01-RF06 do PRD).

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Pages, useFetch/useAsyncData, composables auto-import
- `vue-composition-api` — `<script setup lang="ts">`
- `supabase` — CRUD via client, RLS isolation
- `primevue` — DataTable, Dialog, ConfirmDialog
- `atomic-design` — Molecules e organisms
</skills>

<requirements>
- useClientes composable: listar, criar, atualizar, excluir
- Página de listagem /clientes com tabela paginada
- Página de formulário /clientes/novo e /clientes/[id]
- ConfirmDialog para exclusão
- Validação: nome e email obrigatórios
</requirements>

## Subtarefas

- [ ] 5.1 Criar `app/composables/useClientes.ts` com funções: `buscarTodos()`, `criar(data)`, `atualizar(id, data)`, `excluir(id)`; todas via `useSupabaseClient`
- [ ] 5.2 Criar `app/components/molecules/ClienteForm.vue` — formulário com AppInput (nome, email, telefone, empresa), validação, emite `submit`
- [ ] 5.3 Criar `app/components/organisms/ClienteList.vue` — tabela PrimeVue DataTable com colunas: nome, email, telefone, empresa, ações (editar, excluir)
- [ ] 5.4 Criar `app/pages/clientes/index.vue` — lista de clientes com CrudPageTemplate, botão "Novo Cliente", botão excluir com ConfirmDialog
- [ ] 5.5 Criar `app/pages/clientes/novo.vue` — formulário de criação com CrudPageTemplate
- [ ] 5.6 Criar `app/pages/clientes/[id].vue` — formulário de edição (reutiliza ClienteForm)
- [ ] 5.7 Excluir cliente: verificar se há orçamentos vinculados; se sim, exibir aviso ou usar ON DELETE SET NULL no banco
- [ ] 5.8 Criar testes unitários para `useClientes` (mock Supabase)
- [ ] 5.9 Criar testes unitários para `ClienteForm` e `ClienteList`
- [ ] 5.10 Executar `yarn test:run` e `yarn typecheck`

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Modelos de Dados" contém schema da tabela `clientes`. O composable `useClientes` segue o mesmo padrão de `useOrcamentos` (task 6.0). Dados fluem: formulário → emit → composable → Supabase → refresh lista.

## Critérios de Sucesso

- Criar cliente com nome e email obrigatórios → aparece na lista
- Editar cliente → alterações persistidas
- Excluir cliente → removido da lista (com confirmação)
- Lista paginada e ordenável por nome
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** useClientes.buscarTodos retorna lista de clientes
- [ ] **Unitário (Vitest):** useClientes.criar insere cliente no banco
- [ ] **Unitário (Vitest):** useClientes.atualizar modifica cliente existente
- [ ] **Unitário (Vitest):** useClientes.excluir remove cliente
- [ ] **Unitário (Vitest):** ClienteForm emite submit com dados válidos
- [ ] **Unitário (Vitest):** ClienteForm NÃO emite submit sem nome
- [ ] **Unitário (Vitest):** ClienteList renderiza tabela com clientes

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/composables/useClientes.ts` — novo
- `app/components/molecules/ClienteForm.vue` — novo
- `app/components/organisms/ClienteList.vue` — novo
- `app/pages/clientes/index.vue` — novo
- `app/pages/clientes/novo.vue` — novo
- `app/pages/clientes/[id].vue` — novo
- `tests/composables/useClientes.test.ts` — novo
- `tests/molecules/ClienteForm.test.ts` — novo
- `tests/organisms/ClienteList.test.ts` — novo
