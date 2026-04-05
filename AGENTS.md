# AGENTS.md

Guia para agentes de IA ao trabalhar com o código deste repositório.

Este projeto é uma **aplicação frontend com Nuxt 3** que consome um **BaaS (Supabase)**. Não há backend customizado; toda a lógica de servidor, autenticação e banco de dados é gerenciada pelo Supabase.

### Visão Geral do sistema

O OrçaFácil é um **Micro SaaS** web voltado para **prestadores de serviços autônomos e pequenas empresas** (ex: eletricistas, designers, consultores, mecânicos, fotógrafos) que atualmente criam orçamentos de forma manual (Word, Excel, mensagens de WhatsApp). A solução resolve a lentidão, a inconsistência visual e a falta de profissionalismo na apresentação de propostas, oferecendo um gerador rápido, personalizável e rastreável. Ao permitir que o prestador crie, envie e acompanhe orçamentos em menos de 5 minutos, o produto aumenta a taxa de conversão de vendas, reduz retrabalho administrativo e projeta credibilidade imediata. O valor principal está na simplicidade de uso, no foco no fluxo de "criar → enviar → fechar" e na acessibilidade via navegador sendo um **PWA** podendo ser acessado em qualquer dispositivo.

### Prioridades

- **Sempre ative as skills relevantes** antes de implementar (`nuxt`, `vue-composition`, `primevue`, `tailwindcss`, `pinia`, `supabase`, `atomic-design`)
- **Siga rigorosamente o Atomic Design** dentro de `app/components/`
- **Execute os checks** antes de concluir: `yarn lint`, `yarn typecheck`
- **Não use workarounds** — prefira correções de causa raiz e siga os padrões oficiais do Nuxt/Vue
- **Use `yarn add <pacote>`** para adicionar dependências (nunca edite `package.json` manualmente sem conferir a versão)
- **Sempre use `yarn`** como package manager — nunca use `npm`, `pnpm` ou `bun`

### Comandos do projeto

