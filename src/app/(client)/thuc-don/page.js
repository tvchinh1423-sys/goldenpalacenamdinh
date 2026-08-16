'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingConsultationModal from '@/components/layout/BookingConsultationModal';

const MENU_CATEGORIES = [
  { id: 'SET_TIEC', label: 'Set Menu Tiệc Cưới & Hội Nghị', icon: 'restaurant_menu', count: '18 Set cỗ chính thức' },
  { id: 'CHUYEN_MON', label: 'Menu Chuyên Món Đặc Sản', icon: 'workspace_premium', count: 'Cá, Ba Ba, Dúi, Vịt Trời, Lợn Mán, Bê' },
  { id: 'TRE_EM', label: 'Menu Trẻ Em & Học Sinh', icon: 'child_care', count: '5 Combo ưu đãi 10%' },
  { id: 'ALACARTE', label: 'Menu Chọn Món A la carte', icon: 'menu_book', count: 'Tích chọn tạo bản nháp' },
  { id: 'DO_UONG', label: 'Menu Đồ Uống & Phí Mang Vào', icon: 'wine_bar', count: 'Bảng giá chính thức' },
];

// FULL 18 SET MENUS STRICTLY FROM GOOGLE SHEET (UNIFORM TITLES: SET MENU TIỆC 1 -> SET MENU TIỆC 18)
const SET_MENUS_18 = [
  {
    title: 'SET MENU TIỆC 1',
    price: '320.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp hải sản rong biển' },
      { type: 'Khai vị', name: 'Salad rau má bắp bò muối' },
      { type: 'Món chính', name: 'Cá quả nướng dân tộc' },
      { type: 'Món chính', name: 'Bò xào lúc lắc hạnh nhân' },
      { type: 'Món chính', name: 'Gà rút xương sốt xì dầu' },
      { type: 'Món chính', name: 'Mực một nắng xào cần Mỹ' },
      { type: 'Món chính', name: 'Chân giò hầm sen nấm' },
      { type: 'Món củ', name: 'Rau củ luộc chấm kho quẹt' },
      { type: 'Canh', name: 'Canh măng mọc' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi sen dừa' },
      { type: 'Tráng miệng', name: 'Kem Caramel' },
    ]
  },
  {
    title: 'SET MENU TIỆC 2',
    price: '340.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp tôm nấm' },
      { type: 'Khai vị', name: 'Salad lườn ngỗng xông khói' },
      { type: 'Món chính', name: 'Cá quả hấp kiểu Thái' },
      { type: 'Món chính', name: 'Bê tái chanh' },
      { type: 'Món chính', name: 'Gà rút xương sốt nấm' },
      { type: 'Món chính', name: 'Tôm thẻ 6 hoa chiên giòn' },
      { type: 'Món chính', name: 'Hải sản xào sốt X.O' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Canh mọc hải sản' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi Hoàng Phố ruốc bông' },
      { type: 'Tráng miệng', name: 'Dưa hấu' },
    ]
  },
  {
    title: 'SET MENU TIỆC 3',
    price: '345.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp tôm rong biển' },
      { type: 'Khai vị', name: 'Nộm cổ hũ dừa tôm thịt' },
      { type: 'Món chính', name: 'Cá trắm hấp mẻ' },
      { type: 'Món chính', name: 'Dê chiên riềng' },
      { type: 'Món chính', name: 'Gà hấp lá chanh' },
      { type: 'Món chính', name: 'Bò sốt tiêu đen + Bánh bao' },
      { type: 'Món chính', name: 'Hải sản xào sốt X.O' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Canh mọc hải sản' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi cốm vò' },
      { type: 'Tráng miệng', name: 'Nho Mỹ' },
    ]
  },
  {
    title: 'SET MENU TIỆC 4',
    price: '375.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp hải sản ngó xuân' },
      { type: 'Khai vị', name: 'Nộm rau má bắp bò muối' },
      { type: 'Món chính', name: 'Cá lăng chiên riềng' },
      { type: 'Món chính', name: 'Tôm thẻ 6 hoa chiên hạnh nhân' },
      { type: 'Món chính', name: 'Gà rút xương sốt bát bảo' },
      { type: 'Món chính', name: 'Dê hấp lá tía tô' },
      { type: 'Món chính', name: 'Bắp bò xào cổ hũ dừa' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Cá lăng om chuối đậu' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi sen dừa' },
      { type: 'Tráng miệng', name: 'Nho Mỹ' },
    ]
  },
  {
    title: 'SET MENU TIỆC 5',
    price: '395.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp bò ngó xuân' },
      { type: 'Khai vị', name: 'Salad cá ngừ' },
      { type: 'Món chính', name: 'Gà rút xương xốt nấm' },
      { type: 'Món chính', name: 'Cá lăng rang muối' },
      { type: 'Món chính', name: 'Tôm phượng hoàng (5 hoa)' },
      { type: 'Món chính', name: 'Bò cuộn măng tây sốt tiêu' },
      { type: 'Món chính', name: 'Hải sản xào ngồng tỏi' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Cá lăng om chuối đậu' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi chả mực' },
      { type: 'Tráng miệng', name: 'Nho Mỹ' },
    ]
  },
  {
    title: 'SET MENU TIỆC 6',
    price: '405.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp tôm ngó xuân' },
      { type: 'Khai vị', name: 'Salad trứng cá hồi' },
      { type: 'Món chính', name: 'Cá lăng hấp xì dầu' },
      { type: 'Món chính', name: 'Bò hầm rượu vang + Bánh mì' },
      { type: 'Món chính', name: 'Dê hấp lá thơm' },
      { type: 'Món chính', name: 'Hải sâm tôm nõn xào nấm' },
      { type: 'Món chính', name: 'Gà rút xương xốt nấm' },
      { type: 'Món củ', name: 'Rau củ luộc' },
      { type: 'Canh', name: 'Canh mọc bò viên' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi chim câu' },
      { type: 'Tráng miệng', name: 'Nho Mỹ' },
    ]
  },
  {
    title: 'SET MENU TIỆC 7',
    price: '415.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp lươn nấm thả' },
      { type: 'Khai vị', name: 'Salad trứng cá hồi' },
      { type: 'Món chính', name: 'Gà rút xương sốt sâm nấm' },
      { type: 'Món chính', name: 'Ba ba om chuối đậu (1.5kg)' },
      { type: 'Món chính', name: 'Dê hấp lá hương' },
      { type: 'Món chính', name: 'Tôm 5 hoa chiên trứng muối' },
      { type: 'Món chính', name: 'Hải sâm tôm nõn xào xốt X.O' },
      { type: 'Món củ', name: 'Củ quả luộc' },
      { type: 'Mon ăn phụ', name: 'Bánh bí chiên' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi Hoàng Phố' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  },
  {
    title: 'SET MENU TIỆC 8',
    price: '440.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp gà hải sâm' },
      { type: 'Khai vị', name: 'Salad cá hồi chiên giòn' },
      { type: 'Món chính', name: 'Gà hấp rút xương xốt nấm' },
      { type: 'Món chính', name: 'Cá lăng nướng dân tộc' },
      { type: 'Món chính', name: 'Tôm 7 hoa chiên hạnh nhân' },
      { type: 'Món chính', name: 'Dê chiên riềng' },
      { type: 'Món chính', name: 'Cồi điệp sốt nấm bông cải' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Canh mọc bò viên' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi cốm dẻo' },
      { type: 'Tráng miệng', name: 'Nho Mỹ' },
    ]
  },
  {
    title: 'SET MENU TIỆC 9',
    price: '445.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp gà hải sâm' },
      { type: 'Khai vị', name: 'Salad rau mầm bắp bò' },
      { type: 'Món chính', name: 'Cá chình rang muối' },
      { type: 'Món chính', name: 'Ba ba om chuối đậu (1.3kg)' },
      { type: 'Món chính', name: 'Gà rút xương sốt sen nấm' },
      { type: 'Món chính', name: 'Cồi điệp xốt nấm đông trùng' },
      { type: 'Món chính', name: 'Dê hấp lá thơm' },
      { type: 'Món củ', name: 'Rau củ luộc' },
      { type: 'Món ăn phụ', name: 'Bánh bí chiên' },
      { type: 'Cơm / Xôi', name: 'Cơm tám' },
      { type: 'Cơm / Xôi', name: 'Xôi Hoàng Phố ruốc bông' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  },
  {
    title: 'SET MENU TIỆC 10',
    price: '465.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp cua gỡ rong biển' },
      { type: 'Khai vị', name: 'Salad rau mầm bò chiên cay' },
      { type: 'Món chính', name: 'Cá chình chiên riềng' },
      { type: 'Món chính', name: 'Gà hấp rút xương xốt nấm' },
      { type: 'Món chính', name: 'Tôm 7 hoa chiên hạnh nhân' },
      { type: 'Món chính', name: 'Dê ủ trấu' },
      { type: 'Món chính', name: 'Hải sản xào cần Mỹ' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Cá chình om chuối đậu' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi cá rô' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  },
  {
    title: 'SET MENU TIỆC 11',
    price: '475.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp cua gỡ rong biển' },
      { type: 'Khai vị', name: 'Salad cá hồi chiên giòn' },
      { type: 'Món chính', name: 'Cá song hấp kiểu Thái' },
      { type: 'Món chính', name: 'Chả cua bọc giấy bạc' },
      { type: 'Món chính', name: 'Gà rút xương xốt nấm' },
      { type: 'Món chính', name: 'Dê ủ trấu' },
      { type: 'Món chính', name: 'Bò Nhật xào hạnh nhân' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Canh mọc hải sản' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi Hoàng Phố ruốc bông' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  },
  {
    title: 'SET MENU TIỆC 12',
    price: '510.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp hải sản bạch ngọc' },
      { type: 'Khai vị', name: 'Salad trứng cá hồi' },
      { type: 'Món chính', name: 'Ba ba om chuối đậu (1.5kg)' },
      { type: 'Món chính', name: 'Gà rút xương xốt nấm' },
      { type: 'Món chính', name: 'Bò Fuji nướng xốt tiêu + Bánh mì' },
      { type: 'Món chính', name: 'Tôm 7 hoa chiên trứng muối' },
      { type: 'Món chính', name: 'Hải sản xào xốt X.O' },
      { type: 'Món củ', name: 'Rau củ luộc chấm kho quẹt' },
      { type: 'Món ăn phụ', name: 'Nem hải sản' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi chim câu' },
      { type: 'Tráng miệng', name: 'Nho Mỹ' },
    ]
  },
  {
    title: 'SET MENU TIỆC 13',
    price: '515.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp lươn nấm thả' },
      { type: 'Khai vị', name: 'Nộm cổ hũ dừa tôm thịt' },
      { type: 'Món chính', name: 'Cá hồi sốt chanh leo' },
      { type: 'Món chính', name: 'Gà rút xương xốt nấm' },
      { type: 'Món chính', name: 'Tôm 7 hoa chiên hạnh nhân' },
      { type: 'Món chính', name: 'Dê hấp lá é' },
      { type: 'Món chính', name: 'Cồi điệp hải sâm sốt nấm đông trùng' },
      { type: 'Món củ', name: 'Củ quả luộc' },
      { type: 'Canh', name: 'Lươn om chuối đậu' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi cốm vò' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  },
  {
    title: 'SET MENU TIỆC 14',
    price: '540.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp dê bát bảo' },
      { type: 'Khai vị', name: 'Salad bắp bò muối' },
      { type: 'Món chính', name: 'Cá chình nướng dân tộc' },
      { type: 'Món chính', name: 'Tôm sú 1 lạng bỏ lò phomai' },
      { type: 'Món chính', name: 'Chả ốc hương lá lốt' },
      { type: 'Món chính', name: 'Cồi điệp xốt nấm đông trùng' },
      { type: 'Món chính', name: 'Gà rút xương sốt lá é' },
      { type: 'Món củ', name: 'Rau củ luộc' },
      { type: 'Canh', name: 'Canh lươn hoa chuối' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi vò hạt sen' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  },
  {
    title: 'SET MENU TIỆC 15',
    price: '540.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp cua gỡ ngó xuân' },
      { type: 'Khai vị', name: 'Salad trứng cá hồi' },
      { type: 'Món chính', name: 'Cá hồi áp chảo xốt xì dầu' },
      { type: 'Món chính', name: 'Tôm 7 hoa chiên hạnh nhân' },
      { type: 'Món chính', name: 'Gà rút xương sốt sâm nấm' },
      { type: 'Món chính', name: 'Ba ba om chuối đậu (1.3kg)' },
      { type: 'Món chính', name: 'Mực một nắng xào ngồng tỏi' },
      { type: 'Món củ', name: 'Rau củ luộc' },
      { type: 'Món ăn phụ', name: 'Nem hải sản' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi Hoàng Phố' },
      { type: 'Tráng miệng', name: 'Nho Mỹ' },
    ]
  },
  {
    title: 'SET MENU TIỆC 16',
    price: '590.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp bò ngó xuân' },
      { type: 'Khai vị', name: 'Salad trứng cá hồi' },
      { type: 'Món chính', name: 'Cá hồi chiên hạnh nhân' },
      { type: 'Món chính', name: 'Ba ba om chuối đậu (1.3kg)' },
      { type: 'Món chính', name: 'Tôm 1 lạng bỏ lò phomai' },
      { type: 'Món chính', name: 'Bò Nhật xào măng tây' },
      { type: 'Món chính', name: 'Gà rút xương sốt bát bảo' },
      { type: 'Món củ', name: 'Rau củ luộc chấm kho quẹt' },
      { type: 'Món ăn phụ', name: 'Bánh bí chiên' },
      { type: 'Cơm / Xôi', name: 'Cơm tám' },
      { type: 'Cơm / Xôi', name: 'Xôi chả mực Hạ Long' },
      { type: 'Tráng miệng', name: 'Nho Mỹ' },
    ]
  },
  {
    title: 'SET MENU TIỆC 17',
    price: '660.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp gà sâm tươi' },
      { type: 'Khai vị', name: 'Salad rau má trứng cá hồi' },
      { type: 'Món chính', name: 'Nem cua bể chiên giòn' },
      { type: 'Món chính', name: 'Cá hồi xốt chanh leo' },
      { type: 'Món chính', name: 'Ba ba nướng lá lốt (1.5kg)' },
      { type: 'Món chính', name: 'Tôm sú chiên bơ tỏi (Tôm 1 lạng)' },
      { type: 'Món chính', name: 'Vịt trời hấp lá thơm (rút xương)' },
      { type: 'Món chính', name: 'Bò Fuji nướng xốt tiêu' },
      { type: 'Món củ', name: 'Ngó xuân xào tỏi' },
      { type: 'Canh', name: 'Canh mọc hải sản' },
      { type: 'Cơm / Xôi', name: 'Xôi chim câu' },
      { type: 'Cơm / Xôi', name: 'Cơm tám' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  },
  {
    title: 'SET MENU TIỆC 18',
    price: '690.000 VNĐ / 1 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp nấm bào ngư' },
      { type: 'Khai vị', name: 'Salad lườn ngỗng xông khói' },
      { type: 'Món chính', name: 'Nem cá chiên giòn' },
      { type: 'Món chính', name: 'Bò Fuji nướng xốt tiêu + Bánh mì' },
      { type: 'Món chính', name: 'Cá hồi áp chảo xốt xì dầu Nhật' },
      { type: 'Món chính', name: 'Tôm 1 lạng chiên hạnh nhân' },
      { type: 'Món chính', name: 'Chim câu quay' },
      { type: 'Món chính', name: 'Cồi điệp sốt X.O' },
      { type: 'Món củ', name: 'Rau củ luộc ngũ sắc' },
      { type: 'Canh', name: 'Canh nấm hải sản' },
      { type: 'Cơm / Xôi', name: 'Xôi sen dừa' },
      { type: 'Cơm / Xôi', name: 'Cơm tám' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  }
];

