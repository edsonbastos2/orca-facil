# Tarefa 1.0: Schema SQL e Migration

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o schema completo do banco de dados no Supabase com todas as tabelas, chaves estrangeiras, Row Level Security (RLS) policies e trigger de numeração sequencial para orçamentos. Este é o alicerce sobre o qual todo o Módulo 2 será construído.

<skills>
### Conformidade com Skills Padrões

- `supabase` — Tabelas, RLS policies, triggers, SQL migrations
- `postgresql` — Funções PL/pgSQL, triggers, constraints
</skills>

<requirements>
- 4 tabelas: clientes, orcamentos, orcamento_itens, orcamento_version
- RLS policies isolando dados por usuario_id = auth.uid()
- Trigger gerar_numero_orcamento() para numeração sequencial por usuário (ORC-0001)
- Foreign keys com ON DELETE CASCADE/SET NULL
- Link público via policy de SELECT com public_uuid
</requirements>

## Subtarefas

- [ ] 1.1 Criar diretório `supabase/migrations/` se não existir
- [ ] 1.2 Criar `supabase/migrations/001_clientes_orcamentos.sql` com tabela `clientes` (id, usuario_id, nome, email, telefone, empresa, timestamps)
- [ ] 1.3 Adicionar tabela `orcamentos` (id, usuario_id, cliente_id, numero, titulo, status, desconto_tipo, desconto_valor, validade, observacoes, public_uuid, timestamps)
- [ ] 1.4 Adicionar tabela `orcamento_itens` (id, orcamento_id, tipo, descricao, quantidade, valor_unitario, criado_em) — serviços e materiais unificados
- [ ] 1.5 Adicionar tabela `orcamento_version` (id, orcamento_id, versao, snapshot JSONB, criado_em)
- [ ] 1.6 Criar trigger `gerar_numero_orcamento()` — BEFORE INSERT, gera ORC-0001 sequencial por usuário
- [ ] 1.7 Habilitar RLS em todas as 4 tabelas
- [ ] 1.8 Criar policies de "usuário vê apenas seus próprios dados" para clientes, orcamentos, orcamento_itens, orcamento_version
- [ ] 1.9 Criar policy de "Link público permite leitura" em orcamentos (SELECT quando public_uuid IS NOT NULL)
- [ ] 1.10 Adicionar índices em colunas de filtro frequente (usuario_id, orcamento_id, public_uuid)
- [ ] 1.11 Executar SQL no Supabase Dashboard e verificar que todas as tabelas foram criadas sem erros
- [ ] 1.12 Testar trigger: inserir 3 orçamentos de teste e verificar ORC-0001, ORC-0002, ORC-0003

## Detalhes de Implementação

Consultar a `techspec.md` desta pasta — Seção "Modelos de Dados" contém o SQL completo com todas as tabelas, trigger, RLS policies e índices.

## Critérios de Sucesso

- Todas as 4 tabelas criadas no Supabase sem erros
- Trigger de numeração funciona: 1º orçamento = ORC-0001, 2º = ORC-0002
- RLS ativado em todas as tabelas
- Policies corretas: usuário só vê seus próprios dados
- Policy de link público permite SELECT sem autenticação quando public_uuid existe
- Foreign keys com comportamento correto (CASCADE/SET NULL)

## Testes da Tarefa

- [ ] **SQL manual:** Inserir cliente → verificar que é vinculado ao usuário autenticado
- [ ] **SQL manual:** Inserir 3 orçamentos → verificar numeração sequencial ORC-0001, ORC-0002, ORC-0003
- [ ] **SQL manual:** Inserir orçamento e tentar consultar com usuário diferente → verificar RLS bloqueia
- [ ] **SQL manual:** Setar public_uuid → consultar sem auth → verificar que retorna dados
- [ ] **SQL manual:** Deletar orçamento → verificar que itens e versões são deletados em cascata

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `supabase/migrations/001_clientes_orcamentos.sql` — novo (schema completo)
