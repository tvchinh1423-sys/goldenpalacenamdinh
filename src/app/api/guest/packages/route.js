import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const guests = parseInt(searchParams.get('guests'));
  const venueId = searchParams.get('venue');

  try {
    const packages = await prisma.servicePackage.findMany({
      where: { status: 'PUBLISHED', isAvailable: true },
      include: {
        items: true,
        pricings: {
          where: {
            status: 'PUBLISHED',
            ...(venueId && { venueId }),
            ...(guests && {
              guestRangeMin: { lte: guests },
              guestRangeMax: { gte: guests }
            })
          }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json(packages.filter(pkg => pkg.pricings.length > 0 || !venueId));
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
