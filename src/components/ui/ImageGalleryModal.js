"use client";
import { useState, useEffect } from 'react';

export default function ImageGalleryModal({ images = [], initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between items-center p-4 sm:p-6 animate-in fade-in duration-200 select-none">
      
      {/* Top Header Controls */}
      <div className="w-full max-w-6xl flex justify-between items-center z-10 text-white pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-[#e3a638] text-gray-900 px-3 py-1 rounded-full shadow-md">
            Ảnh {currentIndex + 1} / {images.length}
          </span>
          <span className="text-xs text-gray-300 font-light hidden sm:inline-block">
            Sử dụng phím mũi tên ◄ ► để chuyển ảnh hoặc ESC để đóng
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          title="Đóng xem ảnh (ESC)"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      {/* Main Large Image Container */}
      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center py-4 my-auto">
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-black/60 border border-white/20 text-amber-300 hover:bg-black/90 hover:scale-110 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
            title="Ảnh trước (Phím trái ◄)"
          >
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>
        )}

        {/* Display Image */}
        <div className="relative max-h-[75vh] max-w-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-amber-400/30 bg-black/40">
          <img
            src={currentImg}
            alt={`Ảnh album ${currentIndex + 1}`}
            className="max-h-[75vh] max-w-full object-contain rounded-xl transition-all duration-300"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/60 border border-white/20 text-amber-300 hover:bg-black/90 hover:scale-110 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
            title="Ảnh tiếp theo (Phím phải ►)"
          >
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="w-full max-w-4xl flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 scrollbar-none z-10">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-14 w-20 rounded-lg overflow-hidden flex-shrink-0 transition-all cursor-pointer border-2 ${
                idx === currentIndex
                  ? 'border-[#e3a638] scale-105 shadow-lg shadow-amber-500/30 opacity-100'
                  : 'border-transparent opacity-40 hover:opacity-80'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
