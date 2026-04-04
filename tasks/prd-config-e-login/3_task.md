# Tarefa 3.0: Auth State composable (useState nativo do Nuxt)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o composable `app/composables/useAuth.ts` que encapsula o estado de autenticação (loading, error) e as ações de login, logout e limpeza de erro, utilizando `useState` nativo do Nuxt e `useSupabaseClient` do módulo @nuxtjs/supabase. O `useState` com chaves únicas (`'auth:loading'`, `'auth:error'`) garante estado global compartilhado e SSR-safe.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — `useState`, auto-imports, SSR-safe state management
- `supabase` — `useSupabaseClient`, `signInWithPassword`, `signOut`, session management
- `vue-composition-api` — Composables com `<script setup lang="ts">`
- `state-management` — Padrão de estado global com `useState` do Nuxt
  </skills>

<requirements>
- RF21: Estado global de auth com loading e error (via useState)
- RF22: Função login(email, password) que chama Supabase Auth
- RF23: Função logout() que encerra a sessão
- RF24: Persistência de sessão entre recarregamentos (gerenciada pelo @nuxtjs/supabase)
</requirements>

## Subtarefas

- [ ] 3.1 Criar `app/composables/useAuth.ts` exportando `useAuthState()` com `useState<boolean>('auth:loading', () => false)` e `useState<string | null>('auth:error', () => null)`
- [ ] 3.2 Implementar `login(email, password)` — chama `useSupabaseClient().auth.signInWithPassword()`, atualiza loading/error, retorna boolean
- [ ] 3.3 Implementar `logout()` — chama `useSupabaseClient().auth.signOut()`, reseta estado
- [ ] 3.4 Implementar `clearError()` — limpa `error`
- [ ] 3.5 Executar `yarn typecheck` para verificar tipagem

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Interfaces Principais" (Auth State com useState). Mapear erros do Supabase para mensagens amigáveis em português: `AuthApiError` / invalid credentials → "E-mail ou senha inválidos"; erro genérico → "Erro de conexão. Tente novamente." A sessão é persistente automaticamente pelo @nuxtjs/supabase. `useSupabaseUser()` (auto-import) expõe o usuário logado diretamente.

## Critérios de Sucesso

- `useAuthState()` retorna `{ isLoading, error, login, logout, clearError }` tipados corretamente
- `login()` retorna `true` em sucesso, `false` em erro, e seta mensagem de erro legível
- `logout()` encerra sessão e reseta estado
- `yarn typecheck` passa sem erros
- Composable é auto-importado em componentes Vue

## Testes da Tarefa

- [ ] **Unitário:** Mock de `useSupabaseClient` — testar `login()` com credenciais válidas → retorna `true`, `isLoading` volta ao normal
- [ ] **Unitário:** Mock de `useSupabaseClient` — testar `login()` com credenciais inválidas → retorna `false`, `error` contém mensagem amigável
- [ ] **Unitário:** Testar `logout()` → verificar que `signOut` foi chamado e estado resetado
- [ ] **Unitário:** Testar `clearError()` → verificar que `error` é limpo
- [ ] **Integração:** Chamar `login()` de um componente e verificar que o estado atualiza reativamente

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/composables/useAuth.ts` — novo (auth state composable com useState)
- `app/pages/login.vue` — consome o composable (tarefa 6.0)
- `app/middleware/auth.ts` — depende da sessão do Supabase (tarefa 4.0)
