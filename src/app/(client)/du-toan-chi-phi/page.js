'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

const EVENT_BRANCHES = [
  { id: 'WEDDING', label: 'Tiệc Cưới', icon: 'favorite', desc: 'Đám cưới, tiệc báo hỷ trọn gói' },
  { id: 'CONFERENCE', label: 'Hội Nghị & Sự Kiện', icon: 'corporate_fare', desc: 'Hội thảo, Gala Dinner, tổng kết' },
  { id: 'BIRTHDAY', label: 'Tiệc Sinh Nhật', icon: 'cake', desc: 'Sinh nhật, mừng thọ, thôi nôi' },
  { id: 'ANNIVERSARY', label: 'Tiệc Kỷ Niệm', icon: 'celebration', desc: 'Kỷ niệm ngày cưới, gặp mặt' },
  { id: 'OTHER', label: 'Khác', icon: 'stars', desc: 'Tiệc gia đình, hội khóa & sự kiện khác' },
];

export default function Home() {
  const { estimateData, updateEstimate } = useEstimate();
  const { eventType, guestCount, budgetPerTable, session, date } = estimateData;

  const tableCount = Math.ceil(guestCount / 10);
  const formatCurrency = (val) => val.toLocaleString('vi-VN');

  return (
    <>
      <header className="bg-surface/80 dark:bg-on-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-display-lg text-primary-container bg-clip-text bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-transparent">
              Golden Palace
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <span className="text-primary font-bold font-label-md text-label-md">Quy mô</span>
            <span className="text-on-surface-variant font-label-md text-label-md">Hội trường</span>
            <span className="text-on-surface-variant font-label-md text-label-md">Dịch vụ</span>
            <span className="text-on-surface-variant font-label-md text-label-md">Dự trù</span>
          </nav>
          <div>
            <a href="tel:02286595959" className="text-primary cursor-pointer active:scale-95 duration-200 font-label-md text-label-md flex items-center gap-2">
              Hotline: 0228 659 5959
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16 md:pt-16 pb-24 md:pb-0">
        <section className="relative min-h-[795px] flex items-center justify-center pt-10">
          <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVMMGsN_GiemSPZRwH5o0QICwp2O9rHfxxkJ5UPm90aCeZyOdmVaMfPFgmELGHvIql7axOu_HVEYR-uIf3fAaCuEDD2wndous-gvLSDkSCPU9ilUCQzq7S25sn7dVaLlodkq9YmdEL-1B5CpC24L_UubVBd4JaET4eJAphiIZQOWLeDicqnIarMynEgHiJP99vXpWFL25hi5N_-1KmHy_rtXCFJiPf3OOuNGTRlDCOF96bHQxuLb7c')" }}>
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px]"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-4xl mx-auto px-margin-mobile md:px-0">
            <div className="bg-surface/90 backdrop-blur-xl border border-gold-gradient-start/20 rounded-xl shadow-[0_10px_30px_rgba(212,175,55,0.05)] p-6 md:p-10">
              <div className="text-center mb-8">
                <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-semibold">Bước 1 / 4</span>
                <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mt-1 mb-2">Dự Trù Ngân Sách Sự Kiện</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Chọn loại hình sự kiện & quy mô khách mời để nhận dự toán chi tiết nhất</p>
              </div>
              
              <div className="space-y-6 flex flex-col">
                {/* 1. SELECTION OF EVENT BRANCH (BẮT BUỘC CHỌN 1 NHÁNH) */}
                <div>
                  <label className="font-headline-sm text-headline-sm text-on-surface block mb-3 font-semibold">
                    Loại hình sự kiện <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {EVENT_BRANCHES.map(branch => {
                      const isSelected = (eventType || 'WEDDING') === branch.id;
                      return (
                        <button
                          key={branch.id}
                          type="button"
                          onClick={() => updateEstimate({ eventType: branch.id })}
                          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'bg-gradient-to-br from-[#1c1917] to-[#2a2419] border-[#e3a638] text-white shadow-lg ring-2 ring-[#e3a638]/40 scale-102' 
                              : 'bg-white/80 hover:bg-white border-gray-200 text-gray-800 hover:border-[#e3a638]/60'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`material-symbols-outlined text-2xl ${isSelected ? 'text-[#e3a638]' : 'text-gray-600'}`}>
                              {branch.icon}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#e3a638]"></span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs font-playfair">{branch.label}</h4>
                            <p className={`text-[10px] line-clamp-1 mt-0.5 font-light ${isSelected ? 'text-amber-200/80' : 'text-gray-500'}`}>
                              {branch.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. QUY MÔ TIỆC */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="font-headline-sm text-headline-sm text-on-surface">Quy mô tiệc</label>
                    <div className="text-right">
                      <span className="font-price-display text-price-display text-primary font-bold text-2xl">{guestCount}</span>
                      <span className="font-body-md text-body-md text-on-surface-variant"> khách</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <input 
                      type="range" 
                      min="10" max="800" step="10" 
                      value={guestCount}
                      onChange={(e) => updateEstimate({ guestCount: Number(e.target.value) })}
                      className="w-full accent-[#e3a638]"
                    />
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-label-md text-label-md text-xs">
                    <span>10 khách (VIP)</span>
                    <span>800 khách (Đại hội trường)</span>
                  </div>
                  <div className="mt-3 p-3 bg-surface-container-high rounded-lg flex items-center justify-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-gold-gradient-start" style={{ fontVariationSettings: "'FILL' 1" }}>table_restaurant</span>
                    <span className="font-body-lg text-body-lg text-on-surface">Tương đương <strong className="text-primary">{tableCount}</strong> mâm tiệc</span>
                  </div>
                </div>

                {/* 3. NGÂN SÁCH DỰ KIẾN */}
                <div>
                  <label className="font-headline-sm text-headline-sm text-on-surface block mb-3">Ngân sách dự kiến / Mâm</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {[3500000, 4500000, 6000000].map((amt) => (
                      <button 
                        key={amt}
                        type="button"
                        onClick={() => updateEstimate({ budgetPerTable: amt })}
                        className={`chip font-label-md text-label-md py-2 px-5 rounded-full border text-xs font-semibold transition-all ${
                          budgetPerTable === amt 
                            ? 'bg-primary-container text-on-primary-container border-primary-container active' 
                            : 'bg-transparent text-primary border-gold-gradient-start/50 hover:border-gold-gradient-start'
                        }`}
                      >
                        {(amt / 1000000).toFixed(1)}M / mâm
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formatCurrency(budgetPerTable)}
                      onChange={(e) => updateEstimate({ budgetPerTable: Number(e.target.value.replace(/\D/g, '')) })}
                      className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 font-body-lg text-body-lg text-on-surface py-2 pl-2 pr-10 transition-colors text-sm font-semibold"
                      placeholder="Nhập số tiền khác..." 
                    />
                    <span className="absolute right-2 top-2 text-on-surface-variant font-body-lg text-xs font-semibold">VNĐ</span>
                  </div>
                </div>

                {/* 4. NGÀY & BUỔI TIỆC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-headline-sm text-headline-sm text-on-surface block mb-2 text-xs uppercase font-semibold">Ngày tổ chức (Dự kiến)</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => updateEstimate({ date: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs" 
                    />
                  </div>
                  <div>
                    <label className="font-headline-sm text-headline-sm text-on-surface block mb-2 text-xs uppercase font-semibold">Buổi tiệc</label>
                    <div className="flex bg-surface-container-high rounded-lg p-1">
                      {['Trưa', 'Tối'].map((s) => (
                        <button 
                          key={s}
                          type="button"
                          onClick={() => updateEstimate({ session: s })}
                          className={`flex-1 py-2 text-center rounded-md font-label-md text-xs font-semibold transition-all ${
                            session === s 
                              ? 'bg-surface shadow-sm text-primary' 
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Link href="/du-toan-chi-phi/venues">
                    <button type="button" className="bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-on-primary font-label-md text-xs uppercase font-semibold tracking-wider py-4 px-10 rounded-full gold-glow transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg cursor-pointer">
                      Khám phá không gian phù hợp
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
