'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [guestCount, setGuestCount] = useState(350);
  const [budget, setBudget] = useState(3500000);
  const [session, setSession] = useState('Trưa');
  const [date, setDate] = useState('');

  const tableCount = Math.ceil(guestCount / 10);
  const formatCurrency = (val) => val.toLocaleString('vi-VN');

  return (
    <>
      <header className="bg-surface/80 dark:bg-on-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-4">
            <button className="text-primary dark:text-primary-fixed cursor-pointer active:scale-95 duration-200 md:hidden">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
            </button>
            <div className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-display-lg text-primary-container bg-clip-text bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-transparent">
              Golden Palace
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-primary font-bold hover:text-primary-container transition-colors font-label-md text-label-md" href="#">Quy mô</a>
            <a className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md" href="#">Hội trường</a>
            <a className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md" href="#">Dịch vụ</a>
            <a className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md" href="#">Dự trù</a>
          </nav>
          <div>
            <button className="text-primary dark:text-primary-fixed cursor-pointer active:scale-95 duration-200 font-label-md text-label-md flex items-center gap-2">
              Trợ giúp
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16 md:pt-16 pb-24 md:pb-0">
        <section className="relative min-h-[795px] flex items-center justify-center pt-10">
          <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVMMGsN_GiemSPZRwH5o0QICwp2O9rHfxxkJ5UPm90aCeZyOdmVaMfPFgmELGHvIql7axOu_HVEYR-uIf3fAaCuEDD2wndous-gvLSDkSCPU9ilUCQzq7S25sn7dVaLlodkq9YmdEL-1B5CpC24L_UubVBd4JaET4eJAphiIZQOWLeDicqnIarMynEgHiJP99vXpWFL25hi5N_-1KmHy_rtXCFJiPf3OOuNGTRlDCOF96bHQxuLb7c')" }}>
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px]"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-3xl mx-auto px-margin-mobile md:px-0">
            <div className="bg-surface/90 backdrop-blur-xl border border-gold-gradient-start/20 rounded-xl shadow-[0_10px_30px_rgba(212,175,55,0.05)] p-8 md:p-12">
              <div className="text-center mb-10">
                <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-2">Dự trù ngân sách</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Thiết kế không gian hoàn hảo cho ngày trọng đại của bạn.</p>
              </div>
              
              <div className="space-y-section-gap/2 flex flex-col gap-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="font-headline-sm text-headline-sm text-on-surface">Quy mô tiệc</label>
                    <div className="text-right">
                      <span className="font-price-display text-price-display text-primary">{guestCount}</span>
                      <span className="font-body-md text-body-md text-on-surface-variant"> khách</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <input 
                      type="range" 
                      min="100" max="800" step="10" 
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-label-md text-label-md">
                    <span>100</span>
                    <span>800</span>
                  </div>
                  <div className="mt-4 p-4 bg-surface-container-high rounded-lg flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-gold-gradient-start" style={{ fontVariationSettings: "'FILL' 1" }}>table_restaurant</span>
                    <span className="font-body-lg text-body-lg text-on-surface">Tương đương <strong className="text-primary">{tableCount}</strong> mâm chính</span>
                  </div>
                </div>

                <div>
                  <label className="font-headline-sm text-headline-sm text-on-surface block mb-4">Ngân sách dự kiến / Mâm</label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {[3500000, 4500000, 6000000].map((amt) => (
                      <button 
                        key={amt}
                        type="button"
                        onClick={() => setBudget(amt)}
                        className={`chip font-label-md text-label-md py-2 px-6 rounded-full border transition-all ${
                          budget === amt 
                            ? 'bg-primary-container text-on-primary-container border-primary-container active' 
                            : 'bg-transparent text-primary border-gold-gradient-start/50 hover:border-gold-gradient-start'
                        }`}
                      >
                        {amt / 1000000}M
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formatCurrency(budget)}
                      onChange={(e) => setBudget(Number(e.target.value.replace(/\D/g, '')))}
                      className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 font-body-lg text-body-lg text-on-surface py-2 pl-2 pr-10 transition-colors"
                      placeholder="Nhập số tiền khác..." 
                    />
                    <span className="absolute right-2 top-2 text-on-surface-variant font-body-lg">VNĐ</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-headline-sm text-headline-sm text-on-surface block mb-4">Ngày tổ chức (Dự kiến)</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                    />
                  </div>
                  <div>
                    <label className="font-headline-sm text-headline-sm text-on-surface block mb-4">Buổi tiệc</label>
                    <div className="flex bg-surface-container-high rounded-lg p-1">
                      {['Trưa', 'Tối'].map((s) => (
                        <button 
                          key={s}
                          type="button"
                          onClick={() => setSession(s)}
                          className={`flex-1 py-2 text-center rounded-md font-label-md text-label-md transition-all ${
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

                <div className="pt-6 flex justify-center">
                  <Link href="/venues">
                    <button type="button" className="bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-on-primary font-label-md text-label-md py-4 px-10 rounded-full gold-glow transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                      Khám phá không gian
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className="bg-surface-bright/90 dark:bg-surface-dim/90 backdrop-blur-xl fixed bottom-0 w-full z-50 rounded-t-xl border-t border-gold-gradient-start/20 shadow-[0_-10px_30px_rgba(212,175,55,0.1)] md:hidden">
        <div className="flex justify-around items-center h-20 px-4 w-full">
          <a href="#" className="flex flex-col items-center justify-center text-primary font-bold bg-primary-container/20 rounded-full py-1 px-4 transition-all duration-300 ease-in-out">
            <span className="material-symbols-outlined mb-1 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span className="font-label-md text-[10px]">Quy mô</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-primary-container/10 transition-all duration-300 ease-in-out p-2 rounded-lg">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>domain</span>
            <span className="font-label-md text-[10px]">Hội trường</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-primary-container/10 transition-all duration-300 ease-in-out p-2 rounded-lg">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>restaurant</span>
            <span className="font-label-md text-[10px]">Dịch vụ</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-primary-container/10 transition-all duration-300 ease-in-out p-2 rounded-lg">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>calculate</span>
            <span className="font-label-md text-[10px]">Dự trù</span>
          </a>
        </div>
      </nav>
    </>
  );
}