// MENU CHUYÊN MÓN (EXCLUDING CẦY HƯƠNG & MÒNG KẾT)
const SPECIALTY_MENUS_6 = [
  {
    title: 'MENU CÁ LĂNG / CÁ TRẮM',
    subtitle: 'Cá tươi chọn lọc chế biến 6 món độc đáo',
    items: ['1. Súp cá tươi', '2. Gỏi cá chanh ớt', '3. Cá xào nấm đông cô', '4. Rang muối thảo mộc / Hấp Hồng Kông', '5. Nướng muối ớt dân tộc', '6. Lẩu cá măng chua + Bún']
  },
  {
    title: 'MENU BA BA HOÀNG GIA',
    subtitle: 'Ba ba sông trọn vị 6 món bổ dưỡng',
    items: ['1. Rượu tiết mật ba ba', '2. Ba ba tiềm thuốc bắc', '3. Ba ba xào gừng tươi', '4. Nướng lá lốt thơm lừng', '5. Ba ba rang muối hột', '6. Om chuối đậu + Bún + Hoa chuối']
  },
  {
    title: 'MENU DÚI NÚI',
    subtitle: 'Đặc sản dúi rừng 5 món hấp dẫn',
    items: ['1. Tiết canh dúi', '2. Dúi hấp lá tía tô', '3. Dúi xào lăn', '4. Lẩu dúi rau má', '5. Lòng dúi xào dưa chua']
  },
  {
    title: 'MENU VỊT TRỜI',
    subtitle: 'Vịt trời tự nhiên 5 món thơm ngọt',
    items: ['1. Tiết canh vịt trời', '2. Lòng xào giá hẹ', '3. Vịt trời hấp gừng', '4. Vịt trời nấu chao', '5. Vịt trời quay da giòn']
  },
  {
    title: 'MENU LỢN MÁN MẸT',
    subtitle: 'Lợn mán cắp nách 10 món đặc sắc',
    items: ['1. Tiết canh lợn mán', '2. Lòng nhồi đỗ phộng', '3. Cháo lòng', '4. Xào lăn sả ớt', '5. Lợn mán hấp lá mớ', '6. Chao dầu', '7. Tiết xương xông', '8. Nướng riềng mẻ', '9. Nhựa mận + Bánh mì', '10. Canh xương măng + Bún']
  },
  {
    title: 'MENU BÊ TẢNG',
    subtitle: 'Bê tươi Nam Định 7 món đậm đà',
    items: ['1. Bê tái chanh', '2. Bê nướng tảng nguyên miếng', '3. Bê xào lăn', '4. Bê cháy tỏi', '5. Bê ủ muối thảo mộc', '6. Bê hầm vang đỏ + Bánh mì', '7. Bê nhúng me chua ngọt']
  }
];

