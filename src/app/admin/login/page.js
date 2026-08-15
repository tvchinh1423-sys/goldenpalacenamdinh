'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('0945857996');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    setLoading(false);

    if (res?.error) {
      setError('Tài khoản hoặc mật khẩu không chính xác');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-montserrat">
      <div className="bg-[#111] p-8 max-w-md w-full border border-[#e3a638]/40 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo-icon.png" alt="Golden Palace" className="h-14 w-auto mb-2" />
          <h2 className="text-[#e3a638] text-2xl font-playfair font-bold text-center">Đăng nhập Admin</h2>
          <p className="text-gray-400 text-xs mt-1">Hệ thống Quản trị Golden Palace Nam Định</p>
        </div>
        
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-xs text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-white">
          <div>
            <label className="block text-gray-300 mb-1.5 font-medium">Tài khoản / Số điện thoại</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập 0945857996..."
              required
              className="w-full bg-black border border-white/20 p-3 rounded-lg focus:outline-none focus:border-[#e3a638] text-sm" 
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1.5 font-medium">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập 0945857996..."
              required
              className="w-full bg-black border border-white/20 p-3 rounded-lg focus:outline-none focus:border-[#e3a638] text-sm" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold p-3.5 mt-2 rounded-lg hover:opacity-90 transition-opacity uppercase tracking-wider text-xs cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP ADMIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
