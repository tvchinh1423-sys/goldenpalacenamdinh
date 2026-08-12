import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Bỏ qua Prisma tạm thời do Vercel SQLite error

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Giả lập lưu dữ liệu thành công
    // Thực tế sẽ dùng: await prisma.lead.create({ data: { name, phone, details, ... } })
    console.log('New Lead Received:', data);

    return NextResponse.json(
      { message: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ sớm nhất.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi khi lưu Lead:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
