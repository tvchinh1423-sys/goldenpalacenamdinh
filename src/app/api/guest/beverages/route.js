import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const beverages = await prisma.beverageItem.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' }
    });
    return NextResponse.json(beverages);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
