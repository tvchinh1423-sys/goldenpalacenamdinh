// Data & Preset Templates for Wedding Personalization Suite — Golden Palace

export const LED_SCREEN_FLOORS = [
  { 
    id: 'tang-1', 
    name: 'Tầng 1 (5.12m × 2.72m)', 
    shortName: 'Tầng 1', 
    widthMeters: 5.12, 
    heightMeters: 2.72, 
    aspectRatio: '512 / 272', 
    aspectClass: 'aspect-[512/272]',
    specText: 'Kích thước Màn LED: 5.12m x 2.72m (Tỷ lệ 1.88:1)' 
  },
  { 
    id: 'tang-2', 
    name: 'Tầng 2 (7.04m × 3.36m)', 
    shortName: 'Tầng 2', 
    widthMeters: 7.04, 
    heightMeters: 3.36, 
    aspectRatio: '704 / 336', 
    aspectClass: 'aspect-[704/336]',
    specText: 'Kích thước Màn LED: 7.04m x 3.36m (Tỷ lệ 2.10:1)' 
  },
  { 
    id: 'tang-3', 
    name: 'Tầng 3 (7.04m × 3.84m)', 
    shortName: 'Tầng 3', 
    widthMeters: 7.04, 
    heightMeters: 3.84, 
    aspectRatio: '704 / 384', 
    aspectClass: 'aspect-[704/384]',
    specText: 'Kích thước Màn LED: 7.04m x 3.84m (Tỷ lệ 1.83:1)' 
  },
  { 
    id: 'tang-4', 
    name: 'Tầng 4 (5.12m × 2.72m)', 
    shortName: 'Tầng 4', 
    widthMeters: 5.12, 
    heightMeters: 2.72, 
    aspectRatio: '512 / 272', 
    aspectClass: 'aspect-[512/272]',
    specText: 'Kích thước Màn LED: 5.12m x 2.72m (Tỷ lệ 1.88:1)' 
  }
];

export const LED_STAGE_TEMPLATES = [
  {
    id: 'led-starry-diamond',
    name: '1. Bầu Trời Sao Đêm Kim Cương',
    slogan: '',
    defaultVenueId: 'tang-3',
    bgImage: '/images/led-bg/starry-night-1.jpg',
    borderColor: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.7)',
    accentColor: '#ffffff',
    subTextColor: '#e2e8f0',
    monogramStyle: 'DIDONE_INTERLOCKED',
    fontFamily: 'font-greatvibes',
    badge: ''
  },
  {
    id: 'led-cosmic-milkyway',
    name: '2. Dải Ngân Hà Cosmic Galaxy',
    slogan: '',
    defaultVenueId: 'tang-2',
    bgImage: '/images/led-bg/starry-night-2.jpg',
    borderColor: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.8)',
    accentColor: '#ffffff',
    subTextColor: '#cbd5e1',
    monogramStyle: 'DIDONE_INTERLOCKED',
    fontFamily: 'font-greatvibes',
    badge: ''
  },
  {
    id: 'led-constellation-magic',
    name: '3. Mạn Sao Huyền Ảo Constellation',
    slogan: '',
    defaultVenueId: 'tang-4',
    bgImage: '/images/led-bg/starry-night-3.jpg',
    borderColor: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.75)',
    accentColor: '#ffffff',
    subTextColor: '#94a3b8',
    monogramStyle: 'DIDONE_INTERLOCKED',
    fontFamily: 'font-greatvibes',
    badge: ''
  }
];

export const MUSIC_CATEGORIES = [
  { id: 'welcome', label: '1. Đón Khách (Ballad nhẹ nhàng & Lofi)', desc: 'Giai đoạn tập trung lãng mạn, du dương để quan khách thoải mái khi bước vào sảnh tiệc.' },
  { id: 'entrance', label: '2. Nghi Lễ Chính (Trang trọng & Xúc động)', desc: 'Ca khúc có thông điệp sâu sắc về lời hứa và sự gắn kết bền lâu khi sánh bước lên lễ đường.' },
  { id: 'toast', label: '3. Khai Tiệc & Nâng Ly (Rộn ràng & Sôi động)', desc: 'Khuấy động bầu không khí, khiến khách mời hào hứng chung vui cùng gia đình.' },
  { id: 'dining', label: '4. Giao Lưu & Tiễn Khách (Vui vẻ & Đầm ấm)', desc: 'Duy trì năng lượng tích cực với nhạc Pop/Remix rộn ràng cho phần kết tiệc viên mãn.' }
];

