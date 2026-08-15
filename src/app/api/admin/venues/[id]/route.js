import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        pricings: {
          orderBy: { guestRangeMin: 'asc' }
        }
      }
    });
    
    if (!venue) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(venue);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, minGuests, maxGuests, displayOrder, status, images } = body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (minGuests !== undefined) updateData.minGuests = minGuests;
    if (maxGuests !== undefined) updateData.maxGuests = maxGuests;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (status !== undefined) updateData.status = status;
    if (images !== undefined) updateData.images = images;

    const venue = await prisma.venue.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json(venue);
  } catch (error) {
    console.error('Failed to update venue:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.venue.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
