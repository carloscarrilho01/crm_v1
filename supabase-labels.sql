-- ============================================
-- SCHEMA PARA ETIQUETAS DE CONVERSAS
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- 1. Tabela de Etiquetas
CREATE TABLE IF NOT EXISTS labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#25D366',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para ordenacao
CREATE INDEX IF NOT EXISTS idx_labels_order ON labels("order" ASC);

-- 2. Adicionar coluna label_id na tabela conversations
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS label_id UUID REFERENCES labels(id) ON DELETE SET NULL;

-- Indice para busca por etiqueta
CREATE INDEX IF NOT EXISTS idx_conversations_label_id ON conversations(label_id);

-- 3. RLS para labels
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for labels"
ON labels FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Etiquetas padrao (estilo WhatsApp Business)
INSERT INTO labels (name, color, "order") VALUES
  ('Novo Cliente', '#25D366', 1),
  ('Aguardando Resposta', '#FFB800', 2),
  ('Pagamento Pendente', '#FF5722', 3),
  ('Em Negociacao', '#2196F3', 4),
  ('Resolvido', '#4CAF50', 5),
  ('Importante', '#E91E63', 6)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSTRUCOES:
-- 1. Acesse o Supabase Dashboard
-- 2. Va em "SQL Editor"
-- 3. Cole e execute este script
-- 4. Verifique se a tabela 'labels' foi criada
-- 5. Verifique se a coluna 'label_id' foi adicionada em 'conversations'
-- ============================================
