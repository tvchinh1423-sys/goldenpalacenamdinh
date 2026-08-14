# Business Rules — Golden Palace Wedding Planner

## 1. Phạm vi sản phẩm

- MVP chỉ phục vụ tiệc cưới
- Kiến trúc dự phòng mở rộng: sinh nhật, hội nghị, liên hoan công ty
- Mỗi loại sự kiện tương lai có hành trình, form, bảng giá, dịch vụ và mẫu PDF riêng
- Sản phẩm là công cụ tự khám phá + dự trù + PDF/link + thu lead, KHÔNG phải hệ thống booking

## 2. Ngoài phạm vi MVP

- Giữ lịch tự động
- Đặt cọc hoặc thanh toán online
- Hợp đồng điện tử
- Hiển thị hội trường còn trống theo thời gian thực
- Backdrop editor, thiệp cưới, playlist/kịch bản nhạc, frame Photo Booth
- CRM hoặc thông báo Zalo/email bên ngoài trang quản trị
- Thuật toán phân lead tự động

## 3. Số khách và số mâm

| Quy tắc | Giá trị |
|---|---|
| Số khách mỗi mâm | 10 |
| Cách làm tròn mâm chính | Làm tròn lên (ceil) |
| Mâm dự phòng | 10% mâm chính, làm tròn lên |
| Mâm dự phòng tính tiền | Chỉ theo thực tế sử dụng |

```
main_tables       = ceil(guest_count / 10)
reserve_tables    = ceil(main_tables * 0.10)
prepared_tables   = main_tables + reserve_tables
```

Ví dụ 350 khách: 35 mâm chính + 4 mâm dự phòng = 39 mâm chuẩn bị tối đa.

## 4. Ngân sách và dự trù tiền cỗ

- Ngân sách tối thiểu: 3.500.000đ/mâm
- Nhập tự do, không giới hạn trên
- Combo thực đơn chỉ tham khảo, KHÔNG tham gia phép tính

```
base_food_cost    = main_tables * budget_per_table
max_food_cost     = (main_tables + reserve_tables) * budget_per_table
```

## 5. Hội trường

- Mỗi hội trường có sức chứa tối thiểu và tối đa riêng
- Phí hội trường tách khỏi tiền cỗ
- Phí thay đổi theo khoảng số khách, mỗi hội trường có bảng phí riêng
- Admin cấu hình sức chứa, khoảng khách, mức phí, thời gian hiệu lực
- Hệ thống chỉ gợi ý hội trường phù hợp số khách đã nhập
- So sánh tối đa 2 hội trường, mỗi hội trường có dự trù riêng
- Khách đánh dấu 1 phương án ưu tiên

## 6. Gói dịch vụ và dịch vụ bổ sung

- Mô hình: 1 gói chính + N dịch vụ bổ sung
- Giá thay đổi theo hội trường và khoảng số khách
- Hệ thống tránh tính trùng dịch vụ đã nằm trong gói chính
- Admin cấu hình bảng giá và phạm vi áp dụng

Thuộc tính mỗi gói/dịch vụ:

- Tên, Mô tả, Danh sách hạng mục bao gồm, Ảnh minh họa (bắt buộc)
- Video minh họa (không bắt buộc)
- Hội trường áp dụng, Khoảng khách và mức giá, Ngày hiệu lực (bắt buộc)
- Trạng thái (đang cung cấp / tạm ngừng), Thứ tự hiển thị (bắt buộc)

## 7. Thực đơn

- Combo thực đơn chỉ mang tính tham khảo, có giá dự kiến
- Khách chọn combo yêu thích để nhân viên biết gu
- Khách tải thực đơn về máy tham khảo
- Combo KHÔNG trở thành đơn hàng, KHÔNG tham gia phép tính tự động

## 8. Ngày và buổi tổ chức

- Ngày chính xác, chỉ ngày hiện tại hoặc tương lai
- Buổi: Trưa hoặc Tối
- KHÔNG tham gia công thức tính giá
- Lưu để nhân viên kiểm tra lịch
- MVP không hiển thị trạng thái còn trống
- Ưu tiên theo thứ tự hoàn tất đặt cọc

## 9. Đồ uống và chi phí chưa bao gồm

- Đồ uống tính theo thực tế sử dụng, KHÔNG tính trước vào tổng dự trù
- MVP hiển thị bảng giá đồ uống tham khảo (Admin cấu hình)
- Các khoản chưa bao gồm: thuế VAT, phí phục vụ, đồ uống, chi phí phát sinh

## 10. Công thức tổng dự trù

```
total_base     = base_food_cost + venue_fee + main_package + sum(add_on_services)
total_max      = max_food_cost  + venue_fee + main_package + sum(add_on_services)
```

Hiển thị dạng khoảng: total_base – total_max.
Ghi rõ: "Chưa bao gồm thuế VAT, phí phục vụ, đồ uống và chi phí phát sinh."

## 11. Trạng thái lead

```
Mới → Đã tiếp nhận → Đã đặt cọc → Đã chốt BEO → (kết thúc)
                  ↘ Huỷ (từ bất kỳ trạng thái nào)
```

1. **Mới** — Khách vừa gửi lead, chưa ai xử lý
2. **Đã tiếp nhận** — Nhân viên đã nhận và bắt đầu xử lý
3. **Đã đặt cọc** — Khách hoàn tất đặt cọc lần 1
4. **Đã chốt BEO** — Banquet Event Order đã chốt
5. **Huỷ** — Lead không tiếp tục

## 12. Phân quyền

