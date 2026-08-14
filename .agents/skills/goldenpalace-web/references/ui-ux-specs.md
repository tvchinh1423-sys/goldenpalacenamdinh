# UI/UX Specifications — Golden Palace Wedding Planner

## Tổng quan: 17 Màn hình

Dự án gồm 17 màn hình chính, chia thành 2 nhóm:
- **Guest (Khách hàng)**: 9 màn hình (MH1–MH8 + PDF)
- **Admin (Quản trị)**: 8 màn hình (MH9–MH17)

---

## GUEST FLOW

### MH1: Landing & Nhập liệu cơ bản (Steps 1–4)
- Hero Banner với background ảnh Golden Palace, blur nhẹ
- Headline: Playfair Display, Sub-headline: Inter
- **Block 1 (Quy mô)**: Slider hoặc +/- buttons, 100–800 khách. Real-time fade-in feedback hiển thị số mâm + 10% dự phòng
- **Block 2 (Ngân sách)**: Input VND (3.500.000 ₫), quick-select chips [3.5M, 4.5M, 6M]. Validation: <3.5M → warning đỏ
- **Block 3 (Thời gian)**: Date Picker (future only) + Toggle Trưa/Tối
- CTA: Gold gradient button "Tiếp tục: Khám phá hội trường" với arrow
- **Ngoại lệ**: <100 hoặc >800 → soft message + [Liên hệ ngay] button

### MH2: Lọc & Chọn Hội Trường (Steps 5–7)
- Sticky header tóm tắt selections với [Sửa]
- Grid Cards venue: Image Carousel, tên venue (Playfair), capacity badge, giá auto-calculated
- [Thêm vào so sánh] toggle, max 2 venues
- Floating Comparison Dock ở bottom: "Đã chọn 1/2 hội trường"
- Split-view comparison modal: ảnh side-by-side, pricing, capacity
- Radio select preferred venue → Gold Border Glow
- CTA: "Tiếp tục: Chọn Dịch Vụ"

### MH3: Gói Dịch Vụ & Add-ons (Step 8)
- Tabbed/zoned layout: Zone 1 = Main Packages (radio, single choice), Zone 2 = Add-ons (checkbox, multi)
- Package cards: image, name, dynamic price, green-check bulleted list
- Micro-interaction: glow border + tick mark on selection
- **Duplicate prevention**: Add-on đã trong gói → opacity 50%, text "Đã bao gồm trong gói", click disabled

### MH4: Thực Đơn & Đồ Uống (Steps 9–10)
- Info banner (light blue): "Mang tính tham khảo" — KHÔNG tính vào tổng
- Menu combos: name, price/table, dish list, [Yêu thích] heart + [Tải menu PDF]
- Beverages: Table hoặc Accordion by category (Beer, Wine, Soft drinks)

### MH5: Bảng Dự Trù Tổng Thể (Steps 11–12)
- Invoice/receipt-style layout, dashed border hoặc cream paper background
- 2 venues → 2-column layout, preferred venue emphasized
- Line items: Main tables × budget, reserve tables (lighter), venue fee, service fee
- Divider → **TOTAL (range) in large Gold text** (e.g. 150M–165M ₫)
- Disclaimer box (gray): Excluded costs, standard disclaimer, booking notice

### MH6: Thu Thập Lead (Step 13)
- CTA headline: "Lưu Phương Án & Nhận Báo Giá Chi Tiết"
- Minimal form: Name (required), Phone (required), Bride-Groom (optional)
- Auto-filled: date & guest count (read-only from previous steps)
- Consent checkbox (required before submit)
- Gold gradient submit button with loading animation
- **Success state**: Large checkmark, thank-you text, [Tải PDF] + [Copy Link] + share buttons

### MH7: Shareable Link View (Step 14)
- Header: "Bản Dự Trù Tiệc Cưới" + customer name + plan code (GP-XXXXXX) + version
- Read-only mode = MH5 without nav + [Chỉnh sửa phương án này] button
- Edit mode: Returns to Steps 1–12 pre-filled. Save → new Version (no overwrite)
- **Link Expired**: Content blurred/hidden, centered popup with hotline

