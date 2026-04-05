-- =====================================================
-- TESTES DO MIGRATION 001: Gestão de Orçamentos
-- =====================================================
-- INSTRUÇÕES:
-- 1. Primeiro execute o migration 001_clientes_orcamentos.sql
-- 2. Depois execute este arquivo de testes
-- 3. Substitua SEU_USER_ID pelo UUID do seu usuário autenticado
-- =====================================================

-- =============================================
-- TESTE 1: Numeração sequencial de orçamentos
-- =============================================
-- Substitua pelo UUID real do seu usuário (obter em: SELECT auth.uid();)
DO $$
DECLARE
  test_user_id UUID := auth.uid();  -- Usa o usuário logado
  test_cliente_id UUID;
  test_orcamento_id UUID;
  v_numero TEXT;
  v_count INTEGER;
BEGIN
  -- Verifica se há usuário autenticado
  IF test_user_id IS NULL THEN
    RAISE NOTICE '⚠️  AVISO: Nenhum usuário autenticado. Execute: SELECT auth.login(...) ou use um usuário real.';
    RAISE NOTICE '   Substitua auth.uid() pelo UUID do seu usuário nos testes abaixo.';
    RETURN;
  END IF;

  RAISE NOTICE '🧪 TESTE 1: Numeração sequencial de orçamentos';
  
  -- Criar cliente de teste
  INSERT INTO clientes (usuario_id, nome, email, telefone, empresa)
  VALUES (test_user_id, 'Cliente Teste', 'cliente@teste.com', '(11) 99999-9999', 'Empresa Teste LTDA')
  RETURNING id INTO test_cliente_id;
  
  RAISE NOTICE '   ✅ Cliente criado com ID: %', test_cliente_id;
  
  -- Inserir 3 orçamentos
  INSERT INTO orcamentos (usuario_id, cliente_id, titulo) VALUES (test_user_id, test_cliente_id, 'Orçamento Teste 1');
  INSERT INTO orcamentos (usuario_id, cliente_id, titulo) VALUES (test_user_id, test_cliente_id, 'Orçamento Teste 2');
  INSERT INTO orcamentos (usuario_id, cliente_id, titulo) VALUES (test_user_id, test_cliente_id, 'Orçamento Teste 3');
  
  -- Verificar numeração
  SELECT numero INTO v_numero FROM orcamentos WHERE usuario_id = test_user_id AND titulo = 'Orçamento Teste 1';
  IF v_numero = 'ORC-0001' THEN
    RAISE NOTICE '   ✅ Orçamento 1 = % (esperado: ORC-0001)', v_numero;
  ELSE
    RAISE NOTICE '   ❌ Orçamento 1 = % (esperado: ORC-0001)', v_numero;
  END IF;
  
  SELECT numero INTO v_numero FROM orcamentos WHERE usuario_id = test_user_id AND titulo = 'Orçamento Teste 2';
  IF v_numero = 'ORC-0002' THEN
    RAISE NOTICE '   ✅ Orçamento 2 = % (esperado: ORC-0002)', v_numero;
  ELSE
    RAISE NOTICE '   ❌ Orçamento 2 = % (esperado: ORC-0002)', v_numero;
  END IF;
  
  SELECT numero INTO v_numero FROM orcamentos WHERE usuario_id = test_user_id AND titulo = 'Orçamento Teste 3';
  IF v_numero = 'ORC-0003' THEN
    RAISE NOTICE '   ✅ Orçamento 3 = % (esperado: ORC-0003)', v_numero;
  ELSE
    RAISE NOTICE '   ❌ Orçamento 3 = % (esperado: ORC-0003)', v_numero;
  END IF;
  
  -- =============================================
  -- TESTE 2: INSERT e consulta de itens
  -- =============================================
  RAISE NOTICE '';
  RAISE NOTICE '🧪 TESTE 2: Itens de orçamento e CASCADE';
  
  SELECT id INTO test_orcamento_id FROM orcamentos WHERE usuario_id = test_user_id AND titulo = 'Orçamento Teste 1';
  
  -- Inserir itens
  INSERT INTO orcamento_itens (orcamento_id, tipo, descricao, quantidade, valor_unitario)
  VALUES (test_orcamento_id, 'servico', 'Instalação de ponto de luz', 2, 150.00);
  
  INSERT INTO orcamento_itens (orcamento_id, tipo, descricao, quantidade, valor_unitario)
  VALUES (test_orcamento_id, 'material', 'Fio elétrico 2.5mm (metro)', 50, 3.50);
  
  SELECT COUNT(*) INTO v_count FROM orcamento_itens WHERE orcamento_id = test_orcamento_id;
  IF v_count = 2 THEN
    RAISE NOTICE '   ✅ 2 itens inseridos no orçamento';
  ELSE
    RAISE NOTICE '   ❌ Esperado 2 itens, encontrado %', v_count;
  END IF;
  
  -- =============================================
  -- TESTE 3: Versionamento
  -- =============================================
  RAISE NOTICE '';
  RAISE NOTICE '🧪 TESTE 3: Versionamento de orçamento';
  
  INSERT INTO orcamento_version (orcamento_id, versao, snapshot)
  VALUES (test_orcamento_id, 1, '{"titulo": "Orçamento Teste 1", "status": "rascunho"}');
  
  SELECT COUNT(*) INTO v_count FROM orcamento_version WHERE orcamento_id = test_orcamento_id;
  IF v_count = 1 THEN
    RAISE NOTICE '   ✅ Versão 1 criada com sucesso';
  ELSE
    RAISE NOTICE '   ❌ Esperado 1 versão, encontrado %', v_count;
  END IF;
  
  -- =============================================
  -- TESTE 4: CASCADE DELETE
  -- =============================================
  RAISE NOTICE '';
  RAISE NOTICE '🧪 TESTE 4: CASCADE DELETE';
  
  DELETE FROM orcamentos WHERE id = test_orcamento_id;
  
  SELECT COUNT(*) INTO v_count FROM orcamento_itens WHERE orcamento_id = test_orcamento_id;
  IF v_count = 0 THEN
    RAISE NOTICE '   ✅ Itens deletados em cascata (COUNT = 0)';
  ELSE
    RAISE NOTICE '   ❌ Itens não foram deletados em cascata (COUNT = %)', v_count;
  END IF;
  
  SELECT COUNT(*) INTO v_count FROM orcamento_version WHERE orcamento_id = test_orcamento_id;
  IF v_count = 0 THEN
    RAISE NOTICE '   ✅ Versões deletadas em cascata (COUNT = 0)';
  ELSE
    RAISE NOTICE '   ❌ Versões não foram deletadas em cascata (COUNT = %)', v_count;
  END IF;
  
  -- =============================================
  -- TESTE 5: Link público
  -- =============================================
  RAISE NOTICE '';
  RAISE NOTICE '🧪 TESTE 5: Link público (public_uuid)';
  
  SELECT id INTO test_orcamento_id FROM orcamentos WHERE usuario_id = test_user_id AND titulo = 'Orçamento Teste 2';
  
  UPDATE orcamentos SET public_uuid = gen_random_uuid() WHERE id = test_orcamento_id;
  
  SELECT public_uuid INTO v_numero FROM orcamentos WHERE id = test_orcamento_id;
  IF v_numero IS NOT NULL THEN
    RAISE NOTICE '   ✅ public_uuid definido: %', v_numero;
  ELSE
    RAISE NOTICE '   ❌ public_uuid não foi definido';
  END IF;
  
  -- Limpar dados de teste
  RAISE NOTICE '';
  RAISE NOTICE '🧹 Limpando dados de teste...';
  DELETE FROM orcamentos WHERE usuario_id = test_user_id;
  DELETE FROM clientes WHERE id = test_cliente_id;
  RAISE NOTICE '   ✅ Dados de teste removidos';
  
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Todos os testes concluídos!';
  
END $$;

-- =============================================
-- TESTE MANUAL: Verificar RLS (executar com usuário diferente)
-- =============================================
-- Para testar RLS corretamente:
-- 1. Crie dois usuários no Supabase Auth
-- 2. Autentique com o usuário A
-- 3. Crie um orçamento
-- 4. Autentique com o usuário B
-- 5. Execute: SELECT * FROM orcamentos;
-- 6. Resultado esperado: 0 linhas (RLS bloqueia)
--
-- SQL de verificação (executar com usuário B):
-- SELECT COUNT(*) AS orcamentos_usuario_a FROM orcamentos WHERE usuario_id = 'UUID_USUARIO_A';
-- Resultado esperado: 0

-- =============================================
-- TESTE MANUAL: Verificar índice criados
-- =============================================
SELECT 
  indexname, 
  tablename 
FROM pg_indexes 
WHERE tablename IN ('clientes', 'orcamentos', 'orcamento_itens', 'orcamento_version')
ORDER BY tablename, indexname;
