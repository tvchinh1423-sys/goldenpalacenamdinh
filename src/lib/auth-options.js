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
        
        // Direct override for username/password '0945857996'
        if ((inputVal === '0945857996' || inputLower === '0945857996@goldenpalace.vn' || inputLower === 'admin@goldenpalace.vn') && credentials.password === '0945857996') {
          return {
            id: 'admin-0945857996',
            name: 'Trần Vân Chinh',
            email: '0945857996',
            role: 'ADMIN',
          };
        }

        // Technical member account override
        if ((inputVal === 'Kythuat98donga' || inputLower === 'kythuat98donga' || inputLower === 'kythuat' || inputLower === 'kythuat@goldenpalace.vn') && credentials.password === 'Kythuat98donga') {
          return {
            id: 'tech-kythuat98donga',
            name: 'Bộ Phận Kỹ Thuật',
            email: 'Kythuat98donga',
            role: 'MEMBER',
          };
        }

        // Try database lookup by email or 0945857996@goldenpalace.vn
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: inputLower },
              { email: `${inputLower}@goldenpalace.vn` }
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
