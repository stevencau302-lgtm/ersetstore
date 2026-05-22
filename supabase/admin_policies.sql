-- ============================================
-- Admin Panel: RLS Policies untuk akses admin
-- Jalankan di Supabase SQL Editor
-- ============================================

-- Tambah kolom role ke profiles (opsional, untuk role-based access di masa depan)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer';

-- Admin bisa baca semua orders
CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin bisa update semua orders (untuk ubah status)
CREATE POLICY "Admin can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin bisa baca semua profiles
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin bisa CRUD products
CREATE POLICY "Admin can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Set admin role untuk email tertentu
-- Ganti email di bawah sesuai kebutuhan
UPDATE profiles SET role = 'admin' WHERE email IN ('admin@ersetstore.com', 'stevencau302@gmail.com');
