# Tech Spec — Módulo 2: Gestão de Orçamentos (Quote Service)

## Resumo Executivo

O Módulo 2 transforma o placeholder de dashboard do Orça Fácil em um sistema funcional de gestão de orçamentos. A arquitetura segue o padrão BaaS já adotado: Supabase (PostgreSQL + RLS) para persistência e autenticação, Nuxt 3 para frontend e server routes, PrimeVue 4 para componentes UI, e Tailwind CSS para estilização. A geração de PDF será feita no client-side com `html2pdf.js` (jsPDF + html2canvas), evitando dependência de infraestrutura servidorica. Numeração sequencial via trigger PostgreSQL. Links públicos via UUID. Versionamento com tabela de snapshots. Todo isolamento de dados é garantido por Row Level Security.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Responsabilidade | Tipo |
|---|---|---|
| `server/api/orcamentos/numero.ts` | Gera próximo número sequencial via RPC ao Supabase | Novo |
| `app/pages/orcamentos/index.vue` | Listagem de orçamentos com filtros, busca e ações | Novo |
| `app/pages/orcamentos/novo.vue` | Formulário de criação de orçamento | Novo |
| `app/pages/orcamentos/[id].vue` | Edição de orçamento existente | Novo |
| `app/pages/public/orcamentos/[uuid].vue` | Visualização pública do orçamento (sem auth) | Novo |
| `app/pages/clientes/index.vue` | Listagem de clientes | Novo |
| `app/pages/clientes/novo.vue` | Formulário de criação/edição de cliente | Novo |
| `app/layouts/dashboard.vue` | Layout com sidebar/navbar para área interna | Novo |
| `app/composables/useOrcamentos.ts` | CRUD de orçamentos via Supabase | Novo |
| `app/composables/useClientes.ts` | CRUD de clientes via Supabase | Novo |
| `app/composables/useQuoteCalculations.ts` | Cálculos: subtotais, descontos, totais | Novo |
| `app/composables/useQuotePdf.ts` | Geração de PDF via html2pdf.js | Novo |
| `app/composables/useCurrency.ts` | Formatação monetária BRL | Novo |
| `app/components/atoms/AppSelect.vue` | Select estilizado (wrapper PrimeVue) | Novo |
| `app/components/atoms/AppTextarea.vue` | Textarea estilizado | Novo |
| `app/components/atoms/AppBadge.vue` | Badge de status colorido | Novo |
| `app/components/atoms/AppCurrency.vue` | Input monetário com máscara R$ | Novo |
| `app/components/atoms/AppDateInput.vue` | Input de data | Novo |
| `app/components/molecules/QuoteItemRow.vue` | Linha editável de item (serviço ou material) | Novo |
| `app/components/molecules/QuoteTotals.vue` | Painel de subtotais, desconto e total | Novo |
| `app/components/molecules/QuoteStatusBadge.vue` | Badge visual por status | Novo |
| `app/components/molecules/ClienteForm.vue` | Formulário de cliente (criar/editar) | Novo |
| `app/components/molecules/ConfirmDialog.vue` | Modal de confirmação de ação | Novo |
| `app/components/molecules/QuoteActions.vue` | Ações rápidas (editar, duplicar, PDF, link) | Novo |
| `app/components/organisms/QuoteForm.vue` | Formulário completo de orçamento | Novo |
| `app/components/organisms/QuoteList.vue` | Tabela de orçamentos com filtros | Novo |
| `app/components/organisms/ClienteList.vue` | Tabela de clientes | Novo |
| `app/components/organisms/DashboardSidebar.vue` | Sidebar de navegação interna | Novo |
| `app/components/organisms/QuotePdfTemplate.vue` | Template HTML oculto para geração de PDF | Novo |
| `app/components/organisms/PublicQuoteView.vue` | Visualização pública do orçamento | Novo |
| `app/components/templates/DashboardTemplate.vue` | Layout base com sidebar + conteúdo | Novo |
| `app/components/templates/CrudPageTemplate.vue` | Template genérico para páginas CRUD | Novo |
| `app/components/templates/PublicPageTemplate.vue` | Template para páginas públicas | Novo |
| `app/middleware/orcamento-owner.ts` | Verifica se usuário é dono do orçamento | Novo |
| `supabase/migrations/001_clientes_orcamentos.sql` | Schema completo com tabelas, FKs, RLS, triggers | Novo |

### Fluxo de Dados

