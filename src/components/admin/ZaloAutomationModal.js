'use client';
import { useState } from 'react';

export default function ZaloAutomationModal({ isOpen, onClose }) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return alert('Vui lòng dán Webhook URL tự động hóa Zalo');

    setTesting(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/admin/zalo-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: webhookUrl.trim(), test: true })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(data.message);
      } else {
        alert(data.error || 'Thao tác thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối máy chủ');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-inter">
      <div className="bg-white border border-gray-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center border-b border-gray-800">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#e3a638] font-bold">Cấu Hình Tự Động Hóa</span>
            <h3 className="text-xl font-bold text-white mt-0.5">Kết nối Zalo Group "Chốt tiền hàng"</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2 leading-relaxed">
            <span className="font-bold block text-sm">⚡ Nguyên lý hoạt động tự động hóa 100%:</span>
            <p>1. Khi có khách hàng gửi yêu cầu tư vấn tiệc cưới mới trên Web, hệ thống tự động bóc tách: <strong>Họ tên, SĐT, Ngày, Ca tiệc, Số mâm, Sảnh chọn, Mức giá & Tổng chi phí dự toán</strong>.</p>
            <p>2. Dữ liệu sẽ tự động đẩy qua Webhook Zalo Bot / n8n / Make / Zalo Personal Bot API để bắn trực tiếp tin nhắn vào nhóm Zalo <strong>"Chốt tiền hàng"</strong> dưới danh nghĩa tài khoản của Chinh.</p>
          </div>

          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                Zalo Automation Webhook URL (n8n / Make / Zalo Personal Bot):
              </label>
              <input 
                type="url" 
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://n8n.your-domain.com/webhook/zalo-chot-tien-hang..."
                className="w-full border border-gray-300 rounded-xl p-3 text-xs font-mono focus:border-[#e3a638] focus:outline-none"
              />
            </div>

            {statusMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium">
                {statusMsg}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={testing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {testing ? 'Đang Kiểm Tra Kết Nối...' : 'Kích Hoạt Tự Động Hóa Zalo'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