export const MUSIC_TRACKS = [
  // Giai đoạn 1: Đón khách
  { id: 'w1', catId: 'welcome', title: 'Đi Tìm Tình Yêu', artist: 'MONO', duration: '3:15', youtubeUrl: 'https://www.youtube.com/watch?v=GOSiWQlZdVU' },
  { id: 'w2', catId: 'welcome', title: 'Có Em Đời Bỗng Vui', artist: 'Chillies', duration: '3:40', youtubeUrl: 'https://www.youtube.com/watch?v=2O7U0uJ02V8' },
  { id: 'w3', catId: 'welcome', title: 'Lễ Đường', artist: 'Kai Đinh', duration: '3:50', youtubeUrl: 'https://www.youtube.com/watch?v=s97vSIn5E0w' },
  { id: 'w4', catId: 'welcome', title: 'Until I Found You', artist: 'Stephen Sanchez', duration: '2:57', youtubeUrl: 'https://www.youtube.com/watch?v=GxldQ9eX2fc' },

  // Giai đoạn 2: Nghi lễ chính
  { id: 'e1', catId: 'entrance', title: 'Em Đồng Ý (I Do)', artist: 'Đức Phúc x 911', duration: '3:34', youtubeUrl: 'https://www.youtube.com/watch?v=0A6QNUXn000' },
  { id: 'e2', catId: 'entrance', title: 'Nắm Lấy Tay Anh', artist: 'Tuấn Hưng', duration: '4:10', youtubeUrl: 'https://www.youtube.com/watch?v=aG0g1rOIn7g' },
  { id: 'e3', catId: 'entrance', title: 'Lover', artist: 'Taylor Swift', duration: '3:41', youtubeUrl: 'https://www.youtube.com/watch?v=-BjZmE2gtdo' },
  { id: 'e4', catId: 'entrance', title: 'Yes I Do', artist: 'Only C x Lou Hoàng', duration: '3:55', youtubeUrl: 'https://www.youtube.com/watch?v=Zt_35B07X9Y' },
  { id: 'e5', catId: 'entrance', title: 'Beautiful in White', artist: 'Westlife', duration: '3:52', youtubeUrl: 'https://www.youtube.com/watch?v=XRNL56lYc2E' },

  // Giai đoạn 3: Rót rượu & Cắt bánh
  { id: 't1', catId: 'toast', title: 'Marry You', artist: 'Bruno Mars', duration: '3:50', youtubeUrl: 'https://www.youtube.com/watch?v=83XlW4h16Wk' },
  { id: 't2', catId: 'toast', title: 'Hơn Cả Yêu', artist: 'Đức Phúc', duration: '4:15', youtubeUrl: 'https://www.youtube.com/watch?v=f0b2f-G1gU8' },
  { id: 't3', catId: 'toast', title: 'Sugar', artist: 'Maroon 5', duration: '3:55', youtubeUrl: 'https://www.youtube.com/watch?v=09R8_2nJtjg' },
  { id: 't4', catId: 'toast', title: 'Cầu Hôn', artist: 'Văn Mai Hương', duration: '4:02', youtubeUrl: 'https://www.youtube.com/watch?v=4y-W_m3y8mQ' },

  // Giai đoạn 4: Thưởng thức tiệc & Giao lưu
  { id: 'd1', catId: 'dining', title: 'Ngày Đầu Tiên', artist: 'Đức Phúc', duration: '3:28', youtubeUrl: 'https://www.youtube.com/watch?v=fF-c7zL-kR4' },
  { id: 'd2', catId: 'dining', title: 'Bài Ca Tình Yêu', artist: 'Đinh Mạnh Ninh', duration: '4:30', youtubeUrl: 'https://www.youtube.com/watch?v=68h3c8Yx2Z0' },
  { id: 'd3', catId: 'dining', title: 'Perfect', artist: 'Ed Sheeran', duration: '4:23', youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g' },
  { id: 'd4', catId: 'dining', title: 'Một Nhà', artist: 'Da LAB', duration: '3:10', youtubeUrl: 'https://www.youtube.com/watch?v=84LhW-Wb0b4' }
];

export const INVITATION_TEMPLATES = [
  {
    id: 'CLASSIC_GOLD_FLORAL',
    name: '1. Ép Kim Vàng Cổ Điển',
    bgClass: 'bg-[#faf6f0]',
    cardBorder: 'border-2 border-[#d4af37]/80 shadow-[0_15px_50px_rgba(212,175,55,0.25)]',
    accentColor: '#b8860b',
    nameColor: 'text-[#b8860b]',
    headerColor: 'text-[#a66a3a]',
    subTextColor: '#a66a3a',
    boxBg: 'bg-[#fdfbf7] border border-[#e3a638]/30',
    floralTheme: 'gold-vintage',
    badge: 'Ép Kim Vàng Cổ Điển'
  },
  {
    id: 'ROSE_BLUSH_ELEGANCE',
    name: '2. Hồng Đất & Hoa Thần Thái',
    bgClass: 'bg-[#fdf3f5]',
    cardBorder: 'border-2 border-[#e8a5b8]/80 shadow-[0_15px_50px_rgba(232,165,184,0.25)]',
    accentColor: '#9e475e',
    nameColor: 'text-[#9e475e]',
    headerColor: 'text-[#a54860]',
    subTextColor: '#8a4b5b',
    boxBg: 'bg-[#fff7f8] border border-[#e8a5b8]/40',
    floralTheme: 'rose-blush',
    badge: 'Lãng Mạn Nữ Tính'
  },
  {
    id: 'EMERALD_BOTANICAL',
    name: '3. Xanh Lá Botanical Tươi Mát',
    bgClass: 'bg-[#f1f7f4]',
    cardBorder: 'border-2 border-[#74c69d]/80 shadow-[0_15px_50px_rgba(116,198,157,0.2)]',
    accentColor: '#2d6a4f',
    nameColor: 'text-[#2d6a4f]',
    headerColor: 'text-[#2d6a4f]',
    subTextColor: '#40916c',
    boxBg: 'bg-[#f7faf8] border border-[#74c69d]/40',
    floralTheme: 'emerald-leaf',
    badge: 'Xu Hướng Botanical'
  },
  {
    id: 'PEARL_CHAMPAGNE',
    name: '4. Champagne Ngọc Trai',
    bgClass: 'bg-[#fbf7f0]',
    cardBorder: 'border-2 border-[#e5c158]/70 shadow-[0_15px_50px_rgba(229,193,88,0.2)]',
    accentColor: '#c8963e',
    nameColor: 'text-[#c8963e]',
    headerColor: 'text-[#b5832a]',
    subTextColor: '#947545',
    boxBg: 'bg-[#fffdf9] border border-[#e5c158]/40',
    floralTheme: 'champagne-lace',
    badge: 'Ngọc Trai Quyến Rũ'
  },
  {
    id: 'VELVET_ROSE_GOLD',
    name: '5. Đỏ Nhung Cổ Điển',
    bgClass: 'bg-[#fff7f7]',
    cardBorder: 'border-2 border-[#d90429]/40 shadow-[0_15px_50px_rgba(217,4,41,0.18)]',
    accentColor: '#9b2226',
    nameColor: 'text-[#9b2226]',
    headerColor: 'text-[#9b2226]',
    subTextColor: '#800f2f',
    boxBg: 'bg-[#fffdfd] border border-[#d90429]/30',
    floralTheme: 'crimson-rose',
    badge: 'Trang Trọng Truyền Thống'
  },
  {
    id: 'MODERN_MINIMAL_LIGHT',
    name: '6. Tối Giản Tinh Khôi',
    bgClass: 'bg-[#ffffff]',
    cardBorder: 'border-2 border-stone-300 shadow-[0_15px_40px_rgba(0,0,0,0.08)]',
    accentColor: '#1c1917',
    nameColor: 'text-[#1c1917]',
    headerColor: 'text-[#44403c]',
    subTextColor: '#78716c',
    boxBg: 'bg-[#fafaf9] border border-stone-200',
    floralTheme: 'minimal-silver',
    badge: 'Tối Giản Hiện Đại'
  }
];

export const VENUE_FLOOR_OPTIONS = [
  { id: 'FLOOR_1', idLed: 'tang-1', name: 'Tầng 1 (5.12m × 2.72m)', shortName: 'Tầng 1' },
  { id: 'FLOOR_2', idLed: 'tang-2', name: 'Tầng 2 (7.04m × 3.36m)', shortName: 'Tầng 2' },
  { id: 'FLOOR_3', idLed: 'tang-3', name: 'Tầng 3 (7.04m × 3.84m)', shortName: 'Tầng 3' },
  { id: 'FLOOR_4', idLed: 'tang-4', name: 'Tầng 4 (5.12m × 2.72m)', shortName: 'Tầng 4' }
];
