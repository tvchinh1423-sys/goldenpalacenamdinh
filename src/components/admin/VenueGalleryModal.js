'use client';
import { useState } from 'react';

// Helper to convert Google Drive share links into direct viewable image URLs
function parseImageUrl(inputUrl) {
  if (!inputUrl) return '';
  let url = inputUrl.trim();

  // If it's a Google Drive link, extract file ID
  // Examples:
  // - https://drive.google.com/file/d/1ABC123/view
  // - https://drive.google.com/open?id=1ABC123
  // - https://drive.google.com/uc?id=1ABC123
  const driveFileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                           url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                           url.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (driveFileIdMatch && driveFileIdMatch[1]) {
    const fileId = driveFileIdMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return url;
}

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
  const [draggedIdx, setDraggedIdx] = useState(null);

  if (!isOpen || !venue) return null;

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    const finalUrl = parseImageUrl(newUrl);
    setImages([...images, finalUrl]);
    setNewUrl('');
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  // Drag and Drop handlers for reordering images
  const handleDragStart = (idx) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    // Swap items
    const updated = [...images];
    const draggedItem = updated[draggedIdx];
    updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);
    
    setDraggedIdx(targetIdx);
    setImages(updated);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-montserrat">
      <div className="bg-white border border-gray-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center border-b border-gray-800">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#e3a638] font-bold">Quản lý thư viện ảnh Admin</span>
            <h3 className="text-2xl font-playfair font-bold text-white mt-1">{venue.name}</h3>
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
          <form onSubmit={handleAddImage} className="space-y-2">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="Dán đường dẫn ảnh hoặc Link Google Drive (ví dụ: https://drive.google.com/file/d/...)..." 
                className="flex-grow border border-gray-300 rounded-xl p-3 text-xs font-medium focus:border-[#e3a638] focus:outline-none shadow-inner"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-md"
              >
                <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                Thêm Ảnh
              </button>
            </div>
            <p className="text-[11px] text-amber-800/80 font-light flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#e3a638]">info</span>
              Hỗ trợ nhập <strong>Link Google Drive</strong> (tự động chuyển đổi trực tiếp) hoặc đường dẫn ảnh nội bộ (`/images/...`).
            </p>
          </form>

          {/* Photo Grid with Drag and Drop Reordering */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#e3a638]">drag_indicator</span>
                Danh sách ảnh hiện tại ({images.length} ảnh) - Kéo thả để đổi thứ tự
              </h4>
              <span className="text-[11px] text-gray-500 font-light">Giữ chuột và kéo vị trí ảnh để sắp xếp thứ tự hiển thị</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`group relative h-40 rounded-xl overflow-hidden border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    draggedIdx === idx 
                      ? 'ring-4 ring-[#e3a638] scale-105 z-10 opacity-75 shadow-2xl' 
                      : 'border-gray-200 shadow-md bg-gray-100 hover:border-[#e3a638]'
                  }`}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Photo ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" 
                    onError={(e) => {
                      e.target.src = '/images/hd-venues/tang-2-hd-1.jpg';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-between p-3">
                    <span className="text-[10px] text-amber-300 font-bold bg-black/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">drag_pan</span> Kéo để đổi vị trí
                    </span>
                    <button
                      onClick={() => handleDeleteImage(idx)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>

                  <span className="absolute bottom-2 left-2 bg-gray-900/90 text-amber-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-400/30">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              {images.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 text-xs font-light bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  Chưa có ảnh nào cho hội trường này. Hãy dán link Google Drive hoặc nhập đường dẫn ảnh mới bên trên.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-500 font-light">
            Nhấn "Lưu Thay Đổi" để cập nhật ngay bộ ảnh đã sắp xếp lên website công khai
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu Thay Đổi Thư Viện Ảnh'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
