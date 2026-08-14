# Technical Architecture — Golden Palace Wedding Planner

## Tech Stack

| Tầng | Công nghệ | Ghi chú |
|---|---|---|
| Frontend + Backend | Next.js 16.3 (App Router) | Dùng Route Groups |
| Database | PostgreSQL (Supabase) | Production |
| Database (dev) | SQLite | Local development |
| ORM | Prisma 5.x | Schema-first |
| Auth | NextAuth.js v4 (Credentials) | 2 roles: Admin/Staff |
| PDF | Puppeteer (server-side) | Cần Chrome for Testing trên serverless |
| Storage | Supabase Storage | Ảnh/video upload |
| Hosting | Vercel (app) + Supabase (DB) | |
| Styling | Tailwind CSS 3.x | Custom Golden Palace theme |
| Fonts | Playfair Display (headings) + Inter (body) | Google Fonts |

## Database Schema (Prisma)

### 17 Models:
1. **User** — Admin/Staff accounts (role-based, soft delete via isActive)
2. **Venue** — Wedding halls with min/max guests, images, display order, draft/published
3. **VenuePricing** — Price tiers by guest range with effective dates
4. **ServicePackage** — Main service packages
5. **ServicePackageItem** — Items included in a package
6. **ServicePackagePricing** — Pricing by venue + guest range
7. **AddOnService** — Add-on services with excludedFromPackages
8. **AddOnServicePricing** — Pricing by venue + guest range
9. **MenuCombo** — Reference menu combos (dishes as JSON)
10. **BeverageItem** — Beverage catalog with categories
11. **Lead** — Customer leads with 5-status workflow
12. **Proposal** — Versioned proposals (price freezing)
13. **ProposalVenue** — Selected venues in proposal (frozen name/price)
14. **ProposalAddOn** — Selected add-ons (frozen name/price)
15. **ProposalFavoriteMenu** — Favorite menu combos (frozen name)
16. **SessionTracking** — Session analytics for KPI
17. **Post** — News/promotions blog

### Key Design Patterns:
- **Price Freezing**: Proposal stores snapshot of prices at creation time
- **Draft/Publish**: VenuePricing, ServicePackagePricing, AddOnServicePricing, BeverageItem all have status (DRAFT/PUBLISHED)
- **Soft Delete**: Users deactivated via isActive flag
- **Versioning**: Proposals linked to Lead, version number increments
- **SQLite compatibility**: Enums stored as String, JSON fields stored as String with default "[]"

### Important Notes:
- Prices use `Decimal` type (Prisma) for accuracy
- `priceEffectiveDate` on Proposal is `DateTime`
- Images/videos stored as JSON arrays of URLs (String type for SQLite compat)
- UUID primary keys across all models

## Project Structure

```text
golden-palace/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite dev database
├── public/
│   └── brand/                 # Logo, favicon (currently empty)
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout (Inter + Playfair Display fonts)
│   │   ├── globals.css        # Tailwind directives + custom CSS
│   │   ├── (client)/          # Guest-facing routes (Route Group)
│   │   │   ├── page.js        # Landing/homepage
│   │   │   ├── layout.js      # Client layout (Navbar + Footer)
│   │   │   └── du-toan-chi-phi/  # Estimation wizard
│   │   │       ├── page.js       # Step 1-4: inputs
│   │   │       ├── venues/page.js    # Step 5-7: venues
│   │   │       ├── services/page.js  # Step 8-10: services
│   │   │       └── estimate/page.js  # Step 11-12: estimate
│   │   ├── admin/             # Admin panel
│   │   │   ├── layout.js      # Admin layout (sidebar)
│   │   │   ├── page.js        # Redirect to dashboard
│   │   │   ├── login/page.js
│   │   │   ├── dashboard/page.js  # KPI (placeholder)
│   │   │   ├── leads/page.js      # Lead list (mock data)
│   │   │   ├── posts/page.js      # Posts management
│   │   │   └── staff/page.js      # Staff management
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.js  # Auth
│   │       └── leads/route.js              # Lead creation
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.js      # Global navigation
│   │       └── Footer.js      # Global footer
│   └── lib/
│       ├── prisma.js          # Prisma client singleton
│       ├── auth.js            # NextAuth config
│       ├── calculations.js    # Business logic (tables, costs)
│       └── constants.js       # MIN_GUESTS=100, MAX_GUESTS=800, etc.
├── .env.local                 # Local env (SQLite)
├── .env.production            # Production env (Supabase PG)
├── tailwind.config.js         # Custom Golden Palace theme
├── next.config.mjs            # images.unoptimized = true
├── package.json               # Dependencies
└── seed-admin.js              # Admin seeder
```