### MH8: PDF Quotation (A4 Portrait)
- Page 1 (Cover): Logo, title (Playfair), customer info, invoice table, disclaimer + hotline footer
- Page 2 (Venues): Hero image preferred venue, smaller comparison venue
- Page 3 (Services & Menu): Package checklist, add-ons, reference menu combo
- Running footer: Address, fanpage, website, page numbers, QR code for video

### MH9: Version Diff View (Staff/Admin only)
- Version selector: Dropdown/tabs compare 2 versions
- Diff table: 2-column (V1 vs V2) or git-diff style
- Color coding: Unchanged=gray, Deleted=red+strikethrough, Added=green, Changed=yellow/amber

---

## ADMIN FLOW

### MH10: Dashboard KPI
- KPI widgets: Total Sessions, New Leads, In-progress, Deposited
- Funnel chart: Visits → Leads → Deposits (conversion %)
- To-do list: "5 Leads cần phân" + "3 Leads cần follow-up"

### MH11: Lead Data Grid
- Filters: Search (name/phone/code), Status dropdown, Staff dropdown, Date range
- Table columns: Code, Created, Customer, Phone, Event date, Status badge, Staff, Actions
- Status badges: Mới=Blue, Tiếp nhận=Amber, Đã cọc=Green, Chốt BEO=Purple, Huỷ=Gray
- 3-dot menu: View details, Assign/Transfer (Admin)

### MH12: Lead Detail
- Left (sticky): Name, Phone (click-to-call), Plan code, Status dropdown, Next Contact Date
- Center: Internal notes timeline with timestamps + staff names
- Right/tab: Latest proposal + version dropdown + [Xem So Sánh Diff]

### MH13: Staff Management (Admin Only)
- Table: Name, Email, Role (Admin/Staff), Status (Active/Locked)
- Add/Edit modal: Email, password, role, status toggle
- Deactivate instead of Delete to preserve history

### MH14: Venue Management
- List: Thumbnail, Name, Capacity, Status (Draft/Published), Actions
- Edit Tab 1 (Basic): Name, Description, drag-drop multi-image, min/max capacity, Draft/Publish toggle
- Edit Tab 2 (Pricing): Dynamic table — Guest range from/to, Price, Effective date. Auto-fill "from" based on previous "to" + 1

### MH15: Service Packages & Add-ons
- Package edit: Name, image/video, description, Draft/Publish
- Items: Dynamic add/remove input list
- Pricing Matrix: Select venue → add price tiers by guest range. [Copy pricing Venue A → B]
- Add-on: Similar + "Excluded Packages" multi-select

### MH16: Menu & Beverage Management
- Menu Combos: Name, price/table (display only), dynamic dish list (drag-drop ordering), image upload
- Beverages: Excel-like grid — Name, Category dropdown, Price, Status toggle

### MH17: Draft/Publish Global UI
- Save button: Always saves as DRAFT. Amber banner: "Dữ liệu đã lưu dạng nháp. Khách vẫn thấy giá cũ."
- Publish button: Green/Success. Confirmation modal: "Bạn chắc chắn? Phương án khách đã lưu KHÔNG bị ảnh hưởng." → Confirm

---

## Design Tokens Summary

| Token | Value |
|---|---|
| Primary Accent | Gold gradient (#C5975B → #D4A96A) |
| Dark text | #1A1A2E |
| Heading font | Playfair Display |
| Body font | Inter |
| Card radius | 12px |
| Button radius | 8px |
| Breakpoint | Mobile-first, ≥768px |
| Icons | Material Symbols (variable fill) |
| Animations | fadeIn, slideUp, shimmer, float |
| Selected state | Gold Border Glow |
| Disabled state | opacity 50% |
| Info banner | Light blue background |
| Draft badge | Yellow/Amber |
| Published badge | Green |
