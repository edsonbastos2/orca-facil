# Tarefa 2.0: Composables base e dependências

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar os composables base de lógica pura (`useQuoteCalculations` para cálculos de totais e `useCurrency` para formatação monetária BRL) e instalar a dependência `html2pdf.js`. Estes composables são funções simples, sem I/O, fáceis de testar e reutilizáveis.

<skills>
### Conformidade com Skills Padrões

- `nuxt` — Composables com auto-import, `<script setup lang="ts">`
- `vue-composition-api` — Refs, computed, funções reutilizáveis
- `vue-best-practices` — Funções puras, sem efeitos colaterais
</skills>

<requirements>
- useQuoteCalculations: função pura calcularTotais(servicos, materiais, descontoTipo, descontoValor)
- useCurrency: formatação BRL com Intl.NumberFormat
- Instalar html2pdf.js via yarn add
</requirements>

## Subtarefas

- [ ] 2.1 Instalar `html2pdf.js` via `yarn add html2pdf.js`
- [ ] 2.2 Criar `app/composables/useCurrency.ts` com função `formatarBRL(valor: number): string` usando `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- [ ] 2.3 Criar `app/composables/useQuoteCalculations.ts` com interface `QuoteItem`, interface `CalculatedTotals` e função `calcularTotais(servicos, materiais, descontoTipo, descontoValor)`
- [ ] 2.4 A função calcularTotais deve suportar desconto percentual (%) e fixo (R$)
- [ ] 2.5 Exportar composables para auto-import via diretório `composables/`
- [ ] 2.6 Criar `tests/composables/useQuoteCalculations.test.ts` — testar: sem itens, apenas serviços, apenas materiais, desconto %, desconto fixo, desconto zero
- [ ] 2.7 Criar `tests/composables/useCurrency.test.ts` — testar: valores positivos, zero, negativos, grandes
- [ ] 2.8 Executar `yarn test:run` e verificar todos os testes passando
- [ ] 2.9 Executar `yarn typecheck` e verificar sem erros

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Interfaces Principais" contém as interfaces `QuoteItem`, `CalculatedTotals` e assinatura da função `calcularTotais`.

## Critérios de Sucesso

- `formatarBRL(1234.56)` retorna `"R$ 1.234,56"`
- `calcularTotais` com 2 serviços (100 + 200) e 1 material (50) = subtotalServicos 300, subtotalMateriais 50, total 350
- Desconto percentual 10% sobre 350 = desconto 35, total 315
- Desconto fixo R$50 sobre 350 = total 300
- Todos os testes unitários passam
- `yarn typecheck` passa sem erros

## Testes da Tarefa

- [ ] **Unitário (Vitest):** calcularTotais com arrays vazios retorna todos zeros
- [ ] **Unitário (Vitest):** calcularTotais com apenas serviços calcula subtotalServicos corretamente
- [ ] **Unitário (Vitest):** calcularTotais com serviços + materiais calcula ambos subtotais
- [ ] **Unitário (Vitest):** calcularTotais com desconto percentual aplica % sobre a soma dos subtotais
- [ ] **Unitário (Vitest):** calcularTotais com desconto fixo subtrai valor fixo diretamente
- [ ] **Unitário (Vitest):** formatarBRL formata corretamente valores positivos, zero e negativos

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `app/composables/useCurrency.ts` — novo
- `app/composables/useQuoteCalculations.ts` — novo
- `tests/composables/useQuoteCalculations.test.ts` — novo
- `tests/composables/useCurrency.test.ts` — novo
- `package.json` — modificado (html2pdf.js)
