# Tarefa 12.0: Testes E2E Completos

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Escrever a suíte completa de testes E2E com Playwright cobrindo todos os fluxos críticos do módulo de orçamentos: criação, edição, duplicação, geração de PDF, link público, CRUD de clientes e cenários de erro. Garante que frontend e backend funcionam corretamente integrados.

<skills>
### Conformidade com Skills Padrões

- `playwright` — Testes E2E com Chromium, assertions, interações de formulário
- `supabase` — Criação de dados de teste no banco
</skills>

<requirements>
- Teste E2E de criação completa de orçamento
- Teste E2E de edição de orçamento
- Teste E2E de duplicação
- Teste E2E de geração de PDF
- Teste E2E de link público (acesso anônimo)
- Teste E2E de CRUD de clientes
- Teste E2E de acesso a link público inválido (404)
</requirements>

## Subtarefas

- [ ] 12.1 Configurar dados de teste: criar usuário de teste, cliente de teste e orçamento de teste no Supabase (via variáveis de ambiente `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` ou script de seed)
- [ ] 12.2 Criar `e2e/criar-orcamento.spec.ts` — fluxo: login → novo orçamento → preencher título → selecionar cliente → adicionar 2 serviços → adicionar 1 material → aplicar desconto → salvar → verificar na lista com número e total corretos
- [ ] 12.3 Criar `e2e/editar-orcamento.spec.ts` — fluxo: login → acessar orçamento existente → editar título → adicionar item → salvar → verificar totais atualizados na lista
- [ ] 12.4 Criar `e2e/duplicar-orcamento.spec.ts` — fluxo: login → acessar orçamento → duplicar → verificar novo número ORC-XXXX e status "Rascunho" → verificar que itens foram copiados
- [ ] 12.5 Criar `e2e/pdf-download.spec.ts` — fluxo: login → acessar orçamento → clicar "Gerar PDF" → verificar que arquivo foi baixado (usar `download` event do Playwright)
- [ ] 12.6 Criar `e2e/public-link.spec.ts` — fluxo (2 abas): aba 1 (autenticada): login → gerar link público → copiar URL; aba 2 (anônima): acessar URL → verificar visualização completa do orçamento sem login
- [ ] 12.7 Criar `e2e/cliente-crud.spec.ts` — fluxo: login → navegar para Clientes → criar cliente → editar → listar → excluir com confirmação
- [ ] 12.8 Criar `e2e/guest-public-404.spec.ts` — acessar /public/orcamentos/uuid-invalido → verificar página 404 ou mensagem de erro
- [ ] 12.9 Criar `e2e/orcamento-status-filter.spec.ts` — fluxo: criar orçamentos com status diferentes → filtrar por status → verificar resultados corretos
- [ ] 12.10 Configurar CI-friendly: testes devem rodar com `yarn test:e2e` usando `playwright.config.ts` existente
- [ ] 12.11 Executar `yarn test:e2e` e verificar todos os testes passando (requer Supabase de teste configurado)

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Abordagem de Testes" descreve os cenários E2E. Os testes precisam de um Supabase real com dados de teste. Usar `test.use({ storageState })` para persistir sessão de login entre steps. Para testes com aba anônima, usar `context.newPage()`.

## Critérios de Sucesso

- Todos os 7 testes E2E passam com Supabase de teste configurado
- Fluxo de criação de orçamento completo funciona end-to-end
- PDF é gerado e baixado corretamente
- Link público funciona em aba anônima
- CRUD de clientes funciona completamente
- Filtros de status funcionam na listagem

## Testes da Tarefa

- [ ] **E2E (Playwright):** `criar-orcamento.spec.ts` — fluxo completo de criação
- [ ] **E2E (Playwright):** `editar-orcamento.spec.ts` — edição com alteração de totais
- [ ] **E2E (Playwright):** `duplicar-orcamento.spec.ts` — duplicação com verificação de itens
- [ ] **E2E (Playwright):** `pdf-download.spec.ts` — geração e download de PDF
- [ ] **E2E (Playwright):** `public-link.spec.ts` — link acessível sem auth
- [ ] **E2E (Playwright):** `cliente-crud.spec.ts` — CRUD completo
- [ ] **E2E (Playwright):** `guest-public-404.spec.ts` — UUID inválido retorna erro
- [ ] **E2E (Playwright):** `orcamento-status-filter.spec.ts` — filtros funcionam

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `e2e/criar-orcamento.spec.ts` — novo
- `e2e/editar-orcamento.spec.ts` — novo
- `e2e/duplicar-orcamento.spec.ts` — novo
- `e2e/pdf-download.spec.ts` — novo
- `e2e/public-link.spec.ts` — novo
- `e2e/cliente-crud.spec.ts` — novo
- `e2e/guest-public-404.spec.ts` — novo
- `e2e/orcamento-status-filter.spec.ts` — novo
- `playwright.config.ts` — já existe, pode precisar de ajustes
