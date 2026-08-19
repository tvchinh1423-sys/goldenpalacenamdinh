'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'CHUNG', label: 'Thông tin chung & Địa chỉ' },
  { id: 'SANH', label: 'Sảnh hội trường & Sức chứa' },
  { id: 'THUC_DON', label: 'Thực đơn & Đồ uống' },
  { id: 'DU_TOAN', label: 'Dự toán chi phí & Đặt cọc' },
  { id: 'DICH_VU', label: 'Dịch vụ nâng cao & Trang trí' },
  { id: 'TIEN_ICH', label: 'Tiện ích (Đỗ xe, Giờ mở cửa...)' }
];

export default function AiTrainingPage() {
  const [activeTab, setActiveTab] = useState('RULES'); // RULES | UNANSWERED | SYSTEM_CONFIG

  // State for Tab 1: Rules
  const [rules, setRules] = useState([]);
  const [loadingRules, setLoadingRules] = useState(true);
  const [ruleForm, setRuleForm] = useState({
    id: null,
    keywords: '',
    answer: '',
    category: 'CHUNG'
  });

  // State for Tab 2: Unanswered Questions
  const [unanswered, setUnanswered] = useState([]);
  const [loadingUnanswered, setLoadingUnanswered] = useState(true);

  // State for Tab 3: System Knowledge Config
  const [systemPrompt, setSystemPrompt] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Fetch All Data
  useEffect(() => {
    fetchRules();
    fetchUnanswered();
    fetchSystemConfig();
  }, []);

  const fetchRules = async () => {
    setLoadingRules(true);
    try {
      const res = await fetch('/api/admin/ai-rules');
      const data = await res.json();
      if (Array.isArray(data)) setRules(data);
    } catch (err) {
      console.error('Failed to fetch rules:', err);
    } finally {
      setLoadingRules(false);
    }
  };

  const fetchUnanswered = async () => {
    setLoadingUnanswered(true);
    try {
      const res = await fetch('/api/admin/ai-unanswered');
      const data = await res.json();
      if (Array.isArray(data)) setUnanswered(data);
    } catch (err) {
      console.error('Failed to fetch unanswered questions:', err);
    } finally {
      setLoadingUnanswered(false);
    }
  };

  const fetchSystemConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch('/api/admin/ai-config');
      const data = await res.json();
      if (data?.systemPrompt) setSystemPrompt(data.systemPrompt);
    } catch (err) {
      console.error('Failed to fetch system config:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  // Rule Form Submit
  const handleSaveRule = async (e) => {
    e.preventDefault();
    if (!ruleForm.keywords.trim() || !ruleForm.answer.trim()) return;

    try {
      const isEdit = Boolean(ruleForm.id);
      const res = await fetch('/api/admin/ai-rules', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleForm)
      });

      if (res.ok) {
        alert(isEdit ? '✅ Đã cập nhật quy tắc thành công!' : '✅ Đã thêm quy tắc Hỏi - Đáp mới!');
        setRuleForm({ id: null, keywords: '', answer: '', category: 'CHUNG' });
        fetchRules();
      } else {
        alert('Có lỗi xảy ra khi lưu quy tắc');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối máy chủ');
    }
  };

  const handleDeleteRule = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa quy tắc Hỏi - Đáp này?')) return;
    try {
      const res = await fetch(`/api/admin/ai-rules?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRules();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRuleActive = async (rule) => {
    try {
      await fetch('/api/admin/ai-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rule.id, isActive: !rule.isActive })
      });
      fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  // Convert Unanswered Question to Rule
  const handleAnswerUnanswered = (questionText) => {
    setActiveTab('RULES');
    setRuleForm({
      id: null,
      keywords: questionText,
      answer: `Dạ, về câu hỏi "${questionText}", em xin thông tin đến Quý khách như sau:\n\n`,
      category: 'CHUNG'
    });
  };

  const handleDeleteUnanswered = async (id) => {
    try {
      await fetch(`/api/admin/ai-unanswered?id=${id}`, { method: 'DELETE' });
      fetchUnanswered();
    } catch (err) {
      console.error(err);
    }
  };

  // Save System Prompt
  const handleSaveSystemConfig = async () => {
    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt })
      });
      if (res.ok) {
        alert('✅ Đã lưu cấu hình Tri thức & Prompt AI hệ thống!');
      } else {
        alert('Có lỗi xảy ra khi lưu cấu hình');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối máy chủ');
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#a66a3a] block mb-1">
            🤖 Trợ Lý AI Automation
          </span>
          <h2 className="text-xl font-bold text-gray-900">Huấn Luyện & Quản Lý Trợ Lý AI Chatbot</h2>
          <p className="text-xs text-gray-500 mt-1">
            Thiết lập câu trả lời mẫu "Nếu khách hỏi... thì trả lời...", xem nhật ký câu hỏi khách hàng và huấn luyện AI.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('RULES')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'RULES' ? 'bg-gray-900 text-amber-300 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💬 Quy Tắc Hỏi - Đáp ({rules.length})
          </button>
          <button
            onClick={() => setActiveTab('UNANSWERED')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'UNANSWERED' ? 'bg-gray-900 text-amber-300 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ❓ Câu Hỏi Khách ({unanswered.length})
            {unanswered.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-red-500 text-white rounded-full font-mono">
                {unanswered.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('SYSTEM_CONFIG')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'SYSTEM_CONFIG' ? 'bg-gray-900 text-amber-300 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🧠 Tri Thức Mặc Định AI
          </button>
        </div>
      </div>

      {/* TAB 1: QUY TẮC HỎI - ĐÁP MẪU */}
      {activeTab === 'RULES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* FORM THÊM / SỬA QUY TẮC */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-base">
                {ruleForm.id ? '✏️ Chỉnh Sửa Quy Tắc Hỏi - Đáp' : '➕ Thêm Quy Tắc Hỏi - Đáp Mới'}
              </h3>
              {ruleForm.id && (
                <button
                  onClick={() => setRuleForm({ id: null, keywords: '', answer: '', category: 'CHUNG' })}
                  className="text-xs text-red-600 hover:underline cursor-pointer"
                >
                  Hủy sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">
                  Nếu khách hỏi (Từ khóa kích hoạt) *
                </label>
                <input
                  type="text"
                  required
                  value={ruleForm.keywords}
                  onChange={e => setRuleForm({ ...ruleForm, keywords: e.target.value })}
                  placeholder="Ví dụ: đỗ xe, gửi xe, chỗ gửi xe ô tô (cách nhau bởi dấu phẩy)"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:border-[#e3a638] focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Nhập các từ khóa liên quan đến câu hỏi của khách hàng, phân cách bằng dấu phẩy.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">
                  Danh mục câu hỏi
                </label>
                <select
                  value={ruleForm.category}
                  onChange={e => setRuleForm({ ...ruleForm, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:border-[#e3a638] outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">
                  Thì AI sẽ trả lời (Câu trả lời mẫu chuẩn) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={ruleForm.answer}
                  onChange={e => setRuleForm({ ...ruleForm, answer: e.target.value })}
                  placeholder="Dạ Golden Palace có bãi đỗ xe ô tô và xe máy rộng rãi ngay trước khuôn viên nhà hàng hoàn toàn miễn phí ạ."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-xs font-medium focus:border-[#e3a638] focus:outline-none leading-relaxed"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Hỗ trợ định dạng đậm **chữ đậm**, link [tên link](/duong-dan)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                {ruleForm.id ? 'Cập Nhật Quy Tắc' : 'Lưu Quy Tắc Hỏi - Đáp'}
              </button>
            </form>
          </div>

          {/* DANH SÁCH QUY TẮC ĐÃ CÓ */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-base">Danh Sách Quy Tắc AI Đã Lưu</h3>
              <span className="text-xs text-gray-500">{rules.length} quy tắc kích hoạt</span>
            </div>

            {loadingRules ? (
              <p className="text-xs text-gray-400 py-10 text-center">Đang tải danh sách quy tắc...</p>
            ) : rules.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <span className="material-symbols-outlined text-4xl">quiz</span>
                <p className="text-xs">Chưa có quy tắc Hỏi - Đáp nào. Hãy thêm quy tắc đầu tiên ở bên trái!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {rules.map(rule => (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-xl border transition-all ${
                      rule.isActive ? 'bg-[#fcf9f2] border-amber-200/80' : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase bg-amber-100 text-[#a66a3a] px-2.5 py-0.5 rounded-full inline-block mb-1">
                          Khách hỏi: {rule.keywords}
                        </span>
                        <p className="text-xs text-gray-800 font-medium whitespace-pre-line leading-relaxed">
                          {rule.answer}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleRuleActive(rule)}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer ${
                            rule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {rule.isActive ? 'Bật' : 'Tắt'}
                        </button>
                        <button
                          onClick={() => setRuleForm({ id: rule.id, keywords: rule.keywords, answer: rule.answer, category: rule.category })}
                          className="p-1 text-gray-600 hover:text-amber-600 cursor-pointer"
                          title="Sửa quy tắc"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1 text-gray-600 hover:text-red-600 cursor-pointer"
                          title="Xóa quy tắc"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: CÂU HỎI KHÁCH CHƯA CÓ CÂU TRẢ LỜI */}
      {activeTab === 'UNANSWERED' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Nhật Ký Câu Hỏi Khách Hàng Chưa Trả Lời Được</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Hệ thống tự động ghi lại mỗi khi khách hàng hỏi câu hỏi mà AI chưa khớp quy tắc chuẩn.
              </p>
            </div>
            <span className="text-xs font-bold text-[#a66a3a] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {unanswered.length} câu hỏi cần giải đáp
            </span>
          </div>

          {loadingUnanswered ? (
            <p className="text-xs text-gray-400 py-10 text-center">Đang tải danh sách câu hỏi...</p>
          ) : unanswered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
              <p className="text-xs">Tuyệt vời! Hiện tại không có câu hỏi tồn đọng nào từ khách hàng.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-gray-900 text-amber-200 uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Câu Hỏi Thực Tế Của Khách</th>
                    <th className="p-3 text-center">Số Lần Hỏi</th>
                    <th className="p-3">Thời Gian Ghi Nhận</th>
                    <th className="p-3 text-right">Thao Tác Kịp Thời</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {unanswered.map(item => (
                    <tr key={item.id} className="hover:bg-amber-50/40">
                      <td className="p-3 font-semibold text-gray-900">"{item.question}"</td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-bold rounded-full text-[11px]">
                          {item.askCount} lần
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(item.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleAnswerUnanswered(item.question)}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-[11px] font-bold uppercase rounded-lg shadow-xs hover:opacity-90 cursor-pointer"
                        >
                          ⚡ Trả Lời & Thêm Vào AI Rule
                        </button>
                        <button
                          onClick={() => handleDeleteUnanswered(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                          title="Xóa dòng nhật ký này"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRI THỨC MẶC ĐỊNH & SYSTEM PROMPT */}
      {activeTab === 'SYSTEM_CONFIG' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Kiểm Tra & Chỉnh Sửa Tri Thức Mặc Định AI (System Prompt)</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Xem và chỉnh sửa toàn bộ quy tắc giao tiếp, địa chỉ, sức chứa sảnh và tri thức cốt lõi được nạp cho AI Chatbot.
              </p>
            </div>
            <button
              onClick={handleSaveSystemConfig}
              disabled={isSavingConfig}
              className="px-6 py-2.5 bg-gray-900 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSavingConfig ? 'Đang lưu...' : '💾 Lưu Tri Thức AI'}
            </button>
          </div>

          {loadingConfig ? (
            <p className="text-xs text-gray-400 py-10 text-center">Đang tải tri thức AI...</p>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700">Nội dung System Knowledge Prompt:</label>
              <textarea
                rows={22}
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                className="w-full bg-[#fcf9f2] border border-gray-300 rounded-2xl p-5 text-xs font-mono text-gray-900 leading-relaxed focus:border-[#e3a638] focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
