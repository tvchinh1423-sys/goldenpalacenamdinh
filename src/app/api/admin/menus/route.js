import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await prisma.menuCombo.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = {
      name: body.name,
      estimatedPrice: body.estimatedPrice,
      displayOrder: body.displayOrder,
      status: body.status,
    };

    const item = await prisma.menuCombo.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating MenuCombo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
