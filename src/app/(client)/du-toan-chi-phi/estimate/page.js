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

function parseAddonPrice(addon, guestCount) {
  const raw = addon.description || '';
  if (addon.name.includes('Vòng ánh sáng laser')) {
    if (Number(guestCount) >= 400) return { price: 0, text: '0 VNĐ (Tặng miễn phí)' };
    return { price: 700000, text: '700.000 VNĐ' };
  }
  if (raw.includes('800.000')) return { price: 800000, text: '800.000 VNĐ' };
  if (raw.includes('1.000.000')) return { price: 1000000, text: '1.000.000 VNĐ' };
  if (raw.includes('900.000')) return { price: 900000, text: '900.000 VNĐ' };
  if (raw.includes('3.000.000')) return { price: 3000000, text: '3.000.000 VNĐ' };
  if (raw.includes('3.400.000')) return { price: 3400000, text: '3.400.000 VNĐ' };
  if (raw.includes('4.000.000')) return { price: 4000000, text: '4.000.000 VNĐ' };
  if (raw.includes('5.000.000')) return { price: 5000000, text: '5.000.000 VNĐ' };
  if (raw.includes('14.000.000')) return { price: 14000000, text: '14.000.000 VNĐ' };
  return { price: 0, text: 'Báo giá: Liên hệ' };
}

