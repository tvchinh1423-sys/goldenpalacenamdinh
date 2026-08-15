'use client';

export default function LeadZaloClientActions({ leadName, phone, code, proposal, linkToken }) {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  const handleCopyZaloMessage = () => {
    const venueName = proposal?.venues?.find(v => v.isPreferred)?.venueName || 'Theo lựa chọn';
    const totalEst = proposal?.totalBase ? formatCurrency(proposal.totalBase) : 'Đang tính toán';
    const linkUrl = `${window.location.origin}/du-toan-chi-phi/link/${linkToken}`;

    const text = `Kính gửi Anh/Chị ${leadName}!
Trung tâm Tiệc cưới & Hội nghị Golden Palace Nam Định xin gửi Anh/Chị thông tin dự trù kinh phí cho sự kiện (Mã đơn: ${code}):

👤 Khách hàng: ${leadName}
📞 SĐT: ${phone}
🏛️ Hội trường: ${venueName}
👥 Quy mô: ${proposal?.guestCount || 'N/A'} khách (${proposal?.mainTables || 'N/A'} mâm)
💰 Tổng dự trù kinh phí: ${totalEst}
🔗 Link xem chi tiết bản dự toán: ${linkUrl}

Chuyên viên tư vấn Golden Palace rất hân hạnh được đồng hành và hỗ trợ Anh/Chị!`;

    navigator.clipboard.writeText(text);
    alert('✅ Đã sao chép nội dung báo giá Zalo! Bạn có thể dán (Paste) để gửi ngay qua ứng dụng Zalo.');
  };

  return (
    <div className="flex flex-col gap-2">
      <a 
        href={`https://zalo.me/${phone}`} 
        target="_blank" 
        rel="noreferrer"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
      >
        <span>📱 Mở Chat Zalo Với SĐT {phone}</span>
      </a>

      <button
        onClick={handleCopyZaloMessage}
        className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>📋 Copy Mẫu Báo Giá Đơn Này Để Gửi Zalo</span>
      </button>
    </div>
  );
}
