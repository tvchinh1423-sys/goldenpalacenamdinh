import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const addons = await prisma.addOnService.findMany({
      where: { status: 'PUBLISHED', isAvailable: true },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json(addons);
  } catch (error) {
    console.error('Failed to fetch add-ons:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
