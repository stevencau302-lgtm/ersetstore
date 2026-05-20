-- ============================================
-- Tambah kolom alamat ke tabel profiles
-- Jalankan di Supabase SQL Editor
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shipping_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shipping_phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shipping_address text;
