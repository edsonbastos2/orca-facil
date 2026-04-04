# Tech Spec — Configurações Iniciais e Tela de Login (Orça Fácil)

## Resumo Executivo

A abordagem técnica consiste em transformar o scaffolding mínimo do Nuxt 3 em uma base de produção completa para o micro SaaS Orça Fácil. Utilizaremos módulos oficiais do ecossistema Nuxt — `@nuxtjs/supabase` para autenticação e dados, `@primevue/nuxt-module` para componentes UI, `@nuxtjs/tailwindcss` para estilização. O gerenciamento de estado global será feito via `useState` nativo do Nuxt (ao invés de Pinia), evitando incompatibilidades com Nuxt 3 no hook SSR `app:rendered`. A tela de login seguirá um layout split screen com branding à esquerda e formulário à direita, utilizando componentes PrimeVue estilizados com Tailwind CSS. Telas de registro e recuperação de senha serão placeholders visuais nesta fase.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente                      | Responsabilidade                                                                    | Tipo       |
| ------------------------------- | ----------------------------------------------------------------------------------- | ---------- |
| `nuxt.config.ts`                | Configuração de módulos (Supabase, PrimeVue, Tailwind) e aliases                    | Modificado |
| `app/plugins/`                  | Plugins Nuxt (se necessário, além dos módulos)                                      | Novo       |
| `app/composables/useAuth.ts`    | Composable com `useState` para estado de auth (loading, error) + ações login/logout | Novo       |
| `app/middleware/auth.ts`        | Middleware de rota: protege áreas autenticadas, redireciona já-logados              | Novo       |
| `app/layouts/default.vue`       | Layout padrão para páginas internas                                                 | Novo       |
| `app/layouts/auth.vue`          | Layout split screen para telas de autenticação                                      | Novo       |
| `app/pages/index.vue`           | Redireciona para `/login` ou `/dashboard` conforme sessão                           | Novo       |
| `app/pages/login.vue`           | Tela de login funcional com Supabase Auth                                           | Novo       |
| `app/pages/register.vue`        | Placeholder visual para tela de registro                                            | Novo       |
| `app/pages/forgot-password.vue` | Placeholder visual para tela de recuperação de senha                                | Novo       |
| `app/pages/dashboard.vue`       | Placeholder de dashboard pós-login                                                  | Novo       |
| `app/components/atoms/`         | Componentes atômicos: `AppButton.vue`, `AppInput.vue`, `AppIcon.vue`                | Novo       |
| `app/components/molecules/`     | Componentes moleculares: `LoginForm.vue`, `AuthFooter.vue`                          | Novo       |
| `app/components/organisms/`     | Componentes complexos: `AuthSplitLayout.vue` (branding + form)                      | Novo       |
| `app/components/templates/`     | Templates de página: `AuthPageTemplate.vue`                                         | Novo       |
| `app/assets/css/main.css`       | Estilos globais + imports do Tailwind                                               | Novo       |
| `.env.example`                  | Template de variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)             | Novo       |
| `app/app.vue`                   | Componente raiz — removido NuxtWelcome, adicionado `<NuxtLayout>` + `<NuxtPage>`    | Modificado |

### Fluxo de Dados

```
usuário → / (index) → middleware verifica sessão
  ├─ sem sessão → /login (layout auth split screen)
  │   ├─ LoginForm submete → useAuthState().login(email, password)
  │   │   → useSupabaseClient().auth.signInWithPassword()
  │   │     ├─ sucesso → redirect /dashboard
  │   │     └─ erro → exibe mensagem no form
  │   └─ links → /register, /forgot-password (placeholders)
  └─ com sessão → /dashboard (placeholder)
```

## Design de Implementação

### Interfaces Principais

**Auth State (`useAuthState` com `useState` nativo do Nuxt):**

```ts
function useAuthState() {
  const isLoading = useState<boolean>("auth:loading", () => false);
  const error = useState<string | null>("auth:error", () => null);

  async function login(email: string, password: string): Promise<boolean>;
  async function logout(): Promise<void>;
  function clearError(): void;

  return { isLoading, error, login, logout, clearError };
}
```

O `useState('auth:loading', ...)` garante estado global compartilhado entre componentes, SSR-safe. `useSupabaseUser()` (do @nuxtjs/supabase) expõe o usuário logado diretamente.

**LoginForm Props/Emits:**

```ts
interface LoginFormProps {
  loading?: boolean;
  error?: string | null;
}

interface LoginFormEmits {
  (e: "submit", payload: { email: string; password: string }): void;
}
```

### Modelos de Dados

Nenhum modelo de banco de dados é necessário nesta fase — a autenticação é gerenciada inteiramente pelo Supabase Auth (tabelas internas `auth.users`).

### Endpoints de API

Nenhum endpoint customizado é necessário. Toda a comunicação com o backend é via `@nuxtjs/supabase` (cliente `supabase-js` direto ao Supabase).

## Pontos de Integração

### Supabase (BaaS)

