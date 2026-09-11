import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: Fetch all user accounts
export async function GET(request) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Default System Preset Accounts
    const defaultAccounts = [
      {
        id: 'system-admin-0945857996',
        name: 'Trần Vân Chinh (Admin Chính)',
        email: '0945857996',
        role: 'ADMIN',
        isActive: true,
        isSystem: true,
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'system-staff-letan',
        name: 'Nhân Viên Lễ Tân / Sale',
        email: 'Letan98donga',
        role: 'STAFF',
        isActive: true,
        isSystem: true,
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'system-tech-kythuat',
        name: 'Bộ Phận Kỹ Thuật Sân Khấu',
        email: 'Kythuat98donga',
        role: 'MEMBER',
        isActive: true,
        isSystem: true,
        createdAt: new Date('2026-01-01'),
      },
    ];

    return NextResponse.json({
      dbUsers: users,
      systemUsers: defaultAccounts,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ khi lấy danh sách tài khoản' }, { status: 500 });
  }
}

// POST: Create a new user account
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role, isActive } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ Tên, Tên đăng nhập/Email và Mật khẩu' }, { status: 400 });
    }

    const inputLower = email.trim().toLowerCase();

    // Check existing email
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: inputLower },
          { email: `${inputLower}@goldenpalacenamdinh.com` }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Tài khoản / Email này đã tồn tại trong hệ thống' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: inputLower,
        passwordHash,
        role: role || 'STAFF',
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Không thể tạo tài khoản người dùng' }, { status: 500 });
  }
}
