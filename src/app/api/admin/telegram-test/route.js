import { NextResponse } from 'next/server';
import { sendTelegramTestMessage } from '@/lib/telegram';

export async function POST(request) {
  try {
    const body = await request.json();
    const { botToken, chatId } = body;

    const tokenToUse = botToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatIdToUse = chatId || process.env.TELEGRAM_CHAT_ID;

    if (!tokenToUse || !chatIdToUse) {
      return NextResponse.json({
        success: false,
        error: 'Vui lòng cung cấp TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID'
      }, { status: 400 });
    }

    const result = await sendTelegramTestMessage(tokenToUse, chatIdToUse);

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Đã gửi tin nhắn thử nghiệm thành công tới Telegram!'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Gửi tin nhắn Telegram thất bại'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
