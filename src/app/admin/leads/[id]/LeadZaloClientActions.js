'use client';

export default function LeadZaloClientActions({ leadName, phone, code, proposal, linkToken, notes }) {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  // Format message for Customer
  const handleCopyZaloCustomerMessage = () => {
    const venueName = proposal?.venues?.find(v => v.isPreferred)?.venueName || 'Theo lựa chọn của quý khách';
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
    alert('✅ Đã sao chép tin nhắn báo giá Khách hàng! Bạn có thể dán (Paste) gửi qua Zalo.');
  };

  // Format message for Zalo Group "Chốt tiền hàng"
  const handleCopyGroupChotTienHang = () => {
    const venueName = proposal?.venues?.find(v => v.isPreferred)?.venueName || 'Chưa chọn sảnh';
    const eventDateStr = proposal?.eventDate ? new Date(proposal.eventDate).toLocaleDateString('vi-VN') : 'Chưa xác định';
    const totalEst = proposal?.totalBase ? formatCurrency(proposal.totalBase) : 'Chưa tính';
    const budgetPerTableStr = proposal?.budgetPerTable ? formatCurrency(proposal.budgetPerTable) : 'Chưa chọn';
    const linkUrl = `${window.location.origin}/du-toan-chi-phi/link/${linkToken}`;

    const text = `🔔 THÔNG BÁO KHÁCH YÊU CẦU TƯ VẤN TIỆC CƯỚI
📌 Mã yêu cầu: ${code}
👤 Họ và tên: ${leadName}
📞 Số điện thoại: ${phone}
📅 Ngày tổ chức: ${eventDateStr}
⏰ Ca tiệc: ${proposal?.eventSession || 'Buổi trưa/tối'}
👥 Quy mô: ${proposal?.guestCount || 0} khách (${proposal?.mainTables || 0} mâm chính)
🏛️ Sảnh tiệc yêu cầu: ${venueName}
💵 Giá mâm chọn: ${budgetPerTableStr} / mâm
🎁 Gói dịch vụ & Addons: ${proposal?.package?.name || 'Gói tiêu chuẩn'} (${proposal?.addOns?.length || 0} hạng mục nâng cao)
💰 Tổng dự toán kinh phí: ${totalEst}
📝 Ghi chú từ khách: ${notes || 'Không có'}
🔗 Link bản dự toán chi tiết: ${linkUrl}`;

    navigator.clipboard.writeText(text);
    
    // Ask user if they want to open Zalo Chat Web directly
    if (confirm('✅ Đã copy toàn bộ thông tin khách hàng!\n\nBấm OK để mở Zalo và dán (Paste) vào nhóm "Chốt tiền hàng".')) {
      window.open(`https://chat.zalo.me`, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-2 font-inter">
      {/* Open Direct Zalo Chat */}
      <a 
        href={`https://zalo.me/${phone}`} 
        target="_blank" 
        rel="noreferrer"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        <span className="text-base">📱</span>
        <span>Mở Chat Zalo Cá Nhân Số {phone}</span>
      </a>

      {/* Send to Group "Chốt tiền hàng" */}
      <button
        onClick={handleCopyGroupChotTienHang}
        className="w-full bg-gradient-to-r from-[#e3a638] to-[#a66a3a] hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
      >
        <span className="text-base">👥</span>
        <span>Gửi Thông Báo Vào Nhóm Zalo "Chốt tiền hàng"</span>
      </button>

      {/* Copy Quotation for Customer */}
      <button
        onClick={handleCopyZaloCustomerMessage}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-semibold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span className="text-base">📋</span>
        <span>Copy Báo Giá Zalo Cho Khách Hàng</span>
      </button>
    </div>
  );
}