### Admin

- Hội trường, sức chứa, bảng giá: Tạo / Sửa / Nháp / Publish
- Gói dịch vụ, dịch vụ bổ sung: Tạo / Sửa / Nháp / Publish
- Thực đơn, ảnh, video: Tạo / Sửa / Xoá
- Bảng giá đồ uống: Tạo / Sửa / Nháp / Publish
- Tài khoản nhân viên: Tạo / Sửa / Vô hiệu hoá
- Lead: Xem tất cả / Phân / Chuyển / Cập nhật
- Dashboard KPI: Xem

### Nhân viên tư vấn

- Danh sách lead: Xem tất cả
- Lead được giao: Cập nhật trạng thái / Ghi chú / Đặt ngày liên hệ lại
- Lead không được giao: Chỉ xem, không sửa
- Phương án khách: Xem lựa chọn / Dự trù / PDF / Diff phiên bản
- Bảng giá, nội dung công khai: Không được sửa

## 13. Nháp và Publish

- Admin tạo bản nháp trước khi publish
- Khách chỉ thấy bản đã publish
- Bản nháp chỉ Admin thấy, không ảnh hưởng dữ liệu live
- Phương án khách đã lưu giữ nguyên giá tại thời điểm tạo (price freezing)
- Áp dụng cho: bảng giá hội trường, gói dịch vụ, dịch vụ bổ sung, bảng giá đồ uống

## 14. Link phương án

- Tạo sau khi khách gửi thông tin
- Dạng link riêng, khó đoán (UUID)
- Tồn tại khi lead còn mở
- Hết hiệu lực khi lead chuyển sang Huỷ hoặc Đã chốt BEO
- Truy cập link đã đóng → thông báo mời liên hệ trực tiếp

## 15. Chỉnh sửa và phiên bản

- Khách mở link được chỉnh sửa phương án
- Mỗi lần lưu tạo phiên bản mới, KHÔNG ghi đè
- Phía khách: chỉ thấy phương án hiện tại
- Phía nhân viên: thấy danh sách phiên bản với diff

## 16. Form thông tin liên hệ

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| Họ tên | Có | — |
| Số điện thoại | Có | — |
| Ngày giờ tổ chức | Có | Auto-fill từ bước 4 |
| Số lượng khách | Có | Auto-fill từ bước 1 |
| Tên cô dâu — chú rể | Không | Tùy chọn |
| Ghi chú thêm | Không | Tùy chọn |

## 17. Câu chữ chính thức (KHÔNG ĐƯỢC THAY ĐỔI)

### Disclaimer giá

> Chi phí trên được tính theo thông tin và dịch vụ Quý khách đã lựa chọn, chỉ mang tính chất tham khảo. Mức giá thực tế có thể được điều chỉnh do thực phẩm thay đổi theo thời giá, quy mô khách, hội trường, yêu cầu dịch vụ và chính sách ưu đãi. Vui lòng liên hệ trực tiếp Golden Palace để được tư vấn và nhận báo giá chính thức.

### Thông báo lịch

> Ngày và hội trường Quý khách lựa chọn chưa được giữ chỗ. Golden Palace sẽ liên hệ xác nhận tình trạng lịch; chỉ chắc chắn giữ chỗ sau khi hoàn tất đặt cọc lần 1.

### Consent

> Bằng việc gửi thông tin, Quý khách đồng ý để Golden Palace liên hệ tư vấn.

## 18. Bảo mật dữ liệu

- Lead Huỷ giữ tối đa 6 tháng rồi tự xoá
- Cơ chế tự động dọn hoặc nhắc Admin
- Consent hiển thị trước nút gửi

## 19. KPI

| Chỉ số | Công thức |
|---|---|
| Tỷ lệ truy cập → Lead | Số lead / Số session trang dự trù |
| Tỷ lệ Lead → Đặt cọc | Số lead Đã đặt cọc / Tổng lead |

## 20. Xử lý ngoại lệ

| Tình huống | Hành vi |
|---|---|
| Số khách < 100 hoặc > 800 | Hiển thị lời mời liên hệ tư vấn, không từ chối khô cứng |
| Không có hội trường phù hợp | Hiển thị lời mời liên hệ tư vấn |
| Ngân sách < 3.500.000đ/mâm | Không cho phép tiếp tục, hiển thị mức tối thiểu |
| Ngày trong quá khứ | Không cho phép chọn |
| Link đã đóng | Hiển thị thông báo mời liên hệ trực tiếp |

## 21. Nghiệm thu (13 tiêu chí)

| # | Tiêu chí |
|---|---|
| AC-01 | Luồng dự trù end-to-end (bước 1→13) |
| AC-02 | PDF hoạt động đúng nội dung, đúng thương hiệu |
| AC-03 | Link hoạt động, chỉnh sửa tạo phiên bản mới |
| AC-04 | Link hết hiệu lực khi lead Huỷ/Đã chốt BEO |
| AC-05 | Diff phiên bản rõ ràng |
| AC-06 | Phân/chuyển lead thành công |
| AC-07 | Quyền nhân viên (xem hết, chỉ sửa lead được giao) |
| AC-08 | Nháp/Publish hoạt động |
| AC-09 | Giá đóng băng tại thời điểm tạo phương án |
| AC-10 | Xoá dữ liệu lead Huỷ > 6 tháng |
| AC-11 | Dashboard KPI hiển thị 2 tỷ lệ |
| AC-12 | Xử lý ngoại lệ không khô cứng |
| AC-13 | Disclaimer và consent hiển thị đúng |
