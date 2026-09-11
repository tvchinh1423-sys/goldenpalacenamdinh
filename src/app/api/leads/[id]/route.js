import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/leads/[id] - Delete a lead party
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: 'Thiếu ID khách hàng' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json({ message: 'Không tìm thấy thông tin tiệc này' }, { status: 404 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Đã xóa tiệc cưới thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa tiệc cưới:', error);
    return NextResponse.json({ message: 'Lỗi hệ thống khi xóa tiệc cưới' }, { status: 500 });
  }
}

// PUT /api/leads/[id] - Update lead status or details
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.phone && { phone: body.phone.trim() }),
        ...(body.brideGroomNames !== undefined && { brideGroomNames: body.brideGroomNames?.trim() || null }),
        ...(body.leadStatus && { leadStatus: body.leadStatus }),
        ...(body.internalNotes !== undefined && { internalNotes: body.internalNotes }),
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Lỗi khi cập nhật tiệc:', error);
    return NextResponse.json({ message: 'Không thể cập nhật thông tin tiệc' }, { status: 500 });
  }
}
