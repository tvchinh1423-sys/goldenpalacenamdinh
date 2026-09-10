'use client';

import { useState } from 'react';
import TableMenuDesignerModal from '@/components/admin/TableMenuDesignerModal';

export default function LeadsTableQuickMenuButton({ leadId, leadName, brideGroomNames, eventDate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
        title="Tạo Menu tiệc để bàn cho tiệc này"
      >
        <span className="material-symbols-outlined text-sm">restaurant_menu</span>
        <span>Menu Tiệc</span>
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
