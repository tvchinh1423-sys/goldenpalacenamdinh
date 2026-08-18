'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

// EXACT ITEM BREAKDOWN FROM GOLDEN PALACE OFFICIAL PRICING TABLES
const VENUE_INCLUDED_ITEMS = {
  'Hội trường Tầng 2': {
    name: 'Hạng mục Dịch vụ Cơ bản Tầng 2',
    description: 'Bao gồm 13 hạng mục trang thiết bị & dịch vụ phục vụ tiệc tại Đại Cung Điện Tầng 2 (Sức chứa 350 - 750 khách)',
    items: [
      'Cổng hoa chào đón (1 Bộ)',
      'Bàn trang trí, hộp tiền mừng (1 Bộ)',
      'Bàn hoa cắt bánh cưới (1 Bộ)',
      'Bàn hoa Tháp ly (1 Bộ)',
      'Hoa lụa 2 bên đường dẫn (2 Bộ)',
      'Đèn 2 bên đường dẫn (10 Cột)',
      'Phông 2 bên sân khấu (2 Bộ)',
      'Giàn đèn bướm (10 Bộ)',
      'Phông chụp ảnh lưu niệm (1 Bộ)',
      'Giá để ảnh cưới cỡ lớn (1 Cái)',
      'Màn hình LED 30m² (1 Bộ)',
      'Hệ thống Âm thanh, Ánh sáng biểu diễn (1 Bộ)',
      'Bánh cưới, rượu Champagne, đá khói, pháo điện, bộ chữ lồng tên (1 Bộ)'
    ]
  },
  'Hội trường Tầng 3': {
    name: 'Hạng mục Dịch vụ Cơ bản Tầng 3',
    description: 'Bao gồm 13 hạng mục trang thiết bị & dịch vụ phục vụ tiệc tại Hội trường Hoàng Gia Tầng 3 (Sức chứa 300 - 650 khách)',
    items: [
      'Cổng hoa chào đón (1 Bộ)',
      'Bàn trang trí, hộp tiền mừng (1 Bộ)',
      'Bàn hoa cắt bánh cưới (1 Bộ)',
      'Bàn hoa Tháp ly (1 Bộ)',
      'Hoa lụa 2 bên đường dẫn (2 Bộ)',
      'Đèn 2 bên đường dẫn (10 Cột)',
      'Phông 2 bên sân khấu (2 Bộ)',
      'Giàn đèn bướm (10 Bộ)',
      'Phông chụp ảnh lưu niệm (1 Bộ)',
      'Giá để ảnh cưới cỡ lớn (1 Cái)',
      'Màn hình LED 30m² (1 Bộ)',
      'Hệ thống Âm thanh, Ánh sáng biểu diễn (1 Bộ)',
      'Bánh cưới, rượu Champagne, đá khói, pháo điện, bộ chữ lồng tên (1 Bộ)'
    ]
  },
  'Hội trường Tầng 4': {
    name: 'Hạng mục Dịch vụ Cơ bản Tầng 4',
    description: 'Bao gồm 11 hạng mục trang thiết bị & dịch vụ phục vụ tiệc tại Hội trường Tầng 4 (Sức chứa 100 - 300 khách)',
    items: [
      'Cổng chào đón (1 Bộ)',
      'Bàn, trang trí, hộp tiền mừng (1 Bộ)',
      'Bàn hoa đặt bánh cưới (1 Bộ)',
      'Bàn hoa Tháp ly (1 Bộ)',
      'Cột hoa 2 bên thảm đỏ (6 Cột)',
      'Phông chụp ảnh lưu niệm (1 Bộ)',
      'Hoa lụa 2 bên sân khấu (2 Bộ)',
      'Giá để ảnh cưới cỡ lớn (1 Cái)',
      'Màn hình LED 10m² (1 Màn)',
      'Hệ thống Âm thanh, Ánh sáng (1 Bộ)',
      'Bánh cưới, rượu Champagne, đá khói, pháo điện, bộ chữ lồng tên (1 Bộ)'
    ]
  },
  'Quầy Bar Tầng 1': {
    name: 'Hạng mục Dịch vụ Cơ bản Quầy Bar Tầng 1',
    description: 'Bao gồm 10 hạng mục trang thiết bị & dịch vụ phục vụ tiệc tại Quầy Bar Tầng 1 (Sức chứa 50 - 100 khách)',
    items: [
      'Cổng chào đón hiện đại (1 Bộ)',
      'Bàn, trang trí đón khách & hộp tiền mừng (1 Bộ)',
      'Bàn hoa đặt bánh chúc mừng (1 Bộ)',
      'Bàn hoa Tháp ly / Tháp rượu chúc mừng (1 Bộ)',
      'Cột hoa 2 bên lối đi (6 Cột)',
      'Phông chụp ảnh lưu niệm check-in (1 Bộ)',
      'Hoa lụa trang trí không gian sân khấu (2 Bộ)',
      'Giá để ảnh kỷ niệm / banner sự kiện (1 Cái)',
      'Màn hình LED / Máy chiếu trình chiếu (1 Màn)',
      'Hệ thống Âm thanh, Ánh sáng Lounge hiện đại (1 Bộ)'
    ]
  }
};

