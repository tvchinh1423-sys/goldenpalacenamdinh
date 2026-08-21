'use client';

import { useState, useEffect } from 'react';

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
        .catch((err) => console.log('PWA SW registration failed:', err));
    }

    // 2. Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    // 3. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 4. Handle Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user already dismissed recently
      const dismissed = localStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner on iOS if not dismissed
    if (isIosDevice && !localStorage.getItem('pwa_banner_dismissed')) {
      setShowInstallBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom duration-500 font-sans">
      <div className="bg-stone-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl text-stone-100 flex items-center gap-3.5 relative">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-stone-400 hover:text-stone-100 p-1 text-xs cursor-pointer"
          aria-label="Đóng"
        >
          ✕
        </button>

        {/* App Icon */}
        <img
          src="/logo-icon.png"
          alt="Golden Palace App Icon"
          className="w-12 h-12 rounded-xl object-cover border border-amber-400/50 shadow-md shrink-0"
        />

        {/* Content */}
        <div className="flex-1 pr-4">
          <h4 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-1">
            <span>📱 Cài Đặt App Golden Palace</span>
          </h4>
          <p className="text-[11px] text-stone-300 mt-0.5 leading-tight">
            {isIos ? (
              <span>Bấm nút <b>Chia sẻ (Share)</b> ➔ chọn <b>"Thêm vào Màn hình chính"</b> để cài App.</span>
            ) : (
              <span>Thêm ứng dụng vào màn hình chính để dùng mượt mà & nhận ưu đãi!</span>
            )}
          </p>

          {!isIos && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="mt-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <span>📲 Cài Đặt Ngay</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
