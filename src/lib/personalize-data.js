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
  { id: 'welcome', label: '1. Đón Khách (Ballad nhẹ nhàng & Lofi)', desc: 'Giai đoạn tập trung lãng mạn, du dương để quan khách thoải mái khi bước vào sảnh tiệc.' },
  { id: 'entrance', label: '2. Nghi Lễ Chính (Trang trọng & Xúc động)', desc: 'Ca khúc có thông điệp sâu sắc về lời hứa và sự gắn kết bền lâu khi sánh bước lên lễ đường.' },
  { id: 'toast', label: '3. Khai Tiệc & Nâng Ly (Rộn ràng & Sôi động)', desc: 'Khuấy động bầu không khí, khiến khách mời hào hứng chung vui cùng gia đình.' },
  { id: 'dining', label: '4. Giao Lưu & Tiễn Khách (Vui vẻ & Đầm ấm)', desc: 'Duy trì năng lượng tích cực với nhạc Pop/Remix rộn ràng cho phần kết tiệc viên mãn.' }
];

export const MUSIC_TRACKS = [
  // Giai đoạn 1: Đón khách
  { id: 'w1', catId: 'welcome', title: 'Đi Tìm Tình Yêu', artist: 'MONO', duration: '3:15', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3' },
  { id: 'w2', catId: 'welcome', title: 'Có Em Đời Bỗng Vui', artist: 'Chillies', duration: '3:40', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939bf9a22.mp3?filename=love-background-piano-124445.mp3' },
  { id: 'w3', catId: 'welcome', title: 'Lễ Đường', artist: 'Kai Đinh', duration: '3:50', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c51121d5.mp3?filename=sweet-love-10332.mp3' },
  { id: 'w4', catId: 'welcome', title: 'Until I Found You', artist: 'Stephen Sanchez', duration: '2:57', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65646197.mp3?filename=romantic-guitars-112316.mp3' },

  // Giai đoạn 2: Nghi lễ chính
  { id: 'e1', catId: 'entrance', title: 'Em Đồng Ý (I Do)', artist: 'Đức Phúc x 911', duration: '3:34', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=wedding-march-piano-version-17154.mp3' },
  { id: 'e2', catId: 'entrance', title: 'Nắm Lấy Tay Anh', artist: 'Tuấn Hưng', duration: '4:10', audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88c42661aa.mp3?filename=canon-in-d-11458.mp3' },
  { id: 'e3', catId: 'entrance', title: 'Lover', artist: 'Taylor Swift', duration: '3:41', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_247e68e4c7.mp3?filename=piano-wedding-love-126296.mp3' },
  { id: 'e4', catId: 'entrance', title: 'Yes I Do', artist: 'Only C x Lou Hoàng', duration: '3:55', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2957b42fa.mp3?filename=happy-wedding-day-10025.mp3' },
  { id: 'e5', catId: 'entrance', title: 'Beautiful in White', artist: 'Westlife', duration: '3:52', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=wedding-march-piano-version-17154.mp3' },
  { id: 'e6', catId: 'entrance', title: 'Ánh Nắng Của Anh', artist: 'Đức Phúc', duration: '4:20', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_247e68e4c7.mp3?filename=piano-wedding-love-126296.mp3' },
  { id: 'e7', catId: 'entrance', title: 'Perfect', artist: 'Ed Sheeran', duration: '4:23', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3' },
  { id: 'e8', catId: 'entrance', title: 'Hơn Cả Yêu', artist: 'Đức Phúc', duration: '4:05', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939bf9a22.mp3?filename=love-background-piano-124445.mp3' },

  // Giai đoạn 3: Khai tiệc & Nâng ly
  { id: 't1', catId: 'toast', title: 'Đừng Làm Trái Tim Anh Đau', artist: 'Sơn Tùng M-TP', duration: '3:50', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c51121d5.mp3?filename=sweet-love-10332.mp3' },
  { id: 't2', catId: 'toast', title: 'Love Paradise', artist: 'Kelly Chen', duration: '3:15', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65646197.mp3?filename=romantic-guitars-112316.mp3' },
  { id: 't3', catId: 'toast', title: 'Ngày Mình Chung Đôi', artist: 'Hùng Min', duration: '3:45', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2957b42fa.mp3?filename=happy-wedding-day-10025.mp3' },
  { id: 't4', catId: 'toast', title: 'Ngày Hạnh Phúc', artist: 'Đan Trường', duration: '4:10', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3' },
  { id: 't5', catId: 'toast', title: 'Sugar', artist: 'Maroon 5', duration: '3:55', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c51121d5.mp3?filename=sweet-love-10332.mp3' },
  { id: 't6', catId: 'toast', title: 'Cưới Thôi', artist: 'Masew x Masiu', duration: '3:05', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2957b42fa.mp3?filename=happy-wedding-day-10025.mp3' },
  { id: 't7', catId: 'toast', title: 'Marry You', artist: 'Bruno Mars', duration: '3:50', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2957b42fa.mp3?filename=happy-wedding-day-10025.mp3' },
  { id: 't8', catId: 'toast', title: 'Dancing Queen', artist: 'ABBA', duration: '3:51', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65646197.mp3?filename=romantic-guitars-112316.mp3' },

  // Giai đoạn 4: Giao lưu & Tiễn khách
  { id: 'd1', catId: 'dining', title: 'Một Nhà', artist: 'Da LAB', duration: '3:15', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113540.mp3' },
  { id: 'd2', catId: 'dining', title: 'Pretty Boy', artist: 'M2M', duration: '4:40', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939bf9a22.mp3?filename=love-background-piano-124445.mp3' },
  { id: 'd3', catId: 'dining', title: 'Túp Lều Vàng', artist: 'Nguyễn Đình Vũ x NBORO', duration: '3:20', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2957b42fa.mp3?filename=happy-wedding-day-10025.mp3' },
  { id: 'd4', catId: 'dining', title: 'Chỉ Cần Có Nhau', artist: 'Vũ Cát Tường', duration: '3:35', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_247e68e4c7.mp3?filename=piano-wedding-love-126296.mp3' },
  { id: 'd5', catId: 'dining', title: 'You Are The Reason', artist: 'Calum Scott', duration: '3:24', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_247e68e4c7.mp3?filename=piano-wedding-love-126296.mp3' },
  { id: 'd6', catId: 'dining', title: 'Vài Câu Nói Có Khiến Người Thay Đổi', artist: 'GREY D', duration: '3:45', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65646197.mp3?filename=romantic-guitars-112316.mp3' },
  { id: 'd7', catId: 'dining', title: 'I Do', artist: '911', duration: '3:28', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c51121d5.mp3?filename=sweet-love-10332.mp3' }
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

// Simple Floor options
export const VENUE_FLOOR_OPTIONS = [
  { id: 'FLOOR_1', name: 'Tầng 1', shortName: 'Tầng 1' },
  { id: 'FLOOR_2', name: 'Tầng 2', shortName: 'Tầng 2' },
  { id: 'FLOOR_3', name: 'Tầng 3', shortName: 'Tầng 3' },
  { id: 'FLOOR_4', name: 'Tầng 4', shortName: 'Tầng 4' }
];
