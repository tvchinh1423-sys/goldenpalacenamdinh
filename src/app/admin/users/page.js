'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [dbUsers, setDbUsers] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null for create, object for edit

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('STAFF');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete Confirm Modal
  const [deletingUser, setDeletingUser] = useState(null);

  const showToast = (text, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auth protection for non-admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.replace('/admin');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setDbUsers(data.dbUsers || []);
        setSystemUsers(data.systemUsers || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      showToast('❌ Lỗi khi nạp danh sách tài khoản', true);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('STAFF');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword(''); // Empty means don't change password
    setFormRole(user.role);
    setFormIsActive(user.isActive);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showToast('⚠️ Vui lòng nhập đầy đủ Tên và Tên đăng nhập/Email', true);
      return;
    }
    if (!editingUser && !formPassword.trim()) {
      showToast('⚠️ Vui lòng nhập mật khẩu cho tài khoản mới', true);
      return;
    }

    setFormSubmitting(true);
    try {
      const isEdit = !!editingUser;
      const url = isEdit ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        name: formName,
        email: formEmail,
        role: formRole,
        isActive: formIsActive,
      };
      if (formPassword.trim()) {
        payload.password = formPassword.trim();
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(isEdit ? '✅ Cập nhật tài khoản thành công!' : '🎉 Tạo tài khoản mới thành công!');
        setIsModalOpen(false);
        fetchUsers();
      } else {
        showToast(data.error || 'Có lỗi xảy ra', true);
      }
    } catch (err) {
      console.error('Save user error:', err);
      showToast('❌ Lỗi khi kết nối máy chủ', true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) {
        showToast(`✅ Đã ${!user.isActive ? 'mở khóa' : 'khóa'} tài khoản ${user.name}`);
        fetchUsers();
      } else {
        showToast('❌ Lỗi khi cập nhật trạng thái', true);
      }
    } catch (err) {
      showToast('❌ Đã xảy ra lỗi', true);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('✅ Đã xóa tài khoản thành công!');
        setDeletingUser(null);
        fetchUsers();
      } else {
        showToast('❌ Lỗi khi xóa tài khoản', true);
      }
    } catch (err) {
      showToast('❌ Lỗi kết nối máy chủ', true);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">ADMIN (Quản Trị Vụ)</span>;
      case 'STAFF':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">STAFF (Lễ Tân / Sale)</span>;
      case 'MEMBER':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">MEMBER (Kỹ Thuật Sân Khấu)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-700 text-stone-300">{role}</span>;
    }
  };

  return (
    <div className="space-y-6 text-stone-100 font-inter max-w-7xl mx-auto pb-10">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-60 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce transition-all ${
          toastMessage.isError ? 'bg-rose-600 text-white' : 'bg-amber-400 text-amber-950 border border-amber-500'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-stone-900 border border-amber-500/30 p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <span className="material-symbols-outlined text-2xl">manage_accounts</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-amber-200 font-playfair flex items-center gap-2">
              Quản Lý Tài Khoản Người Dùng
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded hidden sm:inline-block">Golden Palace</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">Phân quyền tài khoản Admin, Lễ Tân / Sale và Kỹ Thuật Sân Khấu</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>Thêm Tài Khoản Mới</span>
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Admin Quản Trị</span>
            <span className="text-lg font-bold text-amber-200">{1 + dbUsers.filter(u => u.role === 'ADMIN').length} tài khoản</span>
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-xl">support_agent</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Lễ Tân / Sale</span>
            <span className="text-lg font-bold text-blue-200">{1 + dbUsers.filter(u => u.role === 'STAFF').length} tài khoản</span>
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <span className="material-symbols-outlined text-xl">dvr</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Kỹ Thuật Sân Khấu</span>
            <span className="text-lg font-bold text-purple-200">{1 + dbUsers.filter(u => u.role === 'MEMBER').length} tài khoản</span>
          </div>
        </div>
      </div>

      {/* SYSTEM DEFAULT ACCOUNTS LIST */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">verified_user</span> Tài Khoản Cố Định Mặc Định Hệ Thống
          </h2>
          <span className="text-[10px] text-stone-400 font-mono">Đăng nhập nhanh</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {systemUsers.map(sysUser => (
            <div key={sysUser.id} className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-stone-200">{sysUser.name}</span>
                {getRoleBadge(sysUser.role)}
              </div>
              <div className="text-[11px] space-y-1 font-mono text-stone-400">
                <p><span className="text-stone-500">Tài khoản:</span> <strong className="text-amber-200">{sysUser.email}</strong></p>
                <p><span className="text-stone-500">Trạng thái:</span> <span className="text-emerald-400 font-bold">● Hoạt động</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC USER ACCOUNTS TABLE */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-stone-800 flex justify-between items-center bg-stone-950">
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">badge</span> Danh Sách Tài Khoản Nhân Viên Tạo Mới ({dbUsers.length})
          </h2>
          <button
            onClick={fetchUsers}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            title="Tải lại"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-stone-400 text-xs font-medium">
            <span className="material-symbols-outlined text-3xl animate-spin text-amber-500 block mb-2">sync</span>
            Đang nạp danh sách tài khoản...
          </div>
        ) : dbUsers.length === 0 ? (
          <div className="p-10 text-center text-stone-400 text-xs space-y-2">
            <span className="material-symbols-outlined text-4xl text-stone-600">no_accounts</span>
            <p>Chưa có tài khoản nhân viên phụ nào được tạo thêm.</p>
            <button onClick={openCreateModal} className="text-amber-400 font-bold hover:underline">
              + Thêm tài khoản mới ngay
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/70 border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">Họ & Tên Nhân Viên</th>
                  <th className="p-3.5">Tên Đăng Nhập / Email</th>
                  <th className="p-3.5">Vai Trò</th>
                  <th className="p-3.5">Trạng Thái</th>
                  <th className="p-3.5">Ngày Tạo</th>
                  <th className="p-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-medium">
                {dbUsers.map(user => (
                  <tr key={user.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center font-bold text-amber-300">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-stone-100">{user.name}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-amber-200">
                      {user.email}
                    </td>

                    <td className="p-3.5">
                      {getRoleBadge(user.role)}
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          user.isActive 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                      >
                        {user.isActive ? '● Hoạt động' : '🔒 Đã khóa'}
                      </button>
                    </td>

                    <td className="p-3.5 text-stone-400 text-[11px] font-mono">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 transition-colors cursor-pointer"
                          title="Chỉnh sửa tài khoản"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-rose-400 transition-colors cursor-pointer"
                          title="Xóa tài khoản"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-stone-900 border border-amber-500/40 rounded-2xl p-5 sm:p-6 space-y-4 text-stone-100 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-playfair">
                <span className="material-symbols-outlined text-xl">person_add</span>
                <span>{editingUser ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Nhân Viên Mới'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Họ và Tên Nhân Viên</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-100 font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Tên Đăng Nhập / Email</label>
                <input
                  type="text"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="VD: nhanvien1 hoac letan@goldenpalace.vn"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-100 font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Mật Khẩu {editingUser ? '(Bỏ trống nếu giữ nguyên)' : ''}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUser ? '•••••••• (Nhập mật khẩu mới nếu muốn đổi)' : 'Nhập mật khẩu'}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-100 font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Phân Quyền (Role)</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-200 font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="STAFF">STAFF (Lễ Tân / Sale)</option>
                    <option value="MEMBER">MEMBER (Kỹ Thuật Sân Khấu)</option>
                    <option value="ADMIN">ADMIN (Quản Trị Vụ)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Trạng Thái Khoản</label>
                  <select
                    value={formIsActive ? 'true' : 'false'}
                    onChange={(e) => setFormIsActive(e.target.value === 'true')}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-200 font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="true">● Hoạt Động (Active)</option>
                    <option value="false">🔒 Tạm Khóa (Locked)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {formSubmitting ? 'Đang lưu...' : (editingUser ? 'Cập Nhật' : 'Tạo Tài Khoản')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-70 bg-black/85 flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-stone-900 border border-rose-500/40 rounded-2xl p-5 space-y-4 text-stone-100 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-rose-300 uppercase">Xác Nhận Xóa Tài Khoản</h3>
              <p className="text-xs text-stone-300 mt-1">
                Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản <strong className="text-white">{deletingUser.name}</strong> ({deletingUser.email})?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                onClick={handleDeleteUser}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