export default function Step3Services() {
  const { estimateData, updateEstimate } = useEstimate();
  const { guestCount, selectedVenues, selectedAddOns } = estimateData;

  const [allVenues, setAllVenues] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedVenueId = selectedVenues[0];

  useEffect(() => {
    async function fetchData() {
      try {
        const [venueRes, addonRes] = await Promise.all([
          fetch('/api/guest/venues'),
          fetch('/api/guest/add-ons')
        ]);
        
        const venueData = await venueRes.json();
        const addonData = await addonRes.json();
        
        setAllVenues(venueData);
        setAddons(addonData);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentVenue = allVenues.find(v => v.id === selectedVenueId) || allVenues[0];
  const currentVenueName = currentVenue?.name || 'Hội trường Tầng 3';
  const venueIncludedInfo = VENUE_INCLUDED_ITEMS[currentVenueName] || VENUE_INCLUDED_ITEMS['Hội trường Tầng 3'];

  const isEligibleForFreeLaserRing = Number(guestCount) >= 400;

  const toggleAddon = (id) => {
    if (selectedAddOns.includes(id)) {
      updateEstimate({ selectedAddOns: selectedAddOns.filter(a => a !== id) });
    } else {
      updateEstimate({ selectedAddOns: [...selectedAddOns, id] });
    }
  };

  const parseAddonDetails = (addon) => {
    const raw = addon.description || '';
    
    if (addon.name.includes('Vòng ánh sáng laser')) {
      if (isEligibleForFreeLaserRing) {
        return {
          mainPrice: '0 VNĐ (Tặng miễn phí)',
          note: '🎁 Tiệc từ 400 khách trở lên được TẶNG MIỄN PHÍ',
          numericPrice: 0,
          isFree: true
        };
      } else {
        return {
          mainPrice: '700.000 VNĐ / lần',
          note: '🎁 Tặng miễn phí cho tiệc từ 400 khách',
          numericPrice: 700000,
          isFree: false
        };
      }
    }

    if (addon.name.includes('Trang Trí') || raw.includes('Liên hệ')) {
      return {
        mainPrice: 'Báo giá: Liên hệ',
        note: 'Trao đổi concept & trang trí riêng',
        numericPrice: 0,
        isContact: true
      };
    }

    const parenIndex = raw.indexOf('(');
    if (parenIndex !== -1) {
      const mainPrice = raw.substring(0, parenIndex).trim();
      const note = raw.substring(parenIndex + 1, raw.lastIndexOf(')')).trim();
      return { mainPrice, note };
    }

    return { mainPrice: raw, note: null };
  };

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-40">
      
      {/* Context Bar */}
      <div className="bg-white border-b border-gray-200 shadow-xs py-3 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/du-toan-chi-phi/venues" className="flex items-center gap-1 text-[#a66a3a] hover:underline text-xs uppercase font-bold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Đổi chọn sảnh</span>
          </Link>
          <span className="text-xs uppercase tracking-wider font-bold text-[#a66a3a]">
            Bước 3 / 5: Dịch Vụ Cơ Bản & Dịch Vụ Nâng Cao
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center mb-8">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">Bước 3 / 5</span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
            Dịch Vụ Đi Kèm & Dịch Vụ Nâng Cao
          </h2>
          <p className="text-gray-600 font-light text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Xem các hạng mục dịch vụ cơ bản đã bao gồm theo sảnh và tùy chọn các dịch vụ bổ sung cao cấp cho ngày cưới.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#e3a638]">progress_activity</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1: HẠNG MỤC DỊCH VỤ CƠ BẢN CỦA SẢNH ĐÃ CHỌN */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-xl p-6 sm:p-8 space-y-6">
                
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-xs text-[#a66a3a] font-bold uppercase tracking-widest block mb-1">
                    Đã bao gồm trong phí sảnh
                  </span>
                  <h3 className="text-2xl font-playfair font-bold text-gray-900">
                    {venueIncludedInfo.name}
                  </h3>
                  <p className="text-gray-500 text-xs font-light mt-1 leading-relaxed">
                    {venueIncludedInfo.description}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {venueIncludedInfo.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#fcf9f2] border border-amber-200/60 text-xs font-medium text-gray-800">
                      <span className="material-symbols-outlined text-[#e3a638] text-base shrink-0 mt-0.5">check_circle</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-base shrink-0 mt-0.5">verified</span>
                  <span>Toàn bộ 13 hạng mục trang trí và thiết bị trên đã nằm trọn gói trong Phí dịch vụ hội trường ({currentVenueName}).</span>
                </div>

              </div>
            </div>

            {/* COLUMN 2: DỊCH VỤ NÂNG CAO BỔ SUNG */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-xl p-6 sm:p-8 space-y-6">
                
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-xs text-[#a66a3a] font-bold uppercase tracking-widest block mb-1">
                    Tùy chọn bổ sung
                  </span>
                  <h3 className="text-2xl font-playfair font-bold text-gray-900">
                    Danh Mục Dịch Vụ Nâng Cao
                  </h3>
                  <p className="text-gray-500 text-xs font-light mt-1">
                    Tích chọn thêm các dịch vụ biểu diễn, MC, PhotoBooth, hoặc trang trí concept riêng.
                  </p>
                </div>

                <div className="space-y-4">
                  {addons.map(addon => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    const details = parseAddonDetails(addon);

                    return (
                      <div 
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                          isSelected 
                            ? 'bg-amber-50/70 border-[#e3a638] ring-2 ring-[#e3a638]/30 shadow-md' 
                            : 'bg-white border-gray-200 hover:border-[#e3a638]'
                        }`}
                      >
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="accent-[#e3a638] w-5 h-5 rounded-md mt-1 cursor-pointer shrink-0"
                        />

                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm text-gray-900 font-playfair">{addon.name}</h4>
                            <span className="text-xs font-bold text-[#a66a3a] whitespace-nowrap bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                              {details.mainPrice}
                            </span>
                          </div>

                          {details.note && (
                            <p className="text-[11px] text-amber-800 font-semibold">{details.note}</p>
                          )}

                          <p className="text-xs text-gray-500 font-light leading-relaxed">
                            {addon.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* NAVIGATION BOTTOM BAR */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-[#e3a638]/40 shadow-xl">
          <Link href="/du-toan-chi-phi/venues">
            <button type="button" className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại chọn sảnh
            </button>
          </Link>

          <Link href="/du-toan-chi-phi/menu">
            <button 
              type="button"
              className="bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
            >
              <span>Sang Bước 4: Xem Thực Đơn & Đồ Uống</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