```
usuário autenticado → /dashboard
  ├─ Sidebar → navegação: Orçamentos, Clientes
  ├─ /orcamentos (lista) → filtra, busca, ordena → ações:
  │   ├─ Novo → /orcamentos/novo → QuoteForm → useOrcamentos.create() → Supabase
  │   ├─ Editar → /orcamentos/[id] → QuoteForm → useOrcamentos.update() → Supabase
  │   ├─ Duplicar → useOrcamentos.duplicate() → novo orçamento Rascunho
  │   ├─ Excluir → ConfirmDialog → useOrcamentos.delete() → Supabase
  │   ├─ PDF → QuotePdfTemplate → html2pdf.js → download
  │   └─ Link → gera UUID → copia /public/orcamentos/[uuid]
  ├─ /clientes (lista) → CRUD básico → useClientes.*() → Supabase
  └─ /public/orcamentos/[uuid] → sem auth → PublicQuoteView → dados do orçamento
```

## Design de Implementação

### Interfaces Principais

**useOrcamentos (composable):**

```ts
interface QuoteItem {
  id?: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

interface Orcamento {
  id: string;
  usuarioId: string;
  clienteId: string;
  numero: string;        // ORC-0001 (gerado por trigger)
  titulo: string;
  status: QuoteStatus;   // rascunho | enviado | aprovado | recusado | expirado
  descontoTipo: "percentual" | "fixo" | null;
  descontoValor: number;
  validade: string | null;   // ISO date
  observacoes: string | null;
  publicUuid: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

interface useOrcamentosReturn {
  lista: Ref<OrcamentoResumo[]>;
  loading: Ref<boolean>;
  criar: (data: CreateOrcamentoInput) => Promise<string>;  // retorna ID
  atualizar: (id: string, data: UpdateOrcamentoInput) => Promise<void>;
  excluir: (id: string) => Promise<void>;
  duplicar: (id: string) => Promise<string>;
  gerarPublicUuid: (id: string) => Promise<string>;
  revogarPublicUuid: (id: string) => Promise<void>;
  buscarPorId: (id: string) => Promise<Orcamento | null>;
  buscarPublico: (uuid: string) => Promise<OrcamentoPublico | null>;
}
```

**useQuoteCalculations (composable puro, sem I/O):**

```ts
interface CalculatedTotals {
  subtotalServicos: number;
  subtotalMateriais: number;
  desconto: number;
  total: number;
}

function calcularTotais(
  servicos: QuoteItem[],
  materiais: QuoteItem[],
  descontoTipo: "percentual" | "fixo" | null,
  descontoValor: number,
): CalculatedTotals;
```

### Modelos de Dados

**Schema Supabase (PostgreSQL):**

```sql
-- Tabela: clientes
CREATE TABLE clientes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefone    TEXT,
  empresa     TEXT,
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: orcamentos
CREATE TABLE orcamentos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id    UUID REFERENCES clientes(id) ON DELETE SET NULL,
  numero        TEXT NOT NULL,             -- gerado por trigger (ORC-0001)
  titulo        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'rascunho',
  desconto_tipo TEXT,                       -- 'percentual' ou 'fixo'
  desconto_valor NUMERIC DEFAULT 0,
  validade      DATE,
  observacoes   TEXT,
  public_uuid   UUID UNIQUE DEFAULT NULL,   -- UUID para link público
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: orcamento_itens (serviços e materiais unificados)
CREATE TABLE orcamento_itens (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id  UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  tipo          TEXT NOT NULL,             -- 'servico' ou 'material'
  descricao     TEXT NOT NULL,
  quantidade    NUMERIC NOT NULL DEFAULT 1,
  valor_unitario NUMERIC NOT NULL DEFAULT 0,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: orcamento_version (snapshots de versionamento)
CREATE TABLE orcamento_version (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id  UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  versao        INTEGER NOT NULL,          -- 1, 2, 3...
  snapshot      JSONB NOT NULL,            -- snapshot completo do orçamento
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para numeração sequencial por usuário
CREATE OR REPLACE FUNCTION gerar_numero_orcamento()
RETURNS TRIGGER AS $$
DECLARE
  proximo_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(numero), '0')::INTEGER + 1
    INTO proximo_num
    FROM orcamentos
   WHERE usuario_id = NEW.usuario_id;
  NEW.numero := 'ORC-' || LPAD(proximo_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gerar_numero_orcamento
  BEFORE INSERT ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION gerar_numero_orcamento();

-- RLS Policies (todas as tabelas)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_version ENABLE ROW LEVEL SECURITY;

-- clientes: usuário vê/edita apenas os seus
CREATE POLICY "Usuarios veem proprios clientes" ON clientes
  FOR ALL USING (usuario_id = auth.uid());

-- orcamentos: usuário vê/edita apenas os seus
CREATE POLICY "Usuarios veem proprios orcamentos" ON orcamentos
  FOR ALL USING (usuario_id = auth.uid());

-- orcamento_itens: segue o orçamento pai
CREATE POLICY "Usuarios veem itens dos proprios orcamentos" ON orcamento_itens
  FOR ALL USING (
    orcamento_id IN (SELECT id FROM orcamentos WHERE usuario_id = auth.uid())
  );

-- orcamento_version: segue o orçamento pai
CREATE POLICY "Usuarios veem versoes dos proprios orcamentos" ON orcamento_version
  FOR ALL USING (
    orcamento_id IN (SELECT id FROM orcamentos WHERE usuario_id = auth.uid())
  );

-- Link público: permite SELECT sem auth quando public_uuid match
CREATE POLICY "Link publico permite leitura" ON orcamentos
  FOR SELECT USING (public_uuid IS NOT NULL);
```

