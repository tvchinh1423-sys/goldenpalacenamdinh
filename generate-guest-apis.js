const fs = require('fs');
const path = require('path');

const generateGuestVenues = () => `import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const guests = parseInt(searchParams.get('guests'));

  try {
    const venues = await prisma.venue.findMany({
      where: {
        status: 'PUBLISHED',
        ...(guests && {
          minGuests: { lte: guests },
          maxGuests: { gte: guests }
        })
      },
      include: {
        pricings: {
          where: {
            status: 'PUBLISHED',
            ...(guests && {
              guestRangeMin: { lte: guests },
              guestRangeMax: { gte: guests }
            })
          }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json(venues);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
`;

const generateGuestPackages = () => `import { NextResponse } from 'next/server';
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
`;

const generateGuestMenus = () => `import { NextResponse } from 'next/server';
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
`;

const generateGuestBeverages = () => `import { NextResponse } from 'next/server';
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
`;

const files = [
  { dir: 'venues', content: generateGuestVenues() },
  { dir: 'packages', content: generateGuestPackages() },
  { dir: 'menus', content: generateGuestMenus() },
  { dir: 'beverages', content: generateGuestBeverages() }
];

files.forEach(f => {
  const dirPath = path.join(__dirname, 'src', 'app', 'api', 'guest', f.dir);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'route.js'), f.content);
});
console.log('Guest APIs generated');
