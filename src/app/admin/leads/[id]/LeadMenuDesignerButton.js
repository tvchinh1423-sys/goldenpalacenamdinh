'use client';

import { useState } from 'react';
import TableMenuDesignerModal from '@/components/admin/TableMenuDesignerModal';

export default function LeadMenuDesignerButton({ leadId, leadName, brideGroomNames, eventDate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/20 active:scale-[0.99]"
      >
        <span className="material-symbols-outlined text-lg">restaurant_menu</span>
        <span>🎴 Tạo & Thiết Kế Menu Tiệc Để Bàn</span>
      </button>

      <TableMenuDesignerModal
        leadId={leadId}
        leadName={leadName}
        brideGroomDefault={brideGroomNames}
        eventDateDefault={eventDate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
