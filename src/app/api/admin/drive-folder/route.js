import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: 'Thiếu đường dẫn URL' }, { status: 400 });
    }

    const trimmedUrl = url.trim();

    // 1. Single File URL
    const singleFileIdMatch = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                              trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (singleFileIdMatch && singleFileIdMatch[1] && !trimmedUrl.includes('/folders/')) {
      const fileId = singleFileIdMatch[1];
      const imgUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
      return NextResponse.json({
        success: true,
        type: 'SINGLE_FILE',
        count: 1,
        images: [imgUrl]
      });
    }

    // 2. Folder URL
    const folderIdMatch = trimmedUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (!folderIdMatch || !folderIdMatch[1]) {
      // If it's a plain image link (/images/... or http...)
      return NextResponse.json({
        success: true,
        type: 'DIRECT_LINK',
        count: 1,
        images: [trimmedUrl]
      });
    }

    const folderId = folderIdMatch[1];
    const folderFetchUrl = `https://drive.google.com/drive/folders/${folderId}`;

    const driveRes = await fetch(folderFetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!driveRes.ok) {
      return NextResponse.json({ success: false, error: 'Không thể truy cập thư mục Google Drive (Vui lòng bật quyền công khai "Bất kỳ ai có liên kết")' }, { status: 400 });
    }

    const html = await driveRes.text();

    // Extract 33-character Google Drive File IDs
    const matches = new Set(html.match(/\"([a-zA-Z0-9_-]{33})\"/g) || []);
    const fileIds = Array.from(matches)
      .map(str => str.replace(/\"/g, ''))
      .filter(id => id !== folderId);

    // Convert file IDs to direct viewable image CDN URLs
    const imageCdnUrls = fileIds.map(fid => `https://lh3.googleusercontent.com/d/${fid}`);

    return NextResponse.json({
      success: true,
      type: 'FOLDER',
      folderId,
      count: imageCdnUrls.length,
      images: imageCdnUrls
    });

  } catch (err) {
    console.error('Drive API Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi xử lý Google Drive' }, { status: 500 });
  }
}
