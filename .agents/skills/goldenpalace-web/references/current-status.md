# Current Project Status — Golden Palace Wedding Planner

Cập nhật: 2026-08-13 (lần 2 — sau khi đối chiếu tài liệu với source code thực tế)

## ⚠️ Đính chính so với bản trước

Bản status trước đó nói quá tiến độ. Thực tế đã kiểm chứng bằng code:

| Tài liệu cũ nói | Thực tế |
|---|---|
| Supabase credentials có trong `.env.production` | Sai. Không có `DATABASE_URL` ở bất kỳ file env nào |
| `admin/dashboard/page.js`, `admin/staff/page.js` đã có | Sai. Hai file không tồn tại |
| `POST /api/leads` working | Sai. Prisma bị comment out, chỉ `console.log` rồi trả success giả |
| Auth working | Sai. Hardcode `admin@goldenpalace.vn/admin123`, không query DB |
| Đã setup migration | Sai. Không có `prisma/migrations/`, DB tạo bằng `db push` |
| Giá có thể dùng Float | Sai (theo hướng tốt). Schema đã dùng `Decimal` từ đầu |

## Đã làm trong phiên chuyển giao Claude Code

- [x] `schema.prisma` chuyển sang PostgreSQL: `provider = "postgresql"`, `url = env("DATABASE_URL")`, `directUrl = env("DIRECT_URL")`
- [x] Khôi phục 5 enums thật: `Role`, `PublishStatus`, `LeadStatus`, `EventSession`, `PostType` (trước bị hạ cấp thành `String` cho SQLite)
- [x] Khôi phục `Json` cho images/videos/dishes/excludedFromPackages (trước là `String @default("[]")`)
- [x] Thêm `@db.Decimal(14,2)` cho toàn bộ trường tiền
- [x] Thêm index cho các truy vấn nóng + `@@unique([leadId, version])` trên Proposal
- [x] Tách `authOptions` ra `src/lib/auth-options.js` (App Router cấm route.js export giá trị ngoài HTTP handler)
- [x] Gỡ hardcode admin → xác thực thật bằng `prisma.user.findUnique` + bcrypt + chặn `isActive: false`
- [x] Gỡ mock trong `/api/leads` → tạo Lead thật kèm `code` (GP-YYMMDD-XXXX) và `linkToken` (UUID)
- [x] `prisma/seed.js` — chỉ seed tài khoản Admin, KHÔNG bịa dữ liệu nghiệp vụ
- [x] `.env.example` + placeholder trong `.env` (Prisma CLI chỉ đọc `.env`, không đọc `.env.local`)
- [x] npm scripts: `db:migrate`, `db:deploy`, `db:seed`, `db:studio`
- [x] `.gitignore`: bỏ ignore `prisma/migrations/`, thêm ignore `prisma/dev.db`, giữ `.env.example`

## Đang chờ (blocker)

Chưa chạy được `prisma migrate` vì **chưa có chuỗi kết nối Supabase thật**.
Vercel CLI và Supabase CLI đều chưa cài/chưa đăng nhập trên máy dev.

Cần dọn thủ công (đã lỗi thời, còn trong git): `convert-to-sqlite.js`, `fix-defaults.js`,
`fix-links.js`, `seed-admin.js` (thay bằng `prisma/seed.js`), `prisma/dev.db`.

## Tổng quan tiến độ

Dự án đang ở giai đoạn **sơ khai** — có foundation nhưng phần lớn features chưa hoàn thiện. Code hiện tại là phiên bản rebuild sau khi code cũ bị xóa.

## Đã hoàn thành ✅

### Foundation
- [x] Next.js 16.3 project setup với App Router
- [x] Prisma schema 17 models (SQLite local, PostgreSQL production)
- [x] NextAuth.js authentication (Credentials provider)
- [x] Tailwind CSS custom theme (Golden Palace colors, fonts)
- [x] Google Fonts: Playfair Display + Inter
- [x] Admin seed script (admin@goldenpalace.vn / admin123)
- [x] Vercel deployment config
- [x] Git repository: tvchinh1423-sys/goldenpalacenamdinh

### Guest UI (Sơ khai)
- [x] Landing homepage with hero section
- [x] Estimation Step 1-4: Guest count slider, budget input, date/session
- [x] Estimation Step 5-7: Venues page (skeleton, dùng mock data)
- [x] Estimation Step 8-10: Services page (skeleton, dùng mock data)
- [x] Estimation Step 11-12: Estimate summary page (skeleton)
- [x] Client layout with Navbar + Footer
- [x] Route Group `(client)` structure

### Admin UI (Sơ khai)
- [x] Admin login page
- [x] Admin layout with dark sidebar
- [x] Dashboard page (placeholder KPI)
- [x] Leads list page (mock data)
- [x] Posts management page

### API
- [x] POST /api/auth/[...nextauth] — Authentication
- [x] POST /api/leads — Create lead (nhưng data mất trên Vercel do SQLite)

### Lib
- [x] prisma.js — Client singleton
- [x] auth.js — NextAuth config
- [x] calculations.js — calculateTables(), calculateFoodCost()
- [x] constants.js — MIN_GUESTS, MAX_GUESTS, MIN_BUDGET, etc.

