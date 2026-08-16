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
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-28">
      
      {/* Step Indicator Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-300 text-[#a66a3a] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <span>Bước 1 / 4: Chọn Quy Mô Tiệc & Ngân Sách</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">Dự Trù Ngân Sách Sự Kiện</h1>
        <p className="text-gray-600 font-light text-xs sm:text-sm mt-1">
          Chọn loại hình sự kiện & quy mô khách mời để hệ thống tính toán dự toán chi tiết nhất
        </p>
      </div>

      <main className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-[#e3a638]/40 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8">
          
          {/* 1. LOẠI HÌNH SỰ KIỆN */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-3">
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
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#1c1917] to-[#2a2419] border-[#e3a638] text-white shadow-lg ring-2 ring-[#e3a638]/40 scale-102' 
                        : 'bg-white hover:bg-amber-50/50 border-gray-200 text-gray-800 hover:border-[#e3a638]/60'
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

          {/* 2. QUY MÔ TIỆC & THANH TRƯỢT SỐ KHÁCH */}
          <div className="bg-[#fcf9f2] p-6 rounded-2xl border border-gray-200/80 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-gray-800">Quy mô tiệc *</label>
                <span className="text-[11px] text-gray-500 font-light">Tầng 2 & Tầng 3 dành cho tiệc từ 250 khách trở lên</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-playfair font-bold text-[#a66a3a]">{guestCount}</span>
                <span className="text-xs font-semibold text-gray-600"> khách</span>
              </div>
            </div>

            <div>
              <input 
                type="range" 
                min="10" max="800" step="10" 
                value={guestCount}
                onChange={(e) => updateEstimate({ guestCount: Number(e.target.value) })}
                className="w-full accent-[#e3a638] h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-gray-500 text-[11px] font-medium mt-1">
                <span>10 khách (VIP)</span>
                <span>250+ (Hội trường Tầng 2 & 3)</span>
                <span>800 khách (Đại tiệc)</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-center gap-2 text-xs font-medium text-gray-800">
              <span className="material-symbols-outlined text-[#e3a638]">table_restaurant</span>
              <span>Tương đương <strong className="text-[#a66a3a] text-sm font-bold">{tableCount}</strong> mâm tiệc (10 khách/mâm)</span>
            </div>
          </div>

          {/* 3. NGÂN SÁCH DỰ KIẾN */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-2">Ngân sách dự kiến / Mâm</label>
            <div className="flex flex-wrap gap-2.5 mb-3">
              {[2500000, 3500000, 4500000, 6000000].map((amt) => (
                <button 
                  key={amt}
                  type="button"
                  onClick={() => updateEstimate({ budgetPerTable: amt })}
                  className={`py-2 px-4 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    budgetPerTable === amt 
                      ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white border-transparent shadow-md' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
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
                className="w-full bg-[#fcf9f2] border border-gray-300 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:border-[#e3a638] focus:outline-none"
                placeholder="Nhập số tiền mâm cỗ..." 
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-500">VNĐ / mâm</span>
            </div>
          </div>

          {/* 4. NGÀY & BUỔI TIỆC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-1.5">Ngày tổ chức (Dự kiến)</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => updateEstimate({ date: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-semibold focus:border-[#e3a638] outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-1.5">Buổi tiệc</label>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                {['Trưa', 'Tối'].map((s) => (
                  <button 
                    key={s}
                    type="button"
                    onClick={() => updateEstimate({ session: s })}
                    className={`py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      session === s 
                        ? 'bg-white shadow-md text-[#a66a3a]' 
                        : 'text-gray-600 hover:text-gray-900'
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
              <button 
                type="button" 
                className="bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
              >
                <span>Khám phá không gian hội trường phù hợp</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
