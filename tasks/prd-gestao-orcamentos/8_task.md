# Tarefa 8.0: Geração de PDF

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a geração de PDF de orçamentos usando `html2pdf.js` no client-side. Um template HTML oculto (`QuotePdfTemplate`) é renderizado com os dados do orçamento e convertido em PDF para download. Cobre RF31-RF35 do PRD.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — SSR guards (import.meta.client para html2pdf.js)
- `vue-composition-api` — `<script setup lang="ts">`, refs, nextTick
- `vue-best-practices` — Template renderizado separado para PDF
</skills>

<requirements>
- QuotePdfTemplate: componente HTML oculto com layout profissional de PDF
- useQuotePdf composable: gera PDF do template e dispara download
- PDF contém: logo/nome Orça Fácil, dados do prestador, cliente, itens, subtotais, desconto, total, número, datas
- PDF otimizado para A4, cores sóbrias, legível em preto e branco
</requirements>

## Subtarefas

- [ ] 8.1 Criar `app/components/organisms/QuotePdfTemplate.vue` — template HTML completo para PDF com: cabeçalho (logo/nome Orça Fácil), dados do prestador (email do usuário), dados do cliente, tabela de serviços, tabela de materiais, resumo financeiro (subtotais, desconto, total), observações, rodapé (número do orçamento, data criação, validade)
- [ ] 8.2 Estilizar QuotePdfTemplate com CSS inline/Tailwind para aparência profissional em A4; cores sóbrias, boa legibilidade P&B
- [ ] 8.3 Criar `app/composables/useQuotePdf.ts` — função `gerarPdf(orcamento)` que: referencia o elemento QuotePdfTemplate oculto, chama `html2pdf().from(element).set(options).save()`; opções: filename `ORC-XXXX.pdf`, format `a4`, margin `10mm`
- [ ] 8.4 Usar `import.meta.client` guard para evitar execução de html2pdf.js no SSR
- [ ] 8.5 Adicionar botão "Gerar PDF" na página de listagem (ação rápida) e na página de edição
- [ ] 8.6 Mostrar feedback visual (loading/spinner) durante geração do PDF
- [ ] 8.7 Tratar erros do html2pdf.js com mensagem amigável ao usuário
- [ ] 8.8 Criar testes unitários para `useQuotePdf` (mock html2pdf.js)
- [ ] 8.9 Criar testes unitários para `QuotePdfTemplate` (renderização com dados mock)
- [ ] 8.10 Executar `yarn test:run` e `yarn typecheck`

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Pontos de Integração" descreve html2pdf.js. O QuotePdfTemplate é um componente oculto (`style="position: absolute; left: -9999px"` ou `v-show="false"` com renderização forçada). Usar `nextTick()` antes de gerar PDF para garantir que o DOM foi atualizado.

## Critérios de Sucesso

- PDF é gerado e baixado com nome `ORC-XXXX.pdf`
- PDF contém todos os dados do orçamento (serviços, materiais, totais, cliente)
- PDF tem layout profissional e legível em A4
- Geração funciona em Chromium, Firefox
- Loading state visível durante geração
- Erros tratados com mensagem amigável
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** useQuotePdf.gerarPdf chama html2pdf com options corretas
- [ ] **Unitário (Vitest):** useQuotePdf.gerarPdf trata erro e retorna false
- [ ] **Unitário (Vitest):** QuotePdfTemplate renderiza com dados mock de orçamento
- [ ] **Unitário (Vitest):** QuotePdfTemplate exibe subtotais e total formatados em BRL

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/components/organisms/QuotePdfTemplate.vue` — novo
- `app/composables/useQuotePdf.ts` — novo
- `tests/organisms/QuotePdfTemplate.test.ts` — novo
- `tests/composables/useQuotePdf.test.ts` — novo
