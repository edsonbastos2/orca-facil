# Tarefa 7.0: Dashboard placeholder e testes E2E

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a página placeholder de dashboard (`pages/dashboard.vue`) que serve como destino pós-login, e escrever a suíte completa de testes: unitários para o auth composable e middleware, e testes E2E com Playwright cobrindo os fluxos críticos de login, erro, persistência de sessão e redirect de não-autenticado.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Pages, middleware de rota, definePageMeta, useState
- `vue-testing-library` — Testes unitários de componentes e composables com Vitest
- `playwright` — Testes E2E de fluxos completos no browser
- `supabase` — Verificação de persistência de sessão
  </skills>

<requirements>
- Dashboard placeholder deve ser acessível apenas para usuários autenticados
- Testes unitários cobrindo auth composable (login, logout, clearError)
- Testes unitários cobrindo middleware auth
- Testes E2E cobrindo fluxos principais de autenticação
</requirements>

## Subtarefas

- [ ] 7.1 Criar `app/pages/dashboard.vue` com placeholder "Dashboard — Em breve", nome do usuário logado (se disponível), e botão de logout
- [ ] 7.2 Adicionar middleware auth ao dashboard via `definePageMeta({ middleware: 'auth' })`
- [ ] 7.3 Implementar botão de logout no dashboard que chama `useAuthState().logout()` e redireciona para `/login`
- [ ] 7.4 Configurar Vitest para testes unitários (se ainda não configurado): instalar `@nuxt/test-utils`, `@testing-library/vue`, `vitest`, `happy-dom`
- [ ] 7.5 Criar testes unitários para `composables/useAuth.ts` — login sucesso, login erro, logout, clearError
- [ ] 7.6 Criar testes unitários para `middleware/auth.ts` — redirect não-autenticado, redirect já-logado
- [ ] 7.7 Configurar Playwright para testes E2E (se ainda não configurado): `yarn create playwright`
- [ ] 7.8 Criar `e2e/login-flow.spec.ts` — navega para `/`, verifica redirect `/login`, preenche form, verifica redirect `/dashboard`
- [ ] 7.9 Criar `e2e/login-error.spec.ts` — preenche credenciais inválidas, verifica mensagem de erro
- [ ] 7.10 Criar `e2e/auth-persistence.spec.ts` — faz login, recarrega página, verifica sessão persiste
- [ ] 7.11 Criar `e2e/auth-guest-redirect.spec.ts` — acessa `/dashboard` sem login, verifica redirect `/login`
- [ ] 7.12 Executar `yarn test` (Vitest) e verificar todos os testes unitários passando
- [ ] 7.13 Executar `yarn test:e2e` (Playwright) e verificar todos os testes E2E passando

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Abordagem de Testes" (Unit, Integração, E2E). O dashboard placeholder deve exibir "Olá, [email do usuário]!" usando `useSupabaseUser()`. Mock do Supabase nos testes unitários: usar `vi.mock('#imports')` para `useSupabaseClient` e `useSupabaseUser`. Para E2E, criar um usuário de teste no Supabase ou usar credenciais de um projeto sandbox.

## Critérios de Sucesso

- Dashboard placeholder exibe mensagem "Em breve" e informações do usuário
- Botão de logout funciona e redireciona para `/login`
- Todos os testes unitários passam (`yarn test`)
- Todos os testes E2E passam (`yarn test:e2e`)
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** `composables/useAuth.ts` — login com credenciais válidas retorna true
- [ ] **Unitário (Vitest):** `composables/useAuth.ts` — login com credenciais inválidas retorna false com erro amigável
- [ ] **Unitário (Vitest):** `composables/useAuth.ts` — logout chama signOut e reseta estado
- [ ] **Unitário (Vitest):** `composables/useAuth.ts` — clearError limpa mensagem de erro
- [ ] **Unitário (Vitest):** `middleware/auth.ts` — redireciona não-autenticado para /login
- [ ] **Unitário (Vitest):** `middleware/auth.ts` — redireciona autenticado de /login para /dashboard
- [ ] **E2E (Playwright):** `login-flow.spec.ts` — fluxo completo de login bem-sucedido
- [ ] **E2E (Playwright):** `login-error.spec.ts` — credenciais inválidas exibem erro
- [ ] **E2E (Playwright):** `auth-persistence.spec.ts` — sessão persiste após reload
- [ ] **E2E (Playwright):** `auth-guest-redirect.spec.ts` — guest acessando dashboard é redirecionado

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/pages/dashboard.vue` — novo (placeholder de dashboard)
- `vitest.config.ts` — novo ou modificado (config de testes unitários)
- `tests/composables/useAuth.test.ts` — novo (testes do auth composable)
- `tests/middleware/auth.test.ts` — novo (testes do middleware)
- `e2e/login-flow.spec.ts` — novo
- `e2e/login-error.spec.ts` — novo
- `e2e/auth-persistence.spec.ts` — novo
- `e2e/auth-guest-redirect.spec.ts` — novo
- `playwright.config.ts` — novo ou modificado
- `package.json` — scripts de teste
