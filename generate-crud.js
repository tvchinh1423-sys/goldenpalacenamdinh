const fs = require('fs');
const path = require('path');

const models = [
  { name: 'ServicePackage', route: 'packages', fields: ['name', 'description', 'displayOrder', 'isAvailable', 'status'] },
  { name: 'AddOnService', route: 'add-ons', fields: ['name', 'description', 'displayOrder', 'isAvailable', 'status'] },
  { name: 'MenuCombo', route: 'menus', fields: ['name', 'estimatedPrice', 'displayOrder', 'status'] },
  { name: 'BeverageItem', route: 'beverages', fields: ['name', 'category', 'price', 'displayOrder', 'status'] }
];

const generateRoute = (model) => `import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await prisma.${model.name.charAt(0).toLowerCase() + model.name.slice(1)}.findMany({
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
${model.fields.map(f => `      ${f}: body.${f},`).join('\n')}
    };

    const item = await prisma.${model.name.charAt(0).toLowerCase() + model.name.slice(1)}.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating ${model.name}:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
`;

const generateIdRoute = (model) => `import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const modelName = '${model.name.charAt(0).toLowerCase() + model.name.slice(1)}';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const item = await prisma[modelName].findUnique({ where: { id: params.id } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = {
${model.fields.map(f => `      ${f}: body.${f},`).join('\n')}
    };

    const item = await prisma[modelName].update({
      where: { id: params.id },
      data
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma[modelName].delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
`;

models.forEach(model => {
  const dirPath = path.join(__dirname, 'src', 'app', 'api', 'admin', model.route);
  const idDirPath = path.join(dirPath, '[id]');
  
  fs.mkdirSync(idDirPath, { recursive: true });
  
  fs.writeFileSync(path.join(dirPath, 'route.js'), generateRoute(model));
  fs.writeFileSync(path.join(idDirPath, 'route.js'), generateIdRoute(model));
  
  console.log('Generated CRUD for ' + model.name);
});