### Endpoints de API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/orcamentos/numero` | Retorna próximo número sequencial (chama RPC `gerar_numero_orcamento`) |
| `GET` | `/api/orcamentos/public/:uuid` | Dados do orçamento público (sem auth required) |
| `POST` | `/api/orcamentos/:id/snapshot` | Cria snapshot de versão atual (chama RPC) |

**Nota:** A maioria das operações será feita diretamente via Supabase client (`useSupabaseClient`) sem necessidade de server routes — exceto para o link público onde o usuário não está autenticado.

## Pontos de Integração

### Supabase (BaaS)

- **Tabelas novas:** `clientes`, `orcamentos`, `orcamento_itens`, `orcamento_version`
- **RLS:** Isolamento total por `usuario_id = auth.uid()` em todas as tabelas
- **Trigger:** `gerar_numero_orcamento()` gera números sequenciais (ORC-0001) por usuário
- **RPC:** `gerar_numero_orcamento` pode ser chamado via `useSupabaseClient.rpc()`
- **Tratamento de erros:**
  - FK violada (cliente deletado) → "Cliente não encontrado"
  - Conflito de concorrência na numeração → retry com backoff
  - RLS bloqueando → "Acesso negado" genérico

### html2pdf.js (PDF Client-Side)

- **Biblioteca:** `html2pdf.js` (combina jsPDF + html2canvas)
- **Funcionamento:** renderiza um elemento HTML oculto (`QuotePdfTemplate`) e converte para PDF
- **Vantagem:** zero dependência de servidor, funciona em qualquer browser moderno
- **Limitação:** fidelidade visual pode variar entre browsers; usar CSS inline para consistência

### Dados Públicos (Link Compartilhável)

- **Endpoint:** `GET /api/orcamentos/public/:uuid` — server route sem auth
- **Segurança:** apenas dados do orçamento específico; RLS não se aplica (usuário anônimo)
- **Revogação:** setar `public_uuid = NULL` no orçamento desativa o link

## Abordagem de Testes

### Testes de Unidade

| Componente | Estratégia |
|---|---|
| `useQuoteCalculations.ts` | Mock-free — função pura; testar combinações de serviços, materiais, descontos % e fixo |
| `useCurrency.ts` | Formatação BRL, valores negativos, zero, null |
| `useOrcamentos.ts` | Mock do `useSupabaseClient`; testar criar, atualizar, excluir, duplicar, gerar/revogar UUID |
| `middleware/orcamento-owner.ts` | Mock de `useSupabaseUser` e `useSupabaseClient`; verificar redirect de não-dono |
| `gerar_numero_orcamento()` (SQL) | Teste via SQL: inserir 3 orçamentos, verificar ORC-0001, ORC-0002, ORC-0003 |

### Testes de Integração

- **Fluxo CRUD de orçamento:** criar → listar → editar → excluir (mock Supabase)
- **Duplicação:** duplicar orçamento, verificar que todos os itens foram copiados
- **Versionamento:** criar snapshot, modificar, restaurar versão anterior
- **Link público:** gerar UUID, acessar via endpoint sem auth, verificar dados

### Testes de E2E (Playwright)

