'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

const VENUE_INCLUDED_ITEMS = {
  'Hội trường Tầng 2': {
    name: 'Hạng mục Dịch vụ Cơ bản Tầng 2',
    description: 'Bao gồm toàn bộ trang thiết bị & dịch vụ phục vụ tiệc cưới tại Đại Cung Điện Tầng 2',
    items: [
      'Không gian Đại Cung Điện trần cao 7m hoàn toàn không cột chắn tầm nhìn',
      'Màn hình LED P2.5 siêu nét tiêu chuẩn 30m²',
      'Hệ thống âm thanh ánh sáng biểu diễn chuyên nghiệp',
      'Giàn đèn bướm nghệ thuật rực rỡ & đường dẫn hoa lụa lãng mạn',
      'Trang trí phông 2 bên sân khấu & Phông chụp ảnh lưu niệm cao cấp',
      'Cổng hoa chào đón & Bàn gallery đón khách chỉn chu',
      'Đội ngũ quản lý & nhân viên phục vụ tận tâm suốt tiệc'
    ]
  },
  'Hội trường Tầng 3': {
    name: 'Hạng mục Dịch vụ Cơ bản Tầng 3',
    description: 'Bao gồm toàn bộ trang thiết bị & dịch vụ phục vụ tiệc cưới tại Hội trường Hoàng Gia Tầng 3',
    items: [
      'Không gian sảnh tiệc tân cổ điển Rose Gold thoáng đãng không cột chắn',
      'Màn hình LED P2.5 tiêu chuẩn 30m² trình chiếu sắc nét',
      'Hệ thống âm thanh ánh sáng sân khấu biểu diễn cao cấp',
      'Giàn đèn bướm nghệ thuật & hệ thống đèn đường dẫn cô dâu tự động',
      'Trang trí phông 2 bên sân khấu & Phông lưu niệm đón khách',
      'Cổng chào đón & Bàn tiền mừng/bàn mừng lụa chỉn chu',
      'Đội ngũ quản lý & nhân viên phục vụ chuyên nghiệp'
    ]
  },
  'Hội trường Tầng 4': {
    name: 'Hạng mục Dịch vụ Cơ bản Tầng 4',
    description: 'Bao gồm toàn bộ trang thiết bị & dịch vụ phục vụ tiệc cưới tại Tầng 4',
    items: [
      'Không gian tiệc cưới ấm cúng, sang trọng cho tiệc 100 - 300 khách',
      'Màn hình LED 10m² hiện đại',
      'Hệ thống âm thanh & ánh sáng biểu diễn tiêu chuẩn',
      'Hoa lụa trang trí 2 bên sân khấu & Cổng hoa chào đón',
      'Phông chụp ảnh lưu niệm & Bàn mừng chỉn chu',
      'Đội ngũ nhân viên phục vụ chu đáo'
    ]
  },
  'Quầy Bar Tầng 1': {
    name: 'Hạng mục Dịch vụ Cơ bản Quầy Bar',
    description: 'Bao gồm toàn bộ trang thiết bị & dịch vụ cho tiệc tại Quầy Bar Tầng 1',
    items: [
      'Không gian quầy Bar kiến trúc hiện đại sành điệu',
      'Quầy pha chế chuyên nghiệp & hệ thống ánh sáng Lounge ấm cúng',
      'Hệ thống âm thanh chất lượng cao cho tiệc sinh nhật/kỷ niệm',
      'Đội ngũ nhân viên phục vụ tiệc tận tình'
    ]
  },
  'Phòng VIP': {
    name: 'Hạng mục Dịch vụ Cơ bản Phòng VIP',
    description: 'Bao gồm toàn bộ dịch vụ cho tiệc riêng tư tại Phòng VIP',
    items: [
      'Không gian phòng VIP biệt lập, riêng tư tuyệt đối',
      'Nội thất sang trọng mạ vàng & bàn tiệc xoay hoàng gia',
      'Phục vụ riêng chuẩn 5 sao tận tình chu đáo',
      'Không gian yên tĩnh phù hợp tiếp đón đối tác & gia đình'
    ]
  }
};

