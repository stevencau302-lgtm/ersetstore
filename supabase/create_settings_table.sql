-- ============================================
-- Store Settings (key-value) table
-- Jalankan di Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS store_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Semua authenticated user bisa baca (serverless function butuh ini)
CREATE POLICY "Anyone can read settings" ON store_settings
  FOR SELECT USING (true);

-- Hanya admin yang bisa update/insert
CREATE POLICY "Admin can manage settings" ON store_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed default settings
INSERT INTO store_settings (key, value) VALUES
  ('binderbyte_api_key', ''),
  ('store_origin_id', 'dist_31.72.05'),
  ('store_name', 'ERSET GEAR LAB')
ON CONFLICT (key) DO NOTHING;
