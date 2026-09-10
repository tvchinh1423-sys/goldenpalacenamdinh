import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// GET /api/admin/table-menu?leadId=...
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'leadId là bắt buộc' }, { status: 400 });
    }

    // Fetch lead with latest proposal
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        proposals: {
          orderBy: { version: 'desc' },
          take: 1
        },
        tableMenus: {
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Không tìm thấy tiệc / khách hàng' }, { status: 404 });
    }

    const savedMenu = lead.tableMenus[0] || null;
    const latestProposal = lead.proposals[0];

    // Format event date
    let formattedDate = '';
    if (latestProposal?.eventDate) {
      formattedDate = new Date(latestProposal.eventDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    const responseData = {
      leadId: lead.id,
      code: lead.code,
      name: lead.name,
      brideGroomNames: savedMenu?.brideGroomNames || lead.brideGroomNames || lead.name || 'Minh Quang & Thu Hiền',
      eventDate: savedMenu?.eventDate || formattedDate || new Date().toLocaleDateString('vi-VN'),
      title: savedMenu?.title || 'Lễ Thành Hôn',
      khaiVi: savedMenu ? JSON.parse(savedMenu.khaiVi || '[]') : [
        'Súp nấm đông trùng hạ thảo',
        'Salad trứng cá hồi'
      ],
      monChinh: savedMenu ? JSON.parse(savedMenu.monChinh || '[]') : [
        'Cá hồi áp chảo sốt chanh leo',
        'Tôm hùm chiên bơ tỏi',
        'Bò hầm vang + bánh mì chuột',
        'Gà rút xương sốt nấm',
        'Củ quả luộc chấm kho quẹt',
        'Canh mọc bò nấm tươi',
        'Cơm tám',
        'Xôi hoàng phố ruốc bỏng'
      ],
      trangMieng: savedMenu ? JSON.parse(savedMenu.trangMieng || '[]') : [
        'Sữa chua'
      ],
      doUong: savedMenu ? JSON.parse(savedMenu.doUong || '[]') : [
        'Rượu ta + Rượu vang + Bia + Nước ngọt + Nước lọc'
      ],
      footerText: savedMenu?.footerText || 'Chúc Quý Khách Ngon Miệng!',
      notes: savedMenu?.notes || '',
      updatedAt: savedMenu?.updatedAt || null
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error fetching table menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/table-menu
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, title, brideGroomNames, eventDate, khaiVi, monChinh, trangMieng, doUong, footerText, notes } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId là bắt buộc' }, { status: 400 });
    }

    const khaiViJson = JSON.stringify(Array.isArray(khaiVi) ? khaiVi : []);
    const monChinhJson = JSON.stringify(Array.isArray(monChinh) ? monChinh : []);
    const trangMiengJson = JSON.stringify(Array.isArray(trangMieng) ? trangMieng : []);
    const doUongJson = JSON.stringify(Array.isArray(doUong) ? doUong : []);

    const existingMenu = await prisma.tableMenu.findFirst({
      where: { leadId }
    });

    let saved;
    if (existingMenu) {
      saved = await prisma.tableMenu.update({
        where: { id: existingMenu.id },
        data: {
          title: title || 'Lễ Thành Hôn',
          brideGroomNames: brideGroomNames || '',
          eventDate: eventDate || '',
          khaiVi: khaiViJson,
          monChinh: monChinhJson,
          trangMieng: trangMiengJson,
          doUong: doUongJson,
          footerText: footerText || 'Chúc Quý Khách Ngon Miệng!',
          notes: notes || ''
        }
      });
    } else {
      saved = await prisma.tableMenu.create({
        data: {
          leadId,
          title: title || 'Lễ Thành Hôn',
          brideGroomNames: brideGroomNames || '',
          eventDate: eventDate || '',
          khaiVi: khaiViJson,
          monChinh: monChinhJson,
          trangMieng: trangMiengJson,
          doUong: doUongJson,
          footerText: footerText || 'Chúc Quý Khách Ngon Miệng!',
          notes: notes || ''
        }
      });
    }

    return NextResponse.json({ success: true, data: saved });

  } catch (error) {
    console.error('Error saving table menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
