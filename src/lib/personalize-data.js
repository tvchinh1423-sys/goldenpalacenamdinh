// Data & Preset Templates for Wedding Personalization Suite — Golden Palace

export const LED_STAGE_TEMPLATES = [
  {
    id: 'led-golden-royal',
    name: 'Hoàng Gia Sang Trọng (Golden Royal)',
    slogan: 'Tone Vàng Ánh Kim & Họa Tiết Cung Điện',
    venue: 'Sảnh Hoàng Gia - Tầng 3',
    bgGradient: 'from-[#1a1200] via-[#3a2903] to-[#1a1200]',
    borderColor: '#e3a638',
    glowColor: 'rgba(227, 166, 56, 0.4)',
    accentColor: '#f3c969',
    textColor: '#ffffff',
    subTextColor: '#e3a638',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(227,166,56,0.15) 0%, transparent 70%)',
    overlayBg: '/images/hd-venues/tang-3-hd-1.jpg',
    fontFamily: 'font-playfair',
    frameStyle: 'border-2 border-[#e3a638] shadow-[0_0_35px_rgba(227,166,56,0.3)]',
  },
  {
    id: 'led-floral-emerald',
    name: 'Hoa Tươi Ngọc Bích (Emerald Floral)',
    slogan: 'Tone Xanh Ngọc & Hoa Hồng Trắng Thượng Uyển',
    venue: 'Sảnh Ngọc Bích - Tầng 2',
    bgGradient: 'from-[#051f15] via-[#0d3b2b] to-[#051f15]',
    borderColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.3)',
    accentColor: '#a7f3d0',
    textColor: '#ffffff',
    subTextColor: '#34d399',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(52,211,153,0.15) 0%, transparent 70%)',
    overlayBg: '/images/hd-venues/tang-2-hd-1.jpg',
    fontFamily: 'font-serif',
    frameStyle: 'border-2 border-emerald-400/60 shadow-[0_0_35px_rgba(52,211,153,0.25)]',
  },
  {
    id: 'led-crystal-diamond',
    name: 'Pha Lê Kim Cương (Crystal Diamond)',
    slogan: 'Tone Trắng Bạc & Đèn Chùm Pha Lê Lộng Lẫy',
    venue: 'Sảnh Kim Cương - Tầng 4',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#0f172a]',
    borderColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    accentColor: '#bae6fd',
    textColor: '#ffffff',
    subTextColor: '#7dd3fc',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.15) 0%, transparent 70%)',
    overlayBg: '/images/hd-venues/tang-4-hd-1.jpg',
    fontFamily: 'font-sans',
    frameStyle: 'border-2 border-sky-400/60 shadow-[0_0_35px_rgba(56,189,248,0.3)]',
  },
  {
    id: 'led-rose-dream',
    name: 'Giấc Mơ Hồng (Rose Pink Dream)',
    slogan: 'Tone Hồng Pastel & Ánh Nến Lãng Mạn',
    venue: 'Sảnh Crystal VIP',
    bgGradient: 'from-[#2e0c18] via-[#50132b] to-[#2e0c18]',
    borderColor: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.35)',
    accentColor: '#fbcfe8',
    textColor: '#ffffff',
    subTextColor: '#f472b6',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(244,114,182,0.15) 0%, transparent 70%)',
    overlayBg: '/images/hd-venues/tang-3-hd-2.jpg',
    fontFamily: 'font-serif',
    frameStyle: 'border-2 border-pink-400/60 shadow-[0_0_35px_rgba(244,114,182,0.3)]',
  }
];

export const MUSIC_CATEGORIES = [
  { id: 'welcome', label: '1. Đón Khách (Welcome)', desc: 'Nhạc nền nhẹ nhàng, acoustic lãng mạn khi quan khách tiến vào hội trường.' },
  { id: 'entrance', label: '2. Làm Lễ & Vào Sân Khấu (Entrance)', desc: 'Giai điệu thiêng liêng, trang trọng khi Chú Rể & Cô Dâu sánh bước lên sân khấu.' },
  { id: 'toast', label: '3. Rót Rượu & Cắt Bánh (Toast & Cheer)', desc: 'Nhạc sôi động, vui tươi chúc mừng khoảnh khắc khắc ghi vĩnh cửu.' },
  { id: 'dining', label: '4. Khai Tiệc & Giao Lưu (Dining)', desc: 'Giai điệu du dương, ấm áp đồng hành cùng bữa tiệc ngập tràn tiếng cười.' }
];

