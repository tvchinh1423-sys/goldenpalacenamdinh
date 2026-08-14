import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pricings = await prisma.venuePricing.findMany({
      where: { venueId: params.id },
      orderBy: { guestRangeMin: 'asc' }
    });
    return NextResponse.json(pricings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { guestRangeMin, guestRangeMax, price, effectiveFrom, effectiveTo, status } = body;

    const pricing = await prisma.venuePricing.create({
      data: {
        venueId: params.id,
        guestRangeMin,
        guestRangeMax,
        price,
        effectiveFrom: new Date(effectiveFrom),
        effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
        status: status || 'DRAFT',
      }
    });

    return NextResponse.json(pricing, { status: 201 });
  } catch (error) {
    console.error('Error creating venue pricing:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
