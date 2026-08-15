import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const guests = parseInt(searchParams.get('guests'));

  try {
    const venues = await prisma.venue.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        pricings: {
          where: {
            status: 'PUBLISHED'
          },
          orderBy: { guestRangeMin: 'asc' }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json(venues);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