- **Serviço:** Supabase Auth (email/senha)
- **Autenticação:** `SUPABASE_URL` + `SUPABASE_ANON_KEY` via variáveis de ambiente
- **Tratamento de erros:**
  - Credenciais inválidas → "E-mail ou senha inválidos"
  - Usuário não confirmado → "Verifique seu e-mail para ativar sua conta"
  - Erro de rede → "Erro de conexão. Tente novamente."
  - Nunca expor mensagens raw do Supabase ao usuário
- **Timeout:** Não configurado explicitamente; confiar no timeout padrão do `supabase-js` (~30s)
- **Idempotência:** Login é inerentemente idempotente; botão desabilitado durante loading previne submissões duplicadas

### Nenhuma integração externa adicional nesta fase

## Abordagem de Testes

### Testes de Unidade

| Componente                   | Estratégia                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `app/composables/useAuth.ts` | Mock do `useSupabaseClient` via Vitest; testar `login()` com credenciais válidas/inválidas, `logout()`, `clearError()` |
| `app/middleware/auth.ts`     | Mock de `useSupabaseUser` (autenticado vs null); verificar redirecionamentos                                           |

**Mock do Supabase:** Usar `vi.mock('@supabase/supabase-js')` ou `vi.mock('#imports')` para simular `useSupabaseClient` e `useSupabaseUser`.

### Testes de Integração

Nesta fase, testes de integração são mínimos pois não há endpoints customizados. O principal fluxo a testar é:

1. Preencher formulário → submeter → chamar `signInWithPassword` → verificar redirect
2. Credenciais inválidas → verificar mensagem de erro exibida

### Testes de E2E (Playwright)

| Cenário                       | Descrição                                                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `login-flow.spec.ts`          | Navegar para `/`, verificar redirect para `/login`, preencher form, clicar Entrar, verificar redirect para `/dashboard` |
| `login-error.spec.ts`         | Preencher com credenciais inválidas, verificar mensagem de erro                                                         |
| `auth-persistence.spec.ts`    | Fazer login, recarregar página, verificar que sessão persiste                                                           |
| `auth-guest-redirect.spec.ts` | Acessar `/dashboard` sem login, verificar redirect para `/login`                                                        |

**Nota:** Para E2E, criar um usuário de teste no Supabase (ou mockar o projeto Supabase com `SUPABASE_URL`/`SUPABASE_ANON_KEY` de um projeto sandbox).

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Dependências e configuração** — Instalar `@nuxtjs/supabase`, `@primevue/nuxt-module`, `@nuxtjs/tailwindcss`; configurar `nuxt.config.ts`; criar `.env.example` e `app/assets/css/main.css`. _Por que primeiro: bloqueia todo o resto._
2. **Estrutura de diretórios** — Criar `app/components/{atoms,molecules,organisms,templates}`, `app/layouts`, `app/middleware`, `app/composables`, `app/stores`, `app/pages`. _Depende de 1._
3. **App.vue e layouts** — Atualizar `app.vue` com `<NuxtLayout>` + `<NuxtPage>`; criar `layouts/auth.vue` (split screen) e `layouts/default.vue`. _Depende de 2._
4. **Auth composable** — Criar `composables/useAuth.ts` com `useState` para loading/error + ações de login/logout. _Depende de 1._
5. **Middleware de auth** — Criar `middleware/auth.ts` com verificação de sessão. _Depende de 4._
6. **Componentes atômicos e moleculares** — `AppButton`, `AppInput`, `LoginForm`, `AuthFooter`. _Depende de 2._
7. **Páginas** — `index.vue`, `login.vue`, `register.vue` (placeholder), `forgot-password.vue` (placeholder), `dashboard.vue` (placeholder). _Depende de 3, 5, 6._
8. **Testes** — Unitários (Vitest) + E2E (Playwright). _Depende de 7._

### Dependências Técnicas

- **Supabase project:** Usuário precisa ter um projeto Supabase criado para obter `SUPABASE_URL` e `SUPABASE_ANON_KEY`
- **Email confirmation:** Supabase requer email confirmation por padrão — o usuário deve desabilitar no dashboard do Supabase para MVP ou implementar fluxo de confirmação
- **Nenhuma dependência bloqueante de infraestrutura adicional**

## Monitoramento e Observabilidade

Para esta fase inicial do projeto:

- **Logs de desenvolvimento:** Usar `console.error` para erros de autenticação em dev; em produção, usar `console.error` com contexto (sem expor dados sensíveis)
- **Métricas:** Sem infra Prometheus/Grafana nesta fase inicial (micro SaaS em bootstrap)
- **Erro tracking futuro:** Considerar Sentry ou LogRocket quando o SaaS tiver usuários reais
- **DevTools:** Nuxt DevTools habilitado para inspeção de estado e rotas

## Considerações Técnicas

### Decisões Principais

