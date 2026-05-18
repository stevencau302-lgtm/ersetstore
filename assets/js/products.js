/* ============================================
   ERSET STORE - Product Database
   ============================================ */

const PRODUCTS = [
  // Gadget Accessories
  { id: 1, name: 'Wireless Earbuds Pro Bluetooth 5.3 Noise Cancelling', category: 'audio', emoji: '🎧', price: 285000, original: 450000, rating: 4.8, sold: 1240, badge: 'sale', stock: 45, desc: 'Wireless earbuds dengan teknologi ANC, baterai tahan 24 jam, dan kualitas suara HiFi. Cocok untuk musik, gaming, dan panggilan.' },
  { id: 2, name: 'Fast Charger USB-C 65W GaN Tech Universal', category: 'gadget', emoji: '🔌', price: 165000, original: 250000, rating: 4.9, sold: 2150, badge: 'sale', stock: 78, desc: 'Charger super cepat dengan teknologi GaN, support PD 3.0 dan QC 4.0. Compact dan ringan, support semua device.' },
  { id: 3, name: 'Magnetic Phone Holder Car Dashboard Premium', category: 'gadget', emoji: '📱', price: 89000, original: 150000, rating: 4.7, sold: 890, badge: 'new', stock: 120, desc: 'Holder magnet super kuat untuk dashboard mobil. Kompatibel dengan semua HP, instalasi mudah tanpa lem.' },
  { id: 4, name: 'Smart Watch Series 8 IP68 Waterproof', category: 'gadget', emoji: '⌚', price: 425000, original: 650000, rating: 4.6, sold: 567, badge: 'sale', stock: 34, desc: 'Smartwatch dengan layar AMOLED, monitor detak jantung, oxygen, sleep tracking, dan 100+ mode olahraga.' },
  { id: 5, name: 'Mini Bluetooth Speaker Waterproof 360 Sound', category: 'audio', emoji: '🔊', price: 145000, original: 220000, rating: 4.5, sold: 1080, stock: 90, desc: 'Speaker portable dengan suara 360 derajat, IPX7 waterproof, baterai tahan 12 jam, koneksi stabil.' },
  { id: 6, name: 'USB Hub 7-in-1 Type-C Adapter HDMI 4K', category: 'gadget', emoji: '💻', price: 195000, original: 320000, rating: 4.8, sold: 670, badge: 'sale', stock: 55, desc: 'Hub multifungsi dengan HDMI 4K, USB 3.0, SD card reader, PD charging. Cocok untuk laptop dan tablet.' },

  // Audio
  { id: 7, name: 'Gaming Headset RGB Surround 7.1 Pro', category: 'audio', emoji: '🎮', price: 320000, original: 480000, rating: 4.7, sold: 450, badge: 'sale', stock: 28, desc: 'Headset gaming dengan surround 7.1, microphone noise cancelling, RGB lighting, dan bantalan memory foam.' },
  { id: 8, name: 'Studio Microphone USB Condenser Podcast', category: 'audio', emoji: '🎤', price: 495000, original: 750000, rating: 4.9, sold: 230, badge: 'new', stock: 18, desc: 'Mikrofon kondenser kualitas studio untuk podcast, streaming, dan recording. Plug & play USB.' },

  // Homeware
  { id: 9, name: 'LED Strip RGB Smart App Control 5M', category: 'homeware', emoji: '💡', price: 125000, original: 200000, rating: 4.6, sold: 1650, badge: 'sale', stock: 200, desc: 'LED strip RGB warna-warni, kontrol via app, sync dengan musik, mode pesta, hemat energi.' },
  { id: 10, name: 'Aroma Diffuser Humidifier Wood Grain LED', category: 'homeware', emoji: '🕯️', price: 175000, original: 280000, rating: 4.7, sold: 720, stock: 65, desc: 'Diffuser ultrasonik dengan tampilan kayu elegan, 7 warna LED, 2 mode mist, auto shut-off.' },
  { id: 11, name: 'Vacuum Cleaner Mini Cordless Handheld', category: 'homeware', emoji: '🧹', price: 285000, original: 420000, rating: 4.5, sold: 380, badge: 'new', stock: 42, desc: 'Vacuum cordless ringan dan kuat untuk membersihkan mobil dan rumah. Baterai isi ulang USB-C.' },
  { id: 12, name: 'Smart Door Lock Fingerprint Bluetooth', category: 'homeware', emoji: '🔐', price: 850000, original: 1200000, rating: 4.8, sold: 145, badge: 'sale', stock: 15, desc: 'Kunci pintu pintar dengan sidik jari, password, kartu RFID, dan kontrol via smartphone.' },

  // Otomotif
  { id: 13, name: 'Car Vacuum Cleaner 12V High Power Wet Dry', category: 'otomotif', emoji: '🚗', price: 195000, original: 320000, rating: 4.6, sold: 540, badge: 'sale', stock: 70, desc: 'Vacuum mobil 120W dengan 5000Pa suction, support kering dan basah, kabel 5 meter.' },
  { id: 14, name: 'Dashcam 4K Dual Lens Front Rear Night Vision', category: 'otomotif', emoji: '📹', price: 685000, original: 950000, rating: 4.7, sold: 320, badge: 'new', stock: 25, desc: 'Dashcam 4K dengan dual lens depan-belakang, night vision, G-sensor, parking mode 24 jam.' },
  { id: 15, name: 'Tire Inflator Portable Digital Auto-Stop', category: 'otomotif', emoji: '🔧', price: 245000, original: 380000, rating: 4.8, sold: 480, stock: 60, desc: 'Pompa ban portable dengan layar LCD, auto-stop, support mobil, motor, sepeda, dan bola.' },
  { id: 16, name: 'LED Headlight H4 H7 Bulb 12000LM Super Bright', category: 'otomotif', emoji: '💡', price: 335000, original: 500000, rating: 4.6, sold: 290, stock: 38, desc: 'Lampu LED mobil super terang 12000 lumen, 6500K putih, instalasi plug & play, awet.' },

  // Outdoor Kit
  { id: 17, name: 'Camping Lantern LED Solar Rechargeable', category: 'outdoor', emoji: '🏕️', price: 145000, original: 220000, rating: 4.7, sold: 850, badge: 'sale', stock: 110, desc: 'Lentera camping LED dengan solar dan USB charging, 3 mode terang, anti air, lipat compact.' },
  { id: 18, name: 'Tactical Backpack 40L Waterproof Military', category: 'outdoor', emoji: '🎒', price: 385000, original: 580000, rating: 4.8, sold: 410, badge: 'sale', stock: 45, desc: 'Tas ransel taktis 40L bahan 1000D nylon, waterproof, multi-kompartemen, MOLLE system.' },
  { id: 19, name: 'Multi Tool 18-in-1 Stainless Steel Pocket', category: 'outdoor', emoji: '🛠️', price: 165000, original: 250000, rating: 4.9, sold: 1200, badge: 'sale', stock: 88, desc: 'Multitool 18 fungsi dari stainless steel, termasuk tang, pisau, obeng, gergaji, dan pembuka botol.' },
  { id: 20, name: 'Insulated Tumbler 750ml Stainless Vacuum', category: 'outdoor', emoji: '🥤', price: 125000, original: 180000, rating: 4.6, sold: 1450, stock: 200, desc: 'Tumbler vacuum insulated, dingin 24 jam panas 12 jam, 750ml, BPA-free, leak-proof.' },

  // Tools
  { id: 21, name: 'Cordless Drill 21V Brushless 2 Battery Pack', category: 'tools', emoji: '🔨', price: 685000, original: 950000, rating: 4.8, sold: 235, badge: 'new', stock: 22, desc: 'Bor cordless 21V dengan motor brushless, 2 baterai, 21+3 torsi, koper lengkap dengan aksesoris.' },
  { id: 22, name: 'Digital Multimeter LCD Auto Range Pro', category: 'tools', emoji: '📐', price: 165000, original: 245000, rating: 4.7, sold: 380, stock: 55, desc: 'Multimeter digital auto-range, LCD backlit, ukur tegangan, arus, resistansi, kapasitansi, suhu.' },
  { id: 23, name: 'Soldering Iron Kit 60W Adjustable Temperature', category: 'tools', emoji: '⚙️', price: 145000, original: 220000, rating: 4.6, sold: 520, stock: 70, desc: 'Solder kit 60W dengan suhu adjustable 200-450°C, pemanasan cepat, dilengkapi 5 mata solder.' },
  { id: 24, name: 'Laser Distance Meter 40M Digital Range Finder', category: 'tools', emoji: '📏', price: 245000, original: 380000, rating: 4.8, sold: 195, badge: 'new', stock: 30, desc: 'Pengukur jarak laser sampai 40 meter, akurasi ±2mm, fungsi area, volume, Pythagoras.' },

  // Hobby & Toys
  { id: 25, name: 'RC Drone 4K Camera GPS Brushless Foldable', category: 'hobby', emoji: '🚁', price: 1250000, original: 1850000, rating: 4.7, sold: 165, badge: 'sale', stock: 12, desc: 'Drone 4K dengan GPS, motor brushless, jarak 1km, terbang 25 menit, foldable design.' },
  { id: 26, name: '3D Printing Pen Kids Educational Creative', category: 'hobby', emoji: '🖊️', price: 195000, original: 295000, rating: 4.5, sold: 480, stock: 80, desc: 'Pen 3D printing untuk anak, suhu rendah aman, 10 warna filament, mengembangkan kreativitas.' },
  { id: 27, name: 'Mechanical Gaming Keyboard RGB Hot-Swappable', category: 'hobby', emoji: '⌨️', price: 485000, original: 750000, rating: 4.9, sold: 340, badge: 'sale', stock: 28, desc: 'Keyboard mechanical 87 tombol, hot-swappable, RGB per-key, switch tactile, frame aluminium.' },
  { id: 28, name: 'Pokemon Trading Card Booster Pack Original', category: 'toys', emoji: '🎴', price: 125000, original: 180000, rating: 4.8, sold: 920, stock: 150, desc: 'Booster pack original Pokemon TCG, 11 kartu per pack, kemungkinan dapat kartu rare dan holographic.' },
  { id: 29, name: 'Lego Compatible Building Blocks 1500 PCS', category: 'toys', emoji: '🧱', price: 285000, original: 420000, rating: 4.7, sold: 380, stock: 45, desc: 'Building blocks 1500 pieces compatible Lego, melatih motorik dan kreativitas anak, anti-toxic.' },
  { id: 30, name: 'Fidget Spinner Metal Premium Bearing Pro', category: 'toys', emoji: '🌀', price: 65000, original: 99000, rating: 4.4, sold: 1850, stock: 250, desc: 'Fidget spinner premium metal, bearing keramik, spin time 3+ menit, anti-stress, hadiah unik.' },
  { id: 31, name: 'Polaroid Mini Camera Instant Print Cute', category: 'hobby', emoji: '📷', price: 685000, original: 950000, rating: 4.6, sold: 220, badge: 'new', stock: 18, desc: 'Kamera polaroid mini, langsung cetak, mode auto exposure, selfie mirror, 5 efek warna.' },
  { id: 32, name: 'Yoga Mat Non-Slip Eco TPE 6mm Thick', category: 'outdoor', emoji: '🧘', price: 165000, original: 250000, rating: 4.7, sold: 720, stock: 95, desc: 'Matras yoga TPE eco-friendly, anti slip kedua sisi, tebal 6mm, ringan, dilengkapi tas.' },
];

const CATEGORIES = [
  { id: 'gadget', name: 'Gadget', icon: '📱', count: PRODUCTS.filter(p => p.category === 'gadget').length },
  { id: 'audio', name: 'Audio', icon: '🎧', count: PRODUCTS.filter(p => p.category === 'audio').length },
  { id: 'homeware', name: 'Homeware', icon: '🏠', count: PRODUCTS.filter(p => p.category === 'homeware').length },
  { id: 'otomotif', name: 'Otomotif', icon: '🚗', count: PRODUCTS.filter(p => p.category === 'otomotif').length },
  { id: 'outdoor', name: 'Outdoor', icon: '🏕️', count: PRODUCTS.filter(p => p.category === 'outdoor').length },
  { id: 'tools', name: 'Tools', icon: '🔧', count: PRODUCTS.filter(p => p.category === 'tools').length },
  { id: 'hobby', name: 'Hobby', icon: '🎨', count: PRODUCTS.filter(p => p.category === 'hobby').length },
  { id: 'toys', name: 'Toys', icon: '🧸', count: PRODUCTS.filter(p => p.category === 'toys').length },
];