const KIDS_MENUS = [
  {
    code: 'COMBO 1',
    note: 'Dành cho học sinh cấp 1',
    price: '130.000 VNĐ / suất',
    items: ['Khoai tây chiên giòn', 'Thăn lợn chiên vừng', 'Cánh gà lắc phô mai', 'Thịt xiên nướng sốt BBQ', 'Cơm rang thập cẩm', 'Cơm cháy sốt bò bằm', 'Nước ngọt: Coca hoặc Nước cam lon']
  },
  {
    code: 'COMBO 2',
    note: 'Dành cho học sinh cấp 1',
    price: '150.000 VNĐ / suất',
    items: ['Ngô chiên bơ', 'Khoai tây chiên', 'Mực chiên bơ tỏi', 'Đùi gà chiên giòn', 'Sườn nướng BBQ', 'Cơm rang thập cẩm', 'Mỳ Ý sốt bò bằm', 'Nước ngọt: Coca hoặc Nước cam lon']
  },
  {
    code: 'COMBO 3',
    note: 'Dành cho học sinh cấp 1 & 2',
    price: '160.000 VNĐ / suất',
    items: ['Ngô chiên bơ', 'Phô mai chiên giòn', 'Xúc xích lắc phô mai', 'Thăn heo chiên xù', 'Cơm cuộn Hàn Quốc', 'Mỳ xào bò hoặc Mỳ Ý sốt bò bằm', 'Cánh gà chiên mắm / chiên giòn', 'Tráng miệng: Bánh tuyết hoặc Caramel', 'Nước ngọt: Coca hoặc Nước cam lon']
  },
  {
    code: 'COMBO 4',
    note: 'Dành cho học sinh cấp 1 & 2',
    price: '180.000 VNĐ / suất',
    items: ['Nem chua rán', 'Khoai tây chiên lắc phô mai', 'Sườn rang muối hoặc Sườn nướng thảo mộc', 'Xúc xích sốt phô mai bơ tỏi', 'Gà xiên nướng sốt BBQ', 'Cơm rang thập cẩm', 'Mỳ Ý sốt bò bằm hoặc Mỳ xào', 'Tráng miệng: Kem Caramel', 'Nước ngọt: Coca hoặc Nước cam lon']
  },
  {
    code: 'COMBO 5',
    note: 'Dành cho học sinh cấp 1 & 2',
    price: '190.000 VNĐ / suất',
    items: ['Ngô chiên bơ', 'Khoai tây chiên phô mai', 'Pizza Hải sản cỡ vừa', 'Gà chiên lắc phô mai', 'Mỳ Ý sốt bò bằm Bolognese', 'Bánh ngọt tráng miệng', 'Nước ép trái cây / Nước ngọt lon']
  }
];

