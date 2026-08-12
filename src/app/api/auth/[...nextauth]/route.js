import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Bỏ qua SQLite trên Vercel do bị lỗi môi trường Serverless (chỉ hỗ trợ file tĩnh), 
        // sử dụng hard-coded account tạm thời để Chinh có thể xem UI
        if (credentials.email === 'admin@goldenpalace.vn' && credentials.password === 'admin123') {
          return {
            id: 'mock-admin-id',
            name: 'Admin',
            email: 'admin@goldenpalace.vn',
            role: 'ADMIN',
          };
        }

        return null;

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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
