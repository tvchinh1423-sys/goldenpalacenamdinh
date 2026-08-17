'use client';

import { useState } from 'react';

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('Dịch vụ Nhà Hàng'); // 'Dịch vụ Nhà Hàng' | 'Trải nghiệm Web' | 'Báo lỗi Web'
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          content,
          name,
          phone
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setContent('');
        setTimeout(() => {
          setSuccess(false);
          setOpen(false);
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button Bottom Left */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 px-4 py-3 bg-stone-900/90 text-[#e3a638] border border-[#e3a638]/40 hover:bg-stone-900 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 cursor-pointer font-montserrat"
      >
        <span className="material-symbols-outlined text-base text-[#e3a638]">rate_review</span>
        <span>Góp Ý & Báo Lỗi</span>
      </button>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-montserrat">
          <div className="bg-[#141414] w-full max-w-lg rounded-3xl border border-[#e3a638]/40 shadow-2xl p-6 text-white relative animate-fade-in">
            
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-2 text-[#e3a638] mb-1">
              <span className="material-symbols-outlined text-2xl">rate_review</span>
              <h3 className="text-xl font-playfair font-bold text-white">Góp Ý & Phản Hồi Website</h3>
            </div>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Ý kiến của quý khách giúp Golden Palace không ngừng hoàn thiện chất lượng dịch vụ & trải nghiệm website. *(Không bắt buộc nhập tên/SĐT)*
            </p>

            {success ? (
              <div className="p-6 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
                <div className="text-sm font-bold text-emerald-300">Cảm Ơn Phản Hồi Của Quý Khách!</div>
                <div className="text-xs text-emerald-100">Ý kiến đóng góp đã được gửi tới Ban Quản Lý Golden Palace.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5 uppercase">Loại Phản Hồi</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-gray-700 text-[#e3a638] font-bold rounded-xl px-4 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Dịch vụ Nhà Hàng">Đóng góp Chất lượng Dịch vụ Nhà hàng</option>
                    <option value="Trải nghiệm Web">Góp ý Giao diện & Tính năng Website</option>
                    <option value="Báo lỗi Web">Báo lỗi Kỹ thuật / Lỗi Website</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5 uppercase">Nội Dung Góp Ý / Phản Hồi (*)</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Vui lòng nhập chi tiết ý kiến góp ý hoặc mô tả lỗi bạn gặp phải..."
                    className="w-full bg-[#1c1c1c] border border-gray-700 focus:border-[#e3a638] rounded-xl p-3.5 text-white outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Họ & Tên (Không bắt buộc)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Số Điện Thoại (Không bắt buộc)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912..."
                      className="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    {loading ? 'Đang Gửi...' : 'Gửi Góp Ý Về Ban Quản Lý'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