export default function Services() {
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

  // Find selected venue object
  const currentVenue = allVenues.find(v => v.id === selectedVenueId) || allVenues[0];
  const currentVenueName = currentVenue?.name || 'Hội trường Tầng 2';
  const venueIncludedInfo = VENUE_INCLUDED_ITEMS[currentVenueName] || VENUE_INCLUDED_ITEMS['Hội trường Tầng 2'];

  const isEligibleForFreeLaserRing = Number(guestCount) >= 400;

  const toggleAddon = (id) => {
    if (selectedAddOns.includes(id)) {
      updateEstimate({ selectedAddOns: selectedAddOns.filter(a => a !== id) });
    } else {
      updateEstimate({ selectedAddOns: [...selectedAddOns, id] });
    }
  };

  // Helper to extract clean price vs note in parentheses ()
  const parseAddonDetails = (addon) => {
    const raw = addon.description || '';
    
    // Check Laser Ring free gift condition
    if (addon.name.includes('Vòng ánh sáng laser')) {
      if (isEligibleForFreeLaserRing) {
        return {
          mainPrice: '0 VNĐ (Tặng miễn phí)',
          note: '🎁 Tiệc > 400 khách được TẶNG MIỄN PHÍ',
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

    // Split text before '(' and inside '(...)'
    const parenIndex = raw.indexOf('(');
    if (parenIndex !== -1) {
      const mainPrice = raw.substring(0, parenIndex).trim();
      const note = raw.substring(parenIndex + 1, raw.lastIndexOf(')')).trim();
      
      let numericPrice = 0;
      if (mainPrice.includes('800.000')) numericPrice = 800000;
      else if (mainPrice.includes('1.000.000')) numericPrice = 1000000;
      else if (mainPrice.includes('1.500.000')) numericPrice = 1500000;
      else if (mainPrice.includes('3.000.000')) numericPrice = 3000000;
      else if (mainPrice.includes('3.400.000')) numericPrice = 3400000;
      else if (mainPrice.includes('4.000.000')) numericPrice = 4000000;
      else if (mainPrice.includes('5.000.000')) numericPrice = 5000000;
      else if (mainPrice.includes('14.000.000')) numericPrice = 14000000;
      else if (mainPrice.includes('900.000')) numericPrice = 900000;

      return { mainPrice, note, numericPrice };
    }

    let numericPrice = 0;
    if (raw.includes('800.000')) numericPrice = 800000;
    else if (raw.includes('1.000.000')) numericPrice = 1000000;
    else if (raw.includes('5.000.000')) numericPrice = 5000000;

    return { mainPrice: raw, note: null, numericPrice };
  };

  const calculateAddonsTotal = () => {
    let total = 0;
    selectedAddOns.forEach(id => {
      const addon = addons.find(a => a.id === id);
      if (addon) {
        const details = parseAddonDetails(addon);
        total += details.numericPrice;
      }
    });
    return total;
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen flex flex-col pt-24 pb-28">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="flex justify-between items-center px-6 h-20 max-w-7xl mx-auto">
          <Link href="/du-toan-chi-phi/venues" className="flex items-center gap-2 text-gray-700 hover:text-[#a66a3a] transition-colors text-sm uppercase font-semibold">
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại chọn sảnh
          </Link>
          <h1 className="font-playfair text-xl tracking-widest uppercase font-semibold text-[#a66a3a]">
            Golden Palace
          </h1>
          <Link href="/du-toan-chi-phi/estimate" className="text-xs uppercase tracking-wider font-semibold text-[#a66a3a] hover:underline">
            Bước tiếp theo
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-3">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-semibold">
            Bước 3: Tinh hoa dịch vụ & Hạng mục đi kèm
          </span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-semibold text-gray-900">
            Dịch Vụ & Hạng Mục Cho {currentVenueName}
          </h2>
          <p className="text-gray-600 font-light text-sm max-w-2xl mx-auto">
            Xem toàn bộ các hạng mục cơ bản đã bao gồm theo sảnh và chủ động chọn các dịch vụ nâng cao/bổ sung cho ngày trọng đại.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#e3a638]">progress_activity</span>
          </div>
        ) : (
          <>
            {/* SECTION 1: HẠNG MỤC CƠ BẢN ĐÃ BAO GỒM THEO SẢNH ĐÃ CHỌN */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#e3a638]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#e3a638] to-[#a66a3a] text-white px-6 py-2 rounded-bl-2xl text-xs uppercase tracking-widest font-semibold shadow-md">
                Đã bao gồm trong Phí dịch vụ sảnh
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#e3a638]/10 text-[#a66a3a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <h3 className="text-2xl font-playfair font-semibold text-gray-900">{venueIncludedInfo.name}</h3>
                  <p className="text-gray-500 text-xs font-light">{venueIncludedInfo.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                {venueIncludedInfo.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#fcf9f2] border border-[#e3a638]/15">
                    <span className="material-symbols-outlined text-[#e3a638] text-lg mt-0.5">check_circle</span>
                    <span className="text-xs text-gray-800 font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: DỊCH VỤ NÂNG CAO / BỔ SUNG */}
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex items-center justify-between border-b border-[#e3a638]/20 pb-4">
                <div>
                  <h3 className="text-2xl font-playfair font-semibold text-gray-900">Dịch Vụ Nâng Cao & Bổ Sung</h3>
                  <p className="text-gray-500 text-xs font-light mt-1">Lựa chọn thêm các dịch vụ biểu diễn, hiệu ứng, chụp ảnh Photobooth & trang trí</p>
                </div>
                <span className="text-xs uppercase tracking-widest text-[#a66a3a] font-semibold">
                  Đã chọn ({selectedAddOns.length} hạng mục)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {addons.map(a => {
                  const isSelected = selectedAddOns.includes(a.id);
                  const details = parseAddonDetails(a);

                  return (
                    <div 
                      key={a.id} 
                      onClick={() => toggleAddon(a.id)}
                      className={`bg-white p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-md relative ${
                        isSelected 
                          ? 'border-[#e3a638] ring-2 ring-[#e3a638]/30 shadow-xl bg-[#fffefb]' 
                          : 'border-gray-200 hover:border-[#e3a638]/60'
                      }`}
                    >
                      <div>
                        {/* Title & Plus/Check Button */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm font-playfair">{a.name}</h4>
                          
                          <button className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
                            isSelected ? 'bg-[#e3a638] border-[#e3a638] text-white' : 'border-gray-300 text-gray-400'
                          }`}>
                            <span className="material-symbols-outlined text-sm">{isSelected ? 'check' : 'add'}</span>
                          </button>
                        </div>

                        {/* SINGLE PRICE DISPLAY */}
                        <div className="mb-2">
                          <span className={`text-xs font-semibold ${
                            details.isFree 
                              ? 'text-emerald-600 font-bold' 
                              : details.isContact 
                              ? 'text-amber-800' 
                              : 'text-gray-900'
                          }`}>
                            {details.mainPrice}
                          </span>
                        </div>

                        {/* YELLOW/AMBER PILL NOTE FOR TEXT IN PARENTHESES () */}
                        {details.note && (
                          <div className={`p-2.5 rounded-lg text-xs leading-relaxed font-medium ${
                            details.isFree 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-900 border border-amber-200/60'
                          }`}>
                            {details.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESTIMATE BOTTOM BAR */}
            <div className="mt-6 p-6 bg-white border border-[#e3a638]/30 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
              <div>
                <p className="text-gray-500 text-xs font-light mb-1">Tạm tính Dịch vụ nâng cao đã chọn:</p>
                <div className="text-2xl sm:text-3xl font-playfair font-semibold text-[#a66a3a]">
                  {calculateAddonsTotal() > 0 ? formatCurrency(calculateAddonsTotal()) : '0 VNĐ'}
                  {isEligibleForFreeLaserRing && selectedAddOns.some(id => addons.find(a => a.id === id)?.name.includes('Vòng ánh sáng')) && (
                    <span className="text-xs font-normal text-emerald-600 ml-2">(🎉 Đã được TẶNG MIỄN PHÍ Vòng Laser)</span>
                  )}
                  {selectedAddOns.some(id => addons.find(a => a.id === id)?.name.includes('Trang Trí')) && (
                    <span className="text-xs font-normal text-amber-700 ml-2">(+ Chi phí trang trí Liên hệ riêng)</span>
                  )}
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Link href="/du-toan-chi-phi/venues" className="flex-1 md:flex-none">
                  <button className="w-full px-6 py-3.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer">
                    Quay Lại
                  </button>
                </Link>
                <Link href="/du-toan-chi-phi/estimate" className="flex-1 md:flex-none">
                  <button className="w-full px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-semibold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity cursor-pointer">
                    Tiếp Tục Bảng Báo Giá ➔
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
