-- =====================================================
-- Migration 001: Schema completo para Gestão de Orçamentos
-- =====================================================
-- Tabelas: clientes, orcamentos, orcamento_itens, orcamento_version
-- Trigger: gerar_numero_orcamento()
-- RLS: Políticas de isolamento por usuário + link público
-- =====================================================

-- =============================================
-- 1. TABELA: clientes
-- =============================================
CREATE TABLE IF NOT EXISTS clientes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  email         TEXT NOT NULL,
  telefone      TEXT,
  empresa       TEXT,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. TABELA: orcamentos
-- =============================================
CREATE TABLE IF NOT EXISTS orcamentos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id     UUID REFERENCES clientes(id) ON DELETE SET NULL,
  numero         TEXT NOT NULL,              -- gerado por trigger (ORC-0001)
  titulo         TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'rascunho',
  desconto_tipo  TEXT,                        -- 'percentual' ou 'fixo'
  desconto_valor NUMERIC DEFAULT 0,
  validade       DATE,
  observacoes    TEXT,
  public_uuid    UUID UNIQUE DEFAULT NULL,    -- UUID para link público
  criado_em      TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. TABELA: orcamento_itens (serviços e materiais unificados)
-- =============================================
CREATE TABLE IF NOT EXISTS orcamento_itens (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id   UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  tipo           TEXT NOT NULL,              -- 'servico' ou 'material'
  descricao      TEXT NOT NULL,
  quantidade     NUMERIC NOT NULL DEFAULT 1,
  valor_unitario NUMERIC NOT NULL DEFAULT 0,
  criado_em      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. TABELA: orcamento_version (snapshots de versionamento)
-- =============================================
CREATE TABLE IF NOT EXISTS orcamento_version (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id   UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  versao         INTEGER NOT NULL,           -- 1, 2, 3...
  snapshot       JSONB NOT NULL,             -- snapshot completo do orçamento
  criado_em      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. TRIGGER: gerar_numero_orcamento()
-- =============================================
-- Gera numeração sequencial por usuário: ORC-0001, ORC-0002, ...
CREATE OR REPLACE FUNCTION gerar_numero_orcamento()
RETURNS TRIGGER AS $$
DECLARE
  proximo_num INTEGER;
BEGIN
  SELECT COALESCE(
    (SELECT MAX(SUBSTRING(numero FROM 5)::INTEGER) FROM orcamentos WHERE usuario_id = NEW.usuario_id),
    0
  ) + 1
    INTO proximo_num;
  NEW.numero := 'ORC-' || LPAD(proximo_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gerar_numero_orcamento ON orcamentos;
CREATE TRIGGER trg_gerar_numero_orcamento
  BEFORE INSERT ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION gerar_numero_orcamento();

-- =============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_version ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------
-- 6.1 Policies: clientes
-- ---------------------------------------------
CREATE POLICY "Usuarios veem proprios clientes"
  ON clientes
  FOR ALL
  USING (usuario_id = auth.uid())
  WITH CHECK (usuario_id = auth.uid());

-- ---------------------------------------------
-- 6.2 Policies: orcamentos
-- ---------------------------------------------
-- CRUD normal para usuário autenticado
CREATE POLICY "Usuarios veem proprios orcamentos"
  ON orcamentos
  FOR ALL
  USING (usuario_id = auth.uid())
  WITH CHECK (usuario_id = auth.uid());

-- Link público: permite SELECT sem autenticação quando public_uuid existe
CREATE POLICY "Link publico permite leitura"
  ON orcamentos
  FOR SELECT
  USING (public_uuid IS NOT NULL);

-- ---------------------------------------------
-- 6.3 Policies: orcamento_itens
-- ---------------------------------------------
-- Segue acesso via orçamento pai
CREATE POLICY "Usuarios veem itens dos proprios orcamentos"
  ON orcamento_itens
  FOR ALL
  USING (
    orcamento_id IN (
      SELECT id FROM orcamentos WHERE usuario_id = auth.uid()
    )
  )
  WITH CHECK (
    orcamento_id IN (
      SELECT id FROM orcamentos WHERE usuario_id = auth.uid()
    )
  );

-- Link público: permite SELECT de itens quando orçamento tem public_uuid
CREATE POLICY "Link publico permite leitura de itens"
  ON orcamento_itens
  FOR SELECT
  USING (
    orcamento_id IN (
      SELECT id FROM orcamentos WHERE public_uuid IS NOT NULL
    )
  );

-- ---------------------------------------------
-- 6.4 Policies: orcamento_version
-- ---------------------------------------------
-- Segue acesso via orçamento pai
CREATE POLICY "Usuarios veem versoes dos proprios orcamentos"
  ON orcamento_version
  FOR ALL
  USING (
    orcamento_id IN (
      SELECT id FROM orcamentos WHERE usuario_id = auth.uid()
    )
  )
  WITH CHECK (
    orcamento_id IN (
      SELECT id FROM orcamentos WHERE usuario_id = auth.uid()
    )
  );

-- =============================================
-- 7. ÍNDICES para performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_clientes_usuario_id ON clientes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_usuario_id ON orcamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_public_uuid ON orcamentos(public_uuid);
CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON orcamentos(status);
CREATE INDEX IF NOT EXISTS idx_orcamento_itens_orcamento_id ON orcamento_itens(orcamento_id);
CREATE INDEX IF NOT EXISTS idx_orcamento_itens_tipo ON orcamento_itens(tipo);
CREATE INDEX IF NOT EXISTS idx_orcamento_version_orcamento_id ON orcamento_version(orcamento_id);

-- =============================================
-- 8. FUNÇÃO AUXILIAR: atualizar atualizado_em
-- =============================================
CREATE OR REPLACE FUNCTION atualizar_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clientes_atualizado_em
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_atualizado_em();

CREATE TRIGGER trg_orcamentos_atualizado_em
  BEFORE UPDATE ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_atualizado_em();
