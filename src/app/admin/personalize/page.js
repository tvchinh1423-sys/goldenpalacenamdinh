'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toPng } from 'html-to-image';
import { MUSIC_TRACKS, MUSIC_CATEGORIES, LED_STAGE_TEMPLATES, VENUE_FLOOR_OPTIONS } from '@/lib/personalize-data';

// Standardized Date Dot Formatter (e.g. "2026-11-20" -> "20.11.2026") matching LedCustomizer.jsx 100%
function formatDateDot(dateStr) {
  if (!dateStr) return '20.11.2026';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
  }
  return dateStr;
}

export default function AdminPersonalizePage() {
  const { data: session } = useSession();
  const isReadOnly = session?.user?.role === 'MEMBER';

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null); // Edit profile modal state
  
  // Date Filtering State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateFilterPreset, setDateFilterPreset] = useState('all'); // 'all' | 'month' | 'week' | 'today' | 'custom'

  // State for Fullscreen LED visualizer modal
  const [fullscreenLed, setFullscreenLed] = useState(false);

  useEffect(() => {
    fetchProfiles();
    const timer = setInterval(fetchProfiles, 4000);
    return () => clearInterval(timer);
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch(`/api/personalize?t=${Date.now()}`, { cache: 'no-store' });
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

  const handleDeleteProfile = async (id) => {
    if (!confirm('Anh Chinh có chắc chắn muốn xóa bản ghi tiệc cưới này khỏi hệ thống?')) return;
    try {
      const res = await fetch(`/api/personalize?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (selectedProfile?.id === id) setSelectedProfile(null);
        fetchProfiles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editingProfile) return;
    try {
      const res = await fetch('/api/personalize', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProfile)
      });
      const data = await res.json();
      if (data.success) {
        setEditingProfile(null);
        if (selectedProfile?.id === editingProfile.id) {
          setSelectedProfile(data.profile);
        }
        fetchProfiles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Date Filtering Logic
  const filteredProfiles = profiles.filter(p => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchText = (
        (p.partyTitle && p.partyTitle.toLowerCase().includes(term)) ||
        (p.groomName && p.groomName.toLowerCase().includes(term)) ||
        (p.brideName && p.brideName.toLowerCase().includes(term)) ||
        (p.phone && p.phone.includes(term)) ||
        (p.venueName && p.venueName.toLowerCase().includes(term))
      );
      if (!matchText) return false;
    }

    if (!p.eventDate) return true;
    const profileDate = new Date(p.eventDate);
    const today = new Date();

    if (dateFilterPreset === 'today') {
      return (
        profileDate.getDate() === today.getDate() &&
        profileDate.getMonth() === today.getMonth() &&
        profileDate.getFullYear() === today.getFullYear()
      );
    }

    if (dateFilterPreset === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() - today.getDay() + 7);
      return profileDate >= startOfWeek && profileDate <= endOfWeek;
    }

    if (dateFilterPreset === 'month') {
      return (
        profileDate.getMonth() === today.getMonth() &&
        profileDate.getFullYear() === today.getFullYear()
      );
    }

    if (dateFilterPreset === 'custom' && (startDate || endDate)) {
      if (startDate && new Date(p.eventDate) < new Date(startDate)) return false;
      if (endDate && new Date(p.eventDate) > new Date(endDate)) return false;
    }

    return true;
  });

  const handleApplyCustomDates = () => {
    if (startDate || endDate) {
      setDateFilterPreset('custom');
    }
  };

  // Find LED Template Object for selected profile
  const currentLedTemplate = selectedProfile
    ? (LED_STAGE_TEMPLATES.find(t => t.id === selectedProfile.ledTemplateId) || LED_STAGE_TEMPLATES[0])
    : LED_STAGE_TEMPLATES[0];

  // Helper function to export/download exact 100% snapshot of live LED element using html-to-image
  const handleDownloadLedBackdrop = async () => {
    if (!selectedProfile) return;
    
    // Priority: capture fullscreen LED container or main LED container
    const node = document.getElementById('fullscreen-led-stage-screen') || document.getElementById('led-stage-screen-canvas');
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: 3, // Ultra HD quality snapshot
        cacheBust: true,
      });

      const link = document.createElement('a');
      const groomClean = (selectedProfile.groomName || 'chinh').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
      const brideClean = (selectedProfile.brideName || 'ha').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
      link.download = `phong-led-san-khau-${groomClean}-${brideClean}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error rendering LED image snapshot:', err);
    }
  };

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 text-white p-6 rounded-2xl border border-amber-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">
            <span className="material-symbols-outlined text-sm">construction</span>
            Bảng Điều Khiển Đội Kỹ Thuật Sân Khấu Golden Palace
          </div>
          <h1 className="text-2xl font-playfair font-bold text-white">Quản Lý Phông Màn LED & Kịch Bản Âm Nhạc</h1>
          <p className="text-xs text-stone-400 mt-1">
            Ghi đè bản cập nhật mới nhất, cho phép sửa xóa, phát nhạc tiệc cưới trực tiếp từ YouTube & tải phông LED.
          </p>
        </div>
        <button
          onClick={fetchProfiles}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Làm Mới Danh Sách
        </button>
      </div>

      {/* Date Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-stone-800 font-mono outline-none shadow-2xs"
          />
          <span className="text-gray-400 font-bold">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-stone-800 font-mono outline-none shadow-2xs"
          />
          <button
            onClick={handleApplyCustomDates}
            className="px-4 py-2 bg-white border border-gray-300 font-bold text-stone-800 rounded-xl hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
          >
            Áp dụng
          </button>
        </div>

        <div className="flex-1 max-w-xs flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-gray-200">
          <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên tiệc, SĐT..."
            className="w-full bg-transparent text-xs outline-none"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shrink-0">
          <button
            onClick={() => setDateFilterPreset('all')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
              dateFilterPreset === 'all' ? 'bg-[#b8860b] text-white font-bold' : 'bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            Toàn thời gian
          </button>
          <button
            onClick={() => setDateFilterPreset('month')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer border-l border-gray-300 ${
              dateFilterPreset === 'month' ? 'bg-[#b8860b] text-white font-bold' : 'bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setDateFilterPreset('week')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer border-l border-gray-300 ${
              dateFilterPreset === 'week' ? 'bg-[#b8860b] text-white font-bold' : 'bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setDateFilterPreset('today')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer border-l border-gray-300 ${
              dateFilterPreset === 'today' ? 'bg-[#b8860b] text-white font-bold' : 'bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            Hôm nay
          </button>
        </div>

      </div>

      {/* Table of Saved Profiles */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Đang tải dữ liệu hồ sơ cá nhân hóa...</div>
        ) : filteredProfiles.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">Không tìm thấy tiệc cưới nào trong khoảng thời gian đã chọn.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Tên Tiệc Cưới & Gia Chủ</th>
                  <th className="p-4">Ngày Cưới & Giờ</th>
                  <th className="p-4">Địa Điểm Sảnh</th>
                  <th className="p-4">SĐT Liên Hệ</th>
                  <th className="p-4">Yêu Cầu LED & Nhạc</th>
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
                      <div className="font-bold text-stone-900">{formatDateDot(prof.eventDate)}</div>
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                          LED: {prof.ledStatus || 'Đã tùy chỉnh phông LED'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          prof.musicStatus === 'Không có yêu cầu gì' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Nhạc: {prof.musicStatus || 'Đã chọn danh sách nhạc'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedProfile(prof)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg text-[11px] hover:brightness-110 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">tune</span>
                          Mở Kịch Bản & Phát Nhạc
                        </button>

                        {!isReadOnly && (
                          <>
                            <button
                              onClick={() => setEditingProfile(prof)}
                              className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1 border border-stone-300 cursor-pointer"
                              title="Sửa thông tin tiệc"
                            >
                              <span className="material-symbols-outlined text-xs">edit</span>
                              Sửa
                            </button>

                            <button
                              onClick={() => handleDeleteProfile(prof.id)}
                              className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1 border border-rose-300 cursor-pointer"
                              title="Xóa bản ghi"
                            >
                              <span className="material-symbols-outlined text-xs">delete</span>
                              Xóa
                            </button>
                          </>
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

      {/* MODAL EDIT PROFILE */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl border border-stone-200 text-stone-900 text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold font-playfair">Chỉnh Sửa Thông Tin Tiệc Cưới</h3>
              <button onClick={() => setEditingProfile(null)} className="text-gray-400 hover:text-black">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Tên Tiệc Cưới</label>
                <input
                  type="text"
                  value={editingProfile.partyTitle || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, partyTitle: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tên Chú Rể</label>
                  <input
                    type="text"
                    value={editingProfile.groomName || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, groomName: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tên Cô Dâu</label>
                  <input
                    type="text"
                    value={editingProfile.brideName || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, brideName: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Ngày Tổ Chức</label>
                  <input
                    type="date"
                    value={editingProfile.eventDate || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, eventDate: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Giờ Tổ Chức</label>
                  <input
                    type="text"
                    value={editingProfile.eventTime || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, eventTime: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Địa Điểm Sảnh</label>
                  <select
                    value={editingProfile.floorId || 'FLOOR_3'}
                    onChange={(e) => {
                      const floorId = e.target.value;
                      const venueName = floorId === 'FLOOR_1' ? 'Tầng 1' : floorId === 'FLOOR_2' ? 'Tầng 2' : floorId === 'FLOOR_4' ? 'Tầng 4' : 'Tầng 3';
                      setEditingProfile({ ...editingProfile, floorId, venueName });
                    }}
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  >
                    {VENUE_FLOOR_OPTIONS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={editingProfile.phone || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Link Google Drive Ảnh & Video</label>
                <input
                  type="url"
                  value={editingProfile.driveLink || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, driveLink: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Ghi Chú Kịch Bản & Yêu Cầu Riêng</label>
                <textarea
                  rows={3}
                  value={editingProfile.customNotes || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, customNotes: e.target.value })}
                  className="w-full border rounded-lg p-2.5 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg shadow-sm"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Interactive Technical Workstation Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-stone-950 w-full max-w-4xl rounded-3xl shadow-2xl border border-amber-500/40 text-stone-100 overflow-hidden animate-fade-in my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-stone-900 border-b border-amber-500/30 p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <span className="material-symbols-outlined text-xl">graphic_eq</span>
                </div>
                <div>
                  <div className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest">
                    TRẠM ĐỒNG BỘ KỸ THUẬT SÂN KHẤU • GOLDEN PALACE
                  </div>
                  <h3 className="text-xl font-bold font-playfair text-white">{selectedProfile.partyTitle}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow text-xs">
              
              {/* Event Info Header Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-900/90 border border-stone-800 rounded-2xl">
                <div>
                  <span className="text-gray-400 block text-[10px]">Ngày & Buổi Tổ Chức:</span>
                  <strong className="text-sm font-mono text-amber-300">{formatDateDot(selectedProfile.eventDate)} ({selectedProfile.eventTime})</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Sảnh Tiệc:</span>
                  <strong className="text-sm text-white font-bold">{selectedProfile.venueName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Gia Chủ (Chú Rể & Cô Dâu):</span>
                  <strong className="text-amber-400 font-bold">{selectedProfile.groomName} ❤️ {selectedProfile.brideName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Hotline Gia Chủ:</span>
                  <strong className="text-blue-400 font-mono">{selectedProfile.phone}</strong>
                </div>
              </div>

              {/* Link Drive chứa Ảnh / Video Cưới nếu có */}
              {selectedProfile.driveLink && (
                <div className="p-3.5 bg-blue-950/40 border border-blue-500/40 rounded-xl flex items-center justify-between gap-3 text-blue-300">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-xl text-blue-400">cloud_download</span>
                    <span className="font-bold">Link Google Drive Ảnh & Video Cưới:</span>
                    <a href={selectedProfile.driveLink} target="_blank" rel="noopener noreferrer" className="underline font-mono text-blue-200 truncate">
                      {selectedProfile.driveLink}
                    </a>
                  </div>
                  <a
                    href={selectedProfile.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shrink-0 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Mở Drive
                  </a>
                </div>
              )}

              {/* SECTION 1: PHÔNG MÀN LED SÂN KHẤU (EXACT 100% MATCH WITH WEB LedCustomizer.jsx) */}
              <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-base">live_tv</span>
                    Phông Màn LED Sân Khấu P3 Full HD
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadLedBackdrop}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Tải File Ảnh Phông LED (1920x1080)
                    </button>
                    <button
                      onClick={() => setFullscreenLed(true)}
                      className="px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">fullscreen</span>
                      Mở Trình Chiếu LED Fullscreen
                    </button>
                  </div>
                </div>

                {/* Mini LED Canvas Visualizer matching LedCustomizer.jsx 100% */}
                <div 
                  id="led-stage-screen-canvas"
                  className="w-full relative rounded-2xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.95)] bg-[#050508] transition-all duration-500"
                  style={{ aspectRatio: selectedProfile.floorId === 'FLOOR_2' ? '704 / 336' : selectedProfile.floorId === 'FLOOR_1' || selectedProfile.floorId === 'FLOOR_4' ? '512 / 272' : '704 / 384' }}
                >
                  {/* STARRY BACKGROUND */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url(${currentLedTemplate.bgImage || '/images/led-bg/starry-night-1.jpg'})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/25"></div>

                  {/* VERTICAL SPOTLIGHT GLOW BEAM */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-full bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.25)_0%,_rgba(255,255,255,0.08)_45%,_transparent_75%)] pointer-events-none z-10"></div>

                  {/* TOP-LEFT CORNER: Golden Palace Pure Transparent PNG Logo Icon ONLY */}
                  <div className="absolute top-3 left-4 sm:top-5 sm:left-6 z-40">
                    <img 
                      src="/logo-icon.png" 
                      alt="Golden Palace Icon Logo" 
                      className="h-7 sm:h-10 md:h-12 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(227,166,56,0.85)]" 
                    />
                  </div>

                  {/* FOREGROUND CONTENT LAYER: JUSTIFY-EVENLY FOR 100% EQUAL VERTICAL SPACING ACROSS 70% HEIGHT */}
                  <div className="relative z-30 w-full h-[70%] flex flex-col items-center justify-evenly text-center px-4 py-2">

                    {/* TẦNG 1: EVENT TITLE HEADER ("LỄ THÀNH HÔN") */}
                    <div className="w-full flex items-center justify-center z-20">
                      <div 
                        className="text-base sm:text-2xl md:text-3xl lg:text-4xl text-slate-50 font-black tracking-wider uppercase drop-shadow-[0_4px_18px_rgba(0,0,0,0.98)]"
                        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                      >
                        {selectedProfile.partyTitle || 'LỄ THÀNH HÔN'}
                      </div>
                    </div>

                    {/* TẦNG 2: COUPLE NAMES ("Đức Hoàng & Thu Hương") */}
                    <div className="w-[75%] max-w-[75%] flex items-center justify-center z-20">
                      <div 
                        className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-wide text-slate-50 drop-shadow-[0_4px_25px_rgba(0,0,0,0.98)] leading-tight whitespace-nowrap flex items-center justify-center"
                        style={{ fontFamily: "'Ballet', 'Great Vibes', cursive" }}
                      >
                        <span>{selectedProfile.groomName || 'Đức Hoàng'}</span>
                        
                        <span 
                          className="text-slate-100 text-lg sm:text-2xl md:text-3xl mx-3 sm:mx-4 font-serif italic font-light tracking-normal"
                          style={{ fontFamily: "'Playfair Display', 'Bodoni Moda', Didot, serif" }}
                        >
                          &
                        </span>

                        <span>{selectedProfile.brideName || 'Thu Hương'}</span>
                      </div>
                    </div>

                    {/* TẦNG 3: WEDDING DATE ("20.11.2026") */}
                    <div className="z-20 w-full flex flex-col items-center">
                      <div 
                        className="text-xs sm:text-base md:text-lg lg:text-xl text-slate-50 font-serif drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)] px-6 font-bold inline-block"
                        style={{ 
                          fontFamily: "'Playfair Display', Didot, 'Times New Roman', serif",
                          fontVariantNumeric: "lining-nums tabular-nums",
                          letterSpacing: "0.14em"
                        }}
                      >
                        {formatDateDot(selectedProfile.eventDate)}
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* SECTION 2: BẢNG PHÁT NHẠC */}
              <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-base">volume_up</span>
                    Danh Sách Bài Hát & Link YouTube Mở Trực Tiếp
                  </div>
                  <span className="text-[10px] text-[#e3a638] font-mono font-bold">
                    Kịch Bản Âm Thanh Sân Khấu
                  </span>
                </div>

                {selectedProfile.musicStatus === 'Không có yêu cầu gì' && (!selectedProfile.selectedMusic || selectedProfile.selectedMusic.length === 0) ? (
                  <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-gray-400 italic">
                    Gia chủ không chọn danh sách nhạc riêng (Đội kỹ thuật mở nhạc tiệc cưới tiêu chuẩn của sảnh).
                  </div>
                ) : (
                  (() => {
                    const userSelectedIds = Array.isArray(selectedProfile.selectedMusic) ? selectedProfile.selectedMusic : [];
                    const ytLinks = selectedProfile.youtubeLinks || {};

                    return (
                      <div className="space-y-4">
                        {MUSIC_CATEGORIES.map((cat) => {
                          const selectedCatTracks = MUSIC_TRACKS.filter(t => t.catId === cat.id && userSelectedIds.includes(t.id));
                          const ytUrl = ytLinks[cat.id];

                          return (
                            <div key={cat.id} className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                                <div className="font-bold text-amber-300 text-xs flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                  {cat.label}
                                </div>
                              </div>

                              {ytUrl && (
                                <div className="p-2.5 bg-red-950/50 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="material-symbols-outlined text-red-400 text-sm">smart_display</span>
                                    <span className="font-bold">Link YouTube bài hát yêu cầu riêng:</span>
                                    <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="underline font-mono text-red-200 truncate">
                                      {ytUrl}
                                    </a>
                                  </div>
                                  <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-red-600 text-white rounded font-bold text-[10px] shrink-0 hover:bg-red-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                                    Mở YouTube
                                  </a>
                                </div>
                              )}

                              <div className="space-y-2">
                                {selectedCatTracks.length === 0 && !ytUrl ? (
                                  <div className="text-[11px] text-gray-500 italic py-1">
                                    Không có bài chọn riêng cho giai đoạn này.
                                  </div>
                                ) : (
                                  selectedCatTracks.map((track) => (
                                    <div key={track.id} className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <div>
                                        <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                          <span className="material-symbols-outlined text-xs text-amber-400">music_note</span>
                                          {track.title}
                                        </div>
                                        <div className="text-[10px] text-gray-400">{track.artist} ({track.duration})</div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <a
                                          href={track.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(track.title + ' ' + track.artist)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                                          Mở YouTube / Tải Nhạc
                                        </a>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                )}
              </div>

              {/* SECTION 3: GHI CHÚ KỊCH BẢN & YÊU CẦU RIÊNG */}
              {selectedProfile.customNotes && selectedProfile.customNotes !== 'Không có ghi chú thêm' && (
                <div className="p-4 bg-stone-900 border border-blue-500/30 rounded-2xl space-y-1">
                  <div className="font-bold text-blue-400 text-xs uppercase flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">edit_note</span>
                    Ghi Chú Kịch Bản & Yêu Cầu Riêng Từ Gia Chủ
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed italic bg-stone-950 p-3 rounded-xl border border-stone-800">
                    "{selectedProfile.customNotes}"
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-[11px] text-gray-400">
                Golden Palace Audio/Visual Technical Operations System
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold uppercase rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  Xuất Kịch Bản PDF / In
                </button>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="px-4 py-2 bg-stone-800 text-gray-300 text-xs font-bold uppercase rounded-xl hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FULLSCREEN STAGE LED SCREEN MODAL (EXACT 100% MATCH WITH WEB LedCustomizer.jsx) */}
      {fullscreenLed && selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
          <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
            <button
              onClick={handleDownloadLedBackdrop}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs uppercase rounded-full border border-emerald-400 hover:bg-emerald-500 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Tải File Ảnh Phông LED
            </button>
            <button
              onClick={() => setFullscreenLed(false)}
              className="px-4 py-2 bg-stone-900/90 text-white font-bold text-xs uppercase rounded-full border border-amber-500/40 hover:bg-stone-800 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">fullscreen_exit</span>
              Thoát Fullscreen
            </button>
          </div>

          <div 
            id="fullscreen-led-stage-screen"
            className="w-full max-w-6xl relative rounded-3xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.95)] bg-[#050508]"
            style={{ aspectRatio: selectedProfile.floorId === 'FLOOR_2' ? '704 / 336' : selectedProfile.floorId === 'FLOOR_1' || selectedProfile.floorId === 'FLOOR_4' ? '512 / 272' : '704 / 384' }}
          >
            {/* STARRY BACKGROUND */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url(${currentLedTemplate.bgImage || '/images/led-bg/starry-night-1.jpg'})` }}
            ></div>
            <div className="absolute inset-0 bg-black/25"></div>

            {/* VERTICAL SPOTLIGHT GLOW BEAM */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-full bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.25)_0%,_rgba(255,255,255,0.08)_45%,_transparent_75%)] pointer-events-none z-10"></div>

            {/* TOP-LEFT CORNER: Golden Palace Pure Transparent PNG Logo Icon ONLY */}
            <div className="absolute top-5 left-6 z-40">
              <img 
                src="/logo-icon.png" 
                alt="Golden Palace Icon Logo" 
                className="h-10 sm:h-14 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(227,166,56,0.85)]" 
              />
            </div>

            {/* FOREGROUND CONTENT LAYER: JUSTIFY-EVENLY FOR 100% EQUAL VERTICAL SPACING ACROSS 70% HEIGHT */}
            <div className="relative z-30 w-full h-[70%] flex flex-col items-center justify-evenly text-center px-4 py-2">

              {/* TẦNG 1: EVENT TITLE HEADER ("LỄ THÀNH HÔN") */}
              <div className="w-full flex items-center justify-center z-20">
                <div 
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-50 font-black tracking-wider uppercase drop-shadow-[0_4px_18px_rgba(0,0,0,0.98)]"
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                >
                  {selectedProfile.partyTitle || 'LỄ THÀNH HÔN'}
                </div>
              </div>

              {/* TẦNG 2: COUPLE NAMES ("Đức Hoàng & Thu Hương") */}
              <div className="w-[75%] max-w-[75%] flex items-center justify-center z-20">
                <div 
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-wide text-slate-50 drop-shadow-[0_4px_25px_rgba(0,0,0,0.98)] leading-tight whitespace-nowrap flex items-center justify-center"
                  style={{ fontFamily: "'Ballet', 'Great Vibes', cursive" }}
                >
                  <span>{selectedProfile.groomName || 'Đức Hoàng'}</span>
                  
                  <span 
                    className="text-slate-100 text-2xl sm:text-4xl md:text-5xl mx-4 sm:mx-6 font-serif italic font-light tracking-normal"
                    style={{ fontFamily: "'Playfair Display', 'Bodoni Moda', Didot, serif" }}
                  >
                    &
                  </span>

                  <span>{selectedProfile.brideName || 'Thu Hương'}</span>
                </div>
              </div>

              {/* TẦNG 3: WEDDING DATE ("20.11.2026") */}
              <div className="z-20 w-full flex flex-col items-center">
                <div 
                  className="text-base sm:text-2xl md:text-3xl text-slate-50 font-serif drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)] px-6 font-bold inline-block"
                  style={{ 
                    fontFamily: "'Playfair Display', Didot, 'Times New Roman', serif",
                    fontVariantNumeric: "lining-nums tabular-nums",
                    letterSpacing: "0.14em"
                  }}
                >
                  {formatDateDot(selectedProfile.eventDate)}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
