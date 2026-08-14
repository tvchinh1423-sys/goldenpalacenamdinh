"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setStatus("loading");
    
    try {
      const res = await fetch('/api/guest/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Khách từ Footer',
          phone: phone,
          notes: 'Yêu cầu tư vấn từ form Footer',
          status: 'NEW'
        })
      });

      if (res.ok) {
        setStatus("success");
        setPhone("");
        // Reset sau 3 giây
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <footer className="bg-[#fcf9f2] border-t border-[#e3a638]/20 pt-20 pb-10 text-gray-600 font-montserrat">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <img src="/logo-icon.png" alt="Golden Palace Emblem" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="text-[#a66a3a] font-playfair text-lg tracking-widest uppercase font-semibold">Golden Palace</span>
          </Link>
          <p className="text-sm font-light leading-relaxed mb-6">
            Nơi tôn vinh những khoảnh khắc trọn vẹn. Không gian hoàng gia, dịch vụ đẳng cấp 5 sao tại trung tâm thành phố Nam Định.
          </p>
        </div>

        {/* Contact */}
        <div className="col-span-1 md:col-span-1">
          <h4 className="text-gray-900 font-semibold mb-6 uppercase tracking-wider text-sm">Liên Hệ</h4>
          <ul className="space-y-4 text-sm font-light">
            <li>
              <span className="block text-[#a66a3a] text-xs mb-1 uppercase tracking-widest font-medium">Địa chỉ</span>
              98 Đông A, KĐT Hòa Vượng, TP Nam Định
            </li>
            <li>
              <span className="block text-[#a66a3a] text-xs mb-1 uppercase tracking-widest font-medium">Hotline</span>
              0228 659 5959
            </li>
            <li>
              <span className="block text-[#a66a3a] text-xs mb-1 uppercase tracking-widest font-medium">Email</span>
              cungdienvang98donga@gmail.com
            </li>
          </ul>
        </div>

        {/* Map */}
        <div className="col-span-1 md:col-span-1">
          <h4 className="text-gray-900 font-semibold mb-6 uppercase tracking-wider text-sm flex items-center justify-between">
            Bản Đồ
            <a 
              href="https://www.google.com/maps/search/?api=1&query=98+Đông+A,+KĐT+Hòa+Vượng,+Nam+Định" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#a66a3a] hover:text-[#e3a638] text-xs font-normal flex items-center gap-1 normal-case"
            >
              Mở trong Maps
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </h4>
          <div className="w-full h-[150px] bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.657685608757!2d106.16278857416391!3d20.43813631055745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135e0aa06c11b15%3A0xc3b832b85e0bf712!2zOTggxJDDtG5nIEEsIEzhu5ljIEjDsmEsIFRQLiBOYW0gxJDhu4tuaCwgTmFtIMSQ4buLbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1714901234567!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Golden Palace"
            ></iframe>
          </div>
        </div>

        {/* Newsletter / Contact form */}
        <div className="col-span-1 md:col-span-1">
          <h4 className="text-gray-900 font-semibold mb-6 uppercase tracking-wider text-sm">Nhận Tư Vấn</h4>
          <p className="text-sm font-light mb-4">Để lại số điện thoại để nhận tư vấn và báo giá chi tiết nhất từ chúng tôi.</p>
          <form onSubmit={handleConsultationSubmit} className="flex flex-col">
            <div className="flex">
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại của bạn" 
                required
                className="bg-white border border-gray-300 px-4 py-2 w-full text-sm focus:outline-none focus:border-[#e3a638] transition-colors text-gray-900"
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="bg-[#e3a638] text-white px-4 py-2 text-sm font-semibold hover:bg-[#a66a3a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === 'loading' ? 'ĐANG GỬI...' : 'GỬI'}
              </button>
            </div>
            
            {status === 'success' && (
              <p className="text-green-600 text-xs mt-2 font-medium">Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.</p>
            )}
            {status === 'error' && (
              <p className="text-red-500 text-xs mt-2 font-medium">Có lỗi xảy ra, vui lòng thử lại sau.</p>
            )}
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-[#e3a638]/20 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-light">
        <p>© 2026 Toàn bộ bản quyền thuộc GoldenPalace</p>
        <div className="mt-4 md:mt-0 text-gray-500">
          Design by Trần Vân Chinh
        </div>
      </div>
    </footer>
  );
}
