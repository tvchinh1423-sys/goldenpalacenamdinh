'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useEstimate } from '@/components/guest/EstimateContext';
import { format } from 'date-fns';

function calculateVenueFee(venueName, guestCount) {
  const name = venueName || '';
  const count = Number(guestCount) || 100;

  if (name.includes('Tầng 2')) {
    if (count >= 350) return 10000000;
    if (count >= 250) return 12000000;
    return 0;
  }
  if (name.includes('Tầng 3')) {
    if (count >= 300) return 10000000;
    if (count >= 250) return 12000000;
    return 0;
  }
  return 2000000;
}

export default function Estimate() {
  const { estimateData } = useEstimate();
  const { guestCount, budgetPerTable, session, date, selectedVenues, selectedPackage, selectedAddOns } = estimateData;

  const [submitted, setSubmitted] = useState(false);
  const [linkToken, setLinkToken] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [venueInfo, setVenueInfo] = useState({ name: 'Hội trường chọn', fee: 2000000 });
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    async function fetchVenueData() {
      let venueName = 'Hội trường Tầng 2';
      let fee = 10000000;

      if (selectedVenues && selectedVenues.length > 0) {
        try {
          const res = await fetch(`/api/guest/venues?guests=${guestCount}`);
          const venues = await res.json();
          const selected = venues.find(v => v.id === selectedVenues[0]);
          if (selected) {
            venueName = selected.name;
            fee = calculateVenueFee(selected.name, guestCount);
          }
        } catch(e) {}
      } else {
        fee = calculateVenueFee('Tầng 2', guestCount);
      }

      setVenueInfo({ name: venueName, fee });

      const tableCount = Math.ceil(guestCount / 10);
      const menuBase = tableCount * budgetPerTable;
      const totalBase = menuBase + fee;

      setPricing({ menuBase, tableCount, totalBase });
    }
    fetchVenueData();
  }, [guestCount, budgetPerTable, selectedVenues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/guest/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, phone, notes,
          guestCount, budgetPerTable, session, date,
          selectedVenues, selectedPackage, selectedAddOns
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLinkToken(data.linkToken);
        setSubmitted(true);
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error(error);
      alert('Không thể kết nối đến máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-32">
      
      {/* Sub-header Navigation Context */}
      <div className="bg-white border-b border-gray-200 shadow-xs py-3 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/du-toan-chi-phi/services" className="flex items-center gap-2 text-[#a66a3a] hover:underline text-xs uppercase font-bold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Quay lại chọn dịch vụ</span>
          </Link>
          <span className="text-xs uppercase tracking-wider font-bold text-[#a66a3a]">
            Bước 4 / 4: Báo Giá Tự Động
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">
            Tổng hợp phương án kinh phí
          </span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
            Bảng Dự Trù Ngân Sách Chi Tiết
          </h2>
          <p className="text-gray-600 font-light text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Chi tiết các hạng mục dự kiến. Vui lòng để lại thông tin để chuyên viên Golden Palace gửi bản mềm báo giá kèm ưu đãi đặc quyền.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Detailed Pricing Breakdown */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#e3a638]/40 space-y-6">
              
              <div className="border-b border-gray-100 pb-5">
                <span className="text-xs text-[#a66a3a] font-bold uppercase tracking-widest block mb-1">Thông số tiệc</span>
                <h3 className="text-2xl font-playfair font-bold text-gray-900">
                  {guestCount} Khách ({pricing?.tableCount} mâm tiệc)
                </h3>
                <p className="text-gray-600 text-xs font-light mt-1">
                  Thời gian: <strong>{date ? format(new Date(date), 'dd/MM/yyyy') : 'Chưa xác định'}</strong> ({session})
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm font-medium">
                
                {/* 1. Mâm cỗ */}
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-gray-700">Dự kiến Mâm cỗ ({formatCurrency(budgetPerTable)}/mâm)</span>
                  <span className="text-gray-900 font-bold text-base">{formatCurrency(pricing?.menuBase || 0)}</span>
                </div>

                {/* 2. Phí thuê hội trường (Explicitly calculated per user rules) */}
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100 bg-amber-50/60 p-3 rounded-xl">
                  <div>
                    <span className="text-gray-900 font-bold block">Phí dịch vụ hội trường ({venueInfo.name})</span>
                    <span className="text-[11px] text-gray-500 font-light">Tính theo quy định chuẩn quy mô {guestCount} khách</span>
                  </div>
                  <span className="text-[#a66a3a] font-bold text-base">{formatCurrency(venueInfo.fee)}</span>
                </div>

                {/* 3. Phụ phí dịch vụ bổ sung nếu chọn */}
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                    <span className="text-gray-700">Dịch vụ nâng cao / bổ sung ({selectedAddOns.length} hạng mục)</span>
                    <span className="text-gray-900 font-bold">Đã tổng hợp</span>
                  </div>
                )}

                {/* 4. Tổng dự toán ban đầu */}
                <div className="flex justify-between items-center pt-3 text-sm sm:text-base font-bold text-gray-900 border-t-2 border-[#e3a638]/40">
                  <span>Tổng dự toán tạm tính:</span>
                  <span className="text-xl sm:text-2xl font-playfair font-bold text-[#a66a3a]">
                    {formatCurrency(pricing?.totalBase || 0)}
                  </span>
                </div>

              </div>

              {/* VAT 8% & DRINK NOTICE NOTE */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-950 text-xs leading-relaxed flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-700 text-lg flex-shrink-0 mt-0.5">info</span>
                <div>
                  <p className="font-bold text-amber-950 mb-1">Lưu ý quan trọng về báo giá:</p>
                  <p className="font-light text-amber-900/90 leading-relaxed">
                    • Giá trên là kinh phí dự trù tham khảo.<br />
                    • <strong>Báo giá CHƯA bao gồm thuế VAT (8%) và Chi phí đồ uống (Bia, Nước ngọt, Nước suối).</strong><br />
                    • Đối với tiệc từ 300 khách trở lên, Golden Palace có áp dụng các gói ưu đãi tặng kèm đặc quyền theo thời điểm.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Form to submit and get quote */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#e3a638]/40 rounded-3xl p-6 sm:p-8 shadow-xl sticky top-28">
              {!submitted ? (
                <>
                  <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-1">Lưu Phương Án & Nhận Báo Giá</h3>
                  <p className="text-gray-500 text-xs font-light mb-6">
                    Điền thông tin để chuyên viên Golden Palace hỗ trợ giữ chỗ và gửi báo giá chi tiết qua Zalo.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Họ và tên *</label>
                      <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full bg-[#fcf9f2] border border-gray-300 rounded-xl py-3 px-4 text-xs font-medium focus:border-[#e3a638] focus:outline-none" 
                        placeholder="Nhập tên của bạn" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Số điện thoại Zalo *</label>
                      <input 
                        type="tel" 
                        required 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        className="w-full bg-[#fcf9f2] border border-gray-300 rounded-xl py-3 px-4 text-xs font-medium focus:border-[#e3a638] focus:outline-none" 
                        placeholder="Nhập số điện thoại Zalo" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Ghi chú thêm (Tùy chọn)</label>
                      <input 
                        type="text" 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        className="w-full bg-[#fcf9f2] border border-gray-300 rounded-xl py-3 px-4 text-xs font-medium focus:border-[#e3a638] focus:outline-none" 
                        placeholder="Yêu cầu riêng về trang trí, thực đơn..." 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading} 
                      className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold uppercase text-xs tracking-wider shadow-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">{isLoading ? 'hourglass_empty' : 'send'}</span> 
                      {isLoading ? 'Đang gửi...' : 'Gửi Nhận Báo Giá Chi Tiết'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">Gửi Thành Công!</h3>
                  <p className="text-gray-600 text-xs font-light mb-6 leading-relaxed">
                    Cảm ơn bạn! Chuyên viên Golden Palace sẽ liên hệ tư vấn và gửi file báo giá chính xác nhất trong ít phút.
                  </p>
                  <Link href="/" className="inline-block w-full py-3.5 bg-gray-900 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors">
                    Trở về Trang chủ
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
