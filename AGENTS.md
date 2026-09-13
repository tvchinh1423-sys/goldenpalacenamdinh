<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Quy Tắc Đồng Bộ Tất Cả Các Hệ Điều Hành (Windows, Android, iOS, macOS)

Mọi thay đổi mã nguồn trong tương lai BẮT BUỘC tuân thủ các nguyên tắc sau:
1. **Nén & Tự động chuyển đổi ảnh ở Frontend (`compressImageToJpeg`)**: Tất cả các tính năng tải/chụp ảnh ở Frontend bắt buộc tự động nén về < 1600px và chuẩn hóa dạng `image/jpeg` qua HTML5 Canvas trước khi gửi API (đảm bảo tương thích HEIC trên iPhone và không bị quá 4.5MB Payload limit trên Vercel khi tải từ Android/Windows).
2. **Kích hoạt File Input bằng Native `<label>`**: Các nút chọn/chụp ảnh phải sử dụng `<label htmlFor="...">` tương thích chuẩn với trình duyệt iOS Safari & Android WebViews. Không gọi `.click()` bất đồng bộ trong JS.
3. **MIME Type Normalization ở Backend**: Tất cả API route tiếp nhận `imageBase64` phải tự động fallback `mimeType = 'image/jpeg'` nếu mimeType không thuộc `['image/jpeg', 'image/png', 'image/webp']`.
4. **Deploy & Push**: Sau bất kỳ sửa đổi nào, luôn commit, push lên `main` và kiểm tra Vercel deployment đạt trạng thái READY.

