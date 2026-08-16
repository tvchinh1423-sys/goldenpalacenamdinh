// Data & Preset Templates for Wedding Personalization Suite — Golden Palace

export const LED_STAGE_TEMPLATES = [
  {
    id: 'led-golden-royal',
    name: 'Hoàng Gia Sang Trọng (Golden Royal)',
    slogan: 'Tone Vàng Ánh Kim & Họa Tiết Cung Điện',
    venue: 'Tầng 3',
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
    venue: 'Tầng 2',
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
    venue: 'Tầng 4',
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
    venue: 'Tầng 1',
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

// 6 Distinct Luxury Light-themed Wedding Invitation Templates
export const INVITATION_TEMPLATES = [
  {
    id: 'CRYSTAL_GOLD_GLASS',
    name: '1. Vàng Ép Kim Hoàng Gia',
    bgClass: 'bg-[#faf6f0]',
    cardBorder: 'border-2 border-[#d4af37]/60 shadow-[0_15px_50px_rgba(212,175,55,0.18)]',
    accentColor: '#b8860b',
    nameColor: 'text-[#b8860b]',
    headerColor: 'text-[#a66a3a]',
    subTextColor: '#8c6d3f',
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

// Simple Floor options with no hall suffix as requested by user
export const VENUE_FLOOR_OPTIONS = [
  { id: 'FLOOR_1', name: 'Tầng 1', shortName: 'Tầng 1' },
  { id: 'FLOOR_2', name: 'Tầng 2', shortName: 'Tầng 2' },
  { id: 'FLOOR_3', name: 'Tầng 3', shortName: 'Tầng 3' },
  { id: 'FLOOR_4', name: 'Tầng 4', shortName: 'Tầng 4' }
];
