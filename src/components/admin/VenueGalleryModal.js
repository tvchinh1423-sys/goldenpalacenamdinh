'use client';
import { useState } from 'react';

export default function VenueGalleryModal({ venue, isOpen, onClose, onSave }) {
  const [images, setImages] = useState(() => {
    try {
      return JSON.parse(venue?.images || '[]');
    } catch (e) {
      return [];
    }
  });
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !venue) return null;

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setImages([...images, newUrl.trim()]);
    setNewUrl('');
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/venues/${venue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: JSON.stringify(images)
        })
      });
      if (res.ok) {
        onSave(images);
        onClose();
      } else {
        alert('Cập nhật bộ ảnh thất bại');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-montserrat">
      <div className="bg-white border border-gray-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center border-b border-gray-800">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#e3a638] font-semibold">Quản lý thư viện ảnh Admin</span>
            <h3 className="text-2xl font-playfair font-semibold text-white mt-1">{venue.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          
          {/* Add Image Form */}
          <form onSubmit={handleAddImage} className="flex gap-3">
            <input 
              type="text" 
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="Nhập đường dẫn ảnh mới (ví dụ: /images/hd-venues/tang-2-hd-1.jpg)..." 
              className="flex-grow border border-gray-300 rounded-lg p-3 text-xs font-medium focus:border-[#e3a638] focus:outline-none"
            />
            <button 
              type="submit"
              className="bg-gray-900 text-amber-300 px-5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">add_photo_alternate</span>
              Thêm Ảnh
            </button>
          </form>

          {/* Photo Grid */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Danh sách ảnh hiện tại ({images.length} ảnh)
              </h4>
              <span className="text-[11px] text-gray-500 font-light">Chỉnh sửa, lọc và xóa ảnh trực tiếp tại đây</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="group relative h-40 rounded-xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
                  <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDeleteImage(idx)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>

                  <span className="absolute bottom-2 left-2 bg-black/70 text-white font-mono text-[10px] px-2 py-0.5 rounded-full">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              {images.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 text-xs font-light">
                  Chưa có ảnh nào cho hội trường này. Hãy thêm đường dẫn ảnh mới bên trên.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-500 font-light">
            Lưu thay đổi để cập nhật bộ ảnh lên toàn bộ giao diện công khai
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu Thay Đổi Thư Viện Ảnh'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
