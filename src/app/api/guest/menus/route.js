import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const menus = await prisma.menuCombo.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' }
    });
    return NextResponse.json(menus);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
