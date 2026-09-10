'use client';

import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

export default function TableMenuDesignerModal({ leadId, leadName, brideGroomDefault, eventDateDefault, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiParsing, setAiParsing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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

  // Auto toast clear
  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch saved table menu data when modal opens
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

  // Save menu to database
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

  // Handle Image Upload & AI Auto-Classification
  const handleImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const processImageFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      sendImageToAI(base64);
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

  // Quick Text Paste Classification
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

  // Camera Handling
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

  // Export to PNG Image
  const handleExportPNG = async () => {
    if (!menuPreviewRef.current) return;
    try {
      showToast('🖼️ Đang tạo ảnh Menu chất lượng cao...');
      const dataUrl = await toPng(menuPreviewRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Menu-Tiec-De-Ban-${brideGroomNames.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      showToast('✅ Đã tải ảnh Menu về máy thành công!');
    } catch (err) {
      console.error('Export PNG Error:', err);
      showToast('❌ Lỗi khi xuất file ảnh', true);
    }
  };

  // Print Menu
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const khaiViList = khaiViText.split('\n').map(s => s.trim()).filter(Boolean);
  const monChinhList = monChinhText.split('\n').map(s => s.trim()).filter(Boolean);
  const trangMiengList = trangMiengText.split('\n').map(s => s.trim()).filter(Boolean);
  const doUongList = doUongText.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      {/* Toast alert */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-60 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce transition-all ${
          toastMessage.isError ? 'bg-rose-600 text-white' : 'bg-amber-400 text-amber-950 border border-amber-500'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Dialog Container */}
      <div className="bg-stone-900 border border-amber-500/30 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl text-amber-100 overflow-hidden">
        
        {/* Modal Header Bar */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-xl">restaurant_menu</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-200 font-playfair flex items-center gap-2">
                Tạo Menu Tiệc Để Bàn
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md">Golden Palace</span>
              </h2>
              <p className="text-xs text-stone-400">Thiết kế & Tự động phân loại món ăn cho tiệc cưới ({brideGroomNames})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveMenu}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">save</span>
              {saving ? 'Đang lưu...' : 'Lưu Thực Đơn'}
            </button>

            <button
              onClick={handleExportPNG}
              className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span> Tải Ảnh PNG
            </button>

            <button
              onClick={handlePrint}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hidden sm:flex"
            >
              <span className="material-symbols-outlined text-base">print</span> In Menu
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content (2 Columns) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
          
          {/* LEFT COLUMN: EDITOR & AI BUTTONS (5 cols) */}
          <div className="lg:col-span-5 p-5 space-y-5 bg-stone-900/90 overflow-y-auto">
            
            {/* AI AUTO CLASSIFICATION TOOLBAR */}
            <div className="bg-gradient-to-r from-amber-950/40 via-stone-800 to-amber-950/40 border border-amber-500/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-base">🤖</span> AI Tự Động Phân Loại Thực Đơn
                </span>
                {aiParsing && (
                  <span className="text-[11px] text-amber-400 font-medium animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> Đang phân tích...
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Chụp ảnh thực đơn hoặc tải ảnh lên — AI sẽ đọc chữ và tự sắp xếp vào 4 mục <b>Khai vị, Món chính, Tráng miệng, Đồ uống</b>.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Camera Capture */}
                <button
                  onClick={startCamera}
                  disabled={aiParsing}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                  <span>Chụp Ảnh</span>
                </button>

                {/* File Upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={aiParsing}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">upload_file</span>
                  <span>Tải Ảnh Lên</span>
                </button>

                {/* Text Paste */}
                <button
                  onClick={() => setIsPasteModalOpen(true)}
                  disabled={aiParsing}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">content_paste</span>
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

            {/* PARTY INFORMATION FIELDS */}
            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">info</span> Thông Tin Tiệc Cưới
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Loại Tiệc</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-amber-100 font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="Lễ Thành Hôn">Lễ Thành Hôn</option>
                    <option value="Lễ Vu Quy">Lễ Vu Quy</option>
                    <option value="Lễ Báo Hỷ">Lễ Báo Hỷ</option>
                    <option value="Tiệc Cưới">Tiệc Cưới</option>
                    <option value="Tiệc Kỷ Niệm">Tiệc Kỷ Niệm</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Ngày Tổ Chức</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="VD: 02/08/2026"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-amber-100 font-semibold outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Tên Cô Dâu & Chú Rể</label>
                <input
                  type="text"
                  value={brideGroomNames}
                  onChange={(e) => setBrideGroomNames(e.target.value)}
                  placeholder="VD: Minh Quang & Thu Hiền"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold outline-none focus:border-amber-500 font-script text-base"
                />
              </div>
            </div>

            {/* DISH CATEGORIES INPUTS */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">format_list_bulleted</span> Danh Sách Món Ăn (Mỗi món 1 dòng)
                </span>
              </h3>

              {/* 1. Khai vị */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-200 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-300">🥗 Khai Vị ({khaiViList.length} món)</span>
                </label>
                <textarea
                  rows={2}
                  value={khaiViText}
                  onChange={(e) => setKhaiViText(e.target.value)}
                  placeholder="Nhập món khai vị..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
                />
              </div>

              {/* 2. Món chính */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-200 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-300">🍲 Món Chính ({monChinhList.length} món)</span>
                </label>
                <textarea
                  rows={6}
                  value={monChinhText}
                  onChange={(e) => setMonChinhText(e.target.value)}
                  placeholder="Nhập các món chính..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
                />
              </div>

              {/* 3. Tráng miệng */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-200 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-300">🍨 Tráng Miệng ({trangMiengList.length} món)</span>
                </label>
                <textarea
                  rows={2}
                  value={trangMiengText}
                  onChange={(e) => setTrangMiengText(e.target.value)}
                  placeholder="Nhập món tráng miệng..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
                />
              </div>

              {/* 4. Đồ uống */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-200 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-300">🍷 Đồ Uống</span>
                </label>
                <textarea
                  rows={2}
                  value={doUongText}
                  onChange={(e) => setDoUongText(e.target.value)}
                  placeholder="Nhập danh mục đồ uống..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
                />
              </div>

              {/* Lời chúc */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block">Lời Chúc Chân Trang</label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none focus:border-amber-500 font-serif italic text-center"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE MENU CARD CANVAS PREVIEW (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 bg-stone-950 flex flex-col items-center justify-center overflow-y-auto min-h-[500px]">
            
            <div className="w-full flex justify-between items-center mb-3 max-w-[840px]">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">preview</span> Bản Xem Trước Menu Để Bàn (Khổ Đôi)
              </span>
              <span className="text-[10px] text-stone-400 italic">Khổ gập 2 mặt chuẩn in Golden Palace</span>
            </div>

            {/* PRINT & RENDERING CONTAINER */}
            <div
              ref={menuPreviewRef}
              id="printable-wedding-menu"
              className="bg-[#faf7f2] text-stone-900 w-full max-w-[860px] min-h-[560px] rounded-lg shadow-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 relative select-none border border-stone-300"
              style={{
                fontFamily: `'Cormorant Garamond', 'Playfair Display', Georgia, serif`,
                backgroundImage: `radial-gradient(#e8e0d0 0.7px, transparent 0.7px)`,
                backgroundSize: '16px 16px'
              }}
            >
              {/* Fold line separator in center */}
              <div className="hidden sm:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-stone-300/80 border-r border-dashed border-stone-400/50 -ml-[0.5px]"></div>

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* PAGE 1 (LEFT SIDE): MENU DISHES CONTENT PAGE */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <div className="flex-1 border-2 border-stone-800 p-5 rounded-sm relative flex flex-col justify-between text-center bg-[#fdfbf7]/90 shadow-xs">
                
                {/* VINTAGE CORNER BORDER ORNAMENTS */}
                {/* Top-Left Corner Floral SVG */}
                <svg className="absolute top-1.5 left-1.5 w-10 h-10 text-stone-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10 40 V 10 H 40" />
                  <path d="M15 35 V 15 H 35" />
                  <circle cx="22" cy="22" r="4" fill="currentColor" />
                  <path d="M22 26 C 28 35 35 28 45 35" />
                  <path d="M26 22 C 35 28 28 35 35 45" />
                </svg>
                {/* Top-Right Corner Floral SVG */}
                <svg className="absolute top-1.5 right-1.5 w-10 h-10 text-stone-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M90 40 V 10 H 60" />
                  <path d="M85 35 V 15 H 65" />
                  <circle cx="78" cy="22" r="4" fill="currentColor" />
                  <path d="M78 26 C 72 35 65 28 55 35" />
                  <path d="M74 22 C 65 28 72 35 65 45" />
                </svg>
                {/* Bottom-Left Corner Floral SVG */}
                <svg className="absolute bottom-1.5 left-1.5 w-10 h-10 text-stone-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10 60 V 90 H 40" />
                  <path d="M15 65 V 85 H 35" />
                  <circle cx="22" cy="78" r="4" fill="currentColor" />
                </svg>
                {/* Bottom-Right Corner Floral SVG */}
                <svg className="absolute bottom-1.5 right-1.5 w-10 h-10 text-stone-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M90 60 V 90 H 60" />
                  <path d="M85 65 V 85 H 65" />
                  <circle cx="78" cy="78" r="4" fill="currentColor" />
                </svg>

                <div className="space-y-3.5 my-auto px-2 py-2">
                  
                  {/* 1. KHAI VỊ */}
                  {khaiViList.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="font-script text-2xl font-bold text-stone-900 tracking-wide">Khai vị</h3>
                      <div className="space-y-0.5 text-[12px] sm:text-[13px] font-serif text-stone-800 font-medium leading-tight">
                        {khaiViList.map((item, idx) => (
                          <p key={idx}>{item}</p>
                        ))}
                      </div>
                      
                      {/* Flourish Divider */}
                      <div className="flex items-center justify-center my-1.5 text-stone-600">
                        <svg className="w-20 h-3 fill-current" viewBox="0 0 100 20">
                          <path d="M0 10 Q 25 0, 50 10 Q 75 20, 100 10 Q 75 0, 50 10 Q 25 20, 0 10 Z" />
                          <circle cx="50" cy="10" r="3" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* 2. MÓN CHÍNH */}
                  {monChinhList.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="font-script text-2xl font-bold text-stone-900 tracking-wide">Món chính</h3>
                      <div className="space-y-0.5 text-[12px] sm:text-[13px] font-serif text-stone-800 font-medium leading-tight">
                        {monChinhList.map((item, idx) => (
                          <p key={idx}>{item}</p>
                        ))}
                      </div>

                      {/* Flourish Divider */}
                      <div className="flex items-center justify-center my-1.5 text-stone-600">
                        <svg className="w-20 h-3 fill-current" viewBox="0 0 100 20">
                          <path d="M0 10 Q 25 0, 50 10 Q 75 20, 100 10 Q 75 0, 50 10 Q 25 20, 0 10 Z" />
                          <circle cx="50" cy="10" r="3" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* 3. TRÁNG MIỆNG */}
                  {trangMiengList.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="font-script text-2xl font-bold text-stone-900 tracking-wide">Tráng miệng</h3>
                      <div className="space-y-0.5 text-[12px] sm:text-[13px] font-serif text-stone-800 font-medium leading-tight">
                        {trangMiengList.map((item, idx) => (
                          <p key={idx}>{item}</p>
                        ))}
                      </div>

                      {/* Flourish Divider */}
                      <div className="flex items-center justify-center my-1.5 text-stone-600">
                        <svg className="w-20 h-3 fill-current" viewBox="0 0 100 20">
                          <path d="M0 10 Q 25 0, 50 10 Q 75 20, 100 10 Q 75 0, 50 10 Q 25 20, 0 10 Z" />
                          <circle cx="50" cy="10" r="3" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* 4. ĐỒ UỐNG */}
                  {doUongList.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="font-script text-2xl font-bold text-stone-900 tracking-wide">Đồ uống</h3>
                      <div className="space-y-0.5 text-[12px] sm:text-[13px] font-serif text-stone-800 font-medium leading-tight">
                        {doUongList.map((item, idx) => (
                          <p key={idx}>{item}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* FOOTER BLESSING */}
                <div className="pt-2 pb-1">
                  <p className="font-serif text-sm font-bold italic text-stone-900 tracking-wide">
                    {footerText}
                  </p>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* PAGE 2 (RIGHT SIDE): COVER PAGE */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <div className="flex-1 border-2 border-stone-800 p-6 rounded-sm relative flex flex-col justify-between text-center bg-[#fdfbf7]/90 shadow-xs">
                
                {/* Ornate Leaf Top Corners */}
                <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none">
                  {/* Left Leaf Garland SVG */}
                  <svg className="w-16 h-16 text-stone-800 opacity-90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 10 Q 40 10 50 40 Q 30 50 10 10 Z" fill="currentColor" fillOpacity="0.08" />
                    <path d="M5 5 C 30 15 20 45 45 45" />
                    <circle cx="25" cy="15" r="2.5" fill="currentColor" />
                    <circle cx="15" cy="25" r="2.5" fill="currentColor" />
                    <circle cx="35" cy="30" r="2" fill="currentColor" />
                  </svg>
                  {/* Right Leaf Garland SVG */}
                  <svg className="w-16 h-16 text-stone-800 opacity-90 scale-x-[-1]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 10 Q 40 10 50 40 Q 30 50 10 10 Z" fill="currentColor" fillOpacity="0.08" />
                    <path d="M5 5 C 30 15 20 45 45 45" />
                    <circle cx="25" cy="15" r="2.5" fill="currentColor" />
                    <circle cx="15" cy="25" r="2.5" fill="currentColor" />
                  </svg>
                </div>

                {/* Bottom Corners */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between pointer-events-none">
                  <svg className="w-10 h-10 text-stone-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 90 V 60 H 40" />
                  </svg>
                  <svg className="w-10 h-10 text-stone-800 scale-x-[-1]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 90 V 60 H 40" />
                  </svg>
                </div>

                {/* LOGO BADGE */}
                <div className="pt-6 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-stone-800 flex items-center justify-center p-1 bg-stone-900 text-amber-400 shadow-md">
                    <div className="w-full h-full rounded-full border border-amber-400/40 flex items-center justify-center font-bold font-playfair text-xl tracking-tighter">
                      GP
                    </div>
                  </div>
                </div>

                {/* COVER TITLES */}
                <div className="my-auto space-y-4 py-4">
                  <h1 className="text-xl sm:text-2xl font-serif tracking-[0.2em] font-semibold text-stone-900 uppercase border-b border-stone-300 pb-2 mx-6">
                    WEDDING MENU
                  </h1>

                  <div className="space-y-1">
                    <p className="font-script text-2xl sm:text-3xl text-stone-800 font-semibold">{title}</p>
                    <h2 className="font-script text-3xl sm:text-4xl text-stone-900 font-bold px-2 py-1 leading-snug">
                      {brideGroomNames}
                    </h2>
                  </div>

                  <div className="pt-2">
                    <span className="inline-block border-t border-b border-stone-800 px-6 py-1 font-serif text-sm sm:text-base font-bold text-stone-900 tracking-wider">
                      {eventDate}
                    </span>
                  </div>
                </div>

                {/* FOOTER HOTEL DETAILS */}
                <div className="pb-4 pt-2 px-2 text-[10px] sm:text-[11px] font-serif text-stone-700 leading-tight border-t border-stone-300/80 mx-4">
                  <p className="font-bold text-stone-900">Trung tâm Hội nghị, Tiệc cưới & Nhà hàng Golden Palace</p>
                  <p className="italic text-stone-700">Số 98 Đông A, Phường Nam Định, Tỉnh Ninh Bình</p>
                  <p className="font-medium text-stone-800">Mọi chi tiết liên hệ: 02286595959</p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CAMERA VIEWFINDER MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-70 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-stone-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-stone-800 flex justify-between items-center text-amber-200">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined">photo_camera</span> Chụp Ảnh Thực Đơn Để Bàn
              </span>
              <button onClick={stopCamera} className="text-stone-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="relative aspect-3/4 bg-black flex items-center justify-center overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
              <div className="absolute inset-8 border-2 border-dashed border-amber-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] text-amber-300/80 bg-stone-950/70 px-3 py-1 rounded-full">Canh thực đơn vào ô vuông</span>
              </div>
            </div>

            <div className="p-4 flex items-center justify-center gap-4 bg-stone-950">
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={capturePhoto}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">camera</span> Chụp & Phân Loại AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK TEXT PASTE MODAL */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-70 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 text-amber-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined">content_paste</span> Dán Văn Bản Thực Đơn Tự Động
              </h3>
              <button onClick={() => setIsPasteModalOpen(false)} className="text-stone-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-stone-300">Dán danh sách món ăn vào ô bên dưới, hệ thống sẽ tự sắp xếp vào Khai vị, Món chính, Tráng miệng và Đồ uống:</p>

            <textarea
              rows={8}
              value={pasteRawText}
              onChange={(e) => setPasteRawText(e.target.value)}
              placeholder={`Dán thực đơn mẫu ở đây, ví dụ:\n\nSúp nấm đông trùng hạ thảo\nSalad trứng cá hồi\nCá hồi áp chảo sốt chanh leo\nTôm hùm chiên bơ tỏi\nBò hầm vang\nSữa chua\nRượu ta + Bia`}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed font-serif"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleParseRawText}
                disabled={aiParsing || !pasteRawText.trim()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {aiParsing ? 'Đang Phân Loại...' : 'Tự Động Phân Loại'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
