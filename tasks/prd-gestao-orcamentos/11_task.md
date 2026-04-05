# Tarefa 11.0: Middleware e Proteção de Rotas

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar middleware de proteção de rotas para garantir que apenas o dono de um orçamento possa editá-lo ou excluí-lo. Adicionar verificação de ownership nas server routes e garantir que links públicos funcionem sem autenticação. Complementa o middleware `auth.ts` existente.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Middleware de rota, defineNuxtRouteMiddleware
- `supabase` — Verificação de ownership via RLS
- `vue-best-practices` — SSR guards
</skills>

<requirements>
- Middleware orcamento-owner: verifica se usuário logado é dono do orçamento antes de permitir edição/exclusão
- Server route pública /api/orcamentos/public/[uuid] não requer auth (RF39)
- Redirect para /orcamentos se usuário não é dono
- Proteção contra acesso direto a URLs de edição de orçamentos de outros usuários
</requirements>

## Subtarefas

- [ ] 11.1 Criar `app/middleware/orcamento-owner.ts` — middleware que: recebe ID do orçamento da rota (`/orcamentos/[id]`), consulta `useSupabaseClient.from('orcamentos').select('usuario_id').eq('id', id).single()`, compara com `useSupabaseUser().id`; se diferente → redirect `/orcamentos` com toast de erro
- [ ] 11.2 Aplicar middleware às páginas `app/pages/orcamentos/[id].vue` via `definePageMeta({ middleware: ['auth', 'orcamento-owner'] })`
- [ ] 11.3 Proteger server route `server/api/orcamentos/[id]/snapshot.ts` — verificar auth antes de criar snapshot
- [ ] 11.4 Verificar que server route `server/api/orcamentos/public/[uuid].ts` NÃO requer autenticação (é pública por design)
- [ ] 11.5 Criar testes unitários para `middleware/orcamento-owner.ts` — mock user dono e não-dono
- [ ] 11.6 Criar testes unitários para server route de snapshot com e sem auth
- [ ] 11.7 Executar `yarn test:run` e `yarn typecheck`

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Pontos de Integração" descreve RLS e isolamento por usuário. O middleware complementa o `auth.ts` existente: `auth.ts` garante que o usuário está logado; `orcamento-owner.ts` garante que o usuário é dono do recurso.

## Critérios de Sucesso

- Usuário autenticado acessando seu próprio orçamento → acesso permitido
- Usuário autenticado acessando orçamento de outro → redirect para /orcamentos
- Link público funciona sem autenticação
- Server route de snapshot rejeita requests sem auth
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** middleware permite acesso quando usuario_id match
- [ ] **Unitário (Vitest):** middleware redireciona quando usuario_id não match
- [ ] **Unitário (Vitest):** middleware lida com orçamento inexistente (redirect)
- [ ] **Unitário (Vitest):** server route pública retorna dados sem auth
- [ ] **Unitário (Vitest):** server route de snapshot rejeita sem auth

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/middleware/orcamento-owner.ts` — novo
- `app/pages/orcamentos/[id].vue` — modificado (adiciona middleware)
- `tests/middleware/orcamento-owner.test.ts` — novo
- `tests/api/orcamentos-snapshot-auth.test.ts` — novo