const ALACARTE_3_SECTIONS = [
  {
    id: 'sec-1',
    sectionTitle: 'I. KHAI VỊ & SALAD',
    sectionDesc: 'Các món súp nóng hổi, salad và nộm khai vị tinh tế',
    icon: 'soup_kitchen',
    groups: [
      {
        subTitle: 'Súp Khai Vị Bổ Dưỡng',
        dishes: [
          'Súp gà ngô nấm', 'Súp gà nấm đông trùng', 'Súp gà Hoàng Kim', 'Súp gà hải sâm', 'Súp dê bát bảo', 'Súp dê nấm tươi', 'Súp bò nấm tươi', 'Súp cua gỡ nấm tuyết', 'Súp cua gỡ rong biển', 'Súp cua gỡ măng tây', 'Súp nấm cua gỡ', 'Súp cua gỡ thảo mộc', 'Súp nấm Bạch Ngọc', 'Súp tôm nấm', 'Súp tôm bí đỏ', 'Súp lươn bát bảo', 'Súp bào ngư nấm đông trùng', 'Súp bào ngư nấm đông cô', 'Súp gà yến sâm'
        ]
      },
      {
        subTitle: 'Salad & Nộm Tươi Mát',
        dishes: [
          'Salad rau xanh bắp bò muối', 'Salad trứng cá hồi', 'Salad cá hồi chiên giòn', 'Salad lườn ngỗng xông khói', 'Salad rau mầm', 'Salad cá ngừ', 'Salad rau má bắp bò', 'Nộm bắp bò hoa chuối', 'Nộm bò nướng cay', 'Nộm miến hải sản sốt Thái', 'Nộm hải sản sốt Thái', 'Nộm gà hoa chuối', 'Nộm cổ hũ dừa tôm thịt', 'Nộm sứa hoa chuối', 'Nộm bắp bò rau tiến vua', 'Nộm rau tiến vua tai heo'
        ]
      }
    ]
  },
  {
    id: 'sec-2',
    sectionTitle: 'II. MÓN CHÍNH & LẨU',
    sectionDesc: 'Đặc sản Hải sản, Bò - Bê - Dê - Lợn mán, Canh xào và Lẩu tươi nóng',
    icon: 'flatware',
    groups: [
      {
        subTitle: 'Đặc Sản Cá & Ba Ba Sông',
        dishes: [
          'Cá lăng chiên riềng mẻ', 'Cá lăng nướng dân tộc', 'Cá lăng om chuối đậu', 'Cá lăng hấp Hồng Kông nguyên con', 'Cá quả nướng mắm ớt', 'Cá quả hấp Thái', 'Cá trắm hấp mẻ', 'Ba ba rang muối hột', 'Ba ba om chuối đậu + Bún', 'Ba ba xào gừng tươi', 'Ba ba nướng lá lốt'
        ]
      },
      {
        subTitle: 'Các Món Bò, Bê & Dê Núi',
        dishes: [
          'Bò xào lúc lắc hạnh nhân', 'Bò sốt tiêu đen + Bánh bao chiên', 'Bắp bò xào cổ hũ dừa', 'Bê tái chanh Nam Định', 'Bê nướng tảng nguyên miếng', 'Bê xào lăn sả ớt', 'Bê cháy tỏi', 'Bê ủ muối thảo mộc', 'Bê hầm vang đỏ + Bánh mì', 'Dê chiên riềng', 'Dê hấp lá tía tô', 'Dê nướng tảng mạ vàng', 'Dê tái chanh'
        ]
      },
      {
        subTitle: 'Tôm, Bề Bề, Ếch & Chân Giò / Sườn',
        dishes: [
          'Tôm thẻ 6 hoa chiên giòn', 'Tôm thẻ chiên hạnh nhân', 'Tôm sú bỏ lò phô mai Pháp', 'Tôm chiên hoàng kim trứng muối', 'Bề bề rang muối hột', 'Bề bề hấp sả ớt', 'Hải sản xào sốt X.O', 'Ếch rang muối thảo mộc', 'Ếch xào măng củ', 'Chân giò hầm sen nấm', 'Chân giò nướng giòn da', 'Sườn nướng sốt BBQ', 'Sườn rang muối'
        ]
      },
      {
        subTitle: 'Canh, Xào & Các Loại Lẩu Tươi',
        dishes: [
          'Canh măng mọc', 'Canh mọc hải sản', 'Rau củ luộc chấm kho quẹt', 'Rau xào theo mùa', 'Măng tây xào tỏi', 'Lẩu cá lăng măng chua', 'Lẩu hải sản thập cẩm', 'Lẩu riêu cua bắp bò', 'Lẩu dê núi tía tô'
        ]
      }
    ]
  },
  {
    id: 'sec-3',
    sectionTitle: 'III. TRÁNG MIỆNG',
    sectionDesc: 'Hoa quả tươi theo mùa, bánh ngọt và kem chè tráng miệng thanh mát',
    icon: 'icecream',
    groups: [
      {
        subTitle: 'Hoa Quả Tươi & Món Ngọt',
        dishes: [
          'Bưởi da xanh', 'Nho Mỹ nhập khẩu', 'Nho xanh nhập khẩu', 'Cam Canh ngọt', 'Chuối ngự Nam Định', 'Hoa quả tươi theo mùa', 'Sữa chua nhà làm', 'Kem Caramel', 'Bánh tuyết Mochi'
        ]
      }
    ]
  }
];

