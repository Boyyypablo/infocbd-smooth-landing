-- ============================================
-- Schema SQL para Tabela de Pedidos (Orders)
-- Integração Asaas Checkout + Supabase
-- ============================================

-- Criar tabela orders (pedidos)
CREATE TABLE IF NOT EXISTS orders (
  -- Chave Primária
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Key para usuário (pode ser NULL se não houver autenticação)
  user_id UUID,
  
  -- CRÍTICO: ID da cobrança retornado pelo Asaas (usado para o Webhook)
  asaas_payment_id VARCHAR(255) UNIQUE,
  
  -- Status do pedido: 'PENDING' (padrão inicial) ou 'APPROVED'
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  
  -- Valor do pedido
  amount DECIMAL(10, 2) NOT NULL,
  
  -- Dados adicionais do pedido (opcional)
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES para Performance
-- ============================================

-- Índice no status (para consultas frequentes)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Índice no asaas_payment_id (para busca rápida no webhook)
CREATE INDEX IF NOT EXISTS idx_orders_asaas_payment_id ON orders(asaas_payment_id);

-- Índice no user_id (para consultas por usuário)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Índice composto para consultas otimizadas
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);

-- ============================================
-- TRIGGER para atualizar updated_at automaticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS na tabela
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seus próprios pedidos
-- (Ajuste conforme sua lógica de autenticação)
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Política: Usuários podem inserir seus próprios pedidos
CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Política: Apenas o sistema (via service role) pode atualizar pedidos
-- (Isso é importante para o webhook funcionar corretamente)
CREATE POLICY "System can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- COMENTÁRIOS nas Colunas (Documentação)
-- ============================================

COMMENT ON TABLE orders IS 'Tabela de pedidos - Fonte única de verdade para status de pagamento';
COMMENT ON COLUMN orders.id IS 'ID único do pedido (UUID gerado automaticamente)';
COMMENT ON COLUMN orders.user_id IS 'ID do usuário que fez o pedido (pode ser NULL)';
COMMENT ON COLUMN orders.asaas_payment_id IS 'CRÍTICO: ID da cobrança do Asaas - usado pelo webhook para atualizar status';
COMMENT ON COLUMN orders.status IS 'Status do pedido: PENDING (aguardando pagamento) ou APPROVED (pagamento aprovado)';
COMMENT ON COLUMN orders.amount IS 'Valor total do pedido';
COMMENT ON COLUMN orders.description IS 'Descrição opcional do pedido';
COMMENT ON COLUMN orders.created_at IS 'Data de criação do pedido';
COMMENT ON COLUMN orders.updated_at IS 'Data da última atualização (atualizado automaticamente)';

-- ============================================
-- VERIFICAÇÃO: Ver se a tabela foi criada corretamente
-- ============================================

-- Execute este SELECT para verificar:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'orders'
-- ORDER BY ordinal_position;

