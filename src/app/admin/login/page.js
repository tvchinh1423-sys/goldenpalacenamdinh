'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    if (res?.error) {
      setError('Email hoặc mật khẩu không chính xác');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-[#111] p-8 max-w-md w-full border border-white/10 rounded-sm">
        <h2 className="text-[#d4af37] text-2xl font-playfair mb-6 text-center">Đăng nhập Admin</h2>
        
        {error && <div className="bg-red-500/10 text-red-500 p-3 mb-4 text-sm font-inter">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4 font-inter text-sm text-white">
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/20 p-2 focus:outline-none focus:border-[#d4af37]" 
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/20 p-2 focus:outline-none focus:border-[#d4af37]" 
            />
          </div>
          <button type="submit" className="w-full bg-[#d4af37] text-black font-semibold p-2 mt-4 hover:bg-white transition-colors">
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    </div>
  );
}