export const MUSIC_TRACKS = [
  // 1. Đón Khách
  { id: 'm1', catId: 'welcome', title: 'Until I Found You', artist: 'Stephen Sanchez', duration: '2:57', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3' },
  { id: 'm2', catId: 'welcome', title: 'A Thousand Years', artist: 'Christina Perri', duration: '4:45', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939bf9a22.mp3?filename=love-background-piano-124445.mp3' },
  { id: 'm3', catId: 'welcome', title: 'I Do', artist: '911 Band', duration: '3:28', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c51121d5.mp3?filename=sweet-love-10332.mp3' },
  { id: 'm4', catId: 'welcome', title: 'Lover', artist: 'Taylor Swift', duration: '3:41', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65646197.mp3?filename=romantic-guitars-112316.mp3' },

  // 2. Vào sân khấu
  { id: 'm5', catId: 'entrance', title: 'Beautiful In White', artist: 'Shane Filan', duration: '3:52', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=wedding-march-piano-version-17154.mp3' },
  { id: 'm6', catId: 'entrance', title: 'Canon in D Major', artist: 'Johann Pachelbel', duration: '5:02', audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88c42661aa.mp3?filename=canon-in-d-11458.mp3' },
  { id: 'm7', catId: 'entrance', title: 'Ánh Nắng Của Anh', artist: 'Đức Phúc', duration: '4:20', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_247e68e4c7.mp3?filename=piano-wedding-love-126296.mp3' },
  { id: 'm8', catId: 'entrance', title: 'Marry You', artist: 'Bruno Mars', duration: '3:50', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2957b42fa.mp3?filename=happy-wedding-day-10025.mp3' },

  // 3. Rót rượu & Cắt bánh
  { id: 'm9', catId: 'toast', title: 'Sugar', artist: 'Maroon 5', duration: '3:55', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c51121d5.mp3?filename=sweet-love-10332.mp3' },
  { id: 'm10', catId: 'toast', title: 'Ngày Đầu Tiên', artist: 'Đức Phúc', duration: '3:30', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65646197.mp3?filename=romantic-guitars-112316.mp3' },
  { id: 'm11', catId: 'toast', title: 'Can\'t Take My Eyes Off You', artist: 'Frankie Valli', duration: '3:20', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2957b42fa.mp3?filename=happy-wedding-day-10025.mp3' },

  // 4. Khai tiệc & Giao lưu
  { id: 'm12', catId: 'dining', title: 'Cưới Nhau Đi (Yes I Do)', artist: 'Bùi Anh Tuấn & Hiền Hồ', duration: '4:12', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3' },
  { id: 'm13', catId: 'dining', title: 'Hơn Cả Yêu', artist: 'Đức Phúc', duration: '4:05', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939bf9a22.mp3?filename=love-background-piano-124445.mp3' },
  { id: 'm14', catId: 'dining', title: 'You Are The Reason', artist: 'Calum Scott', duration: '3:24', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_247e68e4c7.mp3?filename=piano-wedding-love-126296.mp3' }
];

// 6 Light-themed Luxury Wedding Invitation Templates
export const INVITATION_TEMPLATES = [
  {
    id: 'CRYSTAL_GOLD_GLASS',
    name: '1. Trắng Kem & Ép Kim Vàng (We Do)',
    themeClass: 'bg-[#faf6f0] text-gray-800 border-amber-300/80 shadow-[0_10px_30px_rgba(217,162,60,0.15)]',
    accentColor: '#b8860b',
    textColor: '#2d241e',
    subTextColor: '#8c6d3f',
    headerTitleFont: 'font-serif tracking-widest text-[#a66a3a]',
    scriptFont: 'font-serif italic text-3xl font-normal text-[#b8860b]',
    cardBg: 'bg-white/90 backdrop-blur-md border border-amber-200',
    desc: 'Trắng kem nhã nhặn, chữ thư pháp vàng ép kim sang trọng (Tham khảo mẫu 3)',
    badge: 'Mới & Ép Kim Sang Trọng'
  },
  {
    id: 'ROSE_BLUSH_ELEGANCE',
    name: '2. Hồng Đất & Hoa Thần Thái',
    themeClass: 'bg-[#fbf2ed] text-gray-800 border-pink-200 shadow-[0_10px_30px_rgba(219,112,147,0.15)]',
    accentColor: '#9e475e',
    textColor: '#3a2027',
    subTextColor: '#8a4b5b',
    headerTitleFont: 'font-serif text-[#9e475e]',
    scriptFont: 'font-serif italic text-3xl font-semibold text-[#9e475e]',
    cardBg: 'bg-[#fff9f6]/95 border border-pink-200/80',
    desc: 'Nền hồng đất tinh tế phối họa tiết hoa thanh lịch (Tham khảo mẫu 4)',
    badge: 'Lãng Mạn Nữ Tính'
  },
  {
    id: 'EMERALD_BOTANICAL',
    name: '3. Xanh Lá Botanical & Khung Tròn',
    themeClass: 'bg-[#f4f7f4] text-gray-800 border-emerald-200 shadow-[0_10px_30px_rgba(52,211,153,0.12)]',
    accentColor: '#2d6a4f',
    textColor: '#1b4332',
    subTextColor: '#40916c',
    headerTitleFont: 'font-serif text-[#2d6a4f]',
    scriptFont: 'font-serif italic text-3xl text-[#2d6a4f]',
    cardBg: 'bg-white/95 border border-emerald-300/60',
    desc: 'Nền trắng xanh botanical tự nhiên kết hợp hoa cẩm tú cầu (Tham khảo mẫu 5)',
    badge: 'Xu Hướng Mới'
  },
  {
    id: 'PEARL_CHAMPAGNE',
    name: '4. Champagne Ngọc Trai',
    themeClass: 'bg-[#faf5ee] text-gray-800 border-amber-200 shadow-md',
    accentColor: '#c8963e',
    textColor: '#2c251e',
    subTextColor: '#947545',
    headerTitleFont: 'font-serif text-[#c8963e]',
    scriptFont: 'font-serif italic text-3xl text-[#c8963e]',
    cardBg: 'bg-[#ffffff]/90 border border-amber-300/40',
    desc: 'Sắc ngọc trai rạng rỡ, phông chữ mềm mại quyến rũ',
    badge: 'Nhã Nhặn'
  },
  {
    id: 'VELVET_ROSE_GOLD',
    name: '5. Đỏ Nhung Cổ Điển',
    themeClass: 'bg-[#fdf6f6] text-gray-800 border-red-200 shadow-md',
    accentColor: '#9b2226',
    textColor: '#3d0c0e',
    subTextColor: '#9b2226',
    headerTitleFont: 'font-serif text-[#9b2226]',
    scriptFont: 'font-serif italic text-3xl text-[#9b2226]',
    cardBg: 'bg-white border border-red-200',
    desc: 'Thiết kế chữ nổi đỏ nhung trên nền giấy kem truyền thống',
    badge: 'Trang Trọng Truyền Thống'
  },
  {
    id: 'MODERN_MINIMAL_LIGHT',
    name: '6. Tối Giản Tinh Khôi',
    themeClass: 'bg-[#ffffff] text-gray-900 border-gray-200 shadow-sm',
    accentColor: '#1c1917',
    textColor: '#1c1917',
    subTextColor: '#78716c',
    headerTitleFont: 'font-sans font-bold tracking-widest text-[#1c1917]',
    scriptFont: 'font-serif italic text-3xl text-gray-900',
    cardBg: 'bg-stone-50 border border-stone-200',
    desc: 'Trắng tinh khôi tối giản, phông chữ thanh thoát đương đại',
    badge: 'Tối Giản Hiện Đại'
  }
];

export const VENUE_FLOOR_OPTIONS = [
  { id: 'FLOOR_1', name: 'Tầng 1 - Sảnh Bar & Tiệc Nhẹ (50 - 100 khách)', shortName: 'Tầng 1 (Sảnh Bar)' },
  { id: 'FLOOR_2', name: 'Tầng 2 - Sảnh Ngọc Bích (350 - 750 khách)', shortName: 'Tầng 2 (Sảnh Ngọc Bích)' },
  { id: 'FLOOR_3', name: 'Tầng 3 - Sảnh Hoàng Gia (300 - 650 khách)', shortName: 'Tầng 3 (Sảnh Hoàng Gia)' },
  { id: 'FLOOR_4', name: 'Tầng 4 - Sảnh Kim Cương (100 - 300 khách)', shortName: 'Tầng 4 (Sảnh Kim Cương)' }
];
