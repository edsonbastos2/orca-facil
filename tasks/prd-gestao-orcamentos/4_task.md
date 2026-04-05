# Tarefa 4.0: Dashboard Layout e Navegação

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o layout de dashboard com sidebar de navegação e templates reutilizáveis para páginas CRUD e públicas. Este layout substitui o placeholder atual de dashboard e fornece a estrutura visual para todas as páginas internas do sistema.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Layouts, pages, definePageMeta, NuxtLayout
- `vue-composition-api` — `<script setup lang="ts">`
- `primevue` — Menu, Avatar, Breadcrumb
- `tailwindcss` — Layout responsivo com sidebar colapsável
- `atomic-design` — Organisms e templates
</skills>

<requirements>
- Layout dashboard.vue com sidebar fixa à esquerda e conteúdo principal à direita
- Sidebar com navegação: Orçamentos, Clientes
- DashboardTemplate com sidebar + slot de conteúdo
- CrudPageTemplate com título, breadcrumb e slot de conteúdo
- PublicPageTemplate sem sidebar, layout limpo para link público
</requirements>

## Subtarefas

- [ ] 4.1 Criar `app/layouts/dashboard.vue` — layout com sidebar à esquerda (256px) + conteúdo principal (flex-1), fundo cinza claro
- [ ] 4.2 Criar `app/components/organisms/DashboardSidebar.vue` — sidebar com logo "Orça Fácil", links: "Orçamentos" (/orcamentos), "Clientes" (/clientes), botão "Sair" (logout)
- [ ] 4.3 Criar `app/components/templates/DashboardTemplate.vue` — aplica layout dashboard, wrapper com padding e título opcional
- [ ] 4.4 Criar `app/components/templates/CrudPageTemplate.vue` — breadcrumb + título da página + descrição opcional + slot de conteúdo
- [ ] 4.5 Criar `app/components/templates/PublicPageTemplate.vue` — layout limpo, sem sidebar, fundo branco, centralizado
- [ ] 4.6 Atualizar `app/pages/dashboard.vue` — usar DashboardTemplate, mostrar resumo rápido (total de orçamentos, clientes) como placeholder
- [ ] 4.7 Atualizar `pages/index.vue` — redirecionar autenticados para `/dashboard` (já existente, ajustar se necessário)
- [ ] 4.8 Executar `yarn typecheck` e verificar sem erros

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Visão Geral dos Componentes" lista DashboardSidebar, DashboardTemplate, CrudPageTemplate, PublicPageTemplate. Usar `useAuthState().logout()` para botão de sair (já existente). Sidebar responsiva: escondida em mobile com toggle.

## Critérios de Sucesso

- Dashboard exibe sidebar com links de navegação funcionais
- Sidebar responsiva: colapsável em telas menores que 768px
- Templates renderizam conteúdo slotado corretamente
- Link "Sair" faz logout e redireciona para /login
- Página pública template sem elementos de navegação interna

## Testes da Tarefa

- [ ] **Unitário (Vitest):** DashboardSidebar renderiza links de Orçamentos e Clientes
- [ ] **Unitário (Vitest):** DashboardSidebar botão "Sair" chama logout
- [ ] **Unitário (Vitest):** CrudPageTemplate exibe título e breadcrumb

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/layouts/dashboard.vue` — novo
- `app/components/organisms/DashboardSidebar.vue` — novo
- `app/components/templates/DashboardTemplate.vue` — novo
- `app/components/templates/CrudPageTemplate.vue` — novo
- `app/components/templates/PublicPageTemplate.vue` — novo
- `app/pages/dashboard.vue` — modificado
