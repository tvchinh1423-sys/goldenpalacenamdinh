'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

const EVENT_LABEL_MAP = {
  'WEDDING': 'Tiệc Cưới',
  'CONFERENCE': 'Hội Nghị & Sự Kiện',
  'BIRTHDAY': 'Tiệc Sinh Nhật',
  'ANNIVERSARY': 'Tiệc Kỷ Niệm',
  'OTHER': 'Sự Kiện Khác'
};

// Calculate venue fee according to exact user rules
function getVenueFeeInfo(venueName, guestCount) {
  const name = venueName || '';
  const count = Number(guestCount) || 100;

  if (name.includes('Tầng 2')) {
    if (count < 250) return { eligible: false, fee: 0, reason: 'Tầng 2 chỉ áp dụng cho tiệc từ 250 khách trở lên' };
    if (count >= 350) return { eligible: true, fee: 10000000, label: '10.000.000 VNĐ (Từ 350 khách trở lên)' };
    return { eligible: true, fee: 12000000, label: '12.000.000 VNĐ (Từ 250 - 349 khách)' };
  }

  if (name.includes('Tầng 3')) {
    if (count < 250) return { eligible: false, fee: 0, reason: 'Tầng 3 chỉ áp dụng cho tiệc từ 250 khách trở lên' };
    if (count >= 300) return { eligible: true, fee: 10000000, label: '10.000.000 VNĐ (Từ 300 khách trở lên)' };
    return { eligible: true, fee: 12000000, label: '12.000.000 VNĐ (Từ 250 - 299 khách)' };
  }

  // Tầng 4, Quầy Bar, Phòng VIP
  return { eligible: true, fee: 2000000, label: '2.000.000 VNĐ (Phí dịch vụ tiêu chuẩn)' };
}

