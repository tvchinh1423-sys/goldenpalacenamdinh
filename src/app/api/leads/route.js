import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import prisma from '@/lib/prisma';

// Sinh mã lead dạng GP-YYMMDD-XXXX để nhân viên đọc/trao đổi nhanh
function generateLeadCode() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `GP-${yy}${mm}${dd}-${rand}`;
}

export async function POST(req) {
  try {
    const data = await req.json();

    const name = data?.name?.trim();
    const phone = data?.phone?.trim();

    if (!name || !phone) {
      return NextResponse.json(
        { message: 'Vui lòng nhập họ tên và số điện thoại.' },
        { status: 400 }
      );
    }

    // Mã lead có ràng buộc unique — thử lại nếu trùng
    let lead = null;
    for (let attempt = 0; attempt < 5 && !lead; attempt++) {
      try {
        lead = await prisma.lead.create({
          data: {
            code: generateLeadCode(),
            linkToken: randomUUID(),
            name,
            phone,
            brideGroomNames: data?.brideGroomNames?.trim() || null,
            notes: data?.notes?.trim() || null,
          },
        });
      } catch (err) {
        // P2002 = unique constraint. Chỉ thử lại khi đụng field `code`.
        if (err.code === 'P2002' && err.meta?.target?.includes('code')) continue;
        throw err;
      }
    }

    if (!lead) {
      throw new Error('Không sinh được mã lead sau 5 lần thử');
    }

    return NextResponse.json(
      {
        message: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ sớm nhất.',
        code: lead.code,
        linkToken: lead.linkToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi khi lưu Lead:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
