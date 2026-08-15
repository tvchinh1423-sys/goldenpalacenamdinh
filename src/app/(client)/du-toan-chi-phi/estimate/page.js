'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useEstimate } from '@/components/guest/EstimateContext';
import { format } from 'date-fns';

export default function Estimate() {
  const { estimateData } = useEstimate();
  const { guestCount, budgetPerTable, session, date, selectedVenues, selectedPackage, selectedAddOns } = estimateData;

  const [submitted, setSubmitted] = useState(false);
  const [linkToken, setLinkToken] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    // Basic recalculation for display
    const tableCount = Math.ceil(guestCount / 10);
    const menuBase = tableCount * budgetPerTable;
    setPricing({ menuBase, tableCount });
  }, [guestCount, budgetPerTable]);

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
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="flex justify-between items-center px-6 h-20 max-w-7xl mx-auto">
          <Link href="/du-toan-chi-phi/services" className="flex items-center gap-2 text-gray-700 hover:text-[#a66a3a] transition-colors text-sm uppercase font-semibold">
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại chọn dịch vụ
          </Link>
          <h1 className="font-playfair text-xl tracking-widest uppercase font-semibold text-[#a66a3a]">
            Golden Palace
          </h1>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#a66a3a]">
            Báo giá tự động
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="text-center mb-12">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-semibold">
            Bước 4: Tổng hợp phương án kinh phí
          </span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-semibold text-gray-900 mt-2 mb-3">
            Bảng Dự Trù Ngân Sách Sự Kiện
          </h2>
          <p className="text-gray-600 font-light text-sm max-w-2xl mx-auto">
            Chi tiết các hạng mục dự kiến. Vui lòng để lại thông tin để chuyên viên Golden Palace gửi bản mềm báo giá chi tiết kèm ưu đãi đặc quyền.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#e3a638]/30 space-y-6">
              <div className="border-b border-gray-100 pb-6">
                <span className="text-xs text-[#a66a3a] font-semibold uppercase tracking-widest block mb-1">Thông số tiệc</span>
                <h3 className="text-2xl font-playfair font-semibold text-gray-900">
                  {guestCount} Khách ({pricing?.tableCount} mâm tiệc)
                </h3>
                <p className="text-gray-500 text-xs font-light mt-1">
                  Thời gian: <strong>{date ? format(new Date(date), 'dd/MM/yyyy') : 'Chưa xác định'}</strong> ({session})
                </p>
              </div>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-700">Dự kiến Mâm cỗ ({formatCurrency(budgetPerTable)}/mâm)</span>
                  <span className="text-[#a66a3a] font-semibold text-base">{formatCurrency(pricing?.menuBase || 0)}</span>
                </div>
                {selectedVenues.length > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-700">Phí dịch vụ hội trường ({selectedVenues.length} sảnh)</span>
                    <span className="text-[#a66a3a] font-semibold">Theo quy định sảnh chọn</span>
                  </div>
                )}
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-700">Dịch vụ nâng cao / bổ sung ({selectedAddOns.length} hạng mục)</span>
                    <span className="text-[#a66a3a] font-semibold">Đã tổng hợp</span>
                  </div>
                )}
              </div>

              {/* CRITICAL RESTORED VAT & DRINK NOTICE NOTE */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-5 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-700 text-lg flex-shrink-0 mt-0.5">info</span>
                <div>
                  <p className="font-semibold text-amber-900 mb-1">Lưu ý quan trọng về báo giá:</p>
                  <p className="font-light text-amber-800">
                    • Giá trên là kinh phí dự trù tham khảo.<br />
                    • <strong>Báo giá CHƯA bao gồm thuế VAT (10%) và Chi phí đồ uống (Bia, Nước ngọt, Nước suối).</strong><br />
                    • Đối với tiệc từ 300 khách trở lên, Golden Palace có áp dụng các gói ưu đãi tặng kèm đặc quyền theo thời điểm.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-[#e3a638]/30 rounded-2xl p-8 shadow-xl sticky top-28">
              {!submitted ? (
                <>
                  <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-2">Lưu Phương Án & Nhận Báo Giá</h3>
                  <p className="text-gray-500 text-xs font-light mb-6">
                    Điền thông tin để chuyên viên Golden Palace hỗ trợ tư vấn & giữ chỗ ưu đãi.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">Họ và tên *</label>
                      <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full bg-[#fcf9f2] border border-gray-200 rounded-lg py-3 px-4 text-sm font-medium focus:border-[#e3a638] focus:outline-none" 
                        placeholder="Nhập tên của bạn" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                      <input 
                        type="tel" 
                        required 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        className="w-full bg-[#fcf9f2] border border-gray-200 rounded-lg py-3 px-4 text-sm font-medium focus:border-[#e3a638] focus:outline-none" 
                        placeholder="Nhập số điện thoại Zalo" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">Ghi chú thêm (Tùy chọn)</label>
                      <input 
                        type="text" 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        className="w-full bg-[#fcf9f2] border border-gray-200 rounded-lg py-3 px-4 text-sm font-medium focus:border-[#e3a638] focus:outline-none" 
                        placeholder="Yêu cầu riêng về trang trí, thực đơn..." 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading} 
                      className="w-full py-4 mt-2 rounded-lg bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-semibold uppercase text-xs tracking-wider shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">{isLoading ? 'hourglass_empty' : 'send'}</span> 
                      {isLoading ? 'Đang gửi...' : 'Gửi Nhận Báo Giá Chi Tiết'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-2">Gửi Thành Công!</h3>
                  <p className="text-gray-600 text-xs font-light mb-6 leading-relaxed">
                    Cảm ơn bạn! Chuyên viên Golden Palace sẽ liên hệ tư vấn và gửi file báo giá chính xác nhất trong 15 phút.
                  </p>
                  <Link href="/" className="inline-block w-full py-3.5 bg-gray-900 text-amber-300 font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-black transition-colors">
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
