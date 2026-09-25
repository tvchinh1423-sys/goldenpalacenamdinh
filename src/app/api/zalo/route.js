import { NextResponse } from 'next/server';

export async function GET() {
  // Tránh lộ số điện thoại trên giao diện Web bằng cách chuyển hướng trực tiếp từ máy chủ
  return NextResponse.redirect('https://zalo.me/0868262889');
}
