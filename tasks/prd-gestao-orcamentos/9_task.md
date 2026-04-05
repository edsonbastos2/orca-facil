# Tarefa 9.0: Link Público de Compartilhamento

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a funcionalidade de link público para compartilhamento de orçamentos. Cada orçamento recebe um UUID único que gera uma URL acessível sem autenticação. O cliente final visualiza o orçamento em uma página limpa e profissional. Cobre RF36-RF41 do PRD.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Server routes, pages públicas, defineEventHandler
- `supabase` — Queries sem autenticação, public_uuid
- `vue-composition-api` — `<script setup lang="ts">`, useFetch
</skills>

<requirements>
- Server route GET /api/orcamentos/public/[uuid] retorna dados do orçamento sem auth
- Página pública /public/orcamentos/[uuid] com PublicQuoteView
- Gerar UUID: botão na listagem e edição que gera e copia link
- Revogar UUID: botão para desativar link público
- Página pública sem sidebar, navegação ou elementos de edição
</requirements>

## Subtarefas

- [ ] 9.1 Criar `server/api/orcamentos/public/[uuid].ts` — server route GET que consulta orcamentos por public_uuid (sem auth), retorna dados completos com itens e cliente; retorna 404 se não encontrado ou public_uuid é null
- [ ] 9.2 Criar `app/composables/useOrcamentos.ts` — adicionar funções: `gerarPublicUuid(id)` (UPDATE orcamentos SET public_uuid = gen_random_uuid()), `revogarPublicUuid(id)` (UPDATE SET public_uuid = NULL), `buscarPublico(uuid)` (GET /api/orcamentos/public/[uuid])
- [ ] 9.3 Criar `app/components/organisms/PublicQuoteView.vue` — visualização completa do orçamento: cabeçalho com logo/nome Orça Fácil, dados do prestador, dados do cliente, tabela de serviços, tabela de materiais, totais, observações, rodapé; sem elementos de edição ou navegação interna
- [ ] 9.4 Criar `app/pages/public/orcamentos/[uuid].vue` — página pública com PublicPageTemplate + PublicQuoteView; usa `useFetch('/api/orcamentos/public/' + uuid)`; exibe erro 404 se orçamento não encontrado
- [ ] 9.5 Adicionar botão "Copiar link" na listagem (QuoteActions) — gera UUID se não existir, copia URL para clipboard, toast de confirmação
- [ ] 9.6 Adicionar botão "Revogar link" na edição de orçamento — seta public_uuid = NULL, confirma revogação
- [ ] 9.7 Implementar cópia para clipboard com `navigator.clipboard.writeText()` (com `import.meta.client` guard)
- [ ] 9.8 Criar testes unitários para server route pública (mock Supabase)
- [ ] 9.9 Criar testes unitários para `PublicQuoteView`
- [ ] 9.10 Executar `yarn test:run` e `yarn typecheck`

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Pontos de Integração" descreve dados públicos. A server route `/api/orcamentos/public/[uuid]` usa `useSupabaseClient` diretamente (sem middleware auth) para buscar por `public_uuid`. O layout público é limpo, responsivo, sem sidebar.

## Critérios de Sucesso

- Gerar UUID para orçamento cria link único acessível
- Link público exibe orçamento completo sem autenticação
- Página pública é responsiva e profissional
- Revogar link torna URL inacessível (404)
- Copiar link copia URL completa para clipboard
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** Server route retorna orçamento quando public_uuid existe
- [ ] **Unitário (Vitest):** Server route retorna 404 quando public_uuid não existe
- [ ] **Unitário (Vitest):** useOrcamentos.gerarPublicUuid atualiza public_uuid no banco
- [ ] **Unitário (Vitest):** useOrcamentos.revogarPublicUuid seta public_uuid = NULL
- [ ] **Unitário (Vitest):** PublicQuoteView renderiza orçamento completo sem elementos de edição
- [ ] **E2E (Playwright):** Gerar link, acessar em aba anônima, visualizar orçamento

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `server/api/orcamentos/public/[uuid].ts` — novo
- `app/composables/useOrcamentos.ts` — modificado (gerarPublicUuid, revogarPublicUuid, buscarPublico)
- `app/components/organisms/PublicQuoteView.vue` — novo
- `app/pages/public/orcamentos/[uuid].vue` — novo
- `tests/api/orcamentos-public.test.ts` — novo
- `tests/organisms/PublicQuoteView.test.ts` — novo