```bash
# Raiz do projeto
yarn dev              # Servidor de desenvolvimento (Nuxt + HMR)
yarn test             # Testes unitários (Vitest)
yarn test:watch       # Testes em modo watch
yarn test:e2e         # Testes E2E (Playwright)
yarn test:e2e:ui      # Testes E2E com UI do Playwright

- O frontend roda na porta padrão `localhost:3000` (configurável em nuxt.config.ts)

### Stack e skills recomendadas

| Área              | Tecnologia                               | Skill sugerida                                               |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------ |
| Framework         | Nuxt 3, Vue 3, `<script setup>`          | `nuxt`, `vue-composition-api`, `vue-best-practices`          |
| UI / Componentes  | PrimeVue 4, Tailwind CSS v4              | `primevue`, `tailwindcss`, `frontend-design`                 |
| Estado            | Pinia `(@pinia/nuxt)`                    | `pinia`, `state-management`                                  |
| Backend / Dados   | Supabase (BaaS), `@supabase/supabase-js` |  `supabase`, `postgresql`, `edge-function`                   |
| Testes            | Vitest (unit), Playwright                | `vue-testing-library`, `playwright`                          |
| Arquitetura       | Atomic Design                            | `atomic-design`, `component-architecture`                    |

### Estrutura do projeto

/
├── package.json           # Scripts e dependências
├── yarn.lock              # Lockfile do yarn
├── .yarnrc.yml            # (Opcional) Config do Yarn Berry
├── nuxt.config.ts         # Config Nuxt 3 (módulos, aliases, SSR, PrimeVue)
├── tsconfig.json          # TS config com extends: "./.nuxt/tsconfig.json"
├── tailwind.config.ts     # (Opcional se usar Tailwind v4 com CSS-first)
├── .env                   # Variáveis do Supabase (VITE_SUPABASE_*)
├── .env.example           # Template de variáveis
├── app/                   # Diretório padrão do Nuxt 3
│   ├── assets/
│   │   └── css/           # Global styles + Tailwind imports
│   ├── components/        # ATOMIC DESIGN (obrigatório)
│   │   ├── atoms/         # Elementos indivisíveis (Button, Input, Icon, Badge)
│   │   ├── molecules/     # Combinações simples (SearchBar, FormField, CardHeader)
│   │   ├── organisms/     # Seções complexas (Header, Sidebar, ProductList, AuthForm)
│   │   ├── templates/     # Estruturas de layout (DashboardTemplate, AuthTemplate)
│   │   └── wrappers/      # (Opcional) Wrappers contextuais ou providers
│   ├── composables/       # Lógica reutilizável (useSupabase, useAuth, useApi)
│   ├── layouts/           # Layouts globais do Nuxt (default.vue, auth.vue)
│   ├── middleware/        # Middleware de rota (auth.ts, role.ts)
│   ├── pages/             # Rotas baseadas em arquivo
│   ├── plugins/           # Registro de libs (primevue.ts, pinia.ts, supabase.ts)
│   ├── public/            # Assets estáticos servidos diretamente
│   ├── stores/            # Stores Pinia (auto-imported)
│   └── app.vue            # Componente raiz
├── server/                # (Opcional) Edge functions / proxy Supabase
│   └── api/               # Endpoints Nuxt (ex: /api/supabase-proxy)
├── e2e/
│   └── app.spec.ts        # Testes E2E (Playwright)
└── vitest.config.ts       # Config Vitest integrado ao Nuxt

### Regras de componentes Vue/Nuxt

1. **Composition API obrigatória** — use sempre <script setup lang="ts">
2. **Props e Emits tipados** — use defineProps<{ ... }>() e defineEmits<{ ... }>()
3. **Atomic Design rigoroso** — cada componente deve residir na pasta correta (atoms/, molecules/, etc.)
4. **Nomes** — arquivos em **PascalCase.vue**
5. **SSR & Async** — use useFetch, useAsyncData ou onMounted corretamente; evite window/document direto sem guards (process.client ou import.meta.client)
6. **Preferir PrimeVue + Tailwind** — use os componentes do PrimeVue e estilize com o preset Tailwind; evite CSS customizado pesado
Gerenciamento de estado — use Pinia para estado global; ref/reactive para estado local de componente

### Testes

- **Unit tests**: Vitest com @testing-library/vue
- **E2E**: Playwright (Chromium, Firefox, WebKit) — testes em e2e/
- **Configurações nativas**: Nuxt já integra Vitest; rode da raiz com yarn test ou yarn test:e2e
- **Mock do Supabase**: use @supabase/supabase-js mocks ou vitest-mock-extended para evitar chamadas reais em testes unitários

### Supabase & Dados

- **Cliente** único: Instancie o cliente Supabase em composables/useSupabase.ts e reutilize via auto-import ou plugin
- **Auth**: Use useSupabaseUser() e useSupabaseSession() (ou wrappers próprios)
- **RLS:** Confie no Row Level Security do Supabase; não implemente auth manual no frontend
- **Tipagem:** Gere tipos automáticos com supabase gen types typescript --project-id <ID> e mantenha em types/database.ts

### Git
- **Não execute** `git restore`, `git reset`, `git clean` ou comandos destrutivos sem permissão explícita do usuário

## Anti-padrões
1. Pular ativação de skill ou usar apenas uma quando o código toca vários domínios
2. Usar Options API ou this em componentes Nuxt/Vue 3
3. Ignorar a estrutura Atomic Design e colocar componentes fora de suas pastas designadas
4. Criar lógica de backend customizada quando o Supabase já resolve via BaaS/Edge Functions
5. Esquecer verificação de tipos e lint antes de marcar tarefa concluída
6. Executar comandos git destrutivos sem permissão do usuário
7. Usar npm, pnpm ou bun em vez de yarn
8. Manipular DOM ou localStorage diretamente sem SSR guards (process.client ou import.meta.client)
```
