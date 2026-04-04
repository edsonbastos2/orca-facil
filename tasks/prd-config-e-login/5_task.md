# Tarefa 5.0: Layouts e componentes base (Atomic Design)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Estilizar os layouts de autenticação (split screen) e padrão, e criar todos os componentes base seguindo o Atomic Design: átomos (AppButton, AppInput), moléculas (LoginForm, AuthFooter), organismos (AuthSplitLayout) e templates (AuthPageTemplate). Esta tarefa transforma a estrutura vazia da tarefa 2.0 em UI funcional e visualmente coesa.

<skills>
### Conformidade com Skills Padrões

- `atomic-design` — Componentes nas pastas corretas: atoms/, molecules/, organisms/, templates/
- `primevue` — Componentes PrimeVue: Button, InputText, Password, Message, IconField, InputIcon
- `tailwindcss` — Estilização via classes utilitárias Tailwind CSS v4
- `vue-composition-api` — `<script setup lang="ts">`, defineProps, defineEmits tipados
- `frontend-design` — Split screen layout, responsividade, acessibilidade WCAG AA
</skills>

<requirements>
- RF09: Formulário com campos de e-mail e senha
- RF10: Validação de formato de e-mail
- RF11: Toggle de visibilidade de senha
- RF13: Botão "Entrar" com estado de loading
- RF14: Link "Criar conta"
- RF15: Link "Esqueci minha senha"
- Layout split screen para autenticação (branding + formulário)
- Contraste WCAG AA, labels acessíveis, navegação por teclado
</requirements>

## Subtarefas

- [ ] 5.1 Estilizar `app/layouts/auth.vue` com layout split screen: painel esquerdo com branding "Orça Fácil" (gradiente/cor sólida), painel direito com `<slot />`
- [ ] 5.2 Estilizar `app/layouts/default.vue` com estrutura mínima para páginas internas
- [ ] 5.3 Criar `app/components/atoms/AppButton.vue` — wrapper do PrimeVue Button com classes Tailwind padronizadas
- [ ] 5.4 Criar `app/components/atoms/AppInput.vue` — wrapper de PrimeVue InputText/Password com label, validação e suporte a toggle de visibilidade
- [ ] 5.5 Criar `app/components/molecules/AuthFooter.vue` — links "Criar conta" e "Esqueci minha senha"
- [ ] 5.6 Criar `app/components/molecules/LoginForm.vue` — formulário completo com email, senha, loading state, error display; emite `submit` com `{ email, password }`
- [ ] 5.7 Criar `app/components/organisms/AuthSplitLayout.vue` — combina painel de branding + LoginForm para uso na página de login
- [ ] 5.8 Criar `app/components/templates/AuthPageTemplate.vue` — template wrapper com `<NuxtLayout name="auth">` e centralização
- [ ] 5.9 Executar `yarn dev` e verificar visual do split screen no browser
- [ ] 5.10 Executar `yarn typecheck` para verificar tipagem

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Interfaces Principais" (LoginForm Props/Emits) e "Fluxo de Dados". O split screen deve ser responsivo: em telas pequenas (mobile), o painel de branding pode ser reduzido a uma barra com logo. LoginForm deve usar AppInput e AppButton internamente. Todos os componentes devem usar `<script setup lang="ts">`. Verificar acessibilidade: labels associados, `aria-describedby` para mensagens de erro, contraste adequado.

## Critérios de Sucesso

- Layout auth exibe split screen em telas desktop
- Em mobile, layout se adapta (branding compacto ou oculto)
- LoginForm valida e-mail antes de submeter
- Senha pode ser exibida/ocultada com toggle
- Botão de login exibe spinner/loading durante submissão
- Mensagens de erro são visíveis e acessíveis
- `yarn typecheck` passa sem erros
- Nenhum erro de console no browser

## Testes da Tarefa

- [ ] **Unitário:** Montar `LoginForm` com Vitest + Testing Library → verificar que campos de email e senha existem
- [ ] **Unitário:** Simular submissão do LoginForm sem preencher → verificar que emite erro ou não emite `submit`
- [ ] **Unitário:** Montar `LoginForm` com prop `loading={true}` → verificar que botão está desabilitado
- [ ] **Unitário:** Montar `LoginForm` com prop `error="msg"` → verificar que mensagem de erro é exibida
- [ ] **Unitário:** Montar `AuthFooter` → verificar que links para /register e /forgot-password existem
- [ ] **Integração:** Montar `AuthSplitLayout` → verificar que branding e formulário estão visíveis
- [ ] **Visual/Acessibilidade:** Verificar contraste de cores com ferramentas (WCAG AA); verificar navegação por Tab

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/layouts/auth.vue` — modificado (split screen estilizado)
- `app/layouts/default.vue` — modificado
- `app/components/atoms/AppButton.vue` — novo
- `app/components/atoms/AppInput.vue` — novo
- `app/components/molecules/LoginForm.vue` — novo
- `app/components/molecules/AuthFooter.vue` — novo
- `app/components/organisms/AuthSplitLayout.vue` — novo
- `app/components/templates/AuthPageTemplate.vue` — novo
