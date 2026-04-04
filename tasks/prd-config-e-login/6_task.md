# Tarefa 6.0: Páginas de autenticação

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar as páginas de autenticação: `login.vue` (funcional com Supabase Auth), `register.vue` (placeholder visual) e `forgot-password.vue` (placeholder visual). A página de login integra o composable `useAuthState`, o LoginForm e o middleware de auth para criar o fluxo completo de autenticação.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Pages com definePageMeta, NuxtPage, navegação, useState
- `supabase` — Integração de login com `useSupabaseClient` via auth composable
- `vue-composition-api` — `<script setup lang="ts">`, reatividade, handlers
- `primevue` — Componentes UI para páginas placeholder
- `tailwindcss` — Estilização das páginas
  </skills>

<requirements>
- RF12: Mensagem de erro clara em caso de credenciais inválidas
- RF16: Após login bem-sucedido, redirecionar para /dashboard
- RF17: Botão de login em estado de loading durante autenticação
- RF14: Link "Criar conta" → /register
- RF15: Link "Esqueci minha senha" → /forgot-password
</requirements>

## Subtarefas

- [ ] 6.1 Criar `app/pages/login.vue`: usa layout auth, inclui LoginForm, conecta com `useAuthState()`, faz `navigateTo('/dashboard')` em sucesso
- [ ] 6.2 Configurar `definePageMeta({ middleware: 'auth' })` em `login.vue` se necessário para redirect de usuários já logados
- [ ] 6.3 Criar `app/pages/register.vue`: placeholder visual com título "Criar conta", texto "Em breve" e link de volta para login
- [ ] 6.4 Criar `app/pages/forgot-password.vue`: placeholder visual com título "Recuperar senha", texto "Em breve" e link de volta para login
- [ ] 6.5 Testar fluxo completo: preencher login → clicar Entrar → verificar redirecionamento para /dashboard (que ainda é placeholder)
- [ ] 6.6 Testar com credenciais inválidas → verificar mensagem de erro no formulário
- [ ] 6.7 Executar `yarn typecheck` para verificar tipagem

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Fluxo de Dados" e "Modelos de Dados". A página `login.vue` usa o composable `useAuthState()` para chamar `login(email, password)`. O loading e erro vêm do estado reativamente. Páginas de registro e recuperação são placeholders — devem ter aparência limpa e profissional com link de volta ao login.

## Critérios de Sucesso

- Login funcional com Supabase Auth (usuário existente no Supabase consegue entrar)
- Redirecionamento para `/dashboard` após login bem-sucedido
- Mensagem de erro amigável exibida para credenciais inválidas
- Páginas de registro e recuperação são visualmente coerentes com o design
- Links de "Criar conta" e "Esqueci minha senha" navegam corretamente
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Integração:** Preencher email/senha válidos no login → clicar Entrar → verificar `navigateTo('/dashboard')` foi chamado
- [ ] **Integração:** Preencher email/senha inválidos → clicar Entrar → verificar mensagem de erro visível
- [ ] **Integração:** Verificar que botão de login fica desabilitado durante submissão
- [ ] **Integração:** Clicar link "Criar conta" → verificar navegação para `/register`
- [ ] **Integração:** Clicar link "Esqueci minha senha" → verificar navegação para `/forgot-password`
- [ ] **Visual:** Verificar que páginas de placeholder têm design consistente com auth layout

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/pages/login.vue` — novo (página funcional de login)
- `app/pages/register.vue` — novo (placeholder)
- `app/pages/forgot-password.vue` — novo (placeholder)
- `app/components/molecules/LoginForm.vue` — consumido pelo login.vue (task 5.0)
- `app/composables/useAuth.ts` — consumido pelo login.vue (task 3.0)
- `app/layouts/auth.vue` — layout usado pelas páginas (task 2.0/5.0)
