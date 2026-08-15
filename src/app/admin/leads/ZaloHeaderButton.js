'use client';

import { useState } from 'react';
import ZaloAutomationModal from '@/components/admin/ZaloAutomationModal';

export default function ZaloHeaderButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-md cursor-pointer whitespace-nowrap"
      >
        <span className="text-base">⚡</span>
        <span>Cấu Hình Tự Động Hóa Zalo Group</span>
      </button>

      <ZaloAutomationModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
