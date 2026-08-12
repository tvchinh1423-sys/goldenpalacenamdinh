// Business logic tính mâm và dự trù — Golden Palace MVP

// Constants
export const MIN_GUESTS = 100;
export const MAX_GUESTS = 800;
export const GUESTS_PER_TABLE = 10;
export const RESERVE_TABLE_RATIO = 0.10;
export const MIN_BUDGET_PER_TABLE = 3500000;

// Tính số mâm chính
export function calcMainTables(guestCount) {
  return Math.ceil(guestCount / GUESTS_PER_TABLE);
}

// Tính số mâm dự phòng
export function calcReserveTables(mainTables) {
  return Math.ceil(mainTables * RESERVE_TABLE_RATIO);
}

// Tính dự trù tiền cỗ
export function calcFoodCost(mainTables, reserveTables, budgetPerTable) {
  const base = mainTables * budgetPerTable;
  const max = (mainTables + reserveTables) * budgetPerTable;
  return { base, max };
}

// Tính tổng dự trù
export function calcTotalEstimate({ foodCostBase, foodCostMax, venueFee, packagePrice, addOnTotal }) {
  const base = foodCostBase + venueFee + (packagePrice || 0) + (addOnTotal || 0);
  const max = foodCostMax + venueFee + (packagePrice || 0) + (addOnTotal || 0);
  return { base, max };
}

// Format VND
export function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Validate số khách
export function validateGuestCount(count) {
  if (count < MIN_GUESTS) return { valid: false, message: `Số khách tối thiểu là ${MIN_GUESTS}` };
  if (count > MAX_GUESTS) return { valid: false, message: `Số khách tối đa là ${MAX_GUESTS}` };
  return { valid: true };
}

// Validate ngân sách
export function validateBudget(budget) {
  if (budget < MIN_BUDGET_PER_TABLE) return { valid: false, message: `Ngân sách tối thiểu là ${formatVND(MIN_BUDGET_PER_TABLE)}/mâm` };
  return { valid: true };
}
