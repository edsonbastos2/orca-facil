# Tarefa 10.0: Versionamento de Orçamentos

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a funcionalidade de versionamento e duplicação de orçamentos. Permite duplicar orçamentos existentes como novos e manter histórico de versões (snapshots JSONB) com possibilidade de restaurar versões anteriores. Cobre RF27-RF30 do PRD.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Pages, composables, server routes
- `supabase` — Transações, JSONB, RPC
- `vue-composition-api` — `<script setup lang="ts">`
- `primevue` — Dialog, Timeline (para histórico de versões)
</skills>

<requirements>
- Duplicar orçamento: copia todos os dados, novo número sequencial, status "Rascunho"
- Criar snapshot de versão ao salvar alterações significativas
- Listar versões anteriores de um orçamento
- Restaurar versão anterior (sobrescreve dados atuais)
- Máximo 10 versões por orçamento
</requirements>

## Subtarefas

- [ ] 10.1 Estender `app/composables/useOrcamentos.ts` — adicionar `duplicar(id)`: busca orçamento completo com itens → INSERT novo orçamento com mesmo cliente, título ("Cópia de ..."), itens → retorna novo ID; status "Rascunho", novo número sequencial
- [ ] 10.2 Criar função `criarSnapshot(id)` — salva snapshot JSONB completo do orçamento (dados + itens) em orcamento_version; incrementa versao automaticamente (MAX(versao) + 1)
- [ ] 10.3 Criar função `listarVersoes(id)` — retorna lista de versões ordenadas por versao DESC
- [ ] 10.4 Criar função `restaurarVersao(snapshotId)` — lê snapshot JSONB → atualiza orcamento e substitui itens
- [ ] 10.5 Adicionar chamada automática a `criarSnapshot()` ao salvar edição de orçamento (após atualizar)
- [ ] 10.6 Criar `app/components/molecules/QuoteVersionHistory.vue` — lista de versões com PrimeVue Timeline ou lista simples: versão (v1, v2...), data de criação, botão "Restaurar"
- [ ] 10.7 Criar `server/api/orcamentos/[id]/snapshot.ts` — server route POST para criar snapshot via RPC (mais seguro para transações)
- [ ] 10.8 Adicionar botão "Histórico de Versões" na página de edição → abre Dialog com QuoteVersionHistory
- [ ] 10.9 Limitar snapshots a 10 versões: ao criar 11ª, deletar versão mais antiga
- [ ] 10.10 Criar testes unitários para duplicação, snapshot e restauração
- [ ] 10.11 Executar `yarn test:run` e `yarn typecheck`

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Modelos de Dados" contém schema de `orcamento_version` (JSONB snapshot). O snapshot deve incluir: título, cliente_id, status, desconto_tipo, desconto_valor, validade, observacoes, e array de itens (tipo, descricao, quantidade, valor_unitario). Duplicação é feita em transação: INSERT orcamento → INSERT itens.

## Critérios de Sucesso

- Duplicar orçamento cria cópia completa com novo número sequencial
- Snapshot é criado automaticamente ao salvar edição
- Lista de versões mostra v1, v2, v3... com datas
- Restaurar versão anterior substitui dados atuais corretamente
- Limite de 10 versões é respeitado
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** useOrcamentos.duplicar cria novo orçamento com mesmos itens e novo número
- [ ] **Unitário (Vitest):** useOrcamentos.duplicar retorna novo ID com status "Rascunho"
- [ ] **Unitário (Vitest):** criarSnapshot salva JSONB correto na tabela orcamento_version
- [ ] **Unitário (Vitest):** listarVersoes retorna versões em ordem decrescente
- [ ] **Unitário (Vitest):** restaurarVersao substitui dados do orçamento com dados do snapshot
- [ ] **Integração (Vitest):** fluxo completo: criar → editar → snapshot → editar → restaurar v1

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/composables/useOrcamentos.ts` — modificado (duplicar, snapshots, restauração)
- `app/components/molecules/QuoteVersionHistory.vue` — novo
- `server/api/orcamentos/[id]/snapshot.ts` — novo
- `tests/composables/useOrcamentos-versionamento.test.ts` — novo
- `tests/molecules/QuoteVersionHistory.test.ts` — novo
