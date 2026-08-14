# Kinh nghiệm & Bài học kỹ thuật (Lessons Learned)

Tài liệu này tổng hợp các vấn đề kỹ thuật, bug phổ biến và cách giải quyết (workarounds) đã được đúc rút trong quá trình phát triển dự án Golden Palace Wedding Planner. Kích hoạt khi cần xử lý bug hạ tầng, thiết kế database, hoặc tra cứu các rào cản kỹ thuật đã được fix.

## 1. Database & Hosting (Vercel + Supabase + SQLite)
- **Vấn đề mất dữ liệu với SQLite trên Vercel:** Vercel sử dụng môi trường Serverless (Ephemeral Storage), do đó cơ sở dữ liệu SQLite chỉ tồn tại trong thời gian request chạy và sẽ bị xóa/reset ngay sau đó. Các bản build đầu đã gặp lỗi này.
- **Giải pháp:** Bắt buộc sử dụng **PostgreSQL (Supabase)** cho môi trường Production. Cần thiết lập trong `schema.prisma`:
  - `provider = "postgresql"`
  - `url = env("DATABASE_URL")` (Transaction connection pooler, cổng 6543)
  - `directUrl = env("DIRECT_URL")` (Session connection, cổng 5432, dùng cho `prisma migrate`)
- **Fix lỗi build Vercel do Prisma:** Trong `package.json`, luôn cần thêm script `"postinstall": "prisma generate"` để Vercel tự động build Prisma Client trước khi chạy build Next.js. Nếu thiếu sẽ bị crash api endpoint.
- **Tạm thời Bypass (Mocking):** Trong giai đoạn chưa nối Supabase hoàn chỉnh, đã từng phải dùng kỹ thuật mock Prisma calls (ví dụ `POST /api/leads` chỉ trả mock data) để Vercel deploy thành công và xem được UI. 

## 2. Next.js App Router & NextAuth
- **Lỗi export trong API Routes (`route.js`):** Next.js App Router (từ v13.2+) cấm export các giá trị không phải HTTP handlers từ các file API route. Việc cấu hình NextAuth trực tiếp trong `[...nextauth]/route.js` và export `authOptions` từ đó sẽ làm Next.js build failed.
- **Giải pháp:** Tách toàn bộ cấu hình `authOptions` ra một file riêng biệt `src/lib/auth-options.js` và chỉ import vào `route.js` (Server Handlers) hoặc các Server Components cần lấy session.
- **Hydration Mismatch với `date-fns`:** Cẩn thận khi sử dụng các hàm format time (ví dụ `date-fns` hoặc `Intl.DateTimeFormat`) trong JSX template strings, rất dễ gây lỗi Server-Client mismatch. Đã phải fix bằng cách chuẩn hoá đầu vào hoặc dùng `useEffect` nếu cần render timezone locale cụ thể.

## 3. Prisma Schema & Data Types
- **Kiểu dữ liệu tiền tệ:** Sử dụng `Decimal` (cụ thể `@db.Decimal(14,2)`) thay cho `Float` ở tất cả các trường giá/tiền. Việc này tránh sai số làm tròn khi tính toán chi phí (vốn có thể lên hàng trăm triệu đồng).
- **SQLite Compatibility:** Trong môi trường Dev dùng SQLite, không hỗ trợ Enums chuẩn hoặc mảng JSON. Đã có script `convert-to-sqlite.js` và `fix-schema.js` để chuyển Enums thành String, và fallback JSON về chuỗi. Cần chú ý khi switch qua lại giữa các provider.
- **Bảo toàn dữ liệu giá (Price Freezing):** Để giữ đúng báo giá cho khách ở thời điểm tạo dự toán, dùng `@@unique([leadId, version])` trên model `Proposal`. Giá ở `ProposalVenue` và `ProposalAddOn` là giá chết (snapshot), không liên kết trực tiếp (foreign key constraint) với giá live trên catalog.
- **Hardcode Admin:** Để bypass đăng nhập trên môi trường không kết nối DB, từng áp dụng hardcode fallback `admin@goldenpalace.vn`. Đối với production thật, cần dùng Prisma seed (`prisma/seed.js`) có bcrypt hash đàng hoàng.

## 4. UI / UX & Brand Guidelines
- **Chủ đề & Tone màu:** Mặc dù bắt đầu bằng dark-theme/skeleton, nhưng thực tế Branding Guidelines dùng **Light theme**, với nền sáng, chi tiết Vàng đồng (Gold Gradient `#C5975B → #D4A96A`). Logo là Emblem trong suốt. Đã có đợt refactor toàn bộ styling theo chuẩn này (sửa `tailwind.config.js`).
- **Tối ưu trải nghiệm chuyển đổi (CTA):** 
  - Slogan giữ 1 dòng trên màn hình desktop.
  - Sử dụng **Right-side floating CTA action bar** (Thanh hành động bám dính lề phải) để người dùng có thể luôn click Tư Vấn / Đặt Tiệc bất kỳ lúc nào.
- **Footer tin cậy:** Đã tích hợp Google Maps iframe thay cho text thường để người dùng dễ hình dung vị trí (Nam Định) và form tư vấn trực tiếp dưới chân trang.