| Decisão                                             | Justificativa                                                                                                                                                                                | Alternativas Rejeitadas                                                                                                                    |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **@nuxtjs/supabase em vez de cliente manual**       | Módulo oficial já inclui composables auto-importados, middleware de auth, persistência de sessão, suporte Nuxt 3. Economiza ~2 dias de desenvolvimento e evita erros de SSR/client mismatch. | Criar `useSupabase.ts` manual com `@supabase/supabase-js` — mais controle mas reinventa a roda                                             |
| **`useState` nativo do Nuxt para auth state**       | Zero dependências extras, SSR-safe por design, funciona nativamente no Nuxt 3. `useState` com chave única simula comportamento de store.                                                     | Usar Pinia (`@pinia/nuxt`) — incompatível com Nuxt 3 no hook `app:rendered` (erro `Cannot read properties of undefined (reading 'state')`) |
| **@primevue/nuxt-module**                           | Módulo oficial com auto-import de componentes, sem necessidade de registro manual                                                                                                            | Importar PrimeVue manualmente no plugin — mais configuração sem benefício                                                                  |
| **@nuxtjs/tailwindcss**                             | Módulo oficial, zero-config, funciona com Tailwind v4 e Vite do Nuxt 3                                                                                                                       | Configuração manual via postcss — mais propenso a erros                                                                                    |
| **Telas de registro/recuperação como placeholders** | PRD define escopo limitado a Config + Login; evita complexidade desnecessária nesta sprint                                                                                                   | Implementar completas — fora de escopo conforme PRD                                                                                        |
| **Split screen para login**                         | Decisão de UX do usuário; visual mais profissional e com espaço para branding                                                                                                                | Formulário centralizado simples — mais básico, menos impacto visual                                                                        |

### Riscos Conhecidos

| Risco                                             | Impacto                                   | Mitigação                                                                                                                                                                          |
| ------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **@nuxtjs/supabase incompatibilidade com Nuxt 3** | Bloqueia toda a autenticação              | Verificar compatibilidade antes de iniciar (módulo já declara suporte Nuxt 3). Se incompatível, fallback para cliente manual com `@supabase/supabase-js` + `process.client` guards |
| **Email confirmation do Supabase habilitado**     | Usuário não consegue logar após registrar | Instruir usuário a desabilitar "Confirm email" no dashboard do Supabase para desenvolvimento                                                                                       |
| **Tailwind v4 breaking changes**                  | Estilos não aplicam corretamente          | Tailwind v4 usa CSS-first configuration; seguir docs oficial para Nuxt 3                                                                                                           |
| **SSR hydration mismatch**                        | Erros no console durante SSR              | Usar `import.meta.client` / `process.client` guards para código browser-only; usar `ssr: false` no módulo Supabase se necessário                                                   |

### Conformidade com Skills Padrões

Skills aplicáveis a esta Tech Spec:

| Skill                 | Aplicação                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `nuxt`                | Configuração de módulos, auto-imports, middleware, layouts, `useState` para estado global |
| `vue-composition-api` | Todos os componentes usam `<script setup lang="ts">`                                      |
| `primevue`            | Componentes UI: Button, InputText, Message, Password, etc.                                |
| `tailwindcss`         | Estilização via classes utilitárias, customização do preset PrimeVue                      |
| `supabase`            | Integração com Auth, client singleton, session management                                 |
| `atomic-design`       | Estrutura de componentes em atoms/, molecules/, organisms/, templates/                    |
| `vue-best-practices`  | Composition API, props/emits tipados, SSR guards                                          |

### Arquivos Relevantes e Dependentes

| Arquivo                                         | Depende de                          |
| ----------------------------------------------- | ----------------------------------- |
| `nuxt.config.ts`                                | —                                   |
| `package.json`                                  | —                                   |
| `.env.example`                                  | —                                   |
| `app/assets/css/main.css`                       | Tailwind config                     |
| `app/app.vue`                                   | layouts, pages                      |
| `app/layouts/auth.vue`                          | Tailwind, componentes organisms     |
| `app/layouts/default.vue`                       | Tailwind                            |
| `app/middleware/auth.ts`                        | @nuxtjs/supabase                    |
| `app/composables/useAuth.ts`                    | @nuxtjs/supabase                    |
| `app/pages/index.vue`                           | middleware auth                     |
| `app/pages/login.vue`                           | layouts, LoginForm, auth composable |
| `app/pages/register.vue`                        | layouts auth                        |
| `app/pages/forgot-password.vue`                 | layouts auth                        |
| `app/pages/dashboard.vue`                       | layouts default, middleware auth    |
| `app/components/atoms/AppButton.vue`            | PrimeVue Button                     |
| `app/components/atoms/AppInput.vue`             | PrimeVue InputText/Password         |
| `app/components/molecules/LoginForm.vue`        | AppInput, AppButton, auth store     |
| `app/components/molecules/AuthFooter.vue`       | —                                   |
| `app/components/organisms/AuthSplitLayout.vue`  | branding panel, LoginForm           |
| `app/components/templates/AuthPageTemplate.vue` | —                                   |
