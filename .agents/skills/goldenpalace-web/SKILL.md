---
name: goldenpalace-web
description: >-
  Skill chứa toàn bộ kiến thức về dự án Golden Palace Wedding Planner MVP.
  Kích hoạt khi cần: build/sửa bất kỳ tính năng nào của web app Golden Palace,
  hiểu business rules tiệc cưới, cấu trúc database/API, UI/UX specs 17 màn hình,
  hoặc kiểm tra trạng thái hiện tại của dự án.
---

# Golden Palace Wedding Planner — Project Knowledge Base

## Tổng quan sản phẩm

Web app cho **Trung tâm tiệc cưới Golden Palace** (TP. Nam Định).
- **Mục đích**: Công cụ tự khám phá + dự trù chi phí + PDF/link + thu lead
- **KHÔNG phải** hệ thống booking, thanh toán, hay CRM
- **MVP chỉ phục vụ tiệc cưới** (kiến trúc dự phòng mở rộng sinh nhật, hội nghị, v.v.)
- **Personas**: Khách hàng (Guest, không cần tài khoản), Nhân viên tư vấn (Staff), Admin

## Customer Journey (16 bước)

```
Bước 1  → Nhập số khách (100–800)
Bước 2  → Hệ thống tính mâm chính + mâm dự phòng (auto)
Bước 3  → Nhập ngân sách/mâm (≥ 3.500.000đ)
Bước 4  → Chọn ngày + buổi (Trưa/Tối)
Bước 5  → Lọc hội trường phù hợp số khách
Bước 6  → Chọn & so sánh tối đa 2 hội trường
Bước 7  → Đánh dấu 1 hội trường ưu tiên
Bước 8  → Chọn gói dịch vụ chính + dịch vụ bổ sung
Bước 9  → Xem combo thực đơn, đánh dấu yêu thích
Bước 10 → Xem bảng giá đồ uống tham khảo
Bước 11 → Xem dự trù chi tiết (ghi rõ khoản chưa bao gồm)
Bước 12 → Xem toàn bộ TRƯỚC KHI để lại thông tin
Bước 13 → Nhập thông tin → Lưu / Nhận link / Tải PDF / Yêu cầu tư vấn
Bước 14 → Link riêng. Khách mở lại, chỉnh sửa → phiên bản mới
Bước 15 → Lead vào quản trị, Admin phân cho nhân viên
Bước 16 → Nhân viên xem phương án + diff, tư vấn
```

## Công thức tính toán cốt lõi

```javascript
// Số mâm
main_tables    = Math.ceil(guest_count / 10)
reserve_tables = Math.ceil(main_tables * 0.10)

// Chi phí tiền cỗ
base_food_cost = main_tables * budget_per_table
max_food_cost  = (main_tables + reserve_tables) * budget_per_table

// Tổng dự trù (hiển thị dạng khoảng)
total_base = base_food_cost + venue_fee + main_package + sum(add_on_services)
total_max  = max_food_cost  + venue_fee + main_package + sum(add_on_services)
// Ghi rõ: "Chưa bao gồm thuế VAT, phí phục vụ, đồ uống, chi phí phát sinh."
```

## Tech Stack

| Tầng | Công nghệ |
|---|---|
| Framework | Next.js 16.3 (App Router) |
| Database | PostgreSQL (Supabase) / SQLite (local dev) |
| ORM | Prisma 5.x |
| Auth | NextAuth.js v4 (Credentials, 2 roles) |
| PDF | Puppeteer (server-side HTML→PDF) |
| Storage | Supabase Storage |
| Hosting | Vercel + Supabase |
| Styling | Tailwind CSS 3.x (custom Golden Palace theme) |
| Fonts | Playfair Display (headings) + Inter (body) |
| Icons | Material Symbols |

## Design System (Quick Reference)

| Token | Value |
|---|---|
| Primary Gold | #C5975B → #D4A96A (gradient) |
| Dark Navy | #1A1A2E |
| Card radius | 12px |
| Button radius | 8px |
| Breakpoint | Mobile-first, ≥768px |
| Animations | fadeIn, slideUp, shimmer, float |

## Quy tắc làm việc quan trọng

1. **KHÔNG tự bịa dữ liệu**: Không bịa bảng giá, tên hội trường, số lượng gói, dữ liệu khách
2. **Câu chữ chính thức KHÔNG ĐƯỢC thay đổi**: Disclaimer giá, Thông báo lịch, Consent (xem references/business-rules.md)
3. **Price Freezing**: Phương án khách đã lưu giữ nguyên giá tại thời điểm tạo
4. **Draft/Publish**: Admin tạo nháp trước → xem trước → publish. Khách chỉ thấy bản published
5. **Versioning**: Mỗi lần khách chỉnh sửa → tạo phiên bản mới, KHÔNG ghi đè
6. **Combo thực đơn**: Chỉ tham khảo, KHÔNG tham gia phép tính tổng dự trù
7. **Đồ uống**: Hiển thị riêng, tham khảo, KHÔNG tính vào tổng

## Tài liệu tham khảo chi tiết

Đọc thêm khi cần triển khai cụ thể:

- **[Business Rules](./references/business-rules.md)** — Toàn bộ quy tắc nghiệp vụ, công thức, trạng thái lead, phân quyền, câu chữ chính thức, 13 tiêu chí nghiệm thu
- **[Tech Architecture](./references/tech-architecture.md)** — Database schema 17 models, API endpoints, project structure, design system, env vars, known issues
- **[UI/UX Specs](./references/ui-ux-specs.md)** — Chi tiết 17 màn hình (MH1–MH17), components, interactions, design tokens
- **[Current Status](./references/current-status.md)** — Tiến độ hiện tại, những gì đã làm/chưa làm, file tree, git history, known issues

## Tài liệu gốc (trong project root)

Các file tài liệu gốc nằm ở thư mục cha của golden-palace/:
- `PRODUCT-SPECIFICATION.md` — Product spec đầy đủ
- `IMPLEMENTATION-PLAN.md` — Implementation plan + roadmap 4 tuần
- `HANDOFF-BRAINSTORM-GOLDEN-PALACE.md` — Brainstorming notes
- `ui-ux-specs/` — 5 file UI/UX spec chi tiết (01–05)
