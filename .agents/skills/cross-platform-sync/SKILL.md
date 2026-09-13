---
name: cross-platform-sync
description: >-
  Rules and procedures for ensuring 100% compatibility across Windows, Android, iOS (iPhone/iPad), and macOS.
  Use this skill whenever handling image/file uploads, camera capture, API payloads, form inputs, or cross-platform UI interactions.
---

# Quy Trình Đồng Bộ Tất Cả Các Hệ Điều Hành (Windows, Android, iOS, macOS)

Tài liệu này quy định quy chuẩn kỹ thuật bắt buộc để đảm bảo mọi tính năng trên Golden Palace hoạt động đồng bộ 100% trên tất cả các hệ điều hành: **Windows, Android, iOS (iPhone/iPad) và macOS**.

## 1. Chuẩn Hóa & Nén Ảnh Trước Khi Gửi API (Image & Canvas Compression)
- **Định dạng iPhone/iPad (HEIC/HEIF)**: Ảnh chụp từ iOS mặc định dạng `.heic` sẽ bị Google AI API từ chối (`400 Unsupported MIME`). Tất cả các trình xử lý ảnh ở Frontend PHẢI dùng Canvas HTML5 (`compressImageToJpeg`) nén và chuyển về `image/jpeg` chuẩn trước khi đọc DataURL hay gửi API.
- **Giới hạn dung lượng Payload (Payload Limit < 4.5MB)**: Ảnh chụp từ camera Android và Windows thường có dung lượng > 10MB. Phải tự động resize tỷ lệ ảnh xuống tối đa **1600px width/height** và nén chất lượng 0.85 JPG (~300KB) để không vượt giới hạn Vercel Body Payload limit.

## 2. Trình Kích Hoạt Nút Tải/Chụp Ảnh Cross-Platform (Native Label Triggers)
- **Không dùng async JavaScript `.click()`**: Trình duyệt iOS Safari và Android WebViews chặn lệnh `.click()` trên `input[type="file"]` ẩn nếu gọi từ các callback bất đồng bộ (`async/await`).
- **Bắt buộc dùng thẻ Native `<label htmlFor="...">`**: Các nút *"Chụp ảnh"* và *"Tải ảnh"* phải được bọc hoặc gán thuộc tính `htmlFor` trỏ tới thẻ `<input type="file">` ẩn tương ứng.
- **Thuộc tính Input chuẩn**:
  - Tải file: `accept="image/*,image/heic,image/heif,.heic,.heif,.pdf"`
  - Chụp camera: `accept="image/*,image/heic,image/heif" capture="environment"`

## 3. MIME Type Fallback ở Backend API Route
- **Auto-Fix MIME Type**: Ở tất cả các API route tiếp nhận `imageBase64` (`parse-booking`, `parse-ai`), nếu `mimeType` trích xuất được không thuộc danh sách `['image/jpeg', 'image/png', 'image/webp']` (ví dụ: `image/heic`, `image/quicktime`, `application/octet-stream`), PHẢI tự động gán fallback `mimeType = 'image/jpeg'`.

## 4. Quy Trình Kiểm Tra & Đẩy Code (Deployment Protocol)
- **Không hardcode Secret/API Key trong file code**: API Key phải đọc từ `process.env.GEMINI_API_KEY` để vượt qua GitHub Push Protection.
- **Đẩy code đồng bộ**: Sau khi thực hiện bất kỳ sửa đổi nào, lập tức commit, push lên GitHub `main` và verify Vercel build status `READY`.
