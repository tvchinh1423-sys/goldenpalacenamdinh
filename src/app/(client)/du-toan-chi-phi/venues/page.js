'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

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

  // Tầng 4 & Quầy Bar
  return { eligible: true, fee: 2000000, label: '2.000.000 VNĐ (Phí dịch vụ tiêu chuẩn)' };
}

export default function Step2Venues() {
  const { estimateData, updateEstimate } = useEstimate();
  const { guestCount, selectedVenues } = estimateData;
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery Lightbox Modal
  const [activeGalleryVenue, setActiveGalleryVenue] = useState(null);
  
  // Active compare mode state
  const [compareVenues, setCompareVenues] = useState([]);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch(`/api/guest/venues?guests=${guestCount}`);
        let data = await res.json();

        // For wedding parties, filter out VIP private dining rooms
        data = data.filter(v => !v.name.includes('Phòng VIP'));
        setVenues(data);

        // Pre-select first 2 available venues for comparison if empty
        if (selectedVenues.length === 0 && data.length >= 2) {
          updateEstimate({ selectedVenues: [data[0].id] });
          setCompareVenues([data[0].id, data[1].id]);
        } else if (selectedVenues.length > 0) {
          const secondVenue = data.find(v => v.id !== selectedVenues[0]);
          setCompareVenues(secondVenue ? [selectedVenues[0], secondVenue.id] : [selectedVenues[0]]);
        }
      } catch (error) {
        console.error('Failed to fetch venues:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, [guestCount]);

  const toggleCompare = (id) => {
    if (compareVenues.includes(id)) {
      setCompareVenues(compareVenues.filter(v => v !== id));
    } else {
      if (compareVenues.length < 2) {
        setCompareVenues([...compareVenues, id]);
      } else {
        setCompareVenues([compareVenues[1], id]);
      }
    }
  };

  const selectMainVenue = (id) => {
    updateEstimate({ selectedVenues: [id] });
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const compareObjects = venues.filter(v => compareVenues.includes(v.id));

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-40">
      
      {/* Context Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-xs py-3 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
            <Link href="/du-toan-chi-phi" className="text-[#a66a3a] hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Đổi thông tin quy mô</span>
            </Link>
            <span>•</span>
            <span>Quy mô tiệc cưới: <strong className="text-[#a66a3a]">{guestCount} khách ({Math.ceil(guestCount / 10)} mâm)</strong></span>
          </div>

          <Link href="/du-toan-chi-phi">
            <button className="text-xs text-[#a66a3a] font-bold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">edit</span>
              Sửa số khách ({guestCount} khách)
            </button>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center mb-8">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">Bước 2 / 4</span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
            Chọn & So Sánh Hội Trường Tiệc Cưới
          </h2>
          <p className="text-gray-600 font-light text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Khám phá chi tiết các hội trường hoàng gia, chọn 2 sảnh để so sánh thông số và chọn không gian cưới ưng ý nhất.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#e3a638]">progress_activity</span>
          </div>
        ) : (
          <>
            {/* DANH SÁCH THẺ SẢNH HỘI TRƯỜNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map(v => {
                const isSelected = selectedVenues.includes(v.id);
                const isComparing = compareVenues.includes(v.id);
                let images = [];
                try { images = JSON.parse(v.images || '[]'); } catch(e) {}
                const mainImage = images[0] || '/images/hd-venues/tang-3-hd-1.jpg';

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
                        Sảnh Đã Chọn
                      </div>
                    )}

                    {/* Image Header */}
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

                    {/* Details */}
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

                    {/* Actions */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveGalleryVenue(v)}
                          className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>Xem Ảnh Sảnh</span>
                        </button>

                        <button 
                          onClick={() => toggleCompare(v.id)}
                          className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                            isComparing 
                              ? 'bg-amber-100 border-amber-400 text-[#a66a3a]' 
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">compare_arrows</span>
                          <span>{isComparing ? 'Đang So Sánh' : 'So Sánh'}</span>
                        </button>
                      </div>

                      {feeInfo.eligible ? (
                        <Link href="/du-toan-chi-phi/services" className="w-full">
                          <button 
                            onClick={() => selectMainVenue(v.id)} 
                            className="w-full bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            Chọn Sảnh Này & Sang Chọn Menu
                          </button>
                        </Link>
                      ) : (
                        <button 
                          disabled 
                          className="w-full bg-gray-200 text-gray-400 font-bold text-xs uppercase tracking-wider py-3 rounded-xl cursor-not-allowed"
                        >
                          Không Đủ Số Khách
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* BẢNG SO SÁNH 2 HỘI TRƯỜNG */}
            {compareObjects.length >= 2 && (
              <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-2xl p-6 sm:p-10 space-y-6">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">Đối sánh trực quan</span>
                  <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900">
                    Bảng So Sánh Chi Tiết 2 Hội Trường
                  </h3>
                  <p className="text-gray-500 text-xs font-light mt-1">
                    So sánh thông số kỹ thuật, thiết bị và không gian giữa 2 sảnh tiệc bạn quan tâm
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b-2 border-[#e3a638]/30 bg-[#fcf9f2]">
                        <th className="p-4 font-bold text-gray-800 uppercase tracking-wider w-1/3">Tiêu chí so sánh</th>
                        {compareObjects.map(v => (
                          <th key={v.id} className="p-4 font-bold font-playfair text-lg text-[#a66a3a] text-center w-1/3 border-l border-amber-200/60">
                            {v.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Sức chứa tối đa</td>
                        {compareObjects.map(v => (
                          <td key={v.id} className="p-4 text-center font-bold text-gray-900 border-l border-gray-100">
                            {v.minGuests} - {v.maxGuests} khách ({Math.floor(v.maxGuests/10)} mâm)
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Màn hình LED & Thiết bị</td>
                        {compareObjects.map(v => (
                          <td key={v.id} className="p-4 text-center text-gray-700 border-l border-gray-100">
                            {v.name.includes('Tầng 2') || v.name.includes('Tầng 3') 
                              ? 'Màn hình LED 30m² P2.5 + Giàn đèn bướm/pha lê biểu diễn' 
                              : 'Màn hình LED 10m² + Đèn LED tiệc cưới hiện đại'}
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Kiến trúc trần & Lối đi</td>
                        {compareObjects.map(v => (
                          <td key={v.id} className="p-4 text-center text-gray-700 border-l border-gray-100">
                            {v.name.includes('Tầng 2') || v.name.includes('Tầng 3') 
                              ? 'Trần cao 7m không cột chắn, 10 cột hoa đường dẫn thảm đỏ' 
                              : 'Trần ấm cúng 4m, 6 cột hoa trang trí lối đi'}
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Phí dịch vụ hội trường ({guestCount} khách)</td>
                        {compareObjects.map(v => {
                          const feeInfo = getVenueFeeInfo(v.name, guestCount);
                          return (
                            <td key={v.id} className="p-4 text-center font-bold text-[#a66a3a] border-l border-gray-100">
                              {feeInfo.eligible ? feeInfo.label : <span className="text-red-600 font-semibold">{feeInfo.reason}</span>}
                            </td>
                          );
                        })}
                      </tr>

                      <tr className="bg-amber-50/30">
                        <td className="p-4 font-semibold text-gray-800">Hành động chọn sảnh</td>
                        {compareObjects.map(v => {
                          const feeInfo = getVenueFeeInfo(v.name, guestCount);
                          return (
                            <td key={v.id} className="p-4 text-center border-l border-amber-200/60">
                              {feeInfo.eligible ? (
                                <Link href="/du-toan-chi-phi/services">
                                  <button 
                                    onClick={() => selectMainVenue(v.id)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 cursor-pointer"
                                  >
                                    Chọn {v.name}
                                  </button>
                                </Link>
                              ) : (
                                <span className="text-xs text-gray-400 font-medium">Không khả dụng</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
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
