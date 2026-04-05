# Tarefa 3.0: Componentes Atoms

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar os componentes atômicos que serão reutilizados em todos os formulários e páginas do módulo de orçamentos. Cada componente é um wrapper estilizado de componentes PrimeVue, seguindo o padrão de Atomic Design.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Auto-import de componentes
- `vue-composition-api` — `<script setup lang="ts">`, props/emits tipados
- `primevue` — Select, Textarea, Tag, InputNumber, Calendar como base
- `tailwindcss` — Estilização responsiva
- `atomic-design` — Componentes na pasta `atoms/`
</skills>

<requirements>
- AppSelect: wrapper do Select do PrimeVue com label e estado de erro
- AppTextarea: wrapper do Textarea com label e estado de erro
- AppBadge: wrapper do Tag do PrimeVue para status coloridos
- AppCurrency: input monetário com máscara R$ usando InputNumber
- AppDateInput: wrapper do Calendar do PrimeVue
</requirements>

## Subtarefas

- [ ] 3.1 Criar `app/components/atoms/AppSelect.vue` — wrapper de PrimeVue Select com props: `id`, `label`, `modelValue`, `options`, `error`, `disabled`, `placeholder`; emite `update:modelValue`
- [ ] 3.2 Criar `app/components/atoms/AppTextarea.vue` — wrapper de PrimeVue Textarea com props: `id`, `label`, `modelValue`, `error`, `disabled`, `placeholder`, `rows`; emite `update:modelValue`
- [ ] 3.3 Criar `app/components/atoms/AppBadge.vue` — wrapper de PrimeVue Tag com props: `label`, `severity` (info, success, warning, danger), `icon`; usa cores Tailwind
- [ ] 3.4 Criar `app/components/atoms/AppCurrency.vue` — wrapper de PrimeVue InputNumber com `mode="currency"`, `currency="BRL"`, props: `id`, `label`, `modelValue`, `error`, `disabled`; emite `update:modelValue` como number
- [ ] 3.5 Criar `app/components/atoms/AppDateInput.vue` — wrapper de PrimeVue Calendar com props: `id`, `label`, `modelValue`, `error`, `disabled`, `minDate`, `placeholder`; emite `update:modelValue` como string ISO
- [ ] 3.6 Adicionar testes unitários para cada componente: renderização com props, emissão de eventos, exibição de erro
- [ ] 3.7 Executar `yarn test:run` e verificar todos os testes passando
- [ ] 3.8 Executar `yarn typecheck` e verificar sem erros

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Visão Geral dos Componentes" lista todos os átomos. Seguir o padrão do `AppInput.vue` e `AppButton.vue` existentes (wrapper com label, erro via `aria-describedby`, disabled state).

## Critérios de Sucesso

- Todos os 5 átomos renderizam sem erros
- Labels associados corretamente aos inputs (acessibilidade)
- Estado de erro exibe mensagem vermelha abaixo do campo
- `v-model` funciona em todos os componentes
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** AppSelect renderiza com options e emite update:modelValue
- [ ] **Unitário (Vitest):** AppSelect exibe mensagem de erro quando prop error é fornecido
- [ ] **Unitário (Vitest):** AppTextarea renderiza com label e emite update:modelValue
- [ ] **Unitário (Vitest):** AppBadge renderiza com diferentes severities (info, success, warning, danger)
- [ ] **Unitário (Vitest):** AppCurrency formata valor em BRL e emite update:modelValue como number
- [ ] **Unitário (Vitest):** AppDateInput renderiza e emite data no formato ISO

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/components/atoms/AppSelect.vue` — novo
- `app/components/atoms/AppTextarea.vue` — novo
- `app/components/atoms/AppBadge.vue` — novo
- `app/components/atoms/AppCurrency.vue` — novo
- `app/components/atoms/AppDateInput.vue` — novo
- `tests/atoms/*.test.ts` — novos (testes unitários de cada átomo)