## Chưa hoàn thành ❌

### Critical (Phải làm trước)
- [ ] **Migrate SQLite → PostgreSQL (Supabase)** — Blocker lớn nhất
- [ ] Guest API endpoints (venues, packages, add-ons, menus, beverages, estimate, proposal)
- [ ] Admin API endpoints (CRUD all entities, lead management, dashboard)
- [ ] Contact form (Step 13) with lead creation + proposal v1
- [ ] Proposal link system (UUID token, view/edit/versioning)
- [ ] PDF generation (Puppeteer or alternative for serverless)
- [ ] Version diff logic

### Admin CRUD
- [ ] Venues CRUD with pricing tiers + draft/publish
- [ ] Service Packages CRUD with items + pricing matrix
- [ ] Add-on Services CRUD
- [ ] Menu Combos CRUD
- [ ] Beverages CRUD
- [ ] Staff management (create/deactivate)
- [ ] Lead management (assign, status, notes, versions)
- [ ] Dashboard KPI with real data

### Guest Flow (cần rebuild hoàn chỉnh)
- [ ] Venues: Fetch từ API thay vì mock, compare 2 venues, preferred selection
- [ ] Services: Fetch packages/add-ons, duplicate prevention UI
- [ ] Menu: Fetch combos, favorite marking, download
- [ ] Beverages: Fetch + display reference table
- [ ] Estimate: Real-time calculation from API data
- [ ] Contact form: Auto-fill, consent, validation
- [ ] Proposal view/edit via link
- [ ] Expired link page
- [ ] PDF download

### Polish
- [ ] Responsive design toàn bộ (mobile-first)
- [ ] Micro-animations (fadeIn, slideUp, shimmer)
- [ ] Loading states & error handling
- [ ] Input validation (frontend + backend)
- [ ] Brand assets (logo, favicon in public/brand/)
- [ ] SEO meta tags

### Testing & QA
- [ ] Unit tests cho business logic
- [ ] API integration tests
- [ ] E2E testing theo 13 tiêu chí nghiệm thu (AC-01 → AC-13)

## File Tree hiện tại

```
src/
├── app/
│   ├── layout.js                    # Root layout
│   ├── globals.css                  # Tailwind + custom CSS (58 lines)
│   ├── page.module.css              # Module CSS
│   ├── favicon.ico
│   ├── (client)/
│   │   ├── layout.js                # Client layout (Navbar+Footer)
│   │   ├── page.js                  # Homepage
│   │   └── du-toan-chi-phi/
│   │       ├── page.js              # Steps 1-4
│   │       ├── venues/page.js       # Steps 5-7 (skeleton)
│   │       ├── services/page.js     # Steps 8-10 (skeleton)
│   │       └── estimate/page.js     # Steps 11-12 (skeleton)
│   ├── admin/
│   │   ├── layout.js                # Admin sidebar
│   │   ├── page.js                  # Redirect to dashboard
│   │   ├── login/page.js
│   │   ├── dashboard/page.js        # Placeholder
│   │   ├── leads/page.js            # Mock data
│   │   └── posts/page.js
│   └── api/
│       ├── auth/[...nextauth]/route.js
│       └── leads/route.js
├── components/
│   └── layout/
│       ├── Navbar.js
│       └── Footer.js
└── lib/
    ├── prisma.js
    ├── auth.js
    ├── calculations.js
    └── constants.js
```

## Git History (10 commits)

```
569f523 chore: add mock leads data for UI demo
c7a6beb feat: Add POST /api/leads and connect estimator form
9693e35 fix: mock prisma calls to fix vercel sqlite crash
0d7cfc9 fix: bypass SQLite auth on Vercel with hardcoded admin
43e0cac feat: Phase 1 - Add Admin Dashboard (NextAuth, Leads, Posts)
5c0574a feat: Add new Homepage and layout, move estimator to /du-toan-chi-phi
96e2f0d fix: restore missing layout and landing page from Github clone issue
2529d2d fix: add prisma generate to postinstall for Vercel build
eb6ed85 feat: Week 1 - Add Customer Journey UI steps 1 to 4 based on Stitch design
1d8c6e7 feat: foundation setup - Next.js 14, Prisma schema, auth, design system
```

## Known Issues

| # | Issue | Impact | Priority |
|---|---|---|---|
| 1 | SQLite không persistent trên Vercel | Data mất sau mỗi request | 🔴 Critical |
| 2 | Puppeteer không chạy trên Vercel serverless | PDF generation fail | 🟡 High |
| 3 | public/brand/ trống | Không có logo/favicon | 🟡 Medium |
| 4 | Mock data thay vì real API | Không có data thực | 🔴 Critical |
| 5 | Không có tests | Không verify được | 🟡 Medium |
| 6 | Monolithic pages | Khó maintain | 🟢 Low |

## Deployment

- **Vercel URL**: https://goldenpalacenamdinh.vercel.app (có thể down)
- **GitHub**: tvchinh1423-sys/goldenpalacenamdinh
- **Supabase**: Đã có project, credentials trong .env.production
