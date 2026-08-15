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

export default function Venues() {
  const { estimateData, updateEstimate } = useEstimate();
  const { eventType, guestCount, budgetPerTable, selectedVenues } = estimateData;
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-32 pb-40">
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-on-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
          <Link href="/du-toan-chi-phi" className="flex items-center gap-2 text-primary text-xs uppercase font-semibold">
            <span className="material-symbols-outlined">arrow_back</span>
            Đổi loại sự kiện
          </Link>
          <Link href="/" className="flex items-center gap-3 group absolute left-1/2 -translate-x-1/2">
            <img src="/logo-icon.png" alt="Golden Palace Emblem" className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="text-[#a66a3a] font-playfair text-xl tracking-widest uppercase font-semibold">Golden Palace</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-label-md text-primary text-xs font-bold uppercase">
              Nhánh: {EVENT_LABEL_MAP[currentEventType]}
            </span>
          </div>
        </div>
      </header>

      <div className="fixed top-16 w-full z-40 bg-surface-container-high/90 backdrop-blur-md border-b border-gold-gradient-start/20 shadow-sm">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-on-surface-variant font-body-md text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>event_note</span>
              <span className="font-semibold text-gray-900">{EVENT_LABEL_MAP[currentEventType]}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
              <span>{guestCount} khách</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
              <span>{(budgetPerTable / 1000000).toFixed(1)}M/mâm</span>
            </div>
          </div>
          <Link href="/du-toan-chi-phi">
            <button className="text-primary font-label-md hover:underline flex items-center gap-1 transition-colors duration-200 text-xs">
              <span className="material-symbols-outlined text-sm">edit</span>
              Sửa quy mô & nhánh
            </button>
          </Link>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8">
        <div className="text-center mb-section-gap">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-semibold">Bước 2 / 4</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-1 mb-3">Hội Trường Sự Kiện Cho {EVENT_LABEL_MAP[currentEventType]}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto text-sm">
            Khám phá các không gian phù hợp với quy mô khách mời. Chọn tối đa 2 hội trường để so sánh chi tiết.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {venues.map(v => {
              const isSelected = selectedVenues.includes(v.id);
              let images = [];
              try { images = JSON.parse(v.images || '[]'); } catch(e) {}
              const image = images[0] || 'https://via.placeholder.com/600x400';

              // Pricing matching
              const activePricing = v.pricings.find(p => guestCount >= p.guestRangeMin && guestCount <= p.guestRangeMax) || v.pricings[0];
              const price = activePricing?.price || 0;
              const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

              // Silent Business Logic rule: If guestCount < 250, Tang 2 & Tang 3 are not eligible for direct estimate selection
              const isLargeHall = v.name.includes('Tầng 2') || v.name.includes('Tầng 3');
              const isEligible = !(isLargeHall && guestCount < 250);

              const isTight = guestCount > v.maxGuests * 0.9;
              let statusText = 'Phù hợp quy mô';
              let statusColor = 'text-emerald-700 bg-emerald-50';

              if (!isEligible) {
                statusText = 'Dành cho tiệc quy mô lớn';
                statusColor = 'text-amber-700 bg-amber-50';
              } else if (isTight) {
                statusText = 'Có thể chật';
                statusColor = 'text-red-700 bg-red-50';
              }

              return (
                <div key={v.id} className={`glass-panel rounded-xl overflow-hidden transition-all duration-300 relative group flex flex-col h-full ${isSelected ? 'border-primary/60 shadow-[0_4px_20px_rgba(212,175,55,0.15)] ring-1 ring-primary/20' : 'border border-outline-variant/30 hover:border-primary/40'} ${!isEligible ? 'opacity-85' : ''}`}>
                  {isSelected && (
                    <div className="absolute -top-3 right-6 z-10 bg-primary-container text-on-primary-container font-label-md px-4 py-1.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      Đã chọn so sánh
                    </div>
                  )}
                  
                  <div className="relative h-64 overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${image}')` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className={`absolute top-4 left-4 ${statusColor} font-label-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm text-xs font-semibold`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {!isEligible ? 'info' : (isTight ? 'warning' : 'check_circle')}
                      </span>
                      {statusText}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-display-lg">{v.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 font-light">{v.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6 text-on-surface-variant font-body-md text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary opacity-80 text-sm">groups</span>
                        <span>{v.minGuests} - {v.maxGuests} khách</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <span className="material-symbols-outlined text-primary opacity-80 text-sm">payments</span>
                        <span className="font-semibold text-primary">Phí dịch vụ sảnh: {formattedPrice}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex gap-3">
                      {isEligible ? (
                        <>
                          <Link href="/du-toan-chi-phi/services" className="flex-1">
                            <button onClick={() => selectPreferred(v.id)} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white font-label-md py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-md hover:opacity-90 cursor-pointer">
                              <span className="material-symbols-outlined text-[20px]">check</span>
                              Chọn Sảnh
                            </button>
                          </Link>
                          <button 
                            onClick={() => toggleSelect(v.id)}
                            className={`flex-1 font-label-md py-3 rounded-lg flex justify-center items-center gap-2 transition-colors text-xs cursor-pointer ${
                              isSelected 
                                ? 'bg-primary-container/20 border border-primary text-primary font-semibold' 
                                : 'bg-transparent border border-outline text-outline hover:border-primary hover:text-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isSelected ? 'remove' : 'compare_arrows'}
                            </span>
                            {isSelected ? 'Bỏ so sánh' : 'So sánh'}
                          </button>
                        </>
                      ) : (
                        <div className="w-full bg-gray-100 border border-gray-200 text-gray-600 font-label-md py-2.5 px-3 rounded-lg text-center text-xs font-medium">
                          💡 Tối ưu cho tiệc từ 300 khách
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedVenues.length > 0 && (
        <div className="fixed bottom-20 md:bottom-0 left-0 w-full z-50 bg-surface-bright/95 backdrop-blur-xl border-t border-gold-gradient-start/30 shadow-[0_-10px_40px_rgba(212,175,55,0.15)] transform transition-transform duration-500 translate-y-0">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-on-surface-variant font-body-md text-sm">Đang chọn để so sánh</span>
              <span className="text-primary font-headline-sm font-display-lg">Đã chọn {selectedVenues.length}/2 hội trường</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/du-toan-chi-phi/services">
                <button className={`text-white font-label-md px-6 py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-md ${selectedVenues.length > 0 ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028]' : 'bg-surface-variant text-on-surface-variant opacity-80 cursor-not-allowed'}`}>
                  Tiếp tục chọn dịch vụ
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
