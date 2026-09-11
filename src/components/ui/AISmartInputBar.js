'use client';

import { useState, useRef, useEffect } from 'react';

export default function AISmartInputBar({ onParsed, className = '' }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showCameraModal, setShowCameraModal] = useState(false);

  const fileInputRef = useRef(null);
  const cameraFileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Global Paste listener (Ctrl+V / Cmd+V anywhere on bar)
  useEffect(() => {
    const handleGlobalPaste = async (e) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      // 1. Check for Image in Clipboard
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
            return;
          }
        }
      }

      // 2. Check for Text in Clipboard if focused or pasted
      const pastedText = clipboardData.getData('text');
      if (pastedText && pastedText.trim().length > 5) {
        // If user is pasting into text input, let default event update state or process if clicked Paste button
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

  // Process text prompt
  const handleParseText = async (textToParse = inputText) => {
    if (!textToParse || !textToParse.trim()) {
      setStatusMessage('Vui lòng nhập hoặc dán nội dung tin nhắn/thông tin.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('✦ AI đang phân tích dữ liệu văn bản...');

    try {
      const res = await fetch('/api/ai/parse-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: textToParse })
      });
      const result = await res.json();

      if (res.ok && result.success && result.data) {
        setStatusMessage('✨ Phân tích thành công!');
        if (onParsed) onParsed(result.data);
      } else {
        setStatusMessage(result.error || 'Không thể phân tích dữ liệu.');
      }
    } catch (err) {
      console.error('Error parsing AI text:', err);
      setStatusMessage('Lỗi kết nối máy chủ AI.');
    } finally {
      setIsLoading(false);
    }
  };

  // Process image file (upload or capture or paste)
  const processImageFile = (file) => {
    if (!file) return;

    setIsLoading(true);
    setStatusMessage('✦ AI đang đọc chữ từ hình ảnh...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      try {
        const res = await fetch('/api/ai/parse-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            rawText: inputText
          })
        });
        const result = await res.json();

        if (res.ok && result.success && result.data) {
          setStatusMessage('✨ AI đã nhận diện hình ảnh thành công!');
          if (onParsed) onParsed(result.data);
        } else {
          setStatusMessage(result.error || 'AI chưa nhận diện được thông tin trên ảnh.');
        }
      } catch (err) {
        console.error('Error processing image:', err);
        setStatusMessage('Lỗi khi gửi ảnh tới máy chủ AI.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Paste Button Click
  const handlePasteButtonClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInputText(text);
          handleParseText(text);
          return;
        }
      }
    } catch (err) {
      console.log('Clipboard API read error, fallback to focus:', err);
    }
    setStatusMessage('Vui lòng nhấn Ctrl+V (hoặc Cmd+V) để dán văn bản / ảnh vào đây.');
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Camera Live Stream Modal handlers
  const startCamera = async () => {
    // Check if mobile device, fallback to native capture input for simple native UI
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && cameraFileInputRef.current) {
      cameraFileInputRef.current.click();
      return;
    }

    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      // Fallback to camera file input
      setShowCameraModal(false);
      if (cameraFileInputRef.current) {
        cameraFileInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCameraModal(false);
  };

  const capturePhotoFromWebcam = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured_photo.jpg', { type: 'image/jpeg' });
        stopCamera();
        processImageFile(file);
      }
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className={`w-full font-inter ${className}`}>
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraFileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Main MB AI Style Card Component */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/90 to-slate-900 border-2 border-amber-500/40 p-4 sm:p-5 shadow-xl text-white transition-all">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
            <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
            <span>GOLDEN PALACE AI</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-amber-200/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sẵn sàng phân tích</span>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="relative flex items-center bg-slate-950/80 rounded-xl border border-amber-500/30 focus-within:border-amber-400 transition-all p-1.5 mb-3 shadow-inner">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleParseText();
            }}
            placeholder="Ví dụ: Anh Chinh 0912345678 tiệc cưới sảnh Diamond 20/10 30 mâm cọc 10tr..."
            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-medium"
            disabled={isLoading}
          />

          <button
            onClick={() => handleParseText()}
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
            )}
            <span>Trích xuất</span>
          </button>
        </div>

        {/* Action Buttons Row (MB Bank Style: Chụp ảnh | Tải ảnh | Dán) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 border-t border-slate-800/80">
          <button
            type="button"
            onClick={startCamera}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl bg-slate-800/60 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700/50 hover:border-amber-500/40 text-xs font-semibold transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-base text-amber-400 group-hover:scale-110 transition-transform">photo_camera</span>
            <span className="truncate">Chụp ảnh</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl bg-slate-800/60 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700/50 hover:border-amber-500/40 text-xs font-semibold transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-base text-amber-400 group-hover:scale-110 transition-transform">image</span>
            <span className="truncate">Tải ảnh</span>
          </button>

          <button
            type="button"
            onClick={handlePasteButtonClick}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl bg-slate-800/60 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700/50 hover:border-amber-500/40 text-xs font-semibold transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-base text-amber-400 group-hover:scale-110 transition-transform">content_paste</span>
            <span className="truncate">Dán (Paste)</span>
          </button>
        </div>

        {/* Status Message Footer */}
        {statusMessage && (
          <div className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-2 ${
            statusMessage.includes('✨')
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
              : statusMessage.includes('✦')
              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60 animate-pulse'
              : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
          }`}>
            <span className="material-symbols-outlined text-sm">
              {statusMessage.includes('✨') ? 'check_circle' : statusMessage.includes('✦') ? 'sync' : 'error'}
            </span>
            <span className="truncate">{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Webcam Live Capture Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-4 overflow-hidden shadow-2xl space-y-4">
            <div className="flex justify-between items-center text-white">
              <h3 className="font-bold text-sm flex items-center gap-2 text-amber-400">
                <span className="material-symbols-outlined">photo_camera</span>
                <span>Chụp Ảnh Phiếu Cọc / Hợp Đồng</span>
              </h3>
              <button
                onClick={stopCamera}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder frame overlay */}
              <div className="absolute inset-6 border-2 border-dashed border-amber-400/70 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-bold text-amber-200 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                  Căn chỉnh hợp đồng / phiếu cọc vào đây
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={capturePhotoFromWebcam}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-xs font-bold hover:brightness-110 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">camera</span>
                <span>Chụp & Phân Tích</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
