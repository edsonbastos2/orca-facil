/**
 * Script de teste para validar o migration 001_clientes_orcamentos.sql
 * 
 * Testes:
 * 1. Inserir cliente e verificar vínculo com usuário
 * 2. Inserir 3 orçamentos e verificar numeração sequencial (ORC-0001, ORC-0002, ORC-0003)
 * 3. Verificar RLS bloqueando acesso entre usuários diferentes
 * 4. Verificar link público permitindo SELECT sem auth
 * 5. Verificar CASCADE DELETE (deletar orçamento deleta itens e versões)
 * 
 * NOTA: Este script requer um usuário autenticado no Supabase.
 * Para testes de RLS, precisamos de dois usuários diferentes.
 * Os testes de numeração e estrutura podem ser feitos com um único usuário.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis SUPABASE_URL e SUPABASE_ANON_KEY devem estar definidas no .env');
  process.exit(1);
}

// NOTA: Com a chave anon, o Supabase aplica RLS automaticamente.
// Para testes completos, precisamos de autenticação real.
// Este script serve mais como documentação dos testes necessários.

async function runTests() {
  console.log('🧪 Iniciando testes do migration 001_clientes_orcamentos.sql\n');
  console.log('⚠️  NOTA: Os testes completos requerem autenticação real no Supabase.');
  console.log('   Execute o SQL migration manualmente no Supabase Dashboard.\n');
  console.log('📋 Checklist para execução manual:\n');
  
  const checklist = [
    '1. Acesse: https://supabase.com/dashboard/project/zrhnbvfcohkvderfnxdn/editor/sql',
    '2. Cole o conteúdo de supabase/migrations/001_clientes_orcamentos.sql',
    '3. Execute o SQL e verifique que não há erros\n',
    
    'Testes de validação:',
    '  ✅ 1. Inserir cliente → verificar que é vinculado ao usuário autenticado',
    '  ✅ 2. Inserir 3 orçamentos → verificar numeração sequencial ORC-0001, ORC-0002, ORC-0003',
    '  ✅ 3. Inserir orçamento e tentar consultar com usuário diferente → verificar RLS bloqueia',
    '  ✅ 4. Setar public_uuid → consultar sem auth → verificar que retorna dados',
    '  ✅ 5. Deletar orçamento → verificar que itens e versões são deletados em cascata\n',
    
    'SQL para teste de numeração:',
    '```sql',
    '-- Inserir 3 orçamentos de teste (substitua SEU_USER_ID pelo UUID do seu usuário)',
    "INSERT INTO orcamentos (usuario_id, titulo, cliente_id) VALUES ('SEU_USER_ID', 'Teste 1', NULL);",
    "INSERT INTO orcamentos (usuario_id, titulo, cliente_id) VALUES ('SEU_USER_ID', 'Teste 2', NULL);",
    "INSERT INTO orcamentos (usuario_id, titulo, cliente_id) VALUES ('SEU_USER_ID', 'Teste 3', NULL);",
    '',
    '-- Verificar numeração',
    "SELECT numero, titulo FROM orcamentos WHERE usuario_id = 'SEU_USER_ID' ORDER BY criado_em;",
    '-- Resultado esperado: ORC-0001, ORC-0002, ORC-0003',
    '```\n',
    
    'SQL para teste de RLS:',
    '```sql',
    '-- Com usuário diferente, tentar consultar orçamentos do primeiro usuário',
    '-- Resultado esperado: 0 linhas (RLS bloqueia)',
    '```\n',
    
    'SQL para teste de link público:',
    '```sql',
    '-- Definir public_uuid em um orçamento',
    "UPDATE orcamentos SET public_uuid = gen_random_uuid() WHERE numero = 'ORC-0001';",
    '',
    '-- Consultar com chave anon (sem auth) usando o UUID gerado',
    '-- Resultado esperado: retorna o orçamento ORC-0001',
    '```\n',
    
    'SQL para teste de CASCADE DELETE:',
    '```sql',
    '-- Inserir itens e versão em um orçamento',
    "INSERT INTO orcamento_itens (orcamento_id, tipo, descricao, quantidade, valor_unitario) VALUES ((SELECT id FROM orcamentos WHERE numero = 'ORC-0001'), 'servico', 'Teste', 1, 100);",
    "INSERT INTO orcamento_version (orcamento_id, versao, snapshot) VALUES ((SELECT id FROM orcamentos WHERE numero = 'ORC-0001'), 1, '{}');",
    '',
    '-- Deletar orçamento',
    "DELETE FROM orcamentos WHERE numero = 'ORC-0001';",
    '',
    '-- Verificar que itens e versões foram deletados',
    "SELECT COUNT(*) FROM orcamento_itens WHERE orcamento_id IN (SELECT id FROM orcamentos WHERE numero = 'ORC-0001');",
    '-- Resultado esperado: 0',
    '```'
  ];
  
  checklist.forEach(line => console.log(line));
}

runTests().catch(err => {
  console.error('❌ Erro nos testes:', err.message);
  process.exit(1);
});
