-- ============================================
-- ERSET STORE - Seed 32 Produk ke tabel products
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- Hapus data lama jika ada
TRUNCATE TABLE products RESTART IDENTITY;

INSERT INTO products (name, category, emoji, price, original_price, rating, sold, badge, stock, description) VALUES
('Wireless Earbuds Pro Bluetooth 5.3 Noise Cancelling', 'audio', '🎧', 285000, 450000, 4.8, 1240, 'sale', 45, 'Earbuds wireless dengan teknologi ANC, baterai tahan hingga 24 jam, dan kualitas suara HiFi. Cocok untuk dengerin musik, gaming, hingga panggilan kerja.'),
('Fast Charger USB-C 65W GaN Universal', 'gadget', '🔌', 165000, 250000, 4.9, 2150, 'sale', 78, 'Charger super cepat dengan teknologi GaN, support PD 3.0 dan QC 4.0. Bentuk compact dan ringan, support semua perangkat.'),
('Magnetic Phone Holder Mobil Premium', 'gadget', '📱', 89000, 150000, 4.7, 890, 'new', 120, 'Holder magnet super kuat untuk dashboard mobil. Kompatibel dengan semua HP, instalasi mudah tanpa lem dan tanpa bekas.'),
('Smart Watch Series 8 IP68 Waterproof', 'gadget', '⌚', 425000, 650000, 4.6, 567, 'sale', 34, 'Smartwatch dengan layar AMOLED, monitor detak jantung, oksigen darah, sleep tracking, dan 100+ mode olahraga.'),
('Mini Bluetooth Speaker Waterproof 360 Sound', 'audio', '🔊', 145000, 220000, 4.5, 1080, NULL, 90, 'Speaker portable dengan suara 360 derajat, sertifikat IPX7 waterproof, baterai tahan 12 jam, koneksi Bluetooth stabil.'),
('USB Hub 7-in-1 Type-C Adapter HDMI 4K', 'gadget', '💻', 195000, 320000, 4.8, 670, 'sale', 55, 'Hub multifungsi dengan HDMI 4K, USB 3.0, SD card reader, dan PD charging. Cocok untuk laptop, tablet, dan handphone.'),
('Gaming Headset RGB Surround 7.1 Pro', 'audio', '🎮', 320000, 480000, 4.7, 450, 'sale', 28, 'Headset gaming dengan suara surround 7.1, microphone noise cancelling, lampu RGB, dan bantalan memory foam super nyaman.'),
('Studio Microphone USB Condenser Podcast', 'audio', '🎤', 495000, 750000, 4.9, 230, 'new', 18, 'Mikrofon kondenser kualitas studio untuk podcast, streaming, dan rekaman. Tinggal colok USB, langsung pakai.'),
('LED Strip RGB Smart App Control 5M', 'homeware', '💡', 125000, 200000, 4.6, 1650, 'sale', 200, 'Lampu LED strip RGB warna-warni, kontrol via aplikasi, sync dengan musik, mode pesta, dan hemat energi.'),
('Aroma Diffuser Humidifier Wood Grain LED', 'homeware', '🕯️', 175000, 280000, 4.7, 720, NULL, 65, 'Diffuser aroma ultrasonik dengan tampilan motif kayu elegan, 7 warna LED, 2 mode mist, dan auto shut-off.'),
('Vacuum Cleaner Mini Cordless Handheld', 'homeware', '🧹', 285000, 420000, 4.5, 380, 'new', 42, 'Vacuum cleaner cordless ringan dan kuat untuk membersihkan mobil dan rumah. Baterai isi ulang via USB-C.'),
('Smart Door Lock Sidik Jari Bluetooth', 'homeware', '🔐', 850000, 1200000, 4.8, 145, 'sale', 15, 'Kunci pintu pintar dengan sidik jari, password, kartu RFID, dan kontrol via aplikasi smartphone.'),
('Vacuum Mobil 12V High Power Wet Dry', 'otomotif', '🚗', 195000, 320000, 4.6, 540, 'sale', 70, 'Vacuum khusus mobil 120W dengan daya isap 5000Pa, support kering dan basah, dilengkapi kabel sepanjang 5 meter.'),
('Dashcam 4K Dual Lens Depan-Belakang Night Vision', 'otomotif', '📹', 685000, 950000, 4.7, 320, 'new', 25, 'Dashcam 4K dengan dual lens depan dan belakang, night vision, G-sensor, dan parking mode 24 jam.'),
('Pompa Ban Portable Digital Auto-Stop', 'otomotif', '🔧', 245000, 380000, 4.8, 480, NULL, 60, 'Pompa ban portable dengan layar LCD, auto-stop sesuai tekanan, support mobil, motor, sepeda, dan bola.'),
('Lampu LED Mobil H4 H7 12000LM Super Terang', 'otomotif', '🚙', 335000, 500000, 4.6, 290, NULL, 38, 'Lampu LED mobil super terang 12000 lumen, warna 6500K putih, instalasi plug & play, dijamin awet.'),
('Lentera Camping LED Solar Rechargeable', 'outdoor', '🏕️', 145000, 220000, 4.7, 850, 'sale', 110, 'Lentera camping LED dengan tenaga solar dan USB charging, 3 mode terang, anti air, dan bisa dilipat compact.'),
('Tas Ransel Tactical 40L Waterproof Military', 'outdoor', '🎒', 385000, 580000, 4.8, 410, 'sale', 45, 'Tas ransel taktis 40L bahan nylon 1000D, anti air, multi-kompartemen, dan dilengkapi sistem MOLLE.'),
('Multi Tool 18-in-1 Stainless Steel Pocket', 'outdoor', '🛠️', 165000, 250000, 4.9, 1200, 'sale', 88, 'Multitool 18 fungsi dari stainless steel, termasuk tang, pisau, obeng, gergaji, dan pembuka botol.'),
('Insulated Tumbler 750ml Stainless Vacuum', 'outdoor', '🥤', 125000, 180000, 4.6, 1450, NULL, 200, 'Tumbler vacuum insulated, dingin 24 jam panas 12 jam, 750ml, BPA-free, dan anti bocor.'),
('Cordless Drill 21V Brushless 2 Battery Pack', 'tools', '🔨', 685000, 950000, 4.8, 235, 'new', 22, 'Bor cordless 21V dengan motor brushless, 2 baterai, 21+3 torsi, koper lengkap dengan aksesoris.'),
('Digital Multimeter LCD Auto Range Pro', 'tools', '📐', 165000, 245000, 4.7, 380, NULL, 55, 'Multimeter digital auto-range, LCD backlit, ukur tegangan, arus, resistansi, kapasitansi, dan suhu.'),
('Soldering Iron Kit 60W Adjustable Temperature', 'tools', '⚙️', 145000, 220000, 4.6, 520, NULL, 70, 'Solder kit 60W dengan suhu adjustable 200-450°C, pemanasan cepat, dilengkapi 5 mata solder.'),
('Laser Distance Meter 40M Digital Range Finder', 'tools', '📏', 245000, 380000, 4.8, 195, 'new', 30, 'Pengukur jarak laser sampai 40 meter, akurasi ±2mm, fungsi area, volume, dan Pythagoras.'),
('RC Drone 4K Camera GPS Brushless Foldable', 'hobby', '🚁', 1250000, 1850000, 4.7, 165, 'sale', 12, 'Drone 4K dengan GPS, motor brushless, jarak 1km, terbang 25 menit, dan foldable design.'),
('3D Printing Pen Kids Educational Creative', 'hobby', '🖊️', 195000, 295000, 4.5, 480, NULL, 80, 'Pen 3D printing untuk anak, suhu rendah aman, 10 warna filament, mengembangkan kreativitas.'),
('Keyboard Mechanical Gaming RGB Hot-Swappable', 'hobby', '⌨️', 485000, 750000, 4.9, 340, 'sale', 28, 'Keyboard mechanical 87 tombol, hot-swappable, RGB per-tombol, switch tactile, frame aluminium kokoh.'),
('Pokemon Trading Card Booster Pack Original', 'toys', '🎴', 125000, 180000, 4.8, 920, NULL, 150, 'Booster pack original Pokemon TCG, isi 11 kartu per pack, kemungkinan dapat kartu rare dan holographic.'),
('Building Blocks Compatible Lego 1500 PCS', 'toys', '🧱', 285000, 420000, 4.7, 380, NULL, 45, 'Building blocks 1500 pieces compatible Lego, melatih motorik dan kreativitas anak, bahan anti-toxic.'),
('Fidget Spinner Metal Premium Bearing Pro', 'toys', '🌀', 65000, 99000, 4.4, 1850, NULL, 250, 'Fidget spinner premium dari metal, bearing keramik, spin time 3+ menit, anti-stress, hadiah unik.'),
('Polaroid Mini Camera Instant Print', 'hobby', '📷', 685000, 950000, 4.6, 220, 'new', 18, 'Kamera polaroid mini, langsung cetak, mode auto exposure, selfie mirror, dan 5 efek warna.'),
('Yoga Mat Non-Slip Eco TPE 6mm Thick', 'outdoor', '🧘', 165000, 250000, 4.7, 720, NULL, 95, 'Matras yoga TPE eco-friendly, anti slip kedua sisi, tebal 6mm, ringan, dan dilengkapi tas.');
