// Helper module to send Telegram Bot notifications for Golden Palace Admin

export async function sendTelegramNotification({
  code,
  name,
  phone,
  eventDate,
  eventSession,
  guestCount,
  mainTables,
  budgetPerTable,
  preferredVenueName,
  totalBase,
  linkToken,
  leadId,
  isUpdate,
  versionNumber,
  diffSummary
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('[Telegram Notification] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing. Skipping notification.');
    return false;
  }

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));
  const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString('vi-VN') : 'Chưa chọn';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenpalacenamdinh.vercel.app';
  const proposalUrl = `${baseUrl}/du-toan-chi-phi/link/${linkToken}`;
  const adminUrl = `${baseUrl}/admin/leads/${leadId}`;

  const titleHeader = isUpdate 
    ? `🔄 <b>[GOLDEN PALACE] CẬP NHẬT DỰ TOÁN TIỆC (v${versionNumber})</b>`
    : `🔔 <b>[GOLDEN PALACE] BÁO GIÁ TIỆC CƯỚI MỚI!</b>`;

  const message = [
    titleHeader,
    `━━━━━━━━━━━━━━━━━━`,
    `📋 <b>Mã Lead:</b> <code>${code}</code>`,
    `👤 <b>Khách hàng:</b> ${name}`,
    `📱 <b>SĐT Zalo:</b> <code>${phone}</code>`,
    `📅 <b>Ngày tiệc:</b> ${formattedDate} (${eventSession})`,
    `👥 <b>Quy mô:</b> ${guestCount} khách (${mainTables} mâm)`,
    `🍲 <b>Mức mâm cỗ:</b> ${formatCurrency(budgetPerTable)} / mâm`,
    `🏰 <b>Sảnh sảnh:</b> ${preferredVenueName}`,
    `💰 <b>TỔNG DỰ TOÁN:</b> <b>${formatCurrency(totalBase)}</b>`,
    diffSummary ? `📝 <b>Thay đổi:</b> <i>${diffSummary}</i>` : '',
    `━━━━━━━━━━━━━━━━━━`,
    `🔗 <a href="${proposalUrl}">Xem Link Báo Giá Trực Tuyến</a>`,
    `⚙️ <a href="${adminUrl}">Mở Trang Quản Lý Admin</a>`
  ].filter(Boolean).join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const data = await res.json();
    return data.ok;
  } catch (error) {
    console.error('[Telegram Notification Error]:', error);
    return false;
  }
}

// Send test notification
export async function sendTelegramTestMessage(botToken, chatId) {
  if (!botToken || !chatId) return { ok: false, error: 'Thiếu Bot Token hoặc Chat ID' };

  const testMessage = [
    `⚡ <b>[TEST THÀNH CÔNG] KẾT NỐI TELEGRAM BOT - GOLDEN PALACE</b>`,
    `━━━━━━━━━━━━━━━━━━`,
    `Chào anh <b>Trần Vân Chinh</b>, hệ thống thông báo tự động Golden Palace Nam Định đã kết nối thành công với Telegram!`,
    `Mỗi khi có khách hàng đăng ký dự toán chi phí hoặc đặt tiệc mới, thông báo chi tiết sẽ lập tức gửi tới Telegram của anh.`,
    `⏰ Thời gian kết nối: ${new Date().toLocaleString('vi-VN')}`
  ].join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    if (data.ok) {
      return { ok: true };
    } else {
      return { ok: false, error: data.description || 'Lỗi gửi tin nhắn Telegram' };
    }
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
