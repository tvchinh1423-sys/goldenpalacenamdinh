'use client';
import { useState, useEffect } from 'react';
import VenueGalleryModal from '@/components/admin/VenueGalleryModal';

export default function VenuesAdminPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function fetchVenues() {
    try {
      const res = await fetch('/api/admin/venues');
      if (res.ok) {
        const data = await res.json();
        setVenues(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVenues();
  }, []);

  const openGalleryModal = (venue) => {
    setSelectedVenue(venue);
    setModalOpen(true);
  };

  const handleSavedGallery = (updatedImages) => {
    setVenues(venues.map(v => {
      if (v.id === selectedVenue.id) {
        return { ...v, images: JSON.stringify(updatedImages) };
      }
      return v;
    }));
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  return (
    <div className="space-y-6 font-montserrat text-gray-900">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-playfair font-semibold text-gray-900">Quản lý Hội trường & Thư viện Ảnh</h2>
          <p className="text-gray-500 text-xs font-light mt-1">Xem, lọc và chỉnh sửa danh sách ảnh thực tế cho từng sảnh tiệc</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#e3a638]">progress_activity</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
          <table className="w-full text-left font-body-md text-sm">
            <thead className="bg-gray-900 text-amber-200 border-b border-gray-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold w-20">Ảnh nền</th>
                <th className="px-6 py-4 font-semibold">Tên hội trường</th>
                <th className="px-6 py-4 font-semibold">Số ảnh đã tải</th>
                <th className="px-6 py-4 font-semibold">Sức chứa tối đa</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Quản lý ảnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {venues.map(v => {
                let images = [];
                try {
                  images = JSON.parse(v.images || '[]');
                } catch(e) {}
                const thumbnail = images[0] || '/images/hd-venues/tang-2-hd-1.jpg';

                return (
                  <tr key={v.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <img src={thumbnail} alt={v.name} className="w-14 h-12 rounded-lg object-cover border border-gray-200 shadow-xs" />
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 font-playfair text-base">{v.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#a66a3a] font-semibold text-xs rounded-full">
                        <span className="material-symbols-outlined text-sm">photo_library</span>
                        {images.length} ảnh HD
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{v.maxGuests} khách</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        v.status === 'PUBLISHED' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {v.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openGalleryModal(v)}
                        className="bg-gray-900 text-amber-300 hover:bg-black px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <span className="material-symbols-outlined text-sm">collections</span>
                        Lọc & Quản lý Ảnh ({images.length})
                      </button>
                    </td>
                  </tr>
                );
              })}
              {venues.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 font-light">Không có dữ liệu hội trường</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Gallery Modal */}
      {selectedVenue && (
        <VenueGalleryModal
          venue={selectedVenue}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSavedGallery}
        />
      )}
    </div>
  );
}
