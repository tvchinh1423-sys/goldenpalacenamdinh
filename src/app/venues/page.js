'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Venues() {
  const [selectedVenues, setSelectedVenues] = useState([2]); // IDs of selected venues

  const venues = [
    {
      id: 1,
      name: 'Sảnh Kim Cương',
      area: '800 m²',
      capacity: 'Max 500 khách',
      fee: 'Phí sảnh: ~25.000.000đ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANov3vCtm8CBeoQSC1Rq-SswYWeDoZ5AJZ_0fO2V8IjQR50seZ0V1DpffmMdmGmNr__uleL1hLZRbT76xgiJ0g8eJsPaxzVC1rQv94eeUvoDscTBWprUtjjm-nqNMkaBg3hbu139QhQBHtqFtJjd2YRBfl9-uN_N9ylw8yT3lJLvlUReHy9w8PAHvgPK7UBxblR-zgc5xg6NQ9-OeFQ5OCRm8lnovMP-pCAY5eiZeOWeib__aYTSj2',
      status: 'Phù hợp quy mô',
      statusColor: 'text-primary'
    },
    {
      id: 2,
      name: 'Sảnh Pha Lê',
      area: '600 m²',
      capacity: 'Max 350 khách',
      fee: 'Phí sảnh: ~18.000.000đ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7J0LFeNxUZvx5djbSkY_UI13YC3XSmt7iM1QCg672OC_auhT2UB7JJnMt0fgdB6zrbVJXhzLnPZRUaI8pK3OHs1sm4vhcOiJs5iCvUsMdee_0bcksAenFLsM-aXg8bUCtZdokd-a9lOTLEqtos7xIKlPIJkTOA_82fWTm2QgQpEnzbxehZH_7LYO6f7-2kpYqlgEwmspkF-As0mdk1L0LsXBs0fiDFugvNLVypLxoB256vocdGhyW',
      status: 'Phù hợp quy mô',
      statusColor: 'text-primary'
    },
    {
      id: 3,
      name: 'Sảnh Ruby',
      area: '400 m²',
      capacity: 'Max 250 khách',
      capacityColor: 'text-error-rose',
      fee: 'Phí sảnh: ~12.000.000đ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF6hz99jTnd-V4x3PpT9xQYy8JUn3EMbLYR2ozYT02zIi4AiqQFa5ATbLAXSEnGQ1LcAK9b-JpmfgakIuyL3MC3DfGVAygKnApSFVRsnA8bBuXpjV95vy3M_Q0yi8Ly1Dd-IHjlZ0aMw7eOV_yJTetr_CF5jCzu2nxtoU-cE0t_0FYLRDFoaRSB-P7EuMbV8zuG8j_NvR-awiLLZpiqTsOmMe9fdww-YkJd5WY-AwA3_zRN1gVj5cX',
      status: 'Có thể chật',
      statusColor: 'text-error-rose'
    }
  ];

  const toggleSelect = (id) => {
    if (selectedVenues.includes(id)) {
      setSelectedVenues(selectedVenues.filter(v => v !== id));
    } else {
      if (selectedVenues.length < 2) {
        setSelectedVenues([...selectedVenues, id]);
      }
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-32 pb-40">
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-on-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-4 cursor-pointer active:scale-95 duration-200">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed">menu</span>
          </div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-display-lg text-primary-container bg-clip-text bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-transparent text-center absolute left-1/2 -translate-x-1/2">
            Golden Palace
          </h1>
          <div className="flex items-center gap-4 cursor-pointer active:scale-95 duration-200">
            <span className="font-label-md text-primary dark:text-primary-fixed hover:text-primary-container transition-colors hidden md:block">Trợ giúp</span>
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed hover:text-primary-container transition-colors md:hidden">help</span>
          </div>
        </div>
      </header>

      <div className="fixed top-16 w-full z-40 bg-surface-container-high/90 backdrop-blur-md border-b border-gold-gradient-start/20 shadow-sm">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-on-surface-variant font-body-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
              <span>350 khách</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
              <span>4.0M/mâm</span>
            </div>
          </div>
          <Link href="/">
            <button className="text-primary font-label-md hover:underline flex items-center gap-1 transition-colors duration-200">
              <span className="material-symbols-outlined text-sm">edit</span>
              Sửa yêu cầu
            </button>
          </Link>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8">
        <div className="text-center mb-section-gap">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Chọn Hội Trường</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Khám phá các không gian tổ chức sang trọng phù hợp với quy mô khách mời của bạn. Chọn tối đa 2 hội trường để so sánh chi tiết.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {venues.map(v => {
            const isSelected = selectedVenues.includes(v.id);
            return (
              <div key={v.id} className={`glass-panel rounded-xl overflow-hidden transition-all duration-300 relative group flex flex-col h-full ${isSelected ? 'border-primary/60 shadow-[0_4px_20px_rgba(212,175,55,0.15)] ring-1 ring-primary/20' : 'border border-outline-variant/30 hover:border-primary/40'}`}>
                {isSelected && (
                  <div className="absolute -top-3 right-6 z-10 bg-primary-container text-on-primary-container font-label-md px-4 py-1.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Đã chọn so sánh
                  </div>
                )}
                
                <div className={`relative h-64 overflow-hidden ${v.status === 'Có thể chật' ? 'grayscale-[30%]' : ''}`}>
                  <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${v.image}')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className={`absolute top-4 left-4 bg-surface/90 backdrop-blur-sm ${v.statusColor} font-label-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
                    <span className="material-symbols-outlined text-[16px]">
                      {v.status === 'Có thể chật' ? 'warning' : 'check_circle'}
                    </span>
                    {v.status}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-display-lg">{v.name}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-on-surface-variant font-body-md">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary opacity-80">aspect_ratio</span>
                      <span>{v.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary opacity-80">groups</span>
                      <span className={v.capacityColor || ''}>{v.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <span className="material-symbols-outlined text-primary opacity-80">payments</span>
                      <span>{v.fee}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white font-label-md py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-md">
                      <span className="material-symbols-outlined text-[20px]">add</span>
                      Chọn Sảnh
                    </button>
                    <button 
                      onClick={() => toggleSelect(v.id)}
                      className={`flex-1 font-label-md py-3 rounded-lg flex justify-center items-center gap-2 transition-colors ${
                        isSelected 
                          ? 'bg-primary-container/20 border border-primary text-primary' 
                          : 'bg-transparent border border-outline text-outline hover:border-primary hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isSelected ? 'remove' : 'compare_arrows'}
                      </span>
                      {isSelected ? 'Bỏ so sánh' : 'So sánh'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selectedVenues.length > 0 && (
        <div className="fixed bottom-20 md:bottom-0 left-0 w-full z-50 bg-surface-bright/95 backdrop-blur-xl border-t border-gold-gradient-start/30 shadow-[0_-10px_40px_rgba(212,175,55,0.15)] transform transition-transform duration-500 translate-y-0">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-on-surface-variant font-body-md text-sm">Đang chọn để so sánh</span>
              <span className="text-primary font-headline-sm font-display-lg">Đã chọn {selectedVenues.length}/2 hội trường</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                {selectedVenues.map(id => {
                  const v = venues.find(x => x.id === id);
                  return <img key={id} className="w-10 h-10 rounded-md object-cover border border-primary/30" src={v.image} alt={v.name} />;
                })}
                {selectedVenues.length < 2 && (
                  <div className="w-10 h-10 rounded-md border border-dashed border-outline-variant flex items-center justify-center text-outline-variant bg-surface-container">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </div>
                )}
              </div>
              <Link href="/services">
                <button className={`text-white font-label-md px-6 py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-md ${selectedVenues.length > 0 ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028]' : 'bg-surface-variant text-on-surface-variant opacity-80 cursor-not-allowed'}`}>
                  Tiếp tục chọn dịch vụ
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
