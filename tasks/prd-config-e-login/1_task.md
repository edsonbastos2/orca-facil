# Tarefa 1.0: Setup de dependências e configuração do projeto

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Instalar todas as dependências necessárias para o projeto e configurar o `nuxt.config.ts` com os módulos oficiais. Criar o arquivo `.env.example` e o CSS global com imports do Tailwind. Esta é a tarefa fundacional — todo o resto depende dela.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Configuração de módulos Nuxt 3, auto-imports, nuxt.config.ts
- `tailwindcss` — Configuração do Tailwind CSS v4 com módulo oficial @nuxtjs/tailwindcss
- `primevue` — Configuração do PrimeVue 4 via @primevue/nuxt-module
- `pinia` — Configuração do Pinia via @pinia/nuxt
- `supabase` — Configuração do módulo @nuxtjs/supabase
  </skills>

<requirements>
- RF01: Nuxt 3 com TypeScript habilitado (já existente)
- RF02: PrimeVue 4 como biblioteca de componentes UI
- RF03: Tailwind CSS v4 para estilização
- RF04: Pinia para gerenciamento de estado global
- RF05: @supabase/supabase-js via módulo @nuxtjs/supabase
- RF07: Variáveis de ambiente configuradas via .env
</requirements>

## Subtarefas

- [ ] 1.1 Instalar dependências via yarn: `@nuxtjs/supabase`, `@primevue/nuxt-module`, `@nuxtjs/tailwindcss`, `@pinia/nuxt`
- [ ] 1.2 Configurar `nuxt.config.ts` adicionando os 4 módulos na seção `modules`
- [ ] 1.3 Criar `.env.example` com variáveis `SUPABASE_URL=` e `SUPABASE_ANON_KEY=`
- [ ] 1.4 Criar `app/assets/css/main.css` com imports do Tailwind CSS v4
- [ ] 1.5 Executar `yarn dev` e verificar que o projeto inicia sem erros

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Sequenciamento de Desenvolvimento" (etapa 1) e "Decisões Principais". Os módulos devem ser adicionados na ordem: Supabase, PrimeVue, Tailwind, Pinia. Referir à documentação oficial de cada módulo para configuração específica no `nuxt.config.ts`.

## Critérios de Sucesso

- `yarn dev` inicia sem erros de console
- `nuxt.config.ts` contém os 4 módulos configurados
- `.env.example` existe com as duas variáveis do Supabase
- `app/assets/css/main.css` existe com imports do Tailwind

## Testes da Tarefa

- [ ] Verificar que `yarn dev` sobe o servidor de desenvolvimento na porta 3000
- [ ] Verificar que `nuxt.config.ts` contém todos os 4 módulos no array `modules`
- [ ] Verificar que `.env.example` contém `SUPABASE_URL` e `SUPABASE_ANON_KEY`
- [ ] Verificar que `app/assets/css/main.css` contém `@import "tailwindcss"`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `package.json` — novas dependências
- `nuxt.config.ts` — configuração dos módulos
- `.env.example` — template de variáveis de ambiente
- `app/assets/css/main.css` — estilos globais com Tailwind
- `yarn.lock` — atualizado após instalação
