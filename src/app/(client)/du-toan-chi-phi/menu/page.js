'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

const MIN_BUDGET_PER_TABLE = 3200000; // Minimum limit 3.200.000 VNĐ / mâm

// FULL 18 SET MENUS MATCHING /thuc-don
const SET_MENUS_18 = [
  {
    title: 'SET MENU TIỆC 1',
    price: '3.200.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '3.400.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '3.450.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '3.750.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '3.950.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '4.050.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '4.150.000 VNĐ / MÂM 10 KHÁCH',
    dishes: [
      { type: 'Khai vị', name: 'Súp lươn nấm thả' },
      { type: 'Khai vị', name: 'Salad trứng cá hồi' },
      { type: 'Món chính', name: 'Gà rút xương sốt sâm nấm' },
      { type: 'Món chính', name: 'Ba ba om chuối đậu (1.5kg)' },
      { type: 'Món chính', name: 'Dê hấp lá hương' },
      { type: 'Món chính', name: 'Tôm 5 hoa chiên trứng muối' },
      { type: 'Món chính', name: 'Hải sâm tôm nõn xào xốt X.O' },
      { type: 'Món củ', name: 'Củ quả luộc' },
      { type: 'Món ăn phụ', name: 'Bánh bí chiên' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi Hoàng Phố' },
      { type: 'Tráng miệng', name: 'Bưởi da xanh' },
    ]
  },
  {
    title: 'SET MENU TIỆC 8',
    price: '4.400.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '4.450.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '4.650.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '4.750.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '5.100.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '5.150.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '5.400.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '5.400.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '5.900.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '6.600.000 VNĐ / MÂM 10 KHÁCH',
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
    price: '6.900.000 VNĐ / MÂM 10 KHÁCH',
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

const DRINK_PRICES = [
  { stt: 1, name: 'Coca / Pepsi', unitPrice: '15.000/lon' },
  { stt: 2, name: 'Nước cam', unitPrice: '12.000/lon' },
  { stt: 3, name: '7 up', unitPrice: '12.000/lon' },
  { stt: 4, name: 'Bò húc', unitPrice: '18.000/lon' },
  { stt: 5, name: 'Rượu ngâm', unitPrice: '120.000/lít' },
  { stt: 6, name: 'Dasani', unitPrice: '10.000/chai' },
  { stt: 7, name: 'Vodka đen', unitPrice: '230.000/chai' },
  { stt: 8, name: 'Vodka xanh', unitPrice: '120.000/chai' },
  { stt: 9, name: 'Heineken', unitPrice: '30.000/chai' },
  { stt: 10, name: 'Sài gòn lùn', unitPrice: '20.000/chai' },
  { stt: 11, name: 'Tiger', unitPrice: '25.000/chai' },
];

const BRING_DRINK_FEES = [
  { item: 'Rượu ngâm', fee: '30.000/lít' },
  { item: 'Rượu vodka', fee: '70.000/chai' },
  { item: 'Rượu vang', fee: '150.000/chai' },
  { item: 'Rượu mạnh', fee: '200.000/chai' },
  { item: 'Bia, nước ngọt, nước lọc', fee: '30.000/người' }
];

export default function Step4Menu() {
  const { estimateData, updateEstimate } = useEstimate();
  const { guestCount, budgetPerTable } = estimateData;

  const [currentBudget, setCurrentBudget] = useState(budgetPerTable || MIN_BUDGET_PER_TABLE);
  const [activeMenuTab, setActiveMenuTab] = useState('SETS');
  const [setMenuIndex, setSetMenuIndex] = useState(0);

  const tableCount = Math.ceil(guestCount / 10);

  const handleBudgetChange = (val) => {
    let num = Number(val);
    if (isNaN(num)) num = MIN_BUDGET_PER_TABLE;
    setCurrentBudget(num);
    updateEstimate({ budgetPerTable: Math.max(num, MIN_BUDGET_PER_TABLE) });
  };

  const handleBudgetBlur = () => {
    if (currentBudget < MIN_BUDGET_PER_TABLE) {
      setCurrentBudget(MIN_BUDGET_PER_TABLE);
      updateEstimate({ budgetPerTable: MIN_BUDGET_PER_TABLE });
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-40">
      
      {/* Sub-header Context */}
      <div className="bg-white border-b border-gray-200 shadow-xs py-3 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/du-toan-chi-phi/services" className="flex items-center gap-1 text-[#a66a3a] hover:underline text-xs uppercase font-bold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Quay lại chọn dịch vụ</span>
          </Link>
          <span className="text-xs uppercase tracking-wider font-bold text-[#a66a3a]">
            Bước 4 / 5: Ngân Sách Mâm Cỗ & Tham Khảo Thực Đơn
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center mb-8">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">Bước 4 / 5</span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
            Ngân Sách Thực Đơn & Bảng Giá Đồ Uống
          </h2>
          <p className="text-gray-600 font-light text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Điền mức ngân sách mâm mong muốn và tham khảo trực quan trọn bộ 18 Set Menu tiệc cưới & Bảng giá đồ uống chính thức.
          </p>
        </div>

        {/* 1. ĐẦU TRANG: Ô NHẬP NGÂN SÁCH MÂM MONG MUỐN */}
        <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-xl p-6 sm:p-10 space-y-8">
          <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs text-[#a66a3a] uppercase tracking-widest font-bold block mb-0.5">Mức ngân sách mâm</span>
              <h3 className="text-2xl font-playfair font-bold text-gray-900">Điền Ngân Sách Mâm Cỗ Mong Muốn</h3>
            </div>
            <div className="bg-amber-100/80 text-[#a66a3a] px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-300">
              Quy mô: {tableCount} mâm ({guestCount} khách)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-2xl bg-[#fcf9f2] border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#a66a3a]">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Mức ngân sách niêm yết tối thiểu: {formatCurrency(MIN_BUDGET_PER_TABLE)} / mâm</span>
                </div>
                <p className="text-gray-500 text-[11px] font-light leading-relaxed">
                  Mức ngân sách tối thiểu cho tiệc cưới tại Golden Palace là 3.200.000 VNĐ / mâm 10 khách. Bạn có thể chọn các mức ngân sách cao hơn để nâng cấp các món hải sản & món đặc sắc.
                </p>
              </div>

              {/* NÚT CHỌN NHANH */}
              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-2">Chọn mức ngân sách gợi ý:</label>
                <div className="flex flex-wrap gap-2">
                  {[3200000, 3800000, 4500000, 6000000].map((amt) => (
                    <button 
                      key={amt}
                      type="button"
                      onClick={() => handleBudgetChange(amt)}
                      className={`py-2 px-4 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                        currentBudget === amt 
                          ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white border-transparent shadow-md' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                      }`}
                    >
                      {(amt / 1000000).toFixed(1)}M / mâm
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ô NHẬP TỰ DO CÓ KHÓA MINIMUM 3.2M */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#1c1917] to-[#2a2419] p-6 rounded-3xl text-white shadow-xl space-y-4">
              <span className="text-[11px] uppercase tracking-widest text-[#e3a638] font-bold block">Ngân Sách Chọn</span>
              
              <div className="relative">
                <input 
                  type="number"
                  min={MIN_BUDGET_PER_TABLE}
                  step="100000"
                  value={currentBudget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  onBlur={handleBudgetBlur}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-3.5 px-4 text-xl font-bold text-white focus:border-[#e3a638] focus:outline-none"
                />
                <span className="absolute right-4 top-4 text-xs font-bold text-[#e3a638]">VNĐ / mâm</span>
              </div>

              {currentBudget < MIN_BUDGET_PER_TABLE && (
                <p className="text-[11px] text-red-400 font-semibold">
                  ⚠️ Mức ngân sách tối thiểu của nhà hàng là 3.200.000 VNĐ / mâm
                </p>
              )}

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-gray-300">Tổng tiền mâm cỗ ({tableCount} mâm):</span>
                <span className="text-xl font-playfair font-bold text-[#e3a638]">
                  {formatCurrency(Math.max(currentBudget, MIN_BUDGET_PER_TABLE) * tableCount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Ở DƯỚI: THAM KHẢO SET MENU TIỆC CƯỚI & BẢNG GIÁ ĐỒ UỐNG (Y NHƯ TRONG PHẦN THỰC ĐƠN) */}
        <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-xl p-6 sm:p-10 space-y-8">
          
          {/* TAB SELECTOR */}
          <div className="flex justify-center border-b border-gray-200 pb-4">
            <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl gap-2">
              <button 
                onClick={() => setActiveMenuTab('SETS')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMenuTab === 'SETS' 
                    ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🍱 Tham Khảo 18 Set Menu Tiệc Cưới
              </button>

              <button 
                onClick={() => setActiveMenuTab('DRINKS')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMenuTab === 'DRINKS' 
                    ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🥂 Bảng Giá Đồ Uống & Phí Mang Vào
              </button>
            </div>
          </div>

          {/* CONTENT 1: SET MENU TIỆC CƯỚI (ALL 18 SETS) */}
          {activeMenuTab === 'SETS' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-[#fcf9f2] p-4 rounded-2xl border border-amber-200">
                <button 
                  onClick={() => setSetMenuIndex(prev => Math.max(0, prev - 1))}
                  disabled={setMenuIndex === 0}
                  className="px-4 py-2 bg-white text-[#a66a3a] border border-[#e3a638] font-bold text-xs rounded-xl disabled:opacity-30 cursor-pointer"
                >
                  ◄ Set Trước
                </button>

                <span className="text-xs font-bold text-gray-900 font-playfair uppercase text-center">
                  Đang xem: {SET_MENUS_18[setMenuIndex].title} ({setMenuIndex + 1} / 18 SETS)
                </span>

                <button 
                  onClick={() => setSetMenuIndex(prev => Math.min(SET_MENUS_18.length - 1, prev + 1))}
                  disabled={setMenuIndex === SET_MENUS_18.length - 1}
                  className="px-4 py-2 bg-white text-[#a66a3a] border border-[#e3a638] font-bold text-xs rounded-xl disabled:opacity-30 cursor-pointer"
                >
                  Set Tiếp ►
                </button>
              </div>

              {/* ACTIVE SET CARD */}
              <div className="bg-white rounded-3xl border-2 border-[#e3a638] p-6 shadow-xl max-w-2xl mx-auto space-y-4">
                <div className="bg-gradient-to-r from-gray-900 to-amber-950 text-white p-4 rounded-2xl flex justify-between items-center">
                  <h4 className="text-xl font-playfair font-bold text-[#e3a638]">{SET_MENUS_18[setMenuIndex].title}</h4>
                  <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400">
                    {SET_MENUS_18[setMenuIndex].price}
                  </span>
                </div>

                <div className="space-y-2">
                  {SET_MENUS_18[setMenuIndex].dishes.map((d, dIdx) => (
                    <div key={dIdx} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100">
                      <span className="font-medium text-gray-800">{dIdx + 1}. {d.name}</span>
                      <span className="text-[10px] font-semibold text-[#a66a3a] bg-amber-50 px-2 py-0.5 rounded-full">{d.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK SELECT GRID FOR ALL 18 SET MENUS */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-center font-playfair font-bold text-sm text-gray-900 mb-3">Tất Cả 18 Set Menu (Bấm để xem nhanh)</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SET_MENUS_18.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSetMenuIndex(idx)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        setMenuIndex === idx 
                          ? 'bg-amber-900 text-amber-300 border-[#e3a638] shadow-md font-bold' 
                          : 'bg-white text-gray-800 border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      <span className="block text-[10px] uppercase text-[#a66a3a] font-bold">SET {idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* CONTENT 2: BẢNG GIÁ ĐỒ UỐNG & PHÍ MANG VÀO */}
          {activeMenuTab === 'DRINKS' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Đồ uống nhà hàng */}
                <div className="lg:col-span-7 bg-[#fcf9f2] p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-playfair font-bold text-lg text-gray-900 mb-3">Đồ Uống Bán Tại Nhà Hàng</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-900 text-amber-200">
                        <tr>
                          <th className="p-2.5">STT</th>
                          <th className="p-2.5">Tên Đồ Uống</th>
                          <th className="p-2.5 text-right">Đơn Giá</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {DRINK_PRICES.map(d => (
                          <tr key={d.stt}>
                            <td className="p-2.5 text-gray-500">{d.stt}</td>
                            <td className="p-2.5 font-bold text-gray-900">{d.name}</td>
                            <td className="p-2.5 text-right font-bold text-[#a66a3a]">{d.unitPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Phí mang vào */}
                <div className="lg:col-span-5 bg-gradient-to-br from-amber-950 to-gray-900 text-white p-6 rounded-2xl border border-[#e3a638]/40 space-y-4">
                  <h4 className="font-playfair font-bold text-lg text-[#e3a638]">Phí Mang Đồ Uống Vào</h4>
                  <div className="space-y-2 text-xs">
                    {BRING_DRINK_FEES.map((f, fIdx) => (
                      <div key={fIdx} className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span>{f.item}</span>
                        <span className="font-bold text-amber-300">{f.fee}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl text-[11px] text-amber-100 font-light">
                    💡 <em>Ghi chú: Phí đã bao gồm đá lạnh, ly, cốc, nậm sứ đựng rượu mạnh cao cấp, nhân viên phục vụ.</em>
                  </div>
                </div>

              </div>

              {/* NOTICE ABOUT ACTUAL DRINK CONSUMPTION (REQUESTED BY USER IN ANH 1) */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-700 text-xl flex-shrink-0 mt-0.5">info</span>
                <div>
                  <strong className="block text-sm font-bold mb-1 text-amber-900">Lưu ý quan trọng về Đồ uống:</strong>
                  <p className="font-light leading-relaxed text-amber-950">
                    Nhà hàng Golden Palace không bán đồ uống theo thùng cố định. <strong>Tiền đồ uống sẽ được chốt theo số lượng thực tế sử dụng sau khi kết thúc tiệc cưới.</strong>
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-[#e3a638]/40 shadow-xl">
          <Link href="/du-toan-chi-phi/services">
            <button type="button" className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại chọn dịch vụ
            </button>
          </Link>

          <Link href="/du-toan-chi-phi/estimate">
            <button 
              type="button"
              className="bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
            >
              <span>Sang Bước 5: Xem Bảng Báo Giá Chi Tiết</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