export default function Step5Estimate() {
  const { estimateData } = useEstimate();
  const { 
    guestCount, budgetPerTable, session, date, 
    selectedVenues, selectedAddOns,
    groomName, brideName, phone: initialPhone 
  } = estimateData;

  const [submitted, setSubmitted] = useState(false);
  const [linkToken, setLinkToken] = useState('');
  const [copied, setCopied] = useState(false);

  const [contactName, setContactName] = useState(
    groomName && brideName ? `Chú rể ${groomName} & Cô dâu ${brideName}` : (groomName || brideName || '')
  );
  const [phone, setPhone] = useState(initialPhone || '');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [venueInfo, setVenueInfo] = useState({ name: 'Hội trường Tầng 3', fee: 10000000 });
  const [pricingBreakdown, setPricingBreakdown] = useState(null);

  useEffect(() => {
    async function calculateSummary() {
      let venueName = 'Hội trường Tầng 3';
      let fee = 10000000;

      // 1. Fetch Venue Info
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
        fee = calculateVenueFee('Tầng 3', guestCount);
      }

      setVenueInfo({ name: venueName, fee });

      // 2. Fetch Database Add-on Services
      let dbAddons = [];
      try {
        const addonRes = await fetch('/api/guest/add-ons');
        dbAddons = await addonRes.json();
      } catch (e) {
        console.error('Failed to fetch DB add-ons:', e);
      }

      const tableCount = Math.ceil(guestCount / 10);
      const safeBudget = Math.max(budgetPerTable || 3200000, 3200000);
      const menuBase = tableCount * safeBudget;

      // 3. Match selectedAddOns UUIDs to dbAddons and ALWAYS USE REAL NAME (NEVER USE GENERIC PLACEHOLDER)
      let addonTotal = 0;
      const addonItems = [];

      (selectedAddOns || []).forEach(id => {
        const matched = dbAddons.find(a => a.id === id);
        if (matched) {
          const pInfo = parseAddonPrice(matched, guestCount);
          addonTotal += pInfo.price;
          // ALWAYS USE MATCHED.NAME - NEVER USE GENERIC "Dịch vụ nâng cao" PLACEHOLDER!
          addonItems.push({ 
            name: matched.name, 
            price: pInfo.price, 
            text: pInfo.text 
          });
        }
      });

      const grandTotal = menuBase + fee + addonTotal;

      setPricingBreakdown({
        tableCount,
        safeBudget,
        menuBase,
        venueFee: fee,
        addonItems,
        addonTotal,
        grandTotal
      });
    }

    calculateSummary();
  }, [guestCount, budgetPerTable, selectedVenues, selectedAddOns]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/guest/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: contactName, phone, notes,
          guestCount, budgetPerTable: Math.max(budgetPerTable || 3200000, 3200000), 
          session, date,
          selectedVenues, selectedAddOns
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

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/du-toan-chi-phi/link/${linkToken}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-32">
      
      {/* Sub-header Context */}
      <div className="bg-white border-b border-gray-200 shadow-xs py-3 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/du-toan-chi-phi/menu" className="flex items-center gap-1 text-[#a66a3a] hover:underline text-xs uppercase font-bold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Quay lại chọn thực đơn & đồ uống</span>
          </Link>
          <span className="text-xs uppercase tracking-wider font-bold text-[#a66a3a]">
            Bước 5 / 5: Báo Giá Chi Tiết
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">
            Minh bạch & Chi tiết
          </span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
            Bảng Báo Giá Chi Tiết Tiệc Cưới
          </h2>
          <p className="text-gray-600 font-light text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Tổng hợp toàn bộ các khoản mâm cỗ, phí sảnh và giá từng dịch vụ nâng cao đã chọn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ITEMIZED PRICING BREAKDOWN */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#e3a638]/40 space-y-6">
              
              <div className="border-b border-gray-100 pb-5">
                <span className="text-xs text-[#a66a3a] font-bold uppercase tracking-widest block mb-1">Thông số tiệc cưới</span>
                <h3 className="text-2xl font-playfair font-bold text-gray-900">
                  {groomName && brideName ? `Tiệc Cưới: Chú rể ${groomName} ❤️ Cô dâu ${brideName}` : 'Tiệc Cưới Trọn Gói'}
                </h3>
                <p className="text-gray-600 text-xs font-light mt-1">
                  Quy mô: <strong>{guestCount} Khách ({pricingBreakdown?.tableCount} mâm)</strong> | Thời gian: <strong>{date ? format(new Date(date), 'dd/MM/yyyy') : 'Chưa chọn'}</strong> ({session})
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* 1. Mâm cỗ */}
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <div>
                    <span className="text-gray-900 font-bold block">1. Mâm Cỗ Tiệc Cưới</span>
                    <span className="text-[11px] text-gray-500 font-light">
                      {pricingBreakdown?.tableCount} mâm x {formatCurrency(pricingBreakdown?.safeBudget || 3200000)} / mâm
                    </span>
                  </div>
                  <span className="text-gray-900 font-bold text-base">{formatCurrency(pricingBreakdown?.menuBase || 0)}</span>
                </div>

                {/* 2. Phí thuê hội trường */}
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100 bg-amber-50/60 p-3 rounded-xl">
                  <div>
                    <span className="text-gray-900 font-bold block">2. Phí Phục Vụ Hội Trường ({venueInfo.name})</span>
                    <span className="text-[11px] text-gray-500 font-light">Bao gồm hệ thống LED, âm thanh, ánh sáng & các hạng mục trang trí</span>
                  </div>
                  <span className="text-[#a66a3a] font-bold text-base">{formatCurrency(venueInfo.fee)}</span>
                </div>

                {/* 3. BẢNG CHI TIẾT TỪNG DỊCH VỤ NÂNG CAO (ALWAYS DISPLAYS REAL NAME, NEVER GENERIC PLACEHOLDER) */}
                <div className="py-2.5 border-b border-gray-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold">3. Chi Tiết Dịch Vụ Nâng Cao / Bổ Sung ({pricingBreakdown?.addonItems?.length || 0} dịch vụ)</span>
                    <span className="text-[#a66a3a] font-bold">{formatCurrency(pricingBreakdown?.addonTotal || 0)}</span>
                  </div>

                  {pricingBreakdown?.addonItems?.length > 0 ? (
                    <div className="bg-[#fcf9f2] p-3.5 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                      {pricingBreakdown.addonItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-gray-700">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e3a638]"></span>
                            {item.name}
                          </span>
                          <span className="font-bold text-gray-900">
                            {item.price > 0 ? formatCurrency(item.price) : item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic block pl-2">Chưa chọn dịch vụ nâng cao</span>
                  )}
                </div>

                {/* 4. TỔNG CỘNG */}
                <div className="flex justify-between items-center pt-4 text-base sm:text-lg font-bold text-gray-900 border-t-2 border-[#e3a638]">
                  <span>Tổng Chi Phí Dự Toán Trọn Gói:</span>
                  <span className="text-2xl sm:text-3xl font-playfair font-bold text-[#a66a3a]">
                    {formatCurrency(pricingBreakdown?.grandTotal || 0)}
                  </span>
                </div>

              </div>

              {/* VAT & NOTE */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-950 text-xs leading-relaxed flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-700 text-lg flex-shrink-0 mt-0.5">info</span>
                <div>
                  <p className="font-bold text-amber-950 mb-1">Lưu ý về bản báo giá:</p>
                  <p className="font-light text-amber-900/90 leading-relaxed">
                    • Giá trên là tổng dự toán tạm tính dựa trên các thông số đã chọn.<br />
                    • Báo giá chưa bao gồm thuế VAT (8%).<br />
                    • <strong>Với số lượng khách khác nhau thì sẽ có mức ưu đãi khác nhau, quý khách vui lòng liên hệ để nhận báo giá chính xác nhất.</strong>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* FORM NHẬN BÁO GIÁ ZALO (SHORT CONCISE HEADER + EXACT SUBTITLE TEXT) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#e3a638]/40 rounded-3xl p-6 sm:p-8 shadow-xl sticky top-28">
              {!submitted ? (
                <>
                  {/* SHORT & CONCISE FORM HEADER AS REQUESTED */}
                  <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-1">
                    Nhận Báo Giá Chi Tiết
                  </h3>
                  {/* EXACT DESCRIPTION TEXT REQUESTED BY USER */}
                  <p className="text-gray-500 text-xs font-light mb-6">
                    Điền số điện thoại Zalo để chuyên viên Golden Palace tư vấn chi tiết cho bạn.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Họ và tên người nhận *</label>
                      <input 
                        type="text" 
                        required 
                        value={contactName} 
                        onChange={e => setContactName(e.target.value)} 
                        className="w-full bg-[#fcf9f2] border border-gray-300 rounded-xl py-3 px-4 text-xs font-medium focus:border-[#e3a638] focus:outline-none" 
                        placeholder="Nhập họ tên của bạn" 
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
                        placeholder="Yêu cầu riêng về trang trí, ngày xem..." 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading} 
                      className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold uppercase text-xs tracking-wider shadow-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">{isLoading ? 'hourglass_empty' : 'send'}</span> 
                      {isLoading ? 'Đang khởi tạo...' : 'GỬI THÔNG TIN NHẬN BÁO GIÁ'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-1">Gửi Thông Tin Thành Công!</h3>
                    <p className="text-gray-600 text-xs font-light leading-relaxed">
                      Cảm ơn bạn! Link báo giá trực tuyến đã được tạo (giống như Thiệp Cưới Online). Bạn có thể xem ngay hoặc sao chép gửi Zalo:
                    </p>
                  </div>

                  {/* WEB PROPOSAL LINK BUTTONS (MATCHING ONLINE WEDDING CARD STYLE) */}
                  <div className="space-y-3 pt-2">
                    <a 
                      href={`/du-toan-chi-phi/link/${linkToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 block"
                    >
                      <span className="material-symbols-outlined text-xl">language</span>
                      <span>🌐 Xem Link Báo Giá Online Trực Tiếp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full py-3 px-4 bg-amber-50 text-[#a66a3a] border border-[#e3a638] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                      <span>{copied ? '✅ Đã Sao Chép Link Báo Giá!' : '📋 Sao Chép Link Báo Giá'}</span>
                    </button>

                    <Link href="/" className="inline-block w-full py-3 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors">
                      Trở về Trang chủ
                    </Link>
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
