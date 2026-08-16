'use client';
import { useState } from 'react';

const SET_MENUS_ADMIN = [
  { title: 'SET MENU TIỆC 1', price: '320.000 VNĐ/khách', itemsCount: 12, bestFor: 'Tiệc cưới & Tiệc mừng ấm cúng' },
  { title: 'SET MENU TIỆC 2', price: '340.000 VNĐ/khách', itemsCount: 12, bestFor: 'Tiệc cưới & Hội nghị doanh nghiệp' },
  { title: 'SET MENU TIỆC 3', price: '345.000 VNĐ/khách', itemsCount: 12, bestFor: 'Tiệc kỷ niệm & Hội khóa sang trọng' },
  { title: 'SET MENU TIỆC 4', price: '375.000 VNĐ/khách', itemsCount: 12, bestFor: 'Đại tiệc cưới sang trọng & Đẳng cấp' },
  { title: 'SET MENU TIỆC VIP 5', price: '395.000 VNĐ/khách', itemsCount: 12, bestFor: 'Tiệc cưới VIP Hoàng Gia' },
  { title: 'SET MENU TIỆC VVIP 6', price: '415.000 VNĐ/khách', itemsCount: 12, bestFor: 'Tiệc VIP thượng lưu & Tiếp khách cao cấp' },
];

const SPECIALTY_MENUS_ADMIN = [
  { name: 'Menu Cầy Hương', items: '5 Món chuẩn vị' },
  { name: 'Menu Mòng Két', items: '11 Món phong phú' },
  { name: 'Menu Cá Lăng / Trắm', items: '6 Món độc đáo' },
  { name: 'Menu Ba Ba Hoàng Gia', items: '6 Món bổ dưỡng' },
  { name: 'Menu Dúi Núi', items: '5 Món hấp dẫn' },
  { name: 'Menu Vịt Trời', items: '5 Món thơm ngọt' },
  { name: 'Menu Lợn Mán Mẹt', items: '10 Món đặc sắc' },
  { name: 'Menu Bê Tảng', items: '7 Món đậm đà' },
];

const KIDS_COMBOS_ADMIN = [
  { code: 'COMBO 1', note: 'Dành cho học sinh cấp 1', price: '130.000 VNĐ/suất' },
  { code: 'COMBO 2', note: 'Dành cho học sinh cấp 1', price: '150.000 VNĐ/suất' },
  { code: 'COMBO 3', note: 'Dành cho học sinh cấp 1 & 2', price: '160.000 VNĐ/suất' },
  { code: 'COMBO 4', note: 'Dành cho học sinh cấp 1 & 2', price: '180.000 VNĐ/suất' },
  { code: 'COMBO 5', note: 'Dành cho học sinh cấp 1 & 2', price: '190.000 VNĐ/suất' },
];

export default function AdminMenusPage() {
  const [activeSubTab, setActiveSubTab] = useState('SET_TIEC');

  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quản Lý Thực Đơn Tiệc (Đồng bộ Trang Công Khai)</h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý Set Menu cỗ tiệc, Menu Chuyên Món, Combo Trẻ Em & Menu Chọn Món A la carte</p>
        </div>
        <a 
          href="/thuc-don" 
          target="_blank" 
          rel="noreferrer"
          className="px-4 py-2.5 bg-[#e3a638] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          Xem Trang Thực Đơn
        </a>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-3 bg-gray-100 p-2 rounded-xl border border-gray-200">
        <button 
          onClick={() => setActiveSubTab('SET_TIEC')}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${activeSubTab === 'SET_TIEC' ? 'bg-gray-900 text-amber-300 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Set Menu Tiệc Cưới (6 Set)
        </button>
        <button 
          onClick={() => setActiveSubTab('CHUYEN_MON')}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${activeSubTab === 'CHUYEN_MON' ? 'bg-gray-900 text-amber-300 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Menu Chuyên Món (8 Bộ)
        </button>
        <button 
          onClick={() => setActiveSubTab('TRE_EM')}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${activeSubTab === 'TRE_EM' ? 'bg-gray-900 text-amber-300 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Combo Trẻ Em Hè (5 Combo)
        </button>
        <button 
          onClick={() => setActiveSubTab('ALACARTE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${activeSubTab === 'ALACARTE' ? 'bg-gray-900 text-amber-300 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Menu Chọn Món A la carte
        </button>
      </div>

      {/* SET TIỆC */}
      {activeSubTab === 'SET_TIEC' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SET_MENUS_ADMIN.map((m, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#e3a638]">{m.bestFor}</span>
                  <h3 className="font-bold text-gray-900 text-base">{m.title}</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{m.price}</span>
              </div>
              <p className="text-xs text-gray-500 font-light">Bao gồm {m.itemsCount} món ăn chuẩn mâm 10 khách</p>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[11px] text-emerald-600 font-medium">● Đã đồng bộ Live</span>
                <button className="text-xs text-gray-600 hover:text-gray-900 font-semibold cursor-pointer">Chỉnh sửa</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHUYÊN MÓN */}
      {activeSubTab === 'CHUYEN_MON' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALTY_MENUS_ADMIN.map((sp, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-gray-900 text-base">{sp.name}</h3>
              <p className="text-xs text-amber-800 font-medium">{sp.items}</p>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[11px] text-emerald-600 font-medium">● Đã đồng bộ Live</span>
                <button className="text-xs text-gray-600 hover:text-gray-900 font-semibold cursor-pointer">Chỉnh sửa</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRẺ EM */}
      {activeSubTab === 'TRE_EM' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {KIDS_COMBOS_ADMIN.map((k, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-base">{k.code}</h3>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full">{k.price}</span>
              </div>
              <p className="text-xs text-gray-500">{k.note}</p>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[11px] text-emerald-600 font-medium">● Đã giảm 10% Hè</span>
                <button className="text-xs text-gray-600 hover:text-gray-900 font-semibold cursor-pointer">Chỉnh sửa</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* A LA CARTE */}
      {activeSubTab === 'ALACARTE' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900">
            💡 <strong>Phần Menu Chọn Món:</strong> Đã đồng bộ cấu trúc phân loại (I. Khai Vị & Salad, II. Món Chính & Lẩu, III. Tráng Miệng). Không hiển thị giá cố định vì là thực phẩm tươi sống biến động theo thời giá.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 text-sm mb-1">I. Khai Vị & Salad</h4>
              <p className="text-xs text-gray-500">19 Súp + 16 Nộm, Salad tươi mát</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 text-sm mb-1">II. Món Chính & Lẩu</h4>
              <p className="text-xs text-gray-500">Cá & Ba ba, Bò, Bê, Dê, Tôm, Bề bề, Ếch, Lẩu</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 text-sm mb-1">III. Tráng Miệng</h4>
              <p className="text-xs text-gray-500">Bưởi da xanh, Nho Mỹ, Caramel, Mochi...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
