'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPersonalizePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/personalize');
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      (p.partyTitle && p.partyTitle.toLowerCase().includes(term)) ||
      (p.groomName && p.groomName.toLowerCase().includes(term)) ||
      (p.brideName && p.brideName.toLowerCase().includes(term)) ||
      (p.phone && p.phone.includes(term)) ||
      (p.venueName && p.venueName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 text-white p-6 rounded-2xl border border-amber-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">
            <span className="material-symbols-outlined text-sm">construction</span>
            Bảng Điều Khiển Đội Kỹ Thuật Golden Palace
          </div>
          <h1 className="text-2xl font-playfair font-bold text-white">Quản Lý Cá Nhân Hóa & Album Nhạc Tiệc Cưới</h1>
          <p className="text-xs text-stone-400 mt-1">
            Theo dõi, xuất kịch bản âm thanh, phông màn LED sân khấu & thiệp cưới điện tử của khách hàng.
          </p>
        </div>
        <button
          onClick={fetchProfiles}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Làm Mới Danh Sách
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <span className="material-symbols-outlined text-gray-400">search</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo Tên tiệc, Chú rể, Cô dâu, SĐT hoặc Tầng sảnh tổ chức..."
          className="w-full text-sm outline-none bg-transparent text-gray-800"
        />
      </div>

      {/* Table of Saved Profiles */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Đang tải dữ liệu hồ sơ cá nhân hóa...</div>
        ) : filteredProfiles.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">Chưa có hồ sơ cá nhân hóa nào được đăng ký.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Tên Tiệc Cưới & Gia Chủ</th>
                  <th className="p-4">Ngày Cưới & Giờ</th>
                  <th className="p-4">Địa Điểm Sảnh</th>
                  <th className="p-4">SĐT Liên Hệ</th>
                  <th className="p-4">Phông LED & Album Nhạc</th>
                  <th className="p-4 text-center">Thao Tác Kỹ Thuật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredProfiles.map((prof) => (
                  <tr key={prof.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-stone-900">{prof.partyTitle}</div>
                      <div className="text-[11px] text-amber-700 font-medium">
                        Chú Rể: <strong>{prof.groomName}</strong> • Cô Dâu: <strong>{prof.brideName}</strong>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium">
                      <div>{prof.eventDate}</div>
                      <div className="text-[11px] text-gray-500">{prof.eventTime}</div>
                    </td>
                    <td className="p-4 font-bold text-amber-700">
                      {prof.venueName || 'Tầng 3'}
                    </td>
                    <td className="p-4 font-mono">
                      <a href={`tel:${prof.phone}`} className="text-blue-600 font-bold hover:underline">
                        {prof.phone}
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-semibold">
                          LED: {prof.ledTemplateId || 'Standard'}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-semibold">
                          Album Nhạc Đã Chọn
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedProfile(prof)}
                          className="px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg text-[11px] hover:bg-amber-400 transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">tune</span>
                          Xem Kịch Bản
                        </button>
                        {prof.invitationSlug && (
                          <Link
                            href={`/thiep/${prof.invitationSlug}`}
                            target="_blank"
                            className="px-3 py-1.5 bg-stone-800 text-white font-medium rounded-lg text-[11px] hover:bg-stone-700 transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                            Xem Thiệp
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal View Kịch Bản Âm Thanh & Ánh Sáng Kỹ Thuật */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-400 font-mono font-bold uppercase">
                  HỒ SƠ KỊCH BẢN KỸ THUẬT SÂN KHẤU
                </div>
                <h3 className="text-xl font-bold font-playfair">{selectedProfile.partyTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs text-stone-800">
              {/* Event Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-gray-500 block text-[10px]">Ngày Tổ Chức:</span>
                  <strong className="text-sm font-mono text-stone-900">{selectedProfile.eventDate}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Giờ Làm Lễ:</span>
                  <strong className="text-sm font-mono text-stone-900">{selectedProfile.eventTime}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Địa Điểm Sảnh:</span>
                  <strong className="text-sm text-amber-700 font-bold">{selectedProfile.venueName}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Chú Rể:</span>
                  <strong className="text-stone-900">{selectedProfile.groomName}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Cô Dâu:</span>
                  <strong className="text-stone-900">{selectedProfile.brideName}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">SĐT Gia Chủ:</span>
                  <strong className="text-blue-600 font-mono">{selectedProfile.phone}</strong>
                </div>
              </div>

              {/* LED Stage Section */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="font-bold text-amber-800 text-xs uppercase mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">live_tv</span>
                  Cấu Hình Phông Màn LED Sân Khấu P3
                </div>
                <div className="text-stone-800 text-xs">
                  Mẫu đã chọn: <strong>{selectedProfile.ledTemplateId || 'Hoàng Gia Ép Kim'}</strong>
                </div>
              </div>

              {/* Music Script Section */}
              <div className="space-y-3">
                <div className="font-bold text-stone-900 text-xs uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-600">library_music</span>
                  Album Kịch Bản Nhạc Đội Kỹ Thuật
                </div>
                <div className="space-y-2">
                  {['Welcome (Đón khách)', 'Entrance (Vào sân khấu)', 'Toast (Rót rượu cắt bánh)', 'Dining (Khai tiệc)'].map((phase, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
                      <span className="font-semibold text-stone-700">{idx + 1}. Giai đoạn {phase}:</span>
                      <span className="text-amber-800 font-mono font-bold">Đã lên danh sách bài hát chuẩn</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase rounded-xl hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">print</span>
                In Kịch Bản Kỹ Thuật
              </button>
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 bg-stone-200 text-stone-800 text-xs font-bold uppercase rounded-xl hover:bg-stone-300 transition-colors"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
