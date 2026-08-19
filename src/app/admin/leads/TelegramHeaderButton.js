'use client';

import { useState } from 'react';

export default function TelegramHeaderButton() {
  const [openModal, setOpenModal] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleTestSend = async () => {
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/admin/telegram-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken, chatId })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: '✅ Gửi tin nhắn thử nghiệm thành công tới Telegram của bạn!' });
      } else {
        setStatusMsg({ type: 'error', text: `❌ ${data.error}` });
      }
    } catch (e) {
      setStatusMsg({ type: 'error', text: `❌ Lỗi kết nối: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="px-4 py-2 bg-[#24A1DE] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
      >
        <span className="material-symbols-outlined text-base">send</span>
        <span>Kết Nối Telegram</span>
      </button>

      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-stone-800 space-y-4 relative">
            
            {/* Close button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#24A1DE]/10 text-[#24A1DE] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">send</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Cấu Hình Thông Báo Tự Động Qua Telegram
                </h3>
                <p className="text-xs text-gray-500">
                  Nhận tin nhắn báo giá / khách hàng mới tức thì về điện thoại
                </p>
              </div>
            </div>

            {/* Instructions list */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5 leading-relaxed font-serif">
              <p className="font-bold text-amber-900">💡 Hướng dẫn tạo Telegram Bot nhận thông báo (Free 100%):</p>
              <ol className="list-decimal list-inside space-y-1 text-[11px]">
                <li>Mở ứng dụng Telegram, tìm bot <b>@BotFather</b> → gõ <code>/newbot</code> để tạo bot mới và lấy <b>Bot Token</b>.</li>
                <li>Thêm Bot vừa tạo vào Telegram của bạn.</li>
                <li>Tìm bot <b>@userinfobot</b> hoặc <b>@getidsbot</b> để lấy mã <b>Chat ID</b> cá nhân (ví dụ: <code>123456789</code>).</li>
                <li>Dán 2 mã vào ô bên dưới và bấm nút <b>Gửi Tin Nhắn Thử Nghiệm</b>.</li>
              </ol>
            </div>

            {/* Form Inputs */}
            <div className="space-y-3 text-xs font-montserrat">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Telegram Bot Token (TELEGRAM_BOT_TOKEN):
                </label>
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="Ví dụ: 789123456:AAFd4fgh..."
                  className="w-full bg-gray-50 border border-gray-300 focus:border-[#24A1DE] rounded-xl px-3.5 py-2 text-stone-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Telegram Chat ID (TELEGRAM_CHAT_ID):
                </label>
                <input
                  type="text"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  placeholder="Ví dụ: 123456789"
                  className="w-full bg-gray-50 border border-gray-300 focus:border-[#24A1DE] rounded-xl px-3.5 py-2 text-stone-900 font-mono outline-none"
                />
              </div>
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {statusMsg.text}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleTestSend}
                disabled={loading}
                className="flex-1 py-2.5 bg-[#24A1DE] hover:bg-[#1f8ec4] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>{loading ? 'Đang Gửi Thử...' : 'Gửi Tin Nhắn Thử Nghiệm'}</span>
              </button>
            </div>

            <div className="text-[10px] text-gray-400 text-center italic border-t pt-2">
              * Sau khi thử nghiệm thành công, nhập 2 biến <code>TELEGRAM_BOT_TOKEN</code> và <code>TELEGRAM_CHAT_ID</code> vào Vercel Environment Variables để chạy tự động 24/7.
            </div>

          </div>
        </div>
      )}
    </>
  );
}
