'use client';

const DRINK_PRICES_ADMIN = [
  { stt: 1, name: 'Coca', unitPrice: '15.000/lon' },
  { stt: 2, name: 'Nước cam', unitPrice: '12.000/lon' },
  { stt: 3, name: '7 up', unitPrice: '12.000/lon' },
  { stt: 4, name: 'Bò húc', unitPrice: '18.000/lon' },
  { stt: 5, name: 'Rượu ngâm', unitPrice: '120.000/lít' },
  { stt: 6, name: 'Dasani', unitPrice: '10.000/chai' },
  { stt: 7, name: 'Vodka đen', unitPrice: '230.000/chai' },
  { stt: 8, name: 'Vodka xanh', unitPrice: '120.000/chai' },
  { stt: 9, name: 'Vodka men', unitPrice: '110.000/chai' },
  { stt: 10, name: 'Heineken', unitPrice: '30.000/chai' },
  { stt: 11, name: 'Sài gòn lùn', unitPrice: '20.000/chai' },
  { stt: 12, name: 'Tiger', unitPrice: '25.000/chai' },
  { stt: 13, name: 'Rượu mạnh', unitPrice: 'Liên hệ' },
  { stt: 14, name: 'Rượu vang', unitPrice: 'Liên hệ' }
];

const BRING_DRINK_FEES_ADMIN = [
  { item: 'Rượu ngâm', fee: '30.000/lít' },
  { item: 'Rượu vodka', fee: '70.000/chai' },
  { item: 'Rượu vang', fee: '150.000/chai' },
  { item: 'Rượu mạnh', fee: '200.000/chai' },
  { item: 'Bia, nước ngọt, nước lọc', fee: '30.000/người' }
];

export default function AdminBeveragesPage() {
  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quản Lý Đồ Uống & Phí Mang Đồ Vào</h2>
          <p className="text-xs text-gray-500 mt-1">Bảng giá niêm yết chính thức đồ uống bán tại nhà hàng và phí dịch vụ mang vào</p>
        </div>
        <a 
          href="/thuc-don?tab=DO_UONG" 
          target="_blank" 
          rel="noreferrer"
          className="px-4 py-2.5 bg-[#e3a638] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          Xem Trang Đồ Uống
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Table 1 */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <span>🍾</span> Đồ Uống Bán Tại Nhà Hàng (14 Loại - Đã đồng bộ)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900 text-amber-200 uppercase font-semibold">
                <tr>
                  <th className="p-3 w-12 text-center">STT</th>
                  <th className="p-3">Tên Đồ Uống</th>
                  <th className="p-3 text-right">Đơn Giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {DRINK_PRICES_ADMIN.map((d) => (
                  <tr key={d.stt} className="hover:bg-gray-50">
                    <td className="p-3 text-center text-gray-400 font-mono">{d.stt}</td>
                    <td className="p-3 text-gray-900 font-semibold">{d.name}</td>
                    <td className="p-3 text-right text-amber-800 font-bold">{d.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2 */}
        <div className="lg:col-span-5 bg-gradient-to-b from-gray-900 to-black text-white p-6 rounded-2xl border border-amber-500/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#e3a638] text-base flex items-center gap-2 mb-3">
              <span>⚠️</span> Phí Mang Đồ Uống Vào Nhà Hàng (Đồng bộ)
            </h3>

            <table className="w-full text-left text-xs">
              <thead className="bg-white/10 text-amber-300 font-semibold uppercase">
                <tr>
                  <th className="p-3">Loại Đồ Uống</th>
                  <th className="p-3 text-right">Mức Phí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-medium">
                {BRING_DRINK_FEES_ADMIN.map((f, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="p-3 text-gray-200">{f.item}</td>
                    <td className="p-3 text-right font-bold text-amber-300">{f.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-amber-400/30 text-xs text-amber-100 font-light">
            💡 <em>Ghi chú: Phí đã bao gồm đá lạnh, ly, cốc, nậm sứ đựng rượu mạnh hải cao cấp, nhân viên phục vụ.</em>
          </div>
        </div>

      </div>
    </div>
  );
}
