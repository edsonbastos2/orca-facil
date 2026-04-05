# Tarefa 7.0: Listagem de Orçamentos

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a página de listagem de orçamentos com tabela paginada, filtros por status, busca por título/cliente, ordenação e ações rápidas (editar, duplicar, excluir, gerar PDF, copiar link). Cobre RF20-RF26 do PRD.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Pages, useAsyncData, navegação
- `vue-composition-api` — `<script setup lang="ts">`, refs, computed
- `supabase` — Queries com filtros, ordenação, paginação
- `primevue` — DataTable, Paginator, Menu, Toast
- `atomic-design` — Organisms e molecules
</skills>

<requirements>
- QuoteList com DataTable paginada
- Filtro por status, busca por título/cliente
- Ordenação por data, valor total, nome do cliente
- Ações rápidas: editar, duplicar, excluir, gerar PDF, copiar link
- QuoteStatusBadge em cada linha
- Colunas: número, título, cliente, data criação, valor total, status, validade
</requirements>

## Subtarefas

- [ ] 7.1 Criar `app/components/organisms/QuoteList.vue` — PrimeVue DataTable com colunas: número, título, cliente, data criação, total, status (QuoteStatusBadge), validade, ações
- [ ] 7.2 Criar `app/components/molecules/QuoteActions.vue` — menu de ações rápidas por linha: editar (ícone lápis), duplicar (ícone cópia), excluir (ícone lixeira), gerar PDF (ícone download), copiar link (ícone link)
- [ ] 7.3 Criar `app/components/molecules/ConfirmDialog.vue` — modal de confirmação genérico (usado para exclusão de orçamentos e clientes); usa PrimeVue Dialog
- [ ] 7.4 Adicionar filtro por status na página de listagem: dropdown com opções (Todos, Rascunho, Enviado, Aprovado, Recusado, Expirado)
- [ ] 7.5 Adicionar campo de busca por título ou nome do cliente
- [ ] 7.6 Adicionar ordenação: colunas clicáveis para ordenar por data, valor total, nome do cliente
- [ ] 7.7 Adicionar paginação via PrimeVue Paginator
- [ ] 7.8 Criar/Atualizar `app/pages/orcamentos/index.vue` — usa CrudPageTemplate + QuoteList + filtros + busca
- [ ] 7.9 Implementar ação de duplicar: chama `useOrcamentos.duplicar(id)` → refresh lista → toast de sucesso
- [ ] 7.10 Implementar ação de excluir: ConfirmDialog → `useOrcamentos.excluir(id)` → refresh lista
- [ ] 7.11 Criar testes unitários para `QuoteList` e `QuoteActions`
- [ ] 7.12 Executar `yarn test:run` e `yarn typecheck`

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Fluxo de Dados" descreve as ações disponíveis na listagem. A query Supabase deve usar `.select('*, clientes(nome)')` para incluir nome do cliente. Para paginação: `.range(from, to)`. Para filtros: `.eq('status', filtro)`. Para busca: `.ilike('titulo', `%busca%`)`.

## Critérios de Sucesso

- Lista exibe todos os orçamentos do usuário com dados completos
- Filtro por status funciona corretamente
- Busca por título/cliente retorna resultados relevantes
- Ordenação funciona nas colunas configuradas
- Ações rápidas executam: editar (navega), duplicar (cria cópia), excluir (com confirmação)
- Paginação funciona com 10 itens por página
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** QuoteList renderiza tabela com orçamentos mockados
- [ ] **Unitário (Vitest):** QuoteList aplica filtro de status corretamente
- [ ] **Unitário (Vitest):** QuoteActions emite evento de editar, duplicar, excluir
- [ ] **Unitário (Vitest):** ConfirmDialog emite confirm ao clicar botão confirmar
- [ ] **Integração (Vitest):** useOrcamentos.duplicar cria novo orçamento com mesmos itens

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/components/organisms/QuoteList.vue` — novo
- `app/components/molecules/QuoteActions.vue` — novo
- `app/components/molecules/ConfirmDialog.vue` — novo
- `app/pages/orcamentos/index.vue` — novo
- `tests/organisms/QuoteList.test.ts` — novo
- `tests/molecules/QuoteActions.test.ts` — novo
- `tests/molecules/ConfirmDialog.test.ts` — novo
