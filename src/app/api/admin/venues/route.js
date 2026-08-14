import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// GET /api/admin/venues
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const venues = await prisma.venue.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        pricings: {
          orderBy: { guestRangeMin: 'asc' }
        }
      }
    });
    return NextResponse.json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/venues
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, minGuests, maxGuests, displayOrder, status } = body;

    const venue = await prisma.venue.create({
      data: {
        name,
        description,
        minGuests,
        maxGuests,
        displayOrder: displayOrder || 0,
        status: status || 'DRAFT',
      }
    });

    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    console.error('Error creating venue:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
