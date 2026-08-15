'use client';
import { useState } from 'react';

export default function BookingConsultationModal({ isOpen, onClose }) {
  const [consultType, setConsultType] = useState('ONLINE'); // 'ONLINE' or 'DIRECT'
  const [onlineTimeMode, setOnlineTimeMode] = useState('ANYTIME'); // 'ANYTIME' or 'SPECIFIC'
  
  const [directTimeSlot, setDirectTimeSlot] = useState('MORNING'); // 'MORNING', 'NOON', 'AFTERNOON', 'EVENING', 'CUSTOM'
  const [specificDate, setSpecificDate] = useState('');
  const [specificTime, setSpecificTime] = useState('09:00');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Tiệc cưới');
  const [guestCount, setGuestCount] = useState('300');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let timeSummary = '';
    if (consultType === 'ONLINE') {
      timeSummary = onlineTimeMode === 'ANYTIME' 
        ? 'Tư vấn Online: Bất cứ lúc nào' 
        : `Tư vấn Online: Giờ cụ thể (${specificTime} ngày ${specificDate || 'sớm nhất'})`;
    } else {
      const slotMap = {
        'MORNING': 'Sáng (08:00 - 11:30)',
        'NOON': 'Trưa (11:30 - 14:00)',
        'AFTERNOON': 'Chiều (14:00 - 17:30)',
        'EVENING': 'Tối (17:30 - 21:30)',
        'CUSTOM': `Giờ cụ thể (${specificTime})`
      };
      timeSummary = `Tư vấn Trực tiếp tại nhà hàng: ${slotMap[directTimeSlot]} - Ngày: ${specificDate || 'Hôm nay/Ngày mai'}`;
    }

    try {
      const res = await fetch('/api/guest/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          notes: `[ĐẶT LỊCH TƯ VẤN] ${timeSummary} | Sự kiện: ${eventType} | Khách: ${guestCount} | Ghi chú: ${notes}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        alert(data.error || 'Gửi yêu cầu thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-[#e3a638]/40 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-6 text-white relative border-b border-[#e3a638]/30">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <span className="px-3 py-1 bg-[#e3a638]/20 border border-[#e3a638] text-[#e3a638] rounded-full text-[10px] uppercase tracking-widest font-semibold">
            Golden Palace Nam Định
          </span>
          <h2 className="text-2xl font-playfair font-semibold text-amber-200 mt-2">
            Đặt Lịch Tư Vấn Sự Kiện
          </h2>
          <p className="text-gray-300 text-xs font-light mt-1">
            Đặt lịch hẹn tư vấn Online hoặc Trực tiếp tại Nhà hàng cùng chuyên viên tổ chức sự kiện
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-grow font-montserrat text-gray-900 text-sm">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Consultation Type Selector */}
              <div>
                <label className="block text-xs uppercase font-semibold text-gray-700 mb-2">
                  Hình thức tư vấn *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultType('ONLINE')}
                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium text-xs transition-all cursor-pointer ${
                      consultType === 'ONLINE' 
                        ? 'border-[#e3a638] bg-amber-50 text-[#a66a3a] font-semibold ring-2 ring-[#e3a638]/30' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">videocam</span>
                    Tư Vấn Online (Call/Zalo)
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('DIRECT')}
                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium text-xs transition-all cursor-pointer ${
                      consultType === 'DIRECT' 
                        ? 'border-[#e3a638] bg-amber-50 text-[#a66a3a] font-semibold ring-2 ring-[#e3a638]/30' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">storefront</span>
                    Trực Tiếp Tại Nhà Hàng
                  </button>
                </div>
              </div>

              {/* Time Options for ONLINE */}
              {consultType === 'ONLINE' && (
                <div className="bg-[#fcf9f2] p-4 rounded-xl border border-[#e3a638]/20 space-y-3">
                  <label className="block text-xs uppercase font-semibold text-gray-700">
                    Thời gian tư vấn Online *
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input 
                        type="radio" 
                        name="onlineTime" 
                        checked={onlineTimeMode === 'ANYTIME'} 
                        onChange={() => setOnlineTimeMode('ANYTIME')}
                        className="accent-[#e3a638]"
                      />
                      <span>⚡ <strong>Bất cứ lúc nào</strong> (Chuyên viên sẽ liên hệ lại ngay trong 15 phút)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input 
                        type="radio" 
                        name="onlineTime" 
                        checked={onlineTimeMode === 'SPECIFIC'} 
                        onChange={() => setOnlineTimeMode('SPECIFIC')}
                        className="accent-[#e3a638]"
                      />
                      <span>⏰ <strong>Chọn giờ cụ thể</strong> (Chỉ trong giờ mở cửa: 08:00 - 21:00)</span>
                    </label>
                  </div>

                  {onlineTimeMode === 'SPECIFIC' && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Chọn ngày</label>
                        <input 
                          type="date" 
                          value={specificDate} 
                          onChange={e => setSpecificDate(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Chọn giờ (08:00 - 21:00)</label>
                        <input 
                          type="time" 
                          min="08:00"
                          max="21:00"
                          value={specificTime} 
                          onChange={e => setSpecificTime(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Time Options for DIRECT AT RESTAURANT */}
              {consultType === 'DIRECT' && (
                <div className="bg-[#fcf9f2] p-4 rounded-xl border border-[#e3a638]/20 space-y-3">
                  <label className="block text-xs uppercase font-semibold text-gray-700">
                    Khung giờ thăm sảnh & Tư vấn tại Golden Palace *
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'MORNING', label: '🌅 Sáng (08:00 - 11:30)' },
                      { id: 'NOON', label: '☀️ Trưa (11:30 - 14:00)' },
                      { id: 'AFTERNOON', label: '🌇 Chiều (14:00 - 17:30)' },
                      { id: 'EVENING', label: '🌙 Tối (17:30 - 21:30)' }
                    ].map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setDirectTimeSlot(slot.id)}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer ${
                          directTimeSlot === slot.id 
                            ? 'border-[#e3a638] bg-white text-[#a66a3a] font-semibold shadow-xs' 
                            : 'border-gray-200 bg-white/60 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] text-gray-600 mb-1">Ngày dự kiến đến nhà hàng</label>
                    <input 
                      type="date" 
                      value={specificDate} 
                      onChange={e => setSpecificDate(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Customer Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">Họ và tên *</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Nguyễn Văn A" 
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#e3a638] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">Số điện thoại / Zalo *</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="0912 xxx xxx" 
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#e3a638] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">Loại sự kiện</label>
                  <select 
                    value={eventType} 
                    onChange={e => setEventType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#e3a638] focus:outline-none bg-white"
                  >
                    <option value="Tiệc cưới">Tiệc cưới</option>
                    <option value="Tổ chức sự kiện">Tổ chức sự kiện công ty</option>
                    <option value="Tiệc sinh nhật & Kỷ niệm">Tiệc sinh nhật & Kỷ niệm</option>
                    <option value="Phòng ăn riêng">Phòng ăn riêng VIP</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">Số lượng khách dự kiến</label>
                  <input 
                    type="number" 
                    value={guestCount} 
                    onChange={e => setGuestCount(e.target.value)} 
                    placeholder="ví dụ: 300" 
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#e3a638] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">Ghi chú thêm (Tùy chọn)</label>
                <textarea 
                  rows="2" 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  placeholder="Yêu cầu tham quan sảnh Tầng 2/3, tư vấn thực đơn..." 
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#e3a638] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-semibold uppercase text-xs tracking-wider shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">{loading ? 'hourglass_empty' : 'calendar_month'}</span>
                {loading ? 'Đang xác nhận lịch...' : 'Xác Nhận Đặt Lịch Tư Vấn'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl">event_available</span>
              </div>
              <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-2">Đặt Lịch Tư Vấn Thành Công!</h3>
              <p className="text-gray-600 text-xs font-light mb-6 leading-relaxed">
                Cảm ơn <strong>{name}</strong>! Chuyên viên tổ chức sự kiện của Golden Palace đã tiếp nhận yêu cầu lịch hẹn và sẽ gọi điện xác nhận trong ít phút.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-900 text-amber-300 font-medium text-xs uppercase tracking-wider rounded-lg hover:bg-black transition-colors cursor-pointer"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
