# Tarefa 2.0: Estrutura de diretórios e App Shell

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar toda a estrutura de diretórios do projeto seguindo o padrão Atomic Design e atualizar o `app.vue` para usar `<NuxtLayout>` e `<NuxtPage>` ao invés do `NuxtWelcome` padrão. Esta tarefa estabelece o esqueleto sobre o qual todos os componentes e páginas serão construídos.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Directory structure (app/components, app/layouts, app/pages, app/middleware, app/composables, app/stores), auto-imports
- `atomic-design` — Estrutura rigorosa em atoms/, molecules/, organisms/, templates/
- `vue-composition-api` — `<script setup lang="ts">` em todos os componentes Vue
- `vue-best-practices` — Convenções de nomenclatura PascalCase, SSR considerations
</skills>

<requirements>
- RF06: Estrutura de diretórios seguindo Atomic Design (atoms, molecules, organisms, templates)
- App.vue deve usar NuxtLayout e NuxtPage
- Nomes de arquivos em PascalCase.vue
</requirements>

## Subtarefas

- [ ] 2.1 Criar diretórios: `app/components/{atoms,molecules,organisms,templates}`, `app/layouts`, `app/pages`, `app/middleware`, `app/composables`, `app/stores`
- [ ] 2.2 Atualizar `app/app.vue`: remover `NuxtWelcome`, adicionar `<NuxtLayout><NuxtPage /></NuxtLayout>`
- [ ] 2.3 Criar `app/pages/index.vue` — redireciona para `/login` ou `/dashboard` conforme sessão
- [ ] 2.4 Criar `app/layouts/default.vue` — layout padrão mínimo com `<slot />`
- [ ] 2.5 Criar `app/layouts/auth.vue` — layout mínimo com `<slot />` (será estilizado na tarefa 5.0)
- [ ] 2.6 Executar `yarn dev` e verificar que as rotas `/` funcionam sem erros

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Visão Geral dos Componentes" e "Fluxo de Dados". O `index.vue` deve usar `useSupabaseUser` (auto-import do @nuxtjs/supabase) para verificar sessão e redirecionar via `navigateTo()`. Layouts devem conter ao mínimo `<slot />`. Verificar que o Nuxt auto-importa componentes das subpastas de `app/components/`.

## Critérios de Sucesso

- Todos os diretórios existem conforme estrutura definida
- `app.vue` não referencia `NuxtWelcome`
- Acessar `/` não exibe a tela de boas-vindas do Nuxt
- `yarn dev` não exibe erros de rotas ou componentes faltando
- Componentes em `app/components/` são auto-importados corretamente

## Testes da Tarefa

- [ ] Verificar que diretórios existem na estrutura correta
- [ ] Verificar que `app.vue` contém `<NuxtLayout>` e `<NuxtPage>`
- [ ] Verificar que `pages/index.vue` faz redirecionamento condicional baseado em `useSupabaseUser()`
- [ ] Verificar que layouts existem e contêm `<slot />`
- [ ] Acessar `/` no browser e verificar que não há erro 500

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/app.vue` — modificado (root component)
- `app/pages/index.vue` — novo (redirect lógico)
- `app/layouts/default.vue` — novo
- `app/layouts/auth.vue` — novo
- `app/components/atoms/` — novo (diretório vazio)
- `app/components/molecules/` — novo (diretório vazio)
- `app/components/organisms/` — novo (diretório vazio)
- `app/components/templates/` — novo (diretório vazio)
