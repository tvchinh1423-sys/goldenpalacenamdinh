'use client';

import { useState } from 'react';
import AISmartInputBar from '@/components/ui/AISmartInputBar';

export default function AIPersonalizeInputSection({ onProfileCreated }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [formData, setFormData] = useState({
    partyTitle: 'LỄ THÀNH HÔN',
    groomName: '',
    brideName: '',
    phone: '',
    eventDate: '',
    eventTime: '11:00 AM',
    floorId: 'FLOOR_3',
    customNotes: '',
    driveLink: ''
  });

  const handleParsed = (parsedData) => {
    // Split bride and groom names if extracted together
    let groom = '';
    let bride = '';

    if (parsedData.brideGroomNames) {
      const bg = parsedData.brideGroomNames.replace(/chú rể|cô dâu/gi, '').split(/&|và|-|\+/i);
      if (bg.length >= 2) {
        groom = bg[0].trim();
        bride = bg[1].trim();
      } else {
        groom = parsedData.brideGroomNames.trim();
      }
    } else if (parsedData.name) {
      groom = parsedData.name.replace(/anh|chị|khách/gi, '').trim();
    }

    let floor = 'FLOOR_3';
    if (parsedData.venue) {
      const v = parsedData.venue.toLowerCase();
      if (v.includes('1')) floor = 'FLOOR_1';
      else if (v.includes('2')) floor = 'FLOOR_2';
      else if (v.includes('4')) floor = 'FLOOR_4';
      else floor = 'FLOOR_3';
    }

    setFormData({
      partyTitle: 'LỄ THÀNH HÔN',
      groomName: groom || 'Đức Hoàng',
      brideName: bride || 'Thu Hương',
      phone: parsedData.phone || '',
      eventDate: parsedData.eventDate || new Date().toISOString().split('T')[0],
      eventTime: '11:00 AM',
      floorId: floor,
      customNotes: parsedData.notes || 'Trích xuất từ AI Smart Input',
      driveLink: ''
    });
    setIsOpenModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setStatusMsg('🎉 Đã tạo hồ sơ Kỹ thuật & LED thành công!');
        setTimeout(() => {
          setIsOpenModal(false);
          setStatusMsg('');
          if (onProfileCreated) onProfileCreated();
        }, 1000);
      } else {
        alert(data.message || 'Không thể lưu hồ sơ');
      }
    } catch (err) {
      console.error('Error saving personalize profile:', err);
      alert('Lỗi kết nối khi lưu hồ sơ.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between bg-stone-900/90 border border-amber-500/30 p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">photo_camera</span>
          <div>
            <h3 className="text-sm font-bold text-amber-300">Nhập Hồ Sơ Kỹ Thuật Siêu Tốc bằng AI (MB Style)</h3>
            <p className="text-[11px] text-stone-400">Chụp ảnh hợp đồng, tải ảnh Zalo hoặc dán tin nhắn để AI tự tạo phông màn LED & Kịch bản</p>
          </div>
        </div>
      </div>

      {/* Smart Input Component */}
      <AISmartInputBar onParsed={handleParsed} />

      {/* Confirmation Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-800">
              <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <span className="material-symbols-outlined">auto_awesome</span>
                <span>Xác Nhận Tạo Hồ Sơ Kỹ Thuật (Sân Khấu & LED)</span>
              </h3>
              <button
                onClick={() => setIsOpenModal(false)}
                className="text-stone-400 hover:text-white font-bold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-200/90 font-bold mb-1">Tên Chú Rể <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="Đức Hoàng"
                  />
                </div>

                <div>
                  <label className="block text-amber-200/90 font-bold mb-1">Tên Cô Dâu <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="Thu Hương"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-200/90 font-bold mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 font-mono text-amber-300 focus:border-amber-400 outline-none"
                    placeholder="0912345678"
                  />
                </div>

                <div>
                  <label className="block text-amber-200/90 font-bold mb-1">Tầng / Sảnh Tiệc</label>
                  <select
                    value={formData.floorId}
                    onChange={(e) => setFormData({ ...formData, floorId: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none font-bold"
                  >
                    <option value="FLOOR_1">Tầng 1</option>
                    <option value="FLOOR_2">Tầng 2</option>
                    <option value="FLOOR_3">Tầng 3</option>
                    <option value="FLOOR_4">Tầng 4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-200/90 font-bold mb-1">Ngày Tổ Chức</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-amber-200/90 font-bold mb-1">Giờ Làm Lễ</label>
                  <input
                    type="text"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                    placeholder="11:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-200/90 font-bold mb-1">Ghi Chú Âm Nhạc / Kịch Bản</label>
                <textarea
                  rows={3}
                  value={formData.customNotes}
                  onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  placeholder="Nhập hoặc dán yêu cầu kịch bản tiệc..."
                />
              </div>

              {statusMsg && (
                <div className="p-2.5 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{statusMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Lưu Hồ Sơ Kỹ Thuật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