## API Endpoints

### Implemented:
| Method | Endpoint | Status |
|---|---|---|
| POST | `/api/auth/[...nextauth]` | ✅ Working |
| POST | `/api/leads` | ✅ Working (but data not persistent on Vercel/SQLite) |

### Planned (from IMPLEMENTATION-PLAN.md):

#### Guest APIs
| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/api/guest/venues?guests=N` | Lọc hội trường theo số khách |
| GET | `/api/guest/venues/[id]` | Chi tiết hội trường + giá |
| GET | `/api/guest/packages?venue=ID&guests=N` | Gói dịch vụ |
| GET | `/api/guest/add-ons?venue=ID&guests=N` | Dịch vụ bổ sung |
| GET | `/api/guest/menus` | Combo thực đơn |
| GET | `/api/guest/beverages` | Bảng giá đồ uống |
| POST | `/api/guest/estimate` | Tính dự trù |
| POST | `/api/guest/lead` | Gửi lead + tạo proposal v1 |
| GET | `/api/guest/proposal/[token]` | Lấy phương án qua link |
| PUT | `/api/guest/proposal/[token]` | Chỉnh sửa → phiên bản mới |
| GET | `/api/guest/proposal/[token]/pdf` | Tải PDF |

#### Admin APIs
| Method | Endpoint | Chức năng |
|---|---|---|
| CRUD | `/api/admin/venues` | Hội trường + pricing |
| CRUD | `/api/admin/packages` | Gói dịch vụ |
| CRUD | `/api/admin/add-ons` | Dịch vụ bổ sung |
| CRUD | `/api/admin/menus` | Combo thực đơn |
| CRUD | `/api/admin/beverages` | Đồ uống |
| CRUD | `/api/admin/staff` | Tài khoản NV |
| GET | `/api/admin/leads` | Danh sách lead |
| PUT | `/api/admin/leads/[id]/assign` | Phân lead |
| PUT | `/api/admin/leads/[id]/status` | Cập nhật trạng thái |
| PUT | `/api/admin/leads/[id]/notes` | Ghi chú nội bộ |
| GET | `/api/admin/leads/[id]/versions` | Phiên bản + diff |
| GET | `/api/admin/dashboard` | KPI data |

## Design System

### Colors (Tailwind custom)
| Token | Value | Usage |
|---|---|---|
| gold-gradient-start | #C5975B | Primary accent, CTAs |
| gold-gradient-end | #D4A96A | Gradient end |
| primary (dark navy) | #1A1A2E | Text, dark backgrounds |
| surface | cream tones | Backgrounds |
| Status: Mới | Blue | Lead badge |
| Status: Đã tiếp nhận | Amber/Orange | Lead badge |
| Status: Đã đặt cọc | Green | Lead badge |
| Status: Đã chốt BEO | Purple | Lead badge |
| Status: Huỷ | Gray/Red | Lead badge |
| Draft | Yellow/Amber | Admin badge |
| Published | Green | Admin badge |

### Typography
| Element | Font | Weight |
|---|---|---|
| Headings, Venue names, PDF titles | Playfair Display | 600-700 |
| Body text, UI labels | Inter | 400-600 |

### Components Pattern
- Border-radius: 12px (cards), 8px (buttons)
- Glassmorphism effects on surfaces
- Gold gradient CTAs
- Material Symbols icons
- Micro-animations: fadeIn, slideUp, shimmer, float

## Known Issues & Technical Debt

1. **SQLite vs PostgreSQL**: Dev uses SQLite, production needs PostgreSQL. Migration may have issues
2. **Puppeteer on Vercel**: PDF generation won't work on serverless without Chrome for Testing
3. **No persistent data on Vercel**: SQLite files are ephemeral on serverless
4. **Monolithic pages**: Most UI is inline in page.js files, needs component extraction
5. **No unit tests**: Zero test files exist
6. **Empty brand assets**: public/brand/ has no logo, favicon
7. **Security**: Credentials in .env files (not a code issue but deployment concern)
8. **Float vs Decimal**: Some early code used Float for prices

## Environment Variables

### Required (.env.local)
```
DATABASE_URL=          # PostgreSQL connection string (Supabase)
DIRECT_URL=            # Direct PostgreSQL connection (for migrations)
NEXTAUTH_URL=          # App URL (http://localhost:3000 for dev)
NEXTAUTH_SECRET=       # Random secret for NextAuth sessions
NEXT_PUBLIC_BASE_URL=  # Public-facing base URL
```

### Admin Seed
```
email: admin@goldenpalace.vn
password: admin123 (change in production!)
```
