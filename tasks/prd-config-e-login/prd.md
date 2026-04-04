# PRD — Configurações Iniciais e Tela de Login (Orça Fácil)

## Visão Geral

O **Orça Fácil** é um micro SaaS voltado a prestadores de serviço autônomos (encanadores, eletricistas, designers freelancers etc.) que precisam criar e gerenciar orçamentos de forma rápida e profissional.

Este PRD cobre a **fase inicial do projeto**: a configuração da stack de desenvolvimento (Nuxt 3, Supabase, PrimeVue, Tailwind CSS, Pinia) e a **tela de login** que permitirá ao usuário acessar sua conta de forma segura via Supabase Auth.

Essa base é o alicerce sobre o qual todas as funcionalidades futuras (CRUD de orçamentos, clientes e catálogo de serviços) serão construídas.

## Objetivos

- **Setup completo** do projeto Nuxt 3 com todas as dependências necessárias funcionando
- **Autenticação funcional** via Supabase Auth (login com e-mail/senha)
- **Estrutura de diretórios** seguindo Atomic Design para componentes
- **Protótipo navegável** com tela de login e redirecionamento pós-autenticação
- **Métrica de sucesso**: usuário consegue fazer login e ser redirecionado para um placeholder de dashboard

## Histórias de Usuário

1. **Como prestador de serviço autônomo**, eu quero fazer login com meu e-mail e senha para acessar minha conta e gerenciar meus orçamentos.
2. **Como novo usuário**, eu quero conseguir criar uma conta diretamente na tela de login (link "Criar conta") para começar a usar o Orça Fácil.
3. **Como usuário que esqueceu a senha**, eu quero poder solicitar uma redefinição de senha para recuperar acesso à minha conta.
4. **Como usuário autenticado**, eu quero ser redirecionado automaticamente para a área interna do sistema ao retornar (sessão persistente) sem precisar logar novamente.

## Funcionalidades Principais

### 1. Configuração do Projeto

**O que faz:** Instala e configura todas as dependências e módulos necessários para o desenvolvimento.

**Por que é importante:** Sem uma base bem configurada, o desenvolvimento das funcionalidades futuras será lento e propenso a erros.

**Requisitos funcionais:**

- RF01: O projeto deve usar Nuxt 3 com TypeScript habilitado
- RF02: O projeto deve incluir PrimeVue 4 como biblioteca de componentes UI
- RF03: O projeto deve incluir Tailwind CSS v4 para estilização
- RF04: O projeto deve incluir Pinia para gerenciamento de estado global
- RF05: O projeto deve incluir o cliente Supabase (`@supabase/supabase-js`) para integração com o BaaS
- RF06: A estrutura de diretórios deve seguir o padrão Atomic Design (atoms, molecules, organisms, templates) dentro de `app/components/`
- RF07: As variáveis de ambiente do Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) devem ser configuradas via `.env`
- RF08: O composable `useSupabase` deve fornecer um cliente singleton reutilizável em toda a aplicação

### 2. Tela de Login

**O que faz:** Interface para o usuário autenticar-se com e-mail e senha.

**Por que é importante:** É a porta de entrada do sistema e o primeiro contato do usuário com o produto.

**Requisitos funcionais:**

- RF09: A tela deve conter um formulário com campos de e-mail e senha
- RF10: O campo de e-mail deve validar o formato antes do envio
- RF11: O campo de senha deve ter opção de exibir/ocultar texto (toggle de visibilidade)
- RF12: O formulário deve exibir mensagem de erro clara em caso de credenciais inválidas
- RF13: Deve haver um botão de "Entrar" que dispara o fluxo de autenticação via Supabase
- RF14: Deve haver um link para "Criar conta" que redireciona para a tela de registro (placeholder nesta fase)
- RF15: Deve haver um link para "Esqueci minha senha" que redireciona para a tela de recuperação (placeholder nesta fase)
- RF16: Após login bem-sucedido, o usuário deve ser redirecionado para um placeholder de dashboard
- RF17: O botão de login deve ficar em estado de loading durante a autenticação

