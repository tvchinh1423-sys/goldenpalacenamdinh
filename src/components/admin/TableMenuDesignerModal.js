'use client';

import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import WeddingMenuCardCanvas from './WeddingMenuCardCanvas';

export default function TableMenuDesignerModal({ leadId, leadName, brideGroomDefault, eventDateDefault, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiParsing, setAiParsing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Mobile Tab State: 'editor' | 'preview'
  const [activeTab, setActiveTab] = useState('editor');

  // Form State
  const [title, setTitle] = useState('Lễ Thành Hôn');
  const [brideGroomNames, setBrideGroomNames] = useState(brideGroomDefault || leadName || 'Minh Quang & Thu Hiền');
  const [eventDate, setEventDate] = useState(eventDateDefault || new Date().toLocaleDateString('vi-VN'));
  const [khaiViText, setKhaiViText] = useState('Súp nấm đông trùng hạ thảo\nSalad trứng cá hồi');
  const [monChinhText, setMonChinhText] = useState('Cá hồi áp chảo sốt chanh leo\nTôm hùm chiên bơ tỏi\nBò hầm vang + bánh mì chuột\nGà rút xương sốt nấm\nCủ quả luộc chấm kho quẹt\nCanh mọc bò nấm tươi\nCơm tám\nXôi hoàng phố ruốc bỏng');
  const [trangMiengText, setTrangMiengText] = useState('Sữa chua');
  const [doUongText, setDoUongText] = useState('Rượu ta + Rượu vang + Bia + Nước ngọt + Nước lọc');
  const [footerText, setFooterText] = useState('Chúc Quý Khách Ngon Miệng!');

  // Camera & Quick Input Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteRawText, setPasteRawText] = useState('');
  
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const menuPreviewRef = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (isOpen && leadId) {
      fetchMenuData();
    }
  }, [isOpen, leadId]);

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/table-menu?leadId=${leadId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.brideGroomNames) setBrideGroomNames(data.brideGroomNames);
        if (data.eventDate) setEventDate(data.eventDate);
        if (Array.isArray(data.khaiVi)) setKhaiViText(data.khaiVi.join('\n'));
        if (Array.isArray(data.monChinh)) setMonChinhText(data.monChinh.join('\n'));
        if (Array.isArray(data.trangMieng)) setTrangMiengText(data.trangMieng.join('\n'));
        if (Array.isArray(data.doUong)) setDoUongText(data.doUong.join('\n'));
        if (data.footerText) setFooterText(data.footerText);
      }
    } catch (err) {
      console.error('Error fetching table menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMenu = async () => {
    setSaving(true);
    try {
      const payload = {
        leadId,
        title,
        brideGroomNames,
        eventDate,
        khaiVi: khaiViText.split('\n').map(s => s.trim()).filter(Boolean),
        monChinh: monChinhText.split('\n').map(s => s.trim()).filter(Boolean),
        trangMieng: trangMiengText.split('\n').map(s => s.trim()).filter(Boolean),
        doUong: doUongText.split('\n').map(s => s.trim()).filter(Boolean),
        footerText
      };

      const res = await fetch('/api/admin/table-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('✅ Đã lưu cấu hình Menu tiệc thành công!');
      } else {
        showToast('❌ Lỗi khi lưu thực đơn', true);
      }
    } catch (err) {
      console.error('Error saving menu:', err);
      showToast('❌ Đã xảy ra lỗi khi kết nối', true);
    } finally {
      setSaving(false);
    }
  };

  const handleImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      sendImageToAI(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const sendImageToAI = async (base64Image) => {
    setAiParsing(true);
    try {
      const res = await fetch('/api/admin/table-menu/parse-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.khaiVi?.length) setKhaiViText(data.khaiVi.join('\n'));
        if (data.monChinh?.length) setMonChinhText(data.monChinh.join('\n'));
        if (data.trangMieng?.length) setTrangMiengText(data.trangMieng.join('\n'));
        if (data.doUong?.length) setDoUongText(data.doUong.join('\n'));
        showToast('✨ AI đã quét & tự động phân loại thực đơn thành công!');
      } else {
        showToast(data.error || 'Không thể phân tích ảnh tự động', true);
      }
    } catch (err) {
      console.error('Error parsing image:', err);
      showToast('❌ Đã xảy ra lỗi khi gửi ảnh cho AI', true);
    } finally {
      setAiParsing(false);
    }
  };

  const handleParseRawText = async () => {
    if (!pasteRawText.trim()) return;
    setAiParsing(true);
    try {
      const res = await fetch('/api/admin/table-menu/parse-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: pasteRawText })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.khaiVi?.length) setKhaiViText(data.khaiVi.join('\n'));
        if (data.monChinh?.length) setMonChinhText(data.monChinh.join('\n'));
        if (data.trangMieng?.length) setTrangMiengText(data.trangMieng.join('\n'));
        if (data.doUong?.length) setDoUongText(data.doUong.join('\n'));
        setIsPasteModalOpen(false);
        setPasteRawText('');
        showToast('✨ Đã tự động phân loại các món từ văn bản!');
      }
    } catch (err) {
      showToast('❌ Lỗi phân loại văn bản', true);
    } finally {
      setAiParsing(false);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      showToast('❌ Không thể mở Camera thiết bị', true);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    sendImageToAI(base64);
  };

  const handleExportPNG = async () => {
    if (!menuPreviewRef.current) return;
    try {
      showToast('🖼️ Đang tạo ảnh Menu chất lượng cao...');
      const dataUrl = await toPng(menuPreviewRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Menu-Tiec-De-Ban-${brideGroomNames.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      showToast('✅ Đã tải ảnh Menu thành công!');
    } catch (err) {
      console.error('Export PNG Error:', err);
      showToast('❌ Lỗi khi xuất file ảnh', true);
    }
  };

  // Exclusively print A4 menu card
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const khaiViList = khaiViText.split('\n').map(s => s.trim()).filter(Boolean);
  const monChinhList = monChinhText.split('\n').map(s => s.trim()).filter(Boolean);
  const trangMiengList = trangMiengText.split('\n').map(s => s.trim()).filter(Boolean);
  const doUongList = doUongText.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-1 sm:p-4 overflow-y-auto">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-60 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce transition-all ${
          toastMessage.isError ? 'bg-rose-600 text-white' : 'bg-amber-400 text-amber-950 border border-amber-500'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Dialog Container */}
      <div className="bg-stone-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl w-full max-w-7xl h-[98vh] sm:h-auto max-h-[98vh] flex flex-col shadow-2xl text-amber-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/90 shrink-0">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <span className="material-symbols-outlined text-lg sm:text-xl">restaurant_menu</span>
            </div>
            <div className="truncate">
              <h2 className="text-sm sm:text-lg font-bold text-amber-200 font-playfair truncate flex items-center gap-2">
                <span>Thiết Kế Menu Tiệc Cưới Chuẩn A4</span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded hidden sm:inline-block">Golden Palace</span>
              </h2>
              <p className="text-[10px] sm:text-xs text-stone-400 truncate">{brideGroomNames}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleSaveMenu}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">save</span>
              <span className="hidden sm:inline">{saving ? 'Đang lưu...' : 'Lưu Thực Đơn'}</span>
              <span className="sm:hidden">{saving ? 'Lưu...' : 'Lưu'}</span>
            </button>

            <button
              onClick={handleExportPNG}
              className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Tải ảnh PNG"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">download</span>
              <span className="hidden sm:inline">Tải PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md"
              title="In riêng tờ menu tiệc khổ A4"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">print</span>
              <span>In Tờ Menu (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">close</span>
            </button>
          </div>
        </div>

        {/* MOBILE VIEW SWITCH TABS */}
        <div className="flex lg:hidden bg-stone-950 border-b border-stone-800 p-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            <span>1. Nhập & AI Phân Loại</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm">preview</span>
            <span>2. Xem Bản In Tờ Menu</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
          
          {/* LEFT COLUMN: EDITOR & AI */}
          <div className={`lg:col-span-5 p-4 sm:p-5 space-y-4 bg-stone-900/90 overflow-y-auto ${
            activeTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}>
            
            {/* AI TOOLBAR */}
            <div className="bg-gradient-to-r from-amber-950/40 via-stone-800 to-amber-950/40 border border-amber-500/40 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <span>🤖</span> AI Quét Ảnh & Tự Phân Loại
                </span>
                {aiParsing && (
                  <span className="text-[10px] text-amber-400 font-medium animate-pulse">Đang đọc...</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={startCamera}
                  disabled={aiParsing}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                  <span>Chụp Ảnh</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={aiParsing}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>Tải Ảnh</span>
                </button>

                <button
                  onClick={() => setIsPasteModalOpen(true)}
                  disabled={aiParsing}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">content_paste</span>
                  <span>Dán Chữ</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* PARTY INFO */}
            <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800 space-y-2.5">
              <h3 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span> Thông Tin Tiệc Cưới
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[9px] uppercase font-bold text-stone-400 block mb-0.5">Loại Tiệc</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-100 font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="Lễ Thành Hôn">Lễ Thành Hôn</option>
                    <option value="Lễ Vu Quy">Lễ Vu Quy</option>
                    <option value="Lễ Báo Hỷ">Lễ Báo Hỷ</option>
                    <option value="Tiệc Cưới">Tiệc Cưới</option>
                    <option value="Tiệc Kỷ Niệm">Tiệc Kỷ Niệm</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-stone-400 block mb-0.5">Ngày Tổ Chức</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="VD: 02/08/2026"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-100 font-semibold outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-stone-400 block mb-0.5">Tên Cô Dâu & Chú Rể</label>
                <input
                  type="text"
                  value={brideGroomNames}
                  onChange={(e) => setBrideGroomNames(e.target.value)}
                  placeholder="VD: Minh Quang & Thu Hiền"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-200 font-bold outline-none focus:border-amber-500 font-script text-base"
                />
              </div>
            </div>

            {/* DISH INPUTS */}
            <div className="space-y-3">
              {/* Khai vị */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>🥗 Khai Vị ({khaiViList.length} món)</span>
                </label>
                <textarea
                  rows={2}
                  value={khaiViText}
                  onChange={(e) => setKhaiViText(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
                />
              </div>

              {/* Món chính */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>🍲 Món Chính ({monChinhList.length} món)</span>
                </label>
                <textarea
                  rows={5}
                  value={monChinhText}
                  onChange={(e) => setMonChinhText(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
                />
              </div>

              {/* Tráng miệng */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>🍨 Tráng Miệng ({trangMiengList.length} món)</span>
                </label>
                <textarea
                  rows={2}
                  value={trangMiengText}
                  onChange={(e) => setTrangMiengText(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
                />
              </div>

              {/* Đồ uống */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>🍷 Đồ Uống</span>
                </label>
                <textarea
                  rows={2}
                  value={doUongText}
                  onChange={(e) => setDoUongText(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
                />
              </div>

              {/* Lời chúc */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-300 block">Lời Chúc Chân Trang</label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500 font-serif italic text-center"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveTab('preview')}
              className="lg:hidden w-full py-3 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              <span>Xem Bản In Tờ Menu Của Tiệc Này</span>
            </button>

          </div>

          {/* RIGHT COLUMN: 1-TO-1 EXACT REPLICA OF ORIGINAL MENU PHOTO */}
          <div className={`lg:col-span-7 p-3 sm:p-6 bg-stone-950 flex flex-col items-center justify-start overflow-x-auto ${
            activeTab === 'preview' ? 'block' : 'hidden lg:flex'
          }`}>
            
            <div className="w-full flex justify-between items-center mb-3 max-w-[840px] px-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">preview</span> Bản Thiết Kế Y Hệt Menu Gốc (Khổ In A4)
              </span>
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-amber-500 text-stone-950 text-[11px] font-bold rounded-lg shadow-md flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span> In Tờ Menu (A4)
              </button>
            </div>

            {/* SCROLLABLE CANVAS WRAPPER */}
            <div id="printable-wedding-menu-container" className="w-full overflow-x-auto pb-4 flex justify-start lg:justify-center">
              <WeddingMenuCardCanvas
                title={title}
                brideGroomNames={brideGroomNames}
                eventDate={eventDate}
                khaiViList={khaiViList}
                monChinhList={monChinhList}
                trangMiengList={trangMiengList}
                doUongList={doUongList}
                footerText={footerText}
                menuPreviewRef={menuPreviewRef}
              />
            </div>

          </div>
        </div>

      </div>

      {/* CAMERA VIEWFINDER MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-70 bg-black/95 flex flex-col items-center justify-center p-3">
          <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-stone-800 flex justify-between items-center text-amber-200">
              <span className="text-xs font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-base">photo_camera</span> Chụp Ảnh Thực Đơn
              </span>
              <button onClick={stopCamera} className="text-stone-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="relative aspect-3/4 bg-black flex items-center justify-center overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            </div>

            <div className="p-3 flex items-center justify-center gap-3 bg-stone-950">
              <button onClick={stopCamera} className="px-3 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold">Hủy</button>
              <button onClick={capturePhoto} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                <span className="material-symbols-outlined text-base">camera</span> Chụp & Phân Loại AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK TEXT PASTE MODAL */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-70 bg-black/80 flex items-center justify-center p-3">
          <div className="w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-2xl p-4 space-y-3 text-amber-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800 pb-2">
              <h3 className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-base">content_paste</span> Dán Văn Bản Thực Đơn
              </h3>
              <button onClick={() => setIsPasteModalOpen(false)} className="text-stone-400 hover:text-white">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={pasteRawText}
              onChange={(e) => setPasteRawText(e.target.value)}
              placeholder={`Dán thực đơn ở đây...`}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-amber-500 font-serif"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setIsPasteModalOpen(false)} className="px-3 py-1.5 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold">Hủy</button>
              <button onClick={handleParseRawText} disabled={aiParsing || !pasteRawText.trim()} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
                {aiParsing ? 'Đang Phân Loại...' : 'Tự Phân Loại'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
