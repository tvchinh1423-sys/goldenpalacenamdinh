import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Telegram Webhook Handler — Supports 2-way interactive commands & inline button actions
export async function POST(request) {
  try {
    const body = await request.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json({ ok: true });
    }

    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));
    const formatVietnamDateOnly = (dateVal) => dateVal ? new Date(dateVal).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Chưa chọn';

    // Helper to send message back to Telegram
    const sendMessage = async (chatId, text, replyToMsgId = null, replyMarkup = null) => {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
            reply_to_message_id: replyToMsgId,
            reply_markup: replyMarkup
          })
        });
      } catch (err) {
        console.error('Error sending message:', err);
      }
    };

    // Helper to answer Callback Query from Inline Keyboard Buttons
    const answerCallbackQuery = async (callbackQueryId, text) => {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQueryId,
            text: text,
            show_alert: true
          })
        });
      } catch (err) {
        console.error('Error answering callback query:', err);
      }
    };

    // 1. HANDLE INLINE KEYBOARD BUTTON CLICKS (Callback Queries)
    if (body.callback_query) {
      const cb = body.callback_query;
      const callbackData = cb.data; // e.g. "STATUS:CONTACTED:leadId" or "STATUS:WON:leadId"
      const chatId = cb.message.chat.id;

      if (callbackData && callbackData.startsWith('STATUS:')) {
        const parts = callbackData.split(':');
        const newStatus = parts[1]; // e.g. CONTACTED, WON, QUOTED
        const leadId = parts[2];

        const targetLead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (targetLead) {
          const updatedLead = await txStatusUpdate(leadId, newStatus);
          const statusText = newStatus === 'CONTACTED' ? 'ĐÃ LIÊN HỆ 📞' :
                             newStatus === 'WON' ? 'CHỐT HỢP ĐỒNG 🤝' :
                             newStatus === 'QUOTED' ? 'ĐÃ BÁO GIÁ 📝' : newStatus;

          await answerCallbackQuery(cb.id, `✅ Đã chuyển trạng thái khách ${targetLead.name} (${targetLead.phone}) sang: ${statusText}!`);
          await sendMessage(chatId, `✅ <b>CẬP NHẬT TRẠNG THÁI KHÁCH HÀNG:</b>\n👤 <b>${targetLead.name}</b> (<code>${targetLead.phone}</code>)\n📌 Trạng thái mới trên Admin: <b>${statusText}</b>`);
        }
      }

      return NextResponse.json({ ok: true });
    }

    // 2. HANDLE INCOMING MESSAGES / QUESTIONS / COMMANDS
    const message = body.message || body.channel_post;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const msgId = message.message_id;
    const rawText = message.text.trim();
    const textLower = rawText.toLowerCase();

    // Command 1: Get latest customer ("khách gần nhất" / "khách mới nhất")
    if (
      textLower.includes('khách gần nhất') || 
      textLower.includes('khách mới nhất') || 
      textLower.includes('khách vừa rồi') ||
      textLower.includes('khach gan nhat') ||
      textLower.includes('khach moi nhat')
    ) {
      const latestLead = await prisma.lead.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          proposals: {
            orderBy: { version: 'desc' },
            take: 1
          }
        }
      });

      if (!latestLead) {
        await sendMessage(chatId, '❌ Chưa có thông tin khách hàng nào trên hệ thống.', msgId);
        return NextResponse.json({ ok: true });
      }

      const p = latestLead.proposals[0];
      const cleanPhone = latestLead.phone.replace(/[^0-9]/g, '');
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenpalacenamdinh.com';

      const replyText = [
        `📋 <b>THÔNG TIN KHÁCH HÀNG MỚI NHẤT TRÊN ADMIN</b>`,
        `━━━━━━━━━━━━━━━━━━`,
        `🔹 <b>Mã Lead:</b> <code>${latestLead.code}</code>`,
        `👤 <b>Khách hàng:</b> ${latestLead.name}`,
        `📱 <b>SĐT Zalo:</b> <code>${latestLead.phone}</code>`,
        `📌 <b>Trạng thái hiện tại:</b> <b>${latestLead.leadStatus}</b>`,
        p ? `📅 <b>Ngày tiệc:</b> ${formatVietnamDateOnly(p.eventDate)} (${p.eventSession})` : '',
        p ? `👥 <b>Quy mô:</b> ${p.guestCount} khách (${p.mainTables} mâm)` : '',
        p ? `💰 <b>Tổng dự toán:</b> <b>${formatCurrency(p.totalBase)}</b>` : '',
        `━━━━━━━━━━━━━━━━━━`,
        `📲 <a href="https://zalo.me/${cleanPhone}">Chat Zalo Trực Tiếp Vay</a>`,
        `⚙️ <a href="${baseUrl}/admin/leads/${latestLead.id}">Mở Trang Quản Lý Admin</a>`
      ].filter(Boolean).join('\n');

      const inlineButtons = {
        inline_keyboard: [
          [
            { text: '📞 Đã liên hệ', callback_data: `STATUS:CONTACTED:${latestLead.id}` },
            { text: '🤝 Chốt hợp đồng', callback_data: `STATUS:WON:${latestLead.id}` }
          ]
        ]
      };

      await sendMessage(chatId, replyText, msgId, inlineButtons);
      return NextResponse.json({ ok: true });
    }

    // Command 2: Update status by phone number e.g. "0945857996 đã liên hệ" or "0945857996 chốt"
    const phoneMatch = rawText.match(/(0[3|5|7|8|9][0-9]{8})/);
    if (phoneMatch) {
      const targetPhone = phoneMatch[1];
      const lead = await prisma.lead.findFirst({
        where: { phone: { contains: targetPhone } }
      });

      if (lead) {
        let newStatus = null;
        let statusLabel = '';

        if (textLower.includes('đã liên hệ') || textLower.includes('da lien he') || textLower.includes('gọi rồi')) {
          newStatus = 'CONTACTED';
          statusLabel = 'ĐÃ LIÊN HỆ 📞';
        } else if (textLower.includes('chốt') || textLower.includes('chot') || textLower.includes('đặt cọc') || textLower.includes('won')) {
          newStatus = 'WON';
          statusLabel = 'CHỐT HỢP ĐỒNG 🤝';
        } else if (textLower.includes('báo giá') || textLower.includes('bao gia') || textLower.includes('gửi mail')) {
          newStatus = 'QUOTED';
          statusLabel = 'ĐÃ BÁO GIÁ 📝';
        } else if (textLower.includes('hủy') || textLower.includes('huy') || textLower.includes('không đặt')) {
          newStatus = 'LOST';
          statusLabel = 'HỦY / BỎ CỘC ❌';
        }

        if (newStatus) {
          await txStatusUpdate(lead.id, newStatus);
          await sendMessage(
            chatId, 
            `✅ <b>ĐÃ CẬP NHẬT TRẠNG THÁI TRÊN ADMIN:</b>\n👤 <b>${lead.name}</b> (SĐT: <code>${lead.phone}</code>)\n📌 Trạng thái mới: <b>${statusLabel}</b>`,
            msgId
          );
          return NextResponse.json({ ok: true });
        }
      }
    }

    // Command 3: General Bot Help or Greeting
    if (textLower.includes('xin chào') || textLower.includes('chào bot') || textLower.includes('/help') || textLower.includes('hướng dẫn')) {
      const helpText = [
        `🤖 <b>TRỢ LÝ TỰ ĐỘNG GOLDEN PALACE BOT</b>`,
        `━━━━━━━━━━━━━━━━━━`,
        `Em hỗ trợ các câu lệnh điều khiển trực tiếp trên Admin:`,
        `1️⃣ <b>Cập nhật trạng thái khách:</b>`,
        `   • Gõ: <code>0945857996 đã liên hệ</code>`,
        `   • Gõ: <code>0945857996 chốt hợp đồng</code>`,
        `   • Gõ: <code>0945857996 báo giá</code>`,
        `2️⃣ <b>Tra cứu thông tin:</b>`,
        `   • Gõ: <code>Thông báo thông tin của khách gần nhất</code>`,
        `   • Gõ: <code>tìm 0945857996</code>`,
        `━━━━━━━━━━━━━━━━━━`,
        `📌 Trạng thái trên trang Admin sẽ được tự động đổi tức thì!`
      ].join('\n');

      await sendMessage(chatId, helpText, msgId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in Telegram Webhook:', error);
    return NextResponse.json({ ok: true });
  }
}

async function txStatusUpdate(leadId, newStatus) {
  return await prisma.lead.update({
    where: { id: leadId },
    data: {
      leadStatus: newStatus,
      updatedAt: new Date()
    }
  });
}
