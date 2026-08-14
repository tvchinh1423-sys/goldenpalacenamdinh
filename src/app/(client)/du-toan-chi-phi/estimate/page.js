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
    <div className="bg-background text-on-surface font-body-md antialiased pt-32 pb-40 min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-on-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
          <Link href="/du-toan-chi-phi/services">
            <div className="flex items-center gap-2 cursor-pointer active:scale-95 duration-200 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="hidden md:inline font-label-md">Quay lại</span>
            </div>
          </Link>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-display-lg text-primary-container bg-clip-text bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-transparent text-center absolute left-1/2 -translate-x-1/2">
            Golden Palace
          </h1>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8">
        <div className="text-center mb-12">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Bảng Dự Trù Ngân Sách</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Chi tiết các hạng mục dự kiến cho tiệc cưới của bạn. Vui lòng để lại thông tin để nhận báo giá chính xác kèm các ưu đãi đặc quyền.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="bg-surface-bright/85 backdrop-blur-md border border-gold-gradient-start/30 rounded-xl p-8 shadow-lg">
              <div className="border-b border-outline-variant/50 pb-6 mb-6">
                <h3 className="font-headline-sm text-primary mb-2">Thông tin tiệc</h3>
                <div className="text-on-surface-variant font-body-md">
                  Ngày: {date ? format(new Date(date), 'dd/MM/yyyy') : 'Chưa xác định'} ({session}) • {guestCount} Khách ({pricing?.tableCount} mâm)
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-body-lg text-slate-text">Thực đơn dự kiến ({formatCurrency(budgetPerTable)}/mâm)</span>
                  <span className="font-label-md text-primary">{formatCurrency(pricing?.menuBase || 0)}</span>
                </div>
                {selectedVenues.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-body-lg text-slate-text">Hội trường (Đã chọn {selectedVenues.length})</span>
                    <span className="font-label-md text-primary">Theo báo giá</span>
                  </div>
                )}
                {selectedPackage && (
                  <div className="flex justify-between items-center">
                    <span className="font-body-lg text-slate-text">Gói Dịch Vụ</span>
                    <span className="font-label-md text-primary">Theo báo giá</span>
                  </div>
                )}
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-body-lg text-slate-text">Dịch vụ bổ sung ({selectedAddOns.length} mục)</span>
                    <span className="font-label-md text-primary">Theo báo giá</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gold-gradient-start/30 mt-8 pt-8 flex flex-col items-end">
                <span className="font-headline-sm text-on-surface mb-2">Để nhận báo giá chi tiết cho từng hạng mục...</span>
                <span className="text-on-surface-variant text-sm text-right">Vui lòng điền form bên cạnh để chuyên viên tính toán chính xác nhất cho bạn.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-surface-bright/85 backdrop-blur-md border border-outline-variant/30 rounded-xl p-8 sticky top-32">
              {!submitted ? (
                <>
                  <h3 className="font-headline-sm text-on-surface mb-6">Lưu Phương Án & Nhận Báo Giá</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block font-label-md text-slate-text mb-2">Họ và tên *</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 font-body-lg text-on-surface py-2 px-0" placeholder="Nhập tên của bạn" />
                    </div>
                    <div>
                      <label className="block font-label-md text-slate-text mb-2">Số điện thoại *</label>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 font-body-lg text-on-surface py-2 px-0" placeholder="Nhập số điện thoại" />
                    </div>
                    <div>
                      <label className="block font-label-md text-slate-text mb-2">Ghi chú thêm (Tùy chọn)</label>
                      <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 font-body-lg text-on-surface py-2 px-0" placeholder="Yêu cầu đặc biệt..." />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white font-label-md shadow-lg shadow-gold-gradient-start/30 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      <span className="material-symbols-outlined">{isLoading ? 'hourglass_empty' : 'send'}</span> {isLoading ? 'Đang gửi...' : 'Gửi Nhận Báo Giá'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
                  </div>
                  <h3 className="font-headline-sm text-on-surface mb-4">Gửi thành công!</h3>
                  <p className="font-body-md text-on-surface-variant mb-8">
                    Chuyên viên của Golden Palace sẽ liên hệ với bạn trong thời gian sớm nhất.
                  </p>
                  <div className="flex gap-4 flex-col">
                    <button className="w-full py-3 rounded-lg border border-primary text-primary font-label-md flex items-center justify-center gap-2 hover:bg-primary-container/10">
                      <span className="material-symbols-outlined">link</span> Copy Link Báo Giá ({linkToken.substring(0,8)}...)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
