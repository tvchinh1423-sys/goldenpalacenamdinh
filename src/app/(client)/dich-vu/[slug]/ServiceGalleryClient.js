'use client';
import { useState } from 'react';
import ImageGalleryModal from '@/components/ui/ImageGalleryModal';

export default function ServiceGalleryClient({ gallery = [], serviceName = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpenImage = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.map((imgUrl, gIdx) => (
          <div 
            key={gIdx} 
            onClick={() => handleOpenImage(gIdx)}
            className="group relative h-72 rounded-xl overflow-hidden shadow-lg border border-[#e3a638]/20 cursor-pointer font-montserrat"
          >
            <div 
              className="w-full h-full bg-cover bg-center group-hover:scale-108 transition-transform duration-700"
              style={{ backgroundImage: `url('${imgUrl}')` }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
              <div className="flex flex-col items-center gap-1.5 text-white">
                <span className="material-symbols-outlined text-3xl text-amber-300 drop-shadow-md">zoom_in</span>
                <span className="text-xs font-semibold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  Xem ảnh to #{gIdx + 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageGalleryModal
        images={gallery}
        initialIndex={selectedIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
