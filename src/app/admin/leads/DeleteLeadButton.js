'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteLeadButton({ leadId, leadName, isDetail = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsOpen(false);
        if (isDetail) {
          router.push('/admin/leads');
        } else {
          router.refresh();
        }
      } else {
        alert('❌ Không thể xóa tiệc cưới này');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert('❌ Đã xảy ra lỗi khi kết nối máy chủ');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          isDetail
            ? "w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            : "bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg transition-colors cursor-pointer"
        }
        title="Xóa thông tin tiệc này"
      >
        <span className="material-symbols-outlined text-base">delete</span>
        {isDetail && <span>Xóa Đơn Đặt Tiệc Này</span>}
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-70 bg-black/80 flex items-center justify-center p-3 text-stone-100">
          <div className="w-full max-w-sm bg-stone-900 border border-rose-500/40 rounded-2xl p-5 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-rose-300 uppercase">Xác Nhận Xóa Tiệc</h3>
              <p className="text-xs text-stone-300 mt-1">
                Bạn có chắc chắn muốn xóa vĩnh viễn đơn tiệc của <strong className="text-white">{leadName}</strong>?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xóa Vĩnh Viễn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
