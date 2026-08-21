import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Tài khoản / Email', type: 'text' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const inputVal = credentials.email.trim();
        const inputLower = inputVal.toLowerCase();
        
        // 1. Direct override for Admin account '0945857996'
        if ((inputVal === '0945857996' || inputLower === '0945857996@goldenpalace.vn' || inputLower === 'admin@goldenpalace.vn') && credentials.password === '0945857996') {
          return {
            id: 'admin-0945857996',
            name: 'Trần Vân Chinh',
            email: '0945857996',
            role: 'ADMIN',
          };
        }

        // 2. Direct override for Sales Staff account 'Letan98donga'
        if ((inputVal === 'Letan98donga' || inputLower === 'letan98donga' || inputLower === 'letan' || inputLower === 'letan@goldenpalacenamdinh.com') && credentials.password === 'Letan98donga') {
          return {
            id: 'staff-letan98donga',
            name: 'Nhân Viên Lễ Tân / Sale',
            email: 'Letan98donga',
            role: 'STAFF',
          };
        }

        // 3. Technical member account override 'Kythuat98donga'
        if ((inputVal === 'Kythuat98donga' || inputLower === 'kythuat98donga' || inputLower === 'kythuat' || inputLower === 'kythuat@goldenpalace.vn') && credentials.password === 'Kythuat98donga') {
          return {
            id: 'tech-kythuat98donga',
            name: 'Bộ Phận Kỹ Thuật',
            email: 'Kythuat98donga',
            role: 'MEMBER',
          };
        }

        // 4. Database lookup by email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: inputLower },
              { email: `${inputLower}@goldenpalacenamdinh.com` }
            ]
          },
        });

        if (!user || !user.isActive) return null;

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 giờ
  },
  secret: process.env.NEXTAUTH_SECRET || 'goldenpalace-secret-key-2026',
};
