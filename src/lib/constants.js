// Hằng số và câu chữ chính thức — Golden Palace MVP

// Câu chữ chính thức đã duyệt
export const DISCLAIMER_PRICE = 'Chi phí trên được tính theo thông tin và dịch vụ Quý khách đã lựa chọn, chỉ mang tính chất tham khảo. Mức giá thực tế có thể được điều chỉnh do thực phẩm thay đổi theo thời giá, quy mô khách, hội trường, yêu cầu dịch vụ và chính sách ưu đãi. Vui lòng liên hệ trực tiếp Golden Palace để được tư vấn và nhận báo giá chính thức.';

export const DISCLAIMER_SCHEDULE = 'Ngày và hội trường Quý khách lựa chọn chưa được giữ chỗ. Golden Palace sẽ liên hệ xác nhận tình trạng lịch; chỉ chắc chắn giữ chỗ sau khi hoàn tất đặt cọc lần 1.';

export const CONSENT_TEXT = 'Bằng việc gửi thông tin, Quý khách đồng ý để Golden Palace liên hệ tư vấn.';

export const EXCLUDED_COSTS_TEXT = 'Chưa bao gồm thuế VAT, phí phục vụ, đồ uống và chi phí phát sinh — liên hệ Golden Palace để tư vấn thêm.';

export const LINK_EXPIRED_TEXT = 'Phương án này đã đóng. Vui lòng liên hệ trực tiếp Golden Palace để được hỗ trợ.';

export const CONTACT_INVITE_TEXT = 'Với quy mô tiệc của Quý khách, chúng tôi muốn mang đến trải nghiệm tư vấn trực tiếp để phục vụ tốt nhất. Vui lòng liên hệ Golden Palace để được hỗ trợ.';

// Trạng thái lead
export const LEAD_STATUSES = {
  NEW: { value: 'NEW', label: 'Mới' },
  ACCEPTED: { value: 'ACCEPTED', label: 'Đã tiếp nhận' },
  DEPOSITED: { value: 'DEPOSITED', label: 'Đã đặt cọc' },
  BEO_CONFIRMED: { value: 'BEO_CONFIRMED', label: 'Đã chốt BEO' },
  CANCELLED: { value: 'CANCELLED', label: 'Huỷ' },
};

// Trạng thái lead đóng link
export const LINK_CLOSING_STATUSES = ['CANCELLED', 'BEO_CONFIRMED'];

// Buổi tổ chức
export const EVENT_SESSIONS = {
  LUNCH: { value: 'LUNCH', label: 'Trưa' },
  DINNER: { value: 'DINNER', label: 'Tối' },
};
