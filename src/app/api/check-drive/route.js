import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ success: false, error: 'Thiếu đường dẫn URL' });
    }

    const trimmedUrl = url.trim();

    // If it's not a Google Drive link (e.g. Dropbox, OneDrive, Mega, iCloud)
    if (!trimmedUrl.includes('drive.google.com') && !trimmedUrl.includes('docs.google.com')) {
      return NextResponse.json({
        success: true,
        isGoogleDrive: false,
        isPublic: true,
        message: 'Link lưu trữ đám mây ngoài Google Drive'
      });
    }

    // Extract File ID or Folder ID if available
    const folderMatch = trimmedUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    const fileMatch = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    let testFetchUrl = trimmedUrl;
    if (folderMatch && folderMatch[1]) {
      testFetchUrl = `https://drive.google.com/drive/folders/${folderMatch[1]}`;
    } else if (fileMatch && fileMatch[1]) {
      testFetchUrl = `https://drive.google.com/file/d/${fileMatch[1]}/view`;
    }

    const driveRes = await fetch(testFetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      redirect: 'follow'
    });

    const finalUrl = driveRes.url || '';
    
    // IF REDIRECTED TO GOOGLE LOGIN PAGE -> LINK IS PRIVATE / RESTRICTED
    const isLoginRedirect = finalUrl.includes('accounts.google.com') || finalUrl.includes('ServiceLogin');
    if (isLoginRedirect || driveRes.status === 403 || driveRes.status === 401) {
      return NextResponse.json({
        success: true,
        isGoogleDrive: true,
        isPublic: false,
        error: 'Link Google Drive đang để chế độ Riêng Tư (Cần quyền truy cập)'
      });
    }

    // Check page title for explicit Access Denied / You Need Access titles
    const html = await driveRes.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const titleText = titleMatch ? titleMatch[1] : '';

    if (titleText.includes('Yêu cầu quyền truy cập') || titleText.includes('You need access') || titleText.includes('Access Denied')) {
      return NextResponse.json({
        success: true,
        isGoogleDrive: true,
        isPublic: false,
        error: 'Link Google Drive đang để chế độ Riêng Tư (Cần xin quyền truy cập)'
      });
    }

    // Public link confirmed!
    return NextResponse.json({
      success: true,
      isGoogleDrive: true,
      isPublic: true,
      message: 'Link Google Drive đã được mở công khai hợp lệ'
    });

  } catch (err) {
    console.error('Check Drive Error:', err);
    // On unexpected fetch error, do not block user
    return NextResponse.json({
      success: true,
      isGoogleDrive: true,
      isPublic: true,
      message: 'Đã nhận link Google Drive'
    });
  }
}