export default function Venues() {
  const { estimateData, updateEstimate } = useEstimate();
  const { eventType, guestCount, budgetPerTable, selectedVenues } = estimateData;
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery Lightbox Modal
  const [activeGalleryVenue, setActiveGalleryVenue] = useState(null);

  const currentEventType = eventType || 'WEDDING';

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch(`/api/guest/venues?guests=${guestCount}`);
        let data = await res.json();

        // Business Rule: "Phòng VIP không cần hiển thị trong phần tiệc cưới"
        if (currentEventType === 'WEDDING') {
          data = data.filter(v => !v.name.includes('Phòng VIP'));
        }

        setVenues(data);
      } catch (error) {
        console.error('Failed to fetch venues:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, [guestCount, currentEventType]);

  const toggleSelect = (id) => {
    if (selectedVenues.includes(id)) {
      updateEstimate({ selectedVenues: selectedVenues.filter(v => v !== id) });
    } else {
      if (selectedVenues.length < 2) {
        updateEstimate({ selectedVenues: [...selectedVenues, id] });
      }
    }
  };

  const selectPreferred = (id) => {
    updateEstimate({ selectedVenues: [id] });
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-40">
      
      {/* Sub-header Context Bar */}
      <div className="bg-white border-b border-gray-200 shadow-xs py-3 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
            <Link href="/du-toan-chi-phi" className="text-[#a66a3a] hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Đổi quy mô & nhánh</span>
            </Link>
            <span>•</span>
            <span>Loại tiệc: <strong className="text-gray-900">{EVENT_LABEL_MAP[currentEventType]}</strong></span>
            <span>•</span>
            <span>Quy mô: <strong className="text-[#a66a3a]">{guestCount} khách</strong></span>
            <span>•</span>
            <span>Mâm: <strong className="text-[#a66a3a]">{Math.ceil(guestCount / 10)} mâm</strong></span>
          </div>

          <Link href="/du-toan-chi-phi">
            <button className="text-xs text-[#a66a3a] font-bold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">edit</span>
              Sửa quy mô ({guestCount} khách)
            </button>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">Bước 2 / 4</span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
            Không Gian Hội Trường Cho {EVENT_LABEL_MAP[currentEventType]}
          </h2>
          <p className="text-gray-600 font-light text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Khám phá hình ảnh và chi tiết phí dịch vụ hội trường. Bấm vào ảnh để xem toàn bộ album không gian.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#e3a638]">progress_activity</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map(v => {
              const isSelected = selectedVenues.includes(v.id);
              let images = [];
              try { images = JSON.parse(v.images || '[]'); } catch(e) {}
              const mainImage = images[0] || 'https://via.placeholder.com/600x400';

              const feeInfo = getVenueFeeInfo(v.name, guestCount);

              return (
                <div 
                  key={v.id} 
                  className={`bg-white rounded-3xl border shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative ${
                    isSelected 
                      ? 'border-2 border-[#e3a638] ring-2 ring-[#e3a638]/30 shadow-2xl' 
                      : 'border-gray-200 hover:border-[#e3a638]'
                  } ${!feeInfo.eligible ? 'opacity-75' : ''}`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      Đã Chọn
                    </div>
                  )}

                  {/* Hall Photo Header */}
                  <div className="relative h-60 overflow-hidden group cursor-pointer" onClick={() => setActiveGalleryVenue(v)}>
                    <img src={mainImage} alt={v.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-white/20">
                      <span className="material-symbols-outlined text-xs">photo_camera</span>
                      <span>{images.length} Ảnh</span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-xl font-playfair font-bold text-white leading-snug">{v.name}</h3>
                      <p className="text-[11px] text-amber-200/90 font-light mt-0.5">Sức chứa: {v.minGuests} - {v.maxGuests} khách</p>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-5 space-y-3 flex-grow">
                    <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-2">{v.description}</p>
                    
                    <div className="p-3.5 rounded-2xl bg-[#fcf9f2] border border-[#e3a638]/30 space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#a66a3a] block">Phí Dịch Vụ Hội Trường</span>
                      {feeInfo.eligible ? (
                        <div className="text-sm font-bold text-gray-900">{feeInfo.label}</div>
                      ) : (
                        <div className="text-xs font-semibold text-red-600">{feeInfo.reason}</div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                    <button 
                      onClick={() => setActiveGalleryVenue(v)}
                      className="px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>Xem ảnh sảnh</span>
                    </button>

                    {feeInfo.eligible ? (
                      <Link href="/du-toan-chi-phi/services" className="flex-grow">
                        <button 
                          onClick={() => selectPreferred(v.id)} 
                          className="w-full bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                        >
                          Chọn Sảnh Này
                        </button>
                      </Link>
                    ) : (
                      <button 
                        disabled 
                        className="flex-grow bg-gray-200 text-gray-400 font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-not-allowed whitespace-nowrap"
                      >
                        Không Đủ Số Khách
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* LIGHTBOX GALLERY MODAL */}
      {activeGalleryVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-montserrat">
          <div className="bg-white border border-gray-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center border-b border-gray-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#e3a638] font-bold">Album Ảnh Thực Tế</span>
                <h3 className="text-2xl font-playfair font-bold text-white mt-0.5">{activeGalleryVenue.name}</h3>
              </div>
              <button 
                onClick={() => setActiveGalleryVenue(null)} 
                className="text-gray-400 hover:text-white w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(() => {
                let imgs = [];
                try { imgs = JSON.parse(activeGalleryVenue.images || '[]'); } catch(e) {}
                if (imgs.length === 0) return <p className="text-center text-gray-500 col-span-3 py-10">Đang cập nhật album ảnh...</p>;
                return imgs.map((imgUrl, i) => (
                  <div key={i} className="h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group relative">
                    <img src={imgUrl} alt={`${activeGalleryVenue.name} photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ));
              })()}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <span className="text-xs text-gray-500 font-light">Hình ảnh thực tế chụp tại Golden Palace Nam Định</span>
              <button 
                onClick={() => setActiveGalleryVenue(null)}
                className="px-6 py-2.5 bg-gray-900 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer"
              >
                Đóng Album
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
