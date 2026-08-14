'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

export default function Services() {
  const { estimateData, updateEstimate } = useEstimate();
  const { guestCount, selectedVenues, selectedPackage, selectedAddOns } = estimateData;

  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);

  const venueId = selectedVenues[0]; // Take preferred venue for pricing

  useEffect(() => {
    async function fetchData() {
      try {
        const pkgRes = await fetch(`/api/guest/packages?guests=${guestCount}${venueId ? `&venue=${venueId}` : ''}`);
        const addonRes = await fetch(`/api/guest/add-ons?guests=${guestCount}${venueId ? `&venue=${venueId}` : ''}`);
        
        const pkgData = await pkgRes.json();
        const addonData = await addonRes.json();
        
        setPackages(pkgData);
        setAddons(addonData);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [guestCount, venueId]);

  const toggleAddon = (id) => {
    if (selectedAddOns.includes(id)) {
      updateEstimate({ selectedAddOns: selectedAddOns.filter(a => a !== id) });
    } else {
      updateEstimate({ selectedAddOns: [...selectedAddOns, id] });
    }
  };

  const getPackagePrice = (pkg) => {
    return pkg.pricings?.[0]?.price || 0;
  };

  const getAddonPrice = (addon) => {
    return addon.pricings?.[0]?.price || 0;
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedPackage) {
      const pkg = packages.find(p => p.id === selectedPackage);
      if (pkg) total += Number(getPackagePrice(pkg));
    }
    selectedAddOns.forEach(id => {
      const addon = addons.find(a => a.id === id);
      if (addon) total += Number(getAddonPrice(addon));
    });
    return total;
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

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

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        ) : (
          <>
            <div className="flex justify-center border-b border-outline-variant/30 gap-8">
              <button className="pb-4 px-4 font-label-md text-label-md transition-colors duration-300 border-b-2 border-gold-gradient-start text-primary">Gói Dịch Vụ</button>
              <button className="pb-4 px-4 font-label-md text-label-md transition-colors duration-300 text-on-surface-variant border-b-2 border-transparent hover:text-primary">Dịch Vụ Bổ Sung</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-component-gap">
              {packages.map(p => {
                const isSelected = selectedPackage === p.id;
                const images = JSON.parse(p.images || '[]');
                const image = images[0] || 'https://via.placeholder.com/600x400';
                const price = getPackagePrice(p);

                return (
                  <article key={p.id} className={`bg-surface-bright/85 backdrop-blur-md rounded-xl overflow-hidden flex flex-col transition-all duration-300 group relative ${isSelected ? 'border-2 border-gold-gradient-start shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'border border-gold-gradient-start/20'}`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src={image} alt={p.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-headline-sm text-headline-sm text-primary">{p.name}</h3>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow gap-4">
                      <div className="font-price-display text-price-display text-primary">{formatCurrency(price)}</div>
                      <div className="flex-grow">
                        <p className="font-label-md text-label-md text-on-surface-variant mb-2">Bao gồm:</p>
                        <ul className="space-y-2">
                          {p.items?.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 font-body-md text-body-md text-slate-text">
                              <span className="material-symbols-outlined text-success-emerald text-sm">check_circle</span> {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button 
                        onClick={() => updateEstimate({ selectedPackage: p.id })}
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
                
                {addons.map(a => {
                  const isSelected = selectedAddOns.includes(a.id);
                  const images = JSON.parse(a.images || '[]');
                  const image = images[0] || 'https://via.placeholder.com/150';
                  
                  // Logic to check if addon is included in selected package
                  let isIncludedInPackage = false;
                  if (selectedPackage) {
                    try {
                      const excludedPackages = JSON.parse(a.excludedFromPackages || '[]');
                      if (excludedPackages.includes(selectedPackage)) {
                        isIncludedInPackage = true;
                      }
                    } catch(e) {}
                  }

                  if (isIncludedInPackage) {
                    return (
                      <div key={a.id} className="bg-surface-bright/85 backdrop-blur-md p-4 rounded-lg border border-outline-variant/30 flex items-center gap-4 opacity-75">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-surface-variant flex-shrink-0">
                          <img className="w-full h-full object-cover" src={image} alt={a.name} />
                        </div>
                        <div className="flex-grow">
                          <div className="font-label-md text-label-md text-slate-text">{a.name}</div>
                          <div className="font-body-md text-body-md text-on-surface-variant">{formatCurrency(getAddonPrice(a))}</div>
                        </div>
                        <div className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded text-xs whitespace-nowrap">Đã bao gồm</div>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={a.id} 
                      onClick={() => toggleAddon(a.id)}
                      className={`bg-surface-bright/85 backdrop-blur-md p-4 rounded-lg border transition-colors flex items-center gap-4 group cursor-pointer ${isSelected ? 'border-primary' : 'border-outline-variant/50 hover:border-gold-gradient-start/50'}`}
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-surface-variant flex-shrink-0">
                        <img className="w-full h-full object-cover" src={image} alt={a.name} />
                      </div>
                      <div className="flex-grow">
                        <div className="font-label-md text-label-md text-slate-text group-hover:text-primary transition-colors">{a.name}</div>
                        <div className="font-body-md text-body-md text-on-surface-variant">{formatCurrency(getAddonPrice(a))}</div>
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
                <div className="font-price-display text-price-display text-primary">{formatCurrency(calculateTotal())}</div>
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
          </>
        )}
      </main>
    </div>
  );
}
