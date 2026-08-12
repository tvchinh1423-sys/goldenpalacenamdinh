'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Services() {
  const [selectedPackage, setSelectedPackage] = useState(2); // ID 2 is Gói Hoàng Gia
  const [selectedAddons, setSelectedAddons] = useState([]);

  const packages = [
    {
      id: 1,
      name: 'Gói Cơ Bản',
      price: '15.000.000đ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd-XPmjiummbVNtX7c0c8qj5cD8vk58rJPwNFE1D9fGdECtMd-5imPrNxkxVHR0wzxwVpyFHKV6eX9FoXYhJvoNkdEyf6jZ4GEfosjmdG1RYF0DcFdnirmkP8PoCXHzJKr-Gd-5oR79hX_tfW0fl_7vwpJ1Ajw8P2gKpZZ0lgw-FqUgO-_KID4VX-2QahPwtHhj1Avp21UZ04i5gSb88fIuQrz8WFm_ZsmMH8VQ_LLKsWtMJ_w1jy8',
      items: [
        'Trang trí sảnh tiêu chuẩn',
        'Tháp ly Champagne (Cơ bản)',
        'Âm thanh ánh sáng tiêu chuẩn'
      ]
    },
    {
      id: 2,
      name: 'Gói Hoàng Gia',
      price: '35.000.000đ',
      isPopular: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrMjgUyigokC7CRTKCBZqt9JkYsgrV1yUev9CllHHfCbXv1OM_Xv-Idf04a5eq0tK3rWW8CfjOAeseC9DJWg-J0UJxyUNQFB7QL-op9rGo6tp99s2twn3ZxZV_ldNTcIoY4ffXhROgGK5bNzs4u1zRD2kBf5LiHUhWLSLwEa49sP-6PbziC0BFmVtEQuN4nD_YN7Aar2OiJiD37PvRAjp8n0ChUPoJPL3KJV9QULD_cGEaFscA5s-V',
      items: [
        'Trang trí sảnh hoa tươi cao cấp',
        'Tháp ly Champagne 5 tầng & rượu',
        'Bánh cưới 3 tầng hoa tươi',
        'Ban nhạc hoà tấu đón khách'
      ]
    }
  ];

  const addons = [
    {
      id: 1,
      name: 'Pháo điện lối đi',
      price: '1.500.000đ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjFykDrmnIEzki3z3EbAzAKK7n9H--2Eds-h7HveRx_zU-6HFXs4VRv1Sbw13hDthIymG7iqliDn_ByTWFZklasBj2MX5NXOXgl89zmmXk1p83vS6pdnTYUHf84reafCsggtD0WaWJdTbjBiY57H_4KfF_shKGF-m4uQIW_Xbhthzr9VQFQa0NX_ZDueYFz0VfDJKVIf61HuNq2_DC0uAl0eTA95gPPf5upwen-1s53CjoGhkygr-F'
    },
    {
      id: 2,
      name: 'Ban nhạc tứ tấu',
      price: '4.000.000đ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBclEunQOnYwoHrIAGYlu5hRf_Uoe_88vuawqL2RIpLRNq5Ww6cAYHuyZsM5FVoTBS77IWSbpYF2Ir4DvJlZToqcBzHN5XpLLf_JWuDIAI8OAoWtjVlbPLi14o3V4PC6k8KxYj4maeUQyXrAR2dvCK38CA2hYQ4B7ab-yo8idsq5UZ7n0B-IFuXHv0fNNVeRI26tEwckiD9KpaqYWcfWC622ZBFkqw_J7Aa3cUXSUSa9K9CR5skaMV0'
    }
  ];

  const toggleAddon = (id) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col pt-16 pb-20 md:pb-0">
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-on-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-4 cursor-pointer active:scale-95 duration-200 hover:text-primary-container transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">menu</span>
          </div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-display-lg text-primary-container bg-clip-text bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-transparent">Golden Palace</h1>
          <div className="cursor-pointer active:scale-95 duration-200 hover:text-primary-container transition-colors text-primary dark:text-primary-fixed">
            Trợ giúp
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <h2 className="font-headline-md text-headline-md text-primary">Bước 3: Tinh Hoa Dịch Vụ</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Lựa chọn những điểm nhấn hoàn hảo cho ngày trọng đại. Khám phá các gói dịch vụ được thiết kế tỉ mỉ và các tuỳ chọn cao cấp.
          </p>
        </div>

        <div className="flex justify-center border-b border-outline-variant/30 gap-8">
          <button className="pb-4 px-4 font-label-md text-label-md transition-colors duration-300 border-b-2 border-gold-gradient-start text-primary">Gói Dịch Vụ</button>
          <button className="pb-4 px-4 font-label-md text-label-md transition-colors duration-300 text-on-surface-variant border-b-2 border-transparent hover:text-primary">Dịch Vụ Bổ Sung</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-component-gap">
          {packages.map(p => {
            const isSelected = selectedPackage === p.id;
            return (
              <article key={p.id} className={`bg-surface-bright/85 backdrop-blur-md rounded-xl overflow-hidden flex flex-col transition-all duration-300 group relative ${isSelected ? 'border-2 border-gold-gradient-start shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'border border-gold-gradient-start/20'}`}>
                {p.isPopular && <div className="absolute top-4 right-4 bg-primary-container text-on-primary-container font-label-md text-label-md px-3 py-1 rounded-full z-10 shadow-sm">Phổ biến nhất</div>}
                <div className="relative h-48 w-full overflow-hidden">
                  <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src={p.image} alt={p.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-headline-sm text-headline-sm text-primary">{p.name}</h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow gap-4">
                  <div className="font-price-display text-price-display text-primary">{p.price}</div>
                  <div className="flex-grow">
                    <p className="font-label-md text-label-md text-on-surface-variant mb-2">Bao gồm:</p>
                    <ul className="space-y-2">
                      {p.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 font-body-md text-body-md text-slate-text">
                          <span className="material-symbols-outlined text-success-emerald text-sm">check_circle</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={() => setSelectedPackage(p.id)}
                    className={`w-full py-3 rounded-lg font-label-md text-label-md transition-all flex items-center justify-center gap-2 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-white hover:opacity-90' 
                        : 'border border-gold-gradient-start text-primary hover:bg-gold-gradient-start/10'
                    }`}
                  >
                    {isSelected ? <><span className="material-symbols-outlined text-sm">check</span> Đã Chọn</> : 'Chọn Gói Này'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="h-px bg-outline-variant/30 my-8"></div>

        <div className="flex flex-col gap-6">
          <h3 className="font-headline-sm text-headline-sm text-primary">Dịch Vụ Bổ Sung</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-surface-bright/85 backdrop-blur-md p-4 rounded-lg border border-outline-variant/30 flex items-center gap-4 opacity-75">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-surface-variant flex-shrink-0">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXhQaKICV0dRpnRsJJH5F1vP7V-VW-juLLTyJOS6oqUEfjrW9yr4gdK_JXn19FoQZ5DgV-uM8Q48XXFn1JbRensQBHE08DehVVH9gTM9E9YUezwTlKLdZtidqT3rVZSTzI6WUHmL3ctqw47e3UkXG5vvhmjCnMVThB8UI_ylvOaX3S58hHEoPu052Qa00eXabhycif0_Ei9BZ_jiWRIMBEF5f_18dEEPq2G0uEt_im1ennBm3eGdJr" alt="Tháp ly" />
              </div>
              <div className="flex-grow">
                <div className="font-label-md text-label-md text-slate-text">Tháp ly Champagne</div>
                <div className="font-body-md text-body-md text-on-surface-variant">2.500.000đ</div>
              </div>
              <div className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded text-xs whitespace-nowrap">Đã bao gồm</div>
            </div>

            {addons.map(a => {
              const isSelected = selectedAddons.includes(a.id);
              return (
                <div 
                  key={a.id} 
                  onClick={() => toggleAddon(a.id)}
                  className={`bg-surface-bright/85 backdrop-blur-md p-4 rounded-lg border transition-colors flex items-center gap-4 group cursor-pointer ${isSelected ? 'border-primary' : 'border-outline-variant/50 hover:border-gold-gradient-start/50'}`}
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-surface-variant flex-shrink-0">
                    <img className="w-full h-full object-cover" src={a.image} alt={a.name} />
                  </div>
                  <div className="flex-grow">
                    <div className="font-label-md text-label-md text-slate-text group-hover:text-primary transition-colors">{a.name}</div>
                    <div className="font-body-md text-body-md text-on-surface-variant">{a.price}</div>
                  </div>
                  <button className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-gold-gradient-start text-primary group-hover:bg-gold-gradient-start group-hover:text-on-primary'}`}>
                    <span className="material-symbols-outlined text-sm">{isSelected ? 'check' : 'add'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 p-6 bg-surface-bright/85 backdrop-blur-md border border-gold-gradient-start/30 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_10px_30px_rgba(212,175,55,0.05)]">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Tạm tính (Chưa bao gồm thực đơn)</p>
            <div className="font-price-display text-price-display text-primary">35.000.000đ</div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link href="/du-toan-chi-phi/venues">
              <button className="flex-1 md:flex-none px-6 py-3 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors">Quay Lại</button>
            </Link>
            <Link href="/du-toan-chi-phi/estimate">
              <button className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white font-label-md text-label-md shadow-lg shadow-gold-gradient-start/30 hover:opacity-90 transition-opacity">Tiếp Tục</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