| Cenário | Descrição |
|---|---|
| `criar-orcamento.spec.ts` | Fluxo completo: novo → preencher cliente → adicionar itens → salvar → ver na lista |
| `editar-orcamento.spec.ts` | Editar orçamento existente, alterar itens, verificar totais atualizados |
| `duplicar-orcamento.spec.ts` | Duplicar orçamento, verificar novo número e status Rascunho |
| `pdf-download.spec.ts` | Gerar PDF, verificar que arquivo foi baixado |
| `public-link.spec.ts` | Gerar link, acessar em aba anônima, verificar visualização |
| `cliente-crud.spec.ts` | Criar, editar, listar, excluir cliente |
| `guest-public-redirect.spec.ts` | Acessar link público sem UUID válido, verificar erro 404 |

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Schema SQL + Migrations** — Criar tabelas, FKs, RLS policies, trigger de numeração no Supabase. *Por que primeiro: bloqueia todo o resto. Sem banco, não há CRUD.*
2. **Composables base** — `useCurrency`, `useQuoteCalculations` (funções puras, fáceis de testar). *Depende de 0.*
3. **Componentes atoms** — `AppSelect`, `AppTextarea`, `AppBadge`, `AppCurrency`, `AppDateInput`. *Depende de 0.*
4. **CRUD de Clientes** — Páginas, formulário, listagem, `useClientes`. *Depende de 1, 2, 3.*
5. **CRUD de Orçamentos** — Formulário completo (`QuoteForm`), listagem, `useOrcamentos`. *Depende de 1, 2, 3, 4.*
6. **Dashboard Layout** — Sidebar, navegação, template. *Depende de 0.*
7. **Geração de PDF** — `QuotePdfTemplate`, `useQuotePdf`, integração html2pdf.js. *Depende de 5.*
8. **Link Público** — Server route, `PublicQuoteView`, página sem auth. *Depende de 5.*
9. **Versionamento** — Snapshots, restauração, UI de versões. *Depende de 5.*
10. **Testes** — Unitários, integração, E2E. *Depende de 5-9.*

### Dependências Técnicas

- **Supabase:** usuário precisa criar as tabelas via SQL migration no dashboard do Supabase
- **html2pdf.js:** `yarn add html2pdf.js` (e tipos `@types/html2pdf.js` se disponível)
- **Nenhuma infraestrutura adicional** — sem Docker, sem serviços externos

## Monitoramento e Observabilidade

Para esta fase:

- **Logs:** `console.error` com contexto do orçamento (ID, usuário) para erros de CRUD e PDF
- **Métricas de performance:** medir tempo de cálculo de totais (deve ser < 16ms para não causar lag)
- **Erros de PDF:** capturar falhas do html2pdf.js (elemento não encontrado, canvas muito grande)
- **RLS:** verificar no Supabase Dashboard se policies estão aplicando corretamente (logs de SQL)
- **Futuro:** Sentry para tracking de erros em produção

## Considerações Técnicas

### Decisões Principais

| Decisão | Justificativa | Alternativas Rejeitadas |
|---|---|---|
| **html2pdf.js client-side** | Zero infra, gratuito, simples de integrar. Adequado para PDFs de orçamento (1-3 páginas). | Puppeteer server-side — mais fiel visualmente mas requer Chromium no servidor, complexo para micro SaaS. Gotenberg — requer Docker. @sidebase/nuxt-pdf — bom mas adiciona dependência de servidor complexa. |
| **Trigger PostgreSQL para numeração** | Atômico, seguro contra race conditions, gerado no banco antes do INSERT. | Sequência no frontend — pode gerar números duplicados em concorrência. Sequência PostgreSQL global — não isola por usuário. |
| **orcamento_itens unificado (tipo: servico/material)** | Schema mais simples, queries mais limpas. Coluna `tipo` diferencia. | Tabelas separadas `orcamento_servicos` e `orcamento_materiais` — mais normalizado mas queries mais complexas para totais. |
| **orcamento_version com JSONB snapshot** | Flexível, armazena estado completo sem esquema rígido. Fácil restauração. | Tabelas espelho com mesmas colunas — mais rígido, difícil evolução de schema. |
| **public_uuid como UUID** | Não sequencial, não guessable, seguro por obscuridade. | ID numérico com hash — mais complexo para pouco benefício. |
| **Supabase client direto (sem server routes)** | Maioria das operações é CRUD simples; RLS garante segurança. Menos código para manter. | Criar API layer com server routes — adiciona complexidade sem benefício nesta fase. |

### Riscos Conhecidos

