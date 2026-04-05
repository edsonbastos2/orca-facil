# Tarefa 6.0: Formulário de Orçamento

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar o formulário completo de criação e edição de orçamentos — a funcionalidade central do produto. Inclui seções de serviços, materiais, descontos, totais em tempo real, seleção de cliente e persistência via Supabase. Cobre RF07-RF19 do PRD.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Pages dinâmicas [id], useAsyncData, composables
- `vue-composition-api` — `<script setup lang="ts">`, refs, computed, watch
- `supabase` — CRUD com transações (orcamentos + orcamento_itens)
- `primevue` — DataTable, InputNumber, Dialog
- `atomic-design` — Molecules e organisms complexos
- `vue-best-practices` — Computed para cálculos reativos
</skills>

<requirements>
- QuoteForm com seções: dados básicos, serviços, materiais, descontos, observações
- QuoteItemRow para linhas editáveis de itens
- QuoteTotals com subtotais, desconto e total em tempo real
- useOrcamentos composable com criar, atualizar, buscarPorId
- Seleção de cliente existente via AppSelect
- Status inicial "Rascunho"
</requirements>

## Subtarefas

- [ ] 6.1 Criar `app/composables/useOrcamentos.ts` com funções: `buscarTodos()`, `buscarPorId(id)`, `criar(data)`, `atualizar(id, data)`, `excluir(id)`; operações em orcamentos + orcamento_itens
- [ ] 6.2 Criar `app/components/molecules/QuoteItemRow.vue` — linha editável com AppInput (descrição), InputNumber (quantidade), AppCurrency (valor unitário), botão remover; props: `item`, `tipo` (servico/material); emite `update` e `remove`
- [ ] 6.3 Criar `app/components/molecules/QuoteTotals.vue` — painel com subtotal serviços, subtotal materiais, desconto (tipo + valor), total geral; usa `useQuoteCalculations` e `useCurrency`
- [ ] 6.4 Criar `app/components/molecules/QuoteStatusBadge.vue` — wrapper de AppBadge com mapeamento de status: rascunho→gray, enviado→blue, aprovado→green, recusado→red, expirado→orange
- [ ] 6.5 Criar `app/components/organisms/QuoteForm.vue` — formulário completo com seções: título, cliente (AppSelect com busca), itens de serviço (lista de QuoteItemRow com botão "Adicionar serviço"), itens de materiais (idem), desconto (AppSelect tipo + AppCurrency valor), validade (AppDateInput), observações (AppTextarea)
- [ ] 6.6 Criar `app/pages/orcamentos/novo.vue` — página de criação com QuoteForm, CrudPageTemplate; ao salvar → status "Rascunho" → redirect para /orcamentos
- [ ] 6.7 Criar `app/pages/orcamentos/[id].vue` — página de edição, carrega dados com buscarPorId, preenche QuoteForm, ao salvar → redirect para /orcamentos
- [ ] 6.8 Criar botão "Adicionar serviço" e "Adicionar material" que insere linha vazia na lista de itens
- [ ] 6.9 Cálculos em tempo real: watch nos arrays de serviços/materiais e campos de desconto → recalcula QuoteTotals reativamente
- [ ] 6.10 Criar testes unitários para `useOrcamentos` (mock Supabase)
- [ ] 6.11 Criar testes unitários para `QuoteItemRow`, `QuoteTotals`, `QuoteForm`
- [ ] 6.12 Executar `yarn test:run` e `yarn typecheck`

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Interfaces Principais" contém `QuoteItem`, `Orcamento`, `CalculatedTotals`. Seção "Modelos de Dados" contém schema de `orcamentos` e `orcamento_itens`. A criação de orçamento envolve: INSERT em orcamentos → obter ID → INSERT em orcamento_itens (batch). Edição: UPDATE orcamentos → DELETE itens existentes → INSERT novos itens (ou diff inteligente).

## Critérios de Sucesso

- Formulário permite adicionar/remover itens de serviço e materiais
- Totais calculados em tempo real sem lag perceptível
- Criar orçamento gera número sequencial automático (ORC-0001)
- Status inicial é "Rascunho"
- Seleção de cliente funciona via dropdown
- Salvar redireciona para lista
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** useOrcamentos.criar insere orçamento e itens no banco
- [ ] **Unitário (Vitest):** useOrcamentos.atualizar modifica orçamento e itens
- [ ] **Unitário (Vitest):** useOrcamentos.buscarPorId retorna orçamento com itens
- [ ] **Unitário (Vitest):** QuoteItemRow emite update ao modificar campos
- [ ] **Unitário (Vitest):** QuoteItemRow emite remove ao clicar botão remover
- [ ] **Unitário (Vitest):** QuoteTotals calcula corretamente com serviços + materiais + desconto %
- [ ] **Unitário (Vitest):** QuoteTotals calcula corretamente com desconto fixo
- [ ] **Unitário (Vitest):** QuoteForm emite submit com payload completo

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/composables/useOrcamentos.ts` — novo
- `app/components/molecules/QuoteItemRow.vue` — novo
- `app/components/molecules/QuoteTotals.vue` — novo
- `app/components/molecules/QuoteStatusBadge.vue` — novo
- `app/components/organisms/QuoteForm.vue` — novo
- `app/pages/orcamentos/novo.vue` — novo
- `app/pages/orcamentos/[id].vue` — novo
- `tests/composables/useOrcamentos.test.ts` — novo
- `tests/molecules/QuoteItemRow.test.ts` — novo
- `tests/molecules/QuoteTotals.test.ts` — novo
- `tests/organisms/QuoteForm.test.ts` — novo
