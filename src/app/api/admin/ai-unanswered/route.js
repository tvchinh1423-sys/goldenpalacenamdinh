import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unanswered = await prisma.aiUnansweredQuestion.findMany({
      orderBy: [
        { isResolved: 'asc' },
        { askCount: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(unanswered);
  } catch (error) {
    console.error('Error fetching unanswered questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.aiUnansweredQuestion.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting unanswered question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
