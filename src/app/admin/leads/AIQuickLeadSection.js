'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AISmartInputBar from '@/components/ui/AISmartInputBar';

export default function AIQuickLeadSection() {
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Parsed Form Data state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    brideGroomNames: '',
    eventType: 'TIEC_CUOI',
    eventDate: '',
    venue: '',
    mainTables: 20,
    budgetPerTable: 4000000,
    depositAmount: 0,
    notes: '',
  });

  const handleParsed = (parsedData) => {
    setFormData({
      name: parsedData.name || '',
      phone: parsedData.phone || '',
      brideGroomNames: parsedData.brideGroomNames || '',
      eventType: parsedData.eventType || 'TIEC_CUOI',
      eventDate: parsedData.eventDate || new Date().toISOString().split('T')[0],
      venue: parsedData.venue || '',
      mainTables: parsedData.mainTables || 20,
      budgetPerTable: parsedData.budgetPerTable || 4000000,
      depositAmount: parsedData.depositAmount || 0,
      notes: parsedData.notes || '',
    });
    setIsOpenModal(true);
  };

  const handleSaveLead = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Vui lòng nhập tên và số điện thoại khách hàng.');
      return;
    }

    setIsSaving(true);
    setSaveSuccessMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      if (res.ok) {
        setSaveSuccessMessage(`🎉 Đã lưu Lead mới thành công! Mã: ${result.code}`);
        setTimeout(() => {
          setIsOpenModal(false);
          setSaveSuccessMessage('');
          router.refresh();
        }, 1200);
      } else {
        alert(result.message || 'Lỗi khi tạo Lead');
      }
    } catch (err) {
      console.error('Error saving lead:', err);
      alert('Lỗi kết nối khi lưu Lead.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Smart Input Bar Box */}
      <AISmartInputBar onParsed={handleParsed} />

      {/* Confirmation Form Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-amber-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700 font-bold material-symbols-outlined">auto_awesome</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Xác Nhận & Lưu Thông Tin Đặt Tiệc (Lead)</h3>
                  <p className="text-xs text-gray-500">AI đã tự động bóc tách các trường bên dưới. Vui lòng kiểm tra lại.</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4 text-xs font-medium text-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-bold mb-1">Họ & Tên Khách Hàng <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 focus:border-amber-500 outline-none text-xs"
                    placeholder="VD: Anh Chinh"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Số Điện Thoại <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 focus:border-amber-500 outline-none text-xs font-mono font-bold"
                    placeholder="VD: 0912345678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-bold mb-1">Tên Chú Rể & Cô Dâu (Nếu có)</label>
                  <input
                    type="text"
                    value={formData.brideGroomNames}
                    onChange={(e) => setFormData({ ...formData, brideGroomNames: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 focus:border-amber-500 outline-none text-xs"
                    placeholder="VD: Anh Nam & Chị Linh"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Loại Tiệc</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 focus:border-amber-500 outline-none text-xs font-semibold"
                  >
                    <option value="TIEC_CUOI">Tiệc Cưới</option>
                    <option value="HOI_NGHI">Hội Nghị / Công Ty</option>
                    <option value="SINH_NHAT">Sinh Nhật / Thượng Thọ</option>
                    <option value="KHAC">Loại Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-800 font-bold mb-1">Ngày Tổ Chức</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:border-amber-500 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Số Mâm Chính</label>
                  <input
                    type="number"
                    value={formData.mainTables}
                    onChange={(e) => setFormData({ ...formData, mainTables: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:border-amber-500 outline-none text-xs font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Tiền Cọc (VND)</label>
                  <input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:border-amber-500 outline-none text-xs font-bold text-emerald-700"
                    placeholder="10000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-1">Ghi Chú / Nhu Cầu Chi Tiết</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 focus:border-amber-500 outline-none text-xs"
                  placeholder="Ghi chú thêm về thực đơn, sảnh, hoặc yêu cầu đặc biệt..."
                />
              </div>

              {saveSuccessMessage && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>{saveSuccessMessage}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-gray-900 hover:bg-black text-amber-300 text-xs font-bold transition-colors shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">save</span>
                  )}
                  <span>Lưu Lead Về Hệ Thống</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
