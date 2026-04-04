# Tarefa 4.0: Middleware de autenticação

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o middleware de autenticação (`middleware/auth.ts`) que protege rotas internas, redirecionando usuários não autenticados para `/login` e usuários já autenticados que tentam acessar `/login` de volta para `/dashboard`.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Middleware de rota (app/middleware), defineNuxtRouteMiddleware, auto-imports
- `supabase` — `useSupabaseUser` para verificar estado de autenticação
- `vue-composition-api` — Composables dentro do middleware
- `vue-best-practices` — SSR-safe route middleware
  </skills>

<requirements>
- RF18: Middleware auth redireciona não autenticados para /login
- RF19: Usuários autenticados que acessam /login são redirecionados para /dashboard
- RF20: Middleware verifica sessão via Supabase Auth
</requirements>

## Subtarefas

- [ ] 4.1 Criar `app/middleware/auth.ts` usando `defineNuxtRouteMiddleware`
- [ ] 4.2 Implementar verificação: se `!useSupabaseUser()` e rota não é `/login`, `/register` ou `/forgot-password` → `navigateTo('/login')`
- [ ] 4.3 Implementar verificação: se `useSupabaseUser()` e rota é `/login` → `navigateTo('/dashboard')`
- [ ] 4.4 Testar middleware acessando rotas protegidas sem login (deve redirecionar)
- [ ] 4.5 Executar `yarn typecheck` para verificar tipagem

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Visão Geral dos Componentes" (middleware) e "Fluxo de Dados". O middleware usa `useSupabaseUser()` (auto-import do @nuxtjs/supabase) para verificar sessão. Rotas públicas de auth (`/login`, `/register`, `/forgot-password`) não devem ser protegidas. Usar `navigateTo()` com `redirectCode` apropriado. Cuidado com SSR: o middleware roda no client e server — usar guards se necessário.

## Critérios de Sucesso

- Usuário não logado acessando `/dashboard` é redirecionado para `/login`
- Usuário logado acessando `/login` é redirecionado para `/dashboard`
- Rotas `/login`, `/register`, `/forgot-password` são acessíveis sem autenticação
- `yarn typecheck` passa sem erros
- Nenhum erro de hydration mismatch no console

## Testes da Tarefa

- [ ] **Unitário:** Mock `useSupabaseUser` retornando `null` → verificar que middleware redireciona para `/login`
- [ ] **Unitário:** Mock `useSupabaseUser` retornando objeto de usuário → verificar que middleware redireciona `/login` para `/dashboard`
- [ ] **Unitário:** Mock `useSupabaseUser` retornando `null` em rota `/login` → verificar que NÃO redireciona (rota pública)
- [ ] **Integração:** Acessar `/dashboard` sem login no browser → verificar redirect para `/login`
- [ ] **Integração:** Fazer login → acessar `/login` manualmente → verificar redirect para `/dashboard`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/middleware/auth.ts` — novo (middleware de proteção de rotas)
- `app/pages/index.vue` — pode usar o middleware (task 2.0)
- `app/pages/dashboard.vue` — deve usar o middleware (task 7.0)
- `app/composables/useAuth.ts` — complementar (task 3.0)