### 3. Middleware de Autenticação

**O que faz:** Protege rotas que exigem usuário autenticado.

**Por que é importante:** Garante que usuários não autenticados não acessem áreas restritas.

**Requisitos funcionais:**

- RF18: Deve existir um middleware `auth` que redireciona usuários não autenticados para `/login`
- RF19: Usuários autenticados que acessam `/login` devem ser redirecionados para `/dashboard`
- RF20: O middleware deve verificar a sessão via Supabase Auth

### 4. Estado de Autenticação (Pinia)

**O que faz:** Gerencia o estado global da sessão do usuário.

**Por que é importante:** Centraliza o acesso à informação do usuário autenticado e à sessão.

**Requisitos funcionais:**

- RF21: Deve existir uma store Pinia `useAuthStore` que expõe o usuário atual, estado de loading e status de autenticação
- RF22: A store deve ter ação `login(email, password)` que chama Supabase Auth
- RF23: A store deve ter ação `logout()` que encerra a sessão
- RF24: A store deve persistir a sessão entre recarregamentos de página

## Experiência do Usuário

### Personas

- **Lucas, 32 anos** — Eletricista autônomo, usa celular e notebook básico. Precisa de uma interface simples, rápida e que funcione sem complicação. Não é usuário avançado de tecnologia.

### Fluxo Principal de Login

1. Usuário acessa a URL do Orça Fácil
2. É redirecionado para `/login` (não autenticado)
3. Insere e-mail e senha
4. Clica em "Entrar"
5. Feedback visual de loading é exibido
6. Em caso de sucesso → redirecionado para `/dashboard`
7. Em caso de erro → mensagem de erro clara no formulário

### Considerações de UI/UX

- Design limpo e minimalista, com foco na tarefa de login
- Logo/nome "Orça Fácil" visível no topo da tela
- Formulário centralizado vertical e horizontalmente
- Uso de cores profissionais e acessíveis (contraste adequado)
- Componentes do PrimeVue com preset Tailwind CSS
- Estados de erro devem ser informativos sem expor detalhes técnicos (ex: "E-mail ou senha inválidos" ao invés de erros do Supabase)

### Requisitos de Acessibilidade

- Labels associados a todos os campos de formulário
- Navegação por teclado funcional (Tab entre campos)
- Contraste mínimo WCAG AA (4.5:1 para texto normal)
- Mensagens de erro acessíveis via `aria-live` ou `aria-describedby`

## Restrições Técnicas de Alto Nível

- **Backend:** Supabase BaaS — toda lógica de servidor, autenticação e banco de dados é gerenciada pelo Supabase. Não há backend customizado.
- **Frontend:** Nuxt 3 (SPA/SSR), Vue 3 com Composition API (`<script setup lang="ts">`)
- **Autenticação:** Supabase Auth com provider e-mail/senha. Row Level Security (RLS) deve ser considerado para proteção de dados.
- **Performance:** A tela de login deve carregar em menos de 2 segundos em conexão 3G
- **Segurança:** Credenciais e tokens nunca devem ser logados ou expostos no frontend. Variáveis sensíveis via `.env` (não commitadas)
- **Conformidade:** Dados de usuários sujeitos à LGPD — apenas o necessário para autenticação nesta fase

## Fora de Escopo

- **CRUD de orçamentos, clientes e catálogo de serviços** — serão cobertos por PRDs futuros
- **Login social** (Google, Apple, etc.) — não incluso nesta fase
- **Autenticação 2FA** — não incluso nesta fase
- **Tela de registro e recuperação de senha funcionais** — apenas placeholders/links nesta fase
- **Dashboard funcional** — apenas placeholder de redirecionamento pós-login
- **Emails transacionais customizados** (boas-vindas, redefinição de senha) — usar templates padrão do Supabase nesta fase
- **Testes unitários e E2E** — serão cobertos em PRDs futuros
- **Design system completo** — apenas componentes mínimos necessários para o login
