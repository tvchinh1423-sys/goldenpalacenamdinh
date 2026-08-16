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

export const INVITATION_TEMPLATES = [
  {
    id: 'GOLDEN_ELEGANCE',
    name: 'Hoàng Gia Hoàng Kim',
    themeClass: 'bg-gradient-to-b from-[#1a160d] via-[#2a2114] to-[#120f08] text-[#f8fafc]',
    accentColor: '#e3a638',
    cardBg: 'bg-[#1e1910]/90 border-[#e3a638]/40',
    fontHeading: 'font-playfair',
    desc: 'Phong cách cổ điển hoàng gia với tone màu Vàng Kim & Đen Khói huyền bí',
    badge: 'Đặc Quyền Golden Palace'
  },
  {
    id: 'BLOSSOM_ROMANCE',
    name: 'Hoa Tươi Lãng Mạn',
    themeClass: 'bg-gradient-to-b from-[#2d121c] via-[#421b2b] to-[#1f0b13] text-[#f8fafc]',
    accentColor: '#f472b6',
    cardBg: 'bg-[#361623]/90 border-pink-400/40',
    fontHeading: 'font-serif',
    desc: 'Phong cách lãng mạn ngọt ngào với họa tiết hoa hồng & ánh nến lung linh',
    badge: 'Được Yêu Thích Nhất'
  },
  {
    id: 'MODERN_MINIMAL',
    name: 'Tối Giản Hiện Đại',
    themeClass: 'bg-gradient-to-b from-[#091e17] via-[#0f3026] to-[#06140f] text-[#f8fafc]',
    accentColor: '#34d399',
    cardBg: 'bg-[#0b251e]/90 border-emerald-400/40',
    fontHeading: 'font-sans',
    desc: 'Phong cách tối giản, tinh tế dành cho cặp đôi yêu thích sự trẻ trung, hiện đại',
    badge: 'Xu Hướng Mới'
  },
  {
    id: 'VINTAGE_CLASSIC',
    name: 'Cổ Điển Quý Phái',
    themeClass: 'bg-gradient-to-b from-[#260a0a] via-[#3d1111] to-[#1a0707] text-[#f8fafc]',
    accentColor: '#f87171',
    cardBg: 'bg-[#2e0d0d]/90 border-red-400/40',
    fontHeading: 'font-serif',
    desc: 'Nét đẹp truyền thống kết hợp phương Tây với tone Đỏ Nhung & Vàng Ánh Kim',
    badge: 'Trang Trọng'
  }
];