const DRINK_PRICES_IMAGE4 = [
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

const BRING_DRINK_FEES = [
  { item: 'Rượu ngâm', fee: '30.000/lít' },
  { item: 'Rượu vodka', fee: '70.000/chai' },
  { item: 'Rượu vang', fee: '150.000/chai' },
  { item: 'Rượu mạnh', fee: '200.000/chai' },
  { item: 'Bia, nước ngọt, nước lọc', fee: '30.000/người' }
];

function MenuContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState('SET_TIEC');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  // Pagination / Page index for 18 Set Menus (Slider Carousel)
  const [setMenuIndex, setSetMenuIndex] = useState(0); // 0 to 17

  // Active section filter for ALACARTE
  const [activeAlacarteSec, setActiveAlacarteSec] = useState('ALL');

  useEffect(() => {
    if (tabParam && MENU_CATEGORIES.some(c => c.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const toggleSelectDish = (dishName) => {
    if (selectedDishes.includes(dishName)) {
      setSelectedDishes(selectedDishes.filter(d => d !== dishName));
    } else {
      setSelectedDishes([...selectedDishes, dishName]);
    }
  };

  const handleShareZalo = () => {
    const text = `BẢN NHÁP THỰC ĐƠN ĐÃ CHỌN TẠI GOLDEN PALACE (${selectedDishes.length} món):\n` + 
      selectedDishes.map((d, i) => `${i + 1}. ${d}`).join('\n') + 
      `\n\nNhờ chuyên viên Golden Palace kiểm tra thời giá và báo giá chi tiết giúp em!`;
    navigator.clipboard.writeText(text);
    alert('✅ Đã sao chép bản nháp thực đơn! Bạn có thể dán (Paste) để gửi trực tiếp qua Zalo cho chuyên viên.');
    window.open('https://zalo.me/02286595959', '_blank');
  };

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen flex flex-col pt-24 pb-28">
      
      {/* Banner Title */}
      <section className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <span className="text-[#a66a3a] uppercase tracking-[0.25em] text-xs font-bold whitespace-nowrap">
          Ẩm Thực Đỉnh Cao Golden Palace
        </span>
        <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-gray-900 mt-2 mb-3">
          Thực Đơn Tiệc & Bảng Giá Chính Thức
        </h1>
        <p className="text-gray-600 font-light text-sm max-w-3xl mx-auto leading-relaxed">
          Khám phá trọn bộ 18 Set Menu Tiệc Cưới & Hội Nghị, Menu Chuyên Món Đặc Sản, Combo Trẻ Em Hè Rực Rỡ, Menu Chọn Món và Bảng Giá Đồ Uống & Phí Mang Đồ Vào.
        </p>
      </section>

      {/* 5 CATEGORY TABS SELECTOR */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 bg-white p-3 rounded-2xl shadow-xl border border-[#e3a638]/30">
          {MENU_CATEGORIES.map(cat => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`p-3.5 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#1c1917] via-[#2a2419] to-[#0d0d0d] text-white shadow-lg border border-[#e3a638]' 
                    : 'hover:bg-amber-50/60 text-gray-700'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl mb-1 ${isActive ? 'text-[#e3a638]' : 'text-[#a66a3a]'}`}>
                  {cat.icon}
                </span>
                <span className="font-playfair font-semibold text-xs leading-tight mb-1">{cat.label}</span>
                <span className={`text-[10px] font-light ${isActive ? 'text-amber-200/80' : 'text-gray-400'}`}>{cat.count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* TAB 1: SET MENU TIỆC CƯỚI & HỘI NGHỊ (FULL 18 SETS WITH SLIDER / PAGE CAROUSEL) */}
      {activeTab === 'SET_TIEC' && (
        <section className="max-w-7xl mx-auto px-6 space-y-8">
          
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900">
              Trọn Bộ 18 Set Menu Tiệc Cưới & Hội Nghị Chính Thức
            </h2>
            <p className="text-gray-600 text-xs font-light mt-1">
              Phối hợp chuẩn vị 12 món ăn từ Khai vị, Món chính đến Tráng miệng (Sử dụng nút bấm hoặc vuốt qua lại để xem đủ 18 Set)
            </p>
          </div>

          {/* SLIDER NAVIGATION CONTROLS */}
          <div className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl border border-[#e3a638]/30 shadow-md">
            <button 
              onClick={() => setSetMenuIndex(prev => Math.max(0, prev - 1))}
              disabled={setMenuIndex === 0}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-amber-50 text-[#a66a3a] border border-[#e3a638]/40 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e3a638] hover:text-white transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Set Trước</span>
            </button>

            {/* Pagination Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60vw] py-1">
              {SET_MENUS_18.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setSetMenuIndex(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    setMenuIndex === idx 
                      ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white shadow-md scale-110' 
                      : 'bg-gray-100 text-gray-600 hover:bg-amber-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setSetMenuIndex(prev => Math.min(SET_MENUS_18.length - 1, prev + 1))}
              disabled={setMenuIndex === SET_MENUS_18.length - 1}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-amber-50 text-[#a66a3a] border border-[#e3a638]/40 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e3a638] hover:text-white transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Set Tiếp</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          {/* DISPLAY CURRENT SET MENU CARD (SWIPER / CAROUSEL FORMAT) */}
          <div className="max-w-2xl mx-auto">
            {(() => {
              const menu = SET_MENUS_18[setMenuIndex];
              return (
                <div className="bg-white rounded-3xl border-2 border-[#e3a638] shadow-2xl overflow-hidden flex flex-col justify-between transition-all">
                  
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-gray-900 via-amber-950 to-gray-900 text-white p-6 border-b border-[#e3a638]/40 relative">
                    <span className="absolute top-4 right-4 bg-[#e3a638]/20 border border-[#e3a638] text-[#e3a638] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {setMenuIndex + 1} / 18 SET MENUS
                    </span>
                    <h3 className="text-2xl font-playfair font-bold text-[#e3a638] mt-1">{menu.title}</h3>
                    <p className="text-lg font-bold text-white mt-1 font-playfair">{menu.price}</p>
                  </div>

                  {/* Dishes List */}
                  <div className="p-6 space-y-3">
                    {menu.dishes.map((dish, dIdx) => (
                      <div key={dIdx} className="flex justify-between items-center text-xs sm:text-sm py-1.5 border-b border-gray-100 last:border-0">
                        <span className="font-medium text-gray-800">{dIdx + 1}. {dish.name}</span>
                        <span className="text-[10px] font-semibold text-[#a66a3a] bg-amber-50 px-2.5 py-0.5 rounded-full flex-shrink-0 ml-2 whitespace-nowrap">{dish.type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-5 bg-[#fcf9f2] border-t border-gray-100 flex justify-between items-center gap-4">
                    <span className="text-xs text-gray-500 font-light whitespace-nowrap">Mâm 10 khách chuẩn chỉnh</span>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white hover:opacity-90 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
                    >
                      Đặt Thực Đơn {menu.title}
                    </button>
                  </div>

                </div>
              );
            })()}
          </div>

          {/* GRID PREVIEW OF ALL 18 SET MENUS BELOW */}
          <div className="pt-8">
            <h3 className="text-center font-playfair font-bold text-xl text-gray-900 mb-6">Tất Cả 18 Set Menu (Bấm để xem chi tiết)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {SET_MENUS_18.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setSetMenuIndex(idx)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    setMenuIndex === idx 
                      ? 'bg-amber-900 text-amber-300 border-[#e3a638] shadow-md font-bold' 
                      : 'bg-white text-gray-800 border-gray-200 hover:border-amber-400'
                  }`}
                >
                  <span className="block text-[10px] uppercase text-[#a66a3a] font-bold">SET {idx + 1}</span>
                  <span className="block text-xs font-bold mt-0.5 whitespace-nowrap">{m.price.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* TAB 2: MENU CHUYÊN MÓN ĐẶC SẢN (EXCLUDING CẦY HƯƠNG & MÒNG KẾT, WITH NOTE & END CARD) */}
      {activeTab === 'CHUYEN_MON' && (
        <section className="max-w-7xl mx-auto px-6 space-y-8">
          
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900">
              Danh Mục Menu Chuyên Món Đặc Sản
            </h2>
            
            {/* MANDATORY NOTICE REQUESTED BY USER */}
            <div className="mt-3 inline-flex items-center gap-2 bg-amber-100/80 border border-amber-300 text-amber-950 px-4 py-2 rounded-full text-xs font-semibold shadow-xs">
              <span className="material-symbols-outlined text-base text-amber-700">warning</span>
              <span>Lưu ý: Thực đơn không có sẵn, quý khách vui lòng đặt trước 1 ngày.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALTY_MENUS_6.map((sp, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-amber-200 p-6 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:border-[#e3a638] transition-all">
                <div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-[#a66a3a] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-xl">workspace_premium</span>
                  </div>
                  <h3 className="text-lg font-playfair font-bold text-gray-900 mb-1">{sp.title}</h3>
                  <p className="text-xs text-[#a66a3a] font-medium mb-4">{sp.subtitle}</p>

                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    {sp.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="text-xs text-gray-800 font-medium leading-relaxed flex items-start gap-2">
                        <span className="text-[#e3a638] font-bold">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    Đặt Tiệc Đặc Sản
                  </button>
                </div>
              </div>
            ))}

            {/* MANDATORY END CARD REQUESTED BY USER */}
            <div className="bg-gradient-to-br from-gray-900 via-amber-950 to-black text-white rounded-2xl border-2 border-[#e3a638] p-6 shadow-xl flex flex-col justify-between items-center text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#e3a638]/20 border border-[#e3a638] text-[#e3a638] flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl">restaurant</span>
                </div>
                <h3 className="text-xl font-playfair font-bold text-[#e3a638] mb-2">Còn Nhiều Loại Khác...</h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed mb-4">
                  Golden Palace đáp ứng đầy đủ các loại thực đơn đặc sản cao cấp theo khẩu vị và yêu cầu riêng của quý khách.
                </p>
              </div>

              <a 
                href="tel:02286595959"
                className="w-full py-3 bg-[#e3a638] text-gray-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-colors shadow-lg whitespace-nowrap block"
              >
                📞 Liên Hệ Hotline 0228 659 5959
              </a>
            </div>

          </div>
        </section>
      )}

      {/* TAB 3: MENU TRẺ EM & HỌC SINH */}
      {activeTab === 'TRE_EM' && (
        <section className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-gray-900 text-white rounded-3xl p-8 shadow-2xl border border-[#e3a638]/40 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest inline-block mb-2 whitespace-nowrap">
                ☀️ CHƯƠNG TRÌNH MENU HÈ RỰC RỠ
              </span>
              <h2 className="text-3xl font-playfair font-bold text-white mb-2">Ưu Đãi Đặc Biệt Cho Học Sinh & Thầy Cô</h2>
              <p className="text-amber-100/90 text-xs font-light max-w-2xl leading-relaxed">
                • Menu đã được giảm <strong>10%</strong> trực tiếp so với giá gốc.<br />
                • Giảm <strong>50%</strong> Phí dịch vụ sân khấu bao gồm: Âm thanh, Ánh sáng & Màn hình LED trình chiếu.<br />
                • Áp dụng từ 1/5 - 31/7 cho tiệc trẻ em & hội khóa học sinh.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
            >
              Đặt Tiệc Hè Rực RỠ ➔
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KIDS_MENUS.map((kids, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg flex flex-col justify-between hover:border-[#e3a638] transition-all">
                <div>
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <div>
                      <h3 className="font-playfair font-bold text-gray-900 text-lg">{kids.code}</h3>
                      <p className="text-xs text-[#a66a3a] font-medium mt-0.5">{kids.note}</p>
                    </div>
                    
                    <span className="bg-amber-100/90 border border-amber-300/60 text-[#a66a3a] font-bold text-xs px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
                      {kids.price}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-gray-100 pt-4 mt-3">
                    {kids.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="text-xs text-gray-700 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#e3a638] text-sm flex-shrink-0">check_circle</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2.5 bg-gray-900 text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Chọn Combo Này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: MENU CHỌN MÓN (DIVIDED INTO 3 SECTIONS WITH TAB FILTER & COLLAPSIBLE CARDS) */}
      {activeTab === 'ALACARTE' && (
        <section className="max-w-7xl mx-auto px-6 space-y-8">
          
          {/* Prominent Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-md flex items-start gap-4 text-amber-900">
            <span className="material-symbols-outlined text-amber-700 text-3xl flex-shrink-0 mt-1">info</span>
            <div>
              <h3 className="font-playfair font-bold text-lg text-amber-950 mb-1">Lưu ý về Thực Đơn Chọn Món Tươi Sống:</h3>
              <p className="text-xs text-amber-900/90 font-light leading-relaxed">
                • <strong>Món ăn thực phẩm tươi sống được nhập mới hằng ngày, giá thay đổi theo thời giá thị trường.</strong> Do đó danh mục hoàn toàn không niêm yết giá cố định.<br />
                • Quý khách vui lòng <strong>tích chọn (✔) các món ăn ưa thích</strong> để tạo Bản Nháp Thực Đơn gửi trực tiếp cho chuyên viên báo giá.
              </p>
            </div>
          </div>

          {/* FILTER BUTTONS FOR 3 MAIN SECTIONS TO PREVENT OVERWHELMING SCROLL */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveAlacarteSec('ALL')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeAlacarteSec === 'ALL' 
                  ? 'bg-gray-900 text-amber-300 shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-400'
              }`}
            >
              Tất Cả Món
            </button>
            {ALACARTE_3_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveAlacarteSec(sec.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAlacarteSec === sec.id 
                    ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white shadow-md' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-400'
                }`}
              >
                {sec.sectionTitle}
              </button>
            ))}
          </div>

          {/* RENDER FILTERED SECTIONS */}
          <div className="space-y-10">
            {ALACARTE_3_SECTIONS
              .filter(sec => activeAlacarteSec === 'ALL' || activeAlacarteSec === sec.id)
              .map((sec, secIdx) => (
                <div key={secIdx} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl">
                  
                  {/* SECTION HEADER */}
                  <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-[#e3a638]/40">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#a66a3a] flex items-center justify-center shadow-inner shrink-0">
                      <span className="material-symbols-outlined text-2xl">{sec.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-playfair font-bold text-gray-900">{sec.sectionTitle}</h2>
                      <p className="text-xs text-gray-500 font-light mt-0.5">{sec.sectionDesc}</p>
                    </div>
                  </div>

                  {/* SUB GROUPS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sec.groups.map((grp, grpIdx) => (
                      <div key={grpIdx} className="bg-[#fcf9f2] rounded-2xl border border-gray-200 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-playfair font-bold text-gray-900 pb-2.5 border-b border-[#e3a638]/30 flex items-center gap-2">
                            <span className="text-[#e3a638] text-sm">✨</span> {grp.subTitle}
                          </h3>
                          
                          <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {grp.dishes.map((dish, dIdx) => {
                              const isChecked = selectedDishes.includes(dish);
                              return (
                                <div 
                                  key={dIdx}
                                  onClick={() => toggleSelectDish(dish)}
                                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                                    isChecked 
                                      ? 'bg-amber-100/80 border-[#e3a638] font-semibold text-gray-900 shadow-xs' 
                                      : 'bg-white border-gray-200/80 text-gray-700 hover:border-amber-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 pr-2">
                                    <input 
                                      type="checkbox" 
                                      checked={isChecked}
                                      onChange={() => {}}
                                      className="accent-[#e3a638] w-4 h-4 cursor-pointer"
                                    />
                                    <span>{dish}</span>
                                  </div>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${isChecked ? 'bg-[#e3a638] text-white font-bold' : 'bg-gray-100 text-gray-500'}`}>
                                    {isChecked ? 'Đã chọn' : '+ Chọn món'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
          </div>

          {/* FLOATING DRAFT MENU BAR WHEN DISHES ARE SELECTED */}
          {selectedDishes.length > 0 && (
            <div className="fixed bottom-4 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 z-40 bg-[#1c1917] border-2 border-[#e3a638] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 sm:gap-6 max-w-xl">
              <div className="flex-grow min-w-0">
                <span className="text-[10px] uppercase tracking-widest text-[#e3a638] font-bold block truncate">Bản Nháp Thực Đơn</span>
                <span className="text-xs sm:text-sm font-semibold truncate block">Đã chọn <strong className="text-[#e3a638] font-bold text-sm sm:text-base">{selectedDishes.length}</strong> món</span>
              </div>
              
              <button
                onClick={() => setShowDraftModal(true)}
                className="px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-lg shadow-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
              >
                Xem Bản Nháp & Gửi Zalo
              </button>
            </div>
          )}

        </section>
      )}

      {/* TAB 5: MENU ĐỒ UỐNG STRICTLY MATCHING USER'S IMAGE 4 & EXACT USER NOTE TEXT */}
      {activeTab === 'DO_UONG' && (
        <section className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-playfair font-bold text-gray-900">Bảng Giá Đồ Uống & Phí Mang Đồ Vào Nhà Hàng</h2>
            <p className="text-gray-500 text-xs font-light mt-1">Bảng giá niêm yết chính thức áp dụng tại Golden Palace Nam Định</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* BẢNG 1: ĐỒ UỐNG BÁN TẠI NHÀ HÀNG */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e3a638]/40">
                <span className="text-[#e3a638] text-xl">🍾</span>
                <h3 className="text-xl font-playfair font-bold text-gray-900">Đồ Uống Bán Tại Nhà Hàng</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead className="bg-gray-900 text-amber-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-lg w-12 text-center">STT</th>
                      <th className="p-3">Tên Món Ăn / Đồ Uống</th>
                      <th className="p-3 text-right rounded-r-lg">Đơn Giá (ĐVT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {DRINK_PRICES_IMAGE4.map((row) => (
                      <tr key={row.stt} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-3 text-center text-gray-400 font-mono text-[11px]">{row.stt}</td>
                        <td className="p-3 font-semibold text-gray-900">{row.name}</td>
                        <td className="p-3 text-right font-bold text-[#a66a3a] whitespace-nowrap">{row.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BẢNG 2: PHÍ MANG ĐỒ UỐNG VÀO NHÀ HÀNG & EXACT USER NOTE TEXT */}
            <div className="lg:col-span-5 bg-gradient-to-b from-amber-950 via-gray-900 to-black text-white rounded-2xl border-2 border-[#e3a638]/60 p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e3a638]/40">
                  <span className="text-[#e3a638] text-xl">⚠️</span>
                  <h3 className="text-xl font-playfair font-bold text-[#e3a638]">Phí Mang Đồ Uống Vào Nhà Hàng</h3>
                </div>
                
                <p className="text-xs text-amber-200/80 font-light mb-4 leading-relaxed">
                  Quy định áp dụng đối với quý khách mang đồ uống từ bên ngoài vào sử dụng tại sảnh nhà hàng:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium">
                    <thead className="bg-[#e3a638]/20 text-[#e3a638] uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-lg">Loại Đồ Uống</th>
                        <th className="p-3 text-right rounded-r-lg">Mức Phí Quy Định</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {BRING_DRINK_FEES.map((feeRow, fIdx) => (
                        <tr key={fIdx} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-gray-200 font-medium">{feeRow.item}</td>
                          <td className="p-3 text-right font-bold text-amber-300 whitespace-nowrap">{feeRow.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* EXACT NOTE TEXT REQUESTED BY USER IN IMAGE 1 */}
              <div className="mt-6 p-4 rounded-xl bg-white/10 border border-[#e3a638]/40 text-xs text-amber-100 leading-relaxed font-light">
                💡 <em>Ghi chú: Phí đã bao gồm đá lạnh, ly, cốc, nậm sứ đựng rượu mạnh hải cao cấp, nhân viên phục vụ.</em>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* DRAFT MENU MODAL FOR ALACARTE */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-montserrat">
          <div className="bg-white border border-gray-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center border-b border-gray-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#e3a638] font-bold">Bản Nháp Thực Đơn Đã Chọn</span>
                <h3 className="text-xl font-playfair font-bold text-white mt-0.5">Danh Sách {selectedDishes.length} Món Ăn</h3>
              </div>
              <button onClick={() => setShowDraftModal(false)} className="text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2">
              {selectedDishes.map((dish, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#fcf9f2] border border-[#e3a638]/20">
                  <span className="font-semibold text-gray-900">{idx + 1}. {dish}</span>
                  <button onClick={() => toggleSelectDish(dish)} className="text-red-600 hover:text-red-700 text-[11px] font-medium cursor-pointer">Xóa</button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center gap-3">
              <button onClick={() => setSelectedDishes([])} className="text-xs text-gray-500 hover:text-red-600 font-medium cursor-pointer">
                Xóa tất cả
              </button>
              <div className="flex gap-3">
                <button onClick={() => setShowDraftModal(false)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                  Đóng
                </button>
                <button onClick={handleShareZalo} className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-md cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                  <span className="material-symbols-outlined text-base">share</span>
                  Sao Chép & Gửi Zalo
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <BookingConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function MenuShowcasePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center text-amber-900">Đang tải thực đơn...</div>}>
      <MenuContent />
    </Suspense>
  );
}