| Risco | Impacto | Mitigação |
|---|---|---|
| **html2pdf.js inconsistência visual entre browsers** | PDF gerado pode variar visualmente. | Usar CSS inline, testar em Chromium/Firefox/WebKit. Template simples com poucas dependências de fontes. |
| **Trigger de numeração com race condition em INSERT simultâneo** | Dois orçamentos com mesmo número. | Trigger é BEFORE INSERT e usa MAX() com lock implícito do PostgreSQL. Para alto volume, usar advisory locks (`pg_advisory_xact_lock`). |
| **RLS policies mal configuradas** | Vazamento de dados entre usuários. | Revisar policies com `EXPLAIN` no Supabase. Testar com múltiplos usuários em E2E. |
| **Snapshot JSONB fica muito grande** | Performance de query degrada. | Limitar número de versões (ex: max 10). Compactar snapshot removendo campos desnecessários. |
| **Link público expõe dados sensíveis** | Qualquer pessoa com UUID acessa o orçamento. | UUID é não-guessable. Prestador pode revogar a qualquer momento. Não incluir dados financeiros do prestador além do necessário. |
| **html2pdf.js falha com orçamentos grandes** | Canvas muito grande para browser processar. | Paginar PDF se > X itens. Ou usar abordagem server-side como fallback futuro. |

### Conformidade com Skills Padrões

| Skill | Aplicação |
|---|---|
| `nuxt` | Pages, server routes, layouts, middleware, composables, auto-imports |
| `vue-composition-api` | Todos componentes com `<script setup lang="ts">` |
| `primevue` | DataTable, Dialog, ConfirmDialog, Select, InputNumber, Tag (status badges) |
| `tailwindcss` | Estilização responsiva, utilitários para layout de formulários e tabelas |
| `supabase` | CRUD via client, RLS policies, trigger de numeração, RPC calls |
| `atomic-design` | Componentes organizados em atoms/, molecules/, organisms/, templates/ |
| `vue-best-practices` | Props/emits tipados, SSR guards, reatividade otimizada com computed |

### Arquivos Relevantes e Dependentes

| Arquivo | Depende de |
|---|---|
| `supabase/migrations/001_clientes_orcamentos.sql` | — |
| `nuxt.config.ts` | — (possível registro de modules novos) |
| `package.json` | — (dependências: html2pdf.js) |
| `app/layouts/dashboard.vue` | — |
| `app/composables/useCurrency.ts` | — |
| `app/composables/useQuoteCalculations.ts` | — |
| `app/composables/useOrcamentos.ts` | Supabase, schema SQL |
| `app/composables/useClientes.ts` | Supabase, schema SQL |
| `app/composables/useQuotePdf.ts` | html2pdf.js |
| `app/pages/orcamentos/index.vue` | useOrcamentos, componentes organisms |
| `app/pages/orcamentos/novo.vue` | useOrcamentos, QuoteForm |
| `app/pages/orcamentos/[id].vue` | useOrcamentos, QuoteForm |
| `app/pages/public/orcamentos/[uuid].vue` | server route público |
| `app/pages/clientes/index.vue` | useClientes |
| `app/pages/clientes/novo.vue` | useClientes, ClienteForm |
| `app/components/atoms/AppSelect.vue` | PrimeVue Select |
| `app/components/atoms/AppTextarea.vue` | PrimeVue Textarea |
| `app/components/atoms/AppBadge.vue` | PrimeVue Tag |
| `app/components/atoms/AppCurrency.vue` | Intl.NumberFormat, PrimeVue InputNumber |
| `app/components/atoms/AppDateInput.vue` | PrimeVue Calendar |
| `app/components/molecules/QuoteItemRow.vue` | AppInput, AppButton |
| `app/components/molecules/QuoteTotals.vue` | useQuoteCalculations, AppCurrency |
| `app/components/molecules/QuoteStatusBadge.vue` | AppBadge |
| `app/components/molecules/ClienteForm.vue` | AppInput, AppButton |
| `app/components/molecules/ConfirmDialog.vue` | PrimeVue Dialog |
| `app/components/molecules/QuoteActions.vue` | PrimeVue Menu |
| `app/components/organisms/QuoteForm.vue` | QuoteItemRow, QuoteTotals, atoms |
| `app/components/organisms/QuoteList.vue` | PrimeVue DataTable |
| `app/components/organisms/ClienteList.vue` | PrimeVue DataTable |
| `app/components/organisms/DashboardSidebar.vue` | — |
| `app/components/organisms/QuotePdfTemplate.vue` | html2pdf.js |
| `app/components/organisms/PublicQuoteView.vue` | — |
| `app/components/templates/DashboardTemplate.vue` | DashboardSidebar |
| `app/components/templates/CrudPageTemplate.vue` | — |
| `app/components/templates/PublicPageTemplate.vue` | — |
| `app/middleware/orcamento-owner.ts` | Supabase |
| `server/api/orcamentos/numero.ts` | Supabase RPC |
| `server/api/orcamentos/public/[uuid].ts` | — |
